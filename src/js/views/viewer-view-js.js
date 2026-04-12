/**
 * ============================================================================
 * MNEMOSYNE — viewerView.js
 * Commit 12: feat: Real-Time Simulation Effects (parte 4/4)
 * ============================================================================
 *
 * Controlador de la vista de visor de recuerdo. Gestiona la simulación en
 * tiempo real de los filtros de NeuroLink V4 sobre las imágenes de recuerdos,
 * integrando los sliders de filtro, la sesión terapéutica, el monitor de
 * bienestar y los diálogos de confirmación.
 *
 * Dos modos de visor implementados:
 *   A) Visor Alzheimer (María Luisa) — Filtro de Claridad Facial
 *   B) Visor Terapéutico (Carlos)   — Atenuación Emocional + Sesión
 *
 * Justificación DCU global:
 *   - Modelo mental ML §2.1: "gafas" / "lente" → slider de claridad con
 *     metáfora visual (blur/contrast)
 *   - Modelo mental Carlos §2.2: "sesión" → temporalidad, inicio/fin,
 *     monitorización activa
 *   - HTA-1 completo: buscar → seleccionar → visualizar → ajustar → guardar
 *   - HTA-2 completo: iniciar sesión → seleccionar → atenuar → bienestar → salir
 *   - Microinteracciones §1-§8: cada efecto visual mapeado a especificación
 *   - WCAG 2.1 AA: reducción de movimiento, contraste dinámico, anuncios SR
 *
 * Dependencias:
 *   - data.js (Commit 10) → MnemosyneData para obtener recuerdos
 *   - navigation.js (Commit 11) → MnemosyneNav para cambio de pantallas
 *   - sliderController.js (Commit 12, parte 1) → SliderController
 *   - dialogController.js (Commit 12, parte 3) → DialogController, helpers
 *   - CSS Custom Properties de neuro-aesthetic.css (Commit 9)
 *
 * @author Jorge — Grupo PA1, USAL
 * ============================================================================
 */

'use strict';

/* ==========================================================================
   §1. CONSTANTES Y CONFIGURACIÓN
   ==========================================================================
   Ref: Commit 6 (Style Guide) §3 — tokens de animación y feedback
   Ref: Commit 5 — Microinteracciones §1-§8 (tiempos y umbrales)
   ========================================================================== */

const VIEWER_CONFIG = {
  /**
   * Filtro de Claridad Facial (María Luisa)
   * Ref: Modelo mental ML §2.1 — metáfora "gafas": 0 = borroso, 10 = nítido
   * Los valores CSS se interpolan entre estos rangos.
   */
  clarity: {
    cssProperty: '--clarity-level',
    /* blur() en px: nivel 0 = 8px blur (muy borroso), nivel 10 = 0px */
    blurRange: { min: 0, max: 8 },
    /* contrast(): nivel 0 = 0.6 (poco contraste), nivel 10 = 1.2 */
    contrastRange: { min: 0.6, max: 1.2 },
    /* brightness() extra para simular "revelación" */
    brightnessRange: { min: 0.85, max: 1.05 },
    /* Transición suave: Tema 3 (gradualidad) */
    transitionMs: 200,
    /* Duración de la animación de "procesamiento neural" al guardar */
    processingMs: 1500,
    /* Textos descriptivos por nivel (5 niveles discretos para ML)
       Ref: wireframe §2.3, descriptor verbal accesible */
    descriptors: [
      'Muy borrosa',     /* 0-1 */
      'Algo borrosa',    /* 2-3 */
      'Reconocible',     /* 4-5 */
      'Bastante clara',  /* 6-7 */
      'Muy clara'        /* 8-10 */
    ]
  },

  /**
   * Filtro de Atenuación Emocional (Carlos)
   * Ref: Modelo mental Carlos §2.2 — "bajar el volumen" de la emoción
   * Se simula con grayscale + opacity + reducción de saturación.
   */
  attenuation: {
    cssProperty: '--attenuation-level',
    /* grayscale(): 0% = color completo, 100% = blanco y negro */
    grayscaleRange: { min: 0, max: 0.85 },
    /* opacity(): 100% atenuación no llega a invisible (min 0.3) */
    opacityRange: { min: 0.35, max: 1 },
    /* saturación: complementa el grayscale */
    saturateRange: { min: 0.15, max: 1 },
    /* sepia sutil para "suavizar" */
    sepiaRange: { min: 0, max: 0.15 },
    transitionMs: 250,
    processingMs: 2000,
    descriptors: [
      'Intenso',          /* 0-14% */
      'Ligeramente suave', /* 15-29% */
      'Moderado',         /* 30-49% */
      'Bastante suave',   /* 50-69% */
      'Muy suave'         /* 70-100% */
    ]
  },

  /**
   * Detección de cambio brusco
   * Ref: Microinteracción §4; Tema 3; STD S12→S13
   * Si el slider se mueve más de THRESHOLD puntos en menos de TIME_WINDOW ms,
   * se activa D-03 (cambio brusco).
   */
  abruptChange: {
    threshold: 30,      /* puntos porcentuales */
    timeWindowMs: 200   /* milisegundos */
  },

  /**
   * Sesión terapéutica (Carlos)
   * Ref: HTA-2 plan 4; Entrevista P04 ("por la noche")
   */
  session: {
    inactivityTimeoutMs: 30000,  /* 30s → D-05 check bienestar */
    maxDurationMs: 1800000,      /* 30min → aviso suave de duración */
    autoSaveIntervalMs: 60000    /* Backup cada 60s */
  }
};

/* ==========================================================================
   §2. CLASE ViewerView
   ==========================================================================
   Controlador principal del visor. Orquesta la simulación visual,
   los sliders de filtro, la sesión terapéutica y los diálogos.
   ========================================================================== */

const ViewerView = (function () {

  /* --- Estado interno --- */
  let _state = {
    mode: null,           /* 'alzheimer' | 'therapeutic' */
    memoryId: null,       /* ID del recuerdo cargado */
    memoryData: null,     /* Objeto completo del recuerdo */
    currentClarity: 5,    /* Nivel actual (0-10) */
    savedClarity: 5,      /* Último nivel guardado */
    currentAttenuation: 0, /* Nivel actual (0-100) */
    savedAttenuation: 0,  /* Último guardado */
    attenuationLimit: 70, /* Límite terapeuta (%) */
    therapistName: 'Dr. Molina',
    isDirty: false,       /* ¿Hay cambios sin guardar? */
    /* Detección de cambio brusco */
    lastSliderValue: null,
    lastSliderTime: null,
    /* Sesión terapéutica */
    sessionActive: false,
    sessionStartTime: null,
    sessionChangesCount: 0,
    inactivityTimer: null,
    sessionTimer: null,
    wellbeingLevel: 3     /* 1-5, default "Neutro" */
  };

  /* --- Preferencia de reducción de movimiento --- */
  const _prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- Referencias DOM --- */
  let _dom = {};

  /* ========================================================================
     §2.1 Inicialización
     ======================================================================== */

  /**
   * init() — Cachea referencias DOM y prepara listeners.
   * Se llama una vez desde app.js.
   */
  function init() {
    /* Cachear elementos del visor Alzheimer */
    _dom.alzViewer = document.getElementById('screen-alz-viewer');
    _dom.alzImage = document.querySelector('#screen-alz-viewer .viewer__image');
    _dom.alzFilterPanel = document.querySelector('#screen-alz-viewer .filter-panel');
    _dom.alzClaritySlider = document.getElementById('alz-clarity-slider');
    _dom.alzSaveBtn = document.querySelector('#screen-alz-viewer .btn--save');
    _dom.alzUndoBtn = document.querySelector('#screen-alz-viewer .btn--undo');
    _dom.alzProcessing = document.querySelector('#screen-alz-viewer .neural-processing');
    _dom.alzAnnounce = document.getElementById('alz-slider-announce');

    /* Cachear elementos del visor Terapéutico */
    _dom.therViewer = document.getElementById('screen-ther-viewer');
    _dom.therImage = document.querySelector('#screen-ther-viewer .viewer__image');
    _dom.therFilterPanel = document.querySelector('#screen-ther-viewer .filter-panel');
    _dom.therAttSlider = document.getElementById('ther-attenuation-slider');
    _dom.therWellbeingSlider = document.getElementById('ther-wellbeing-slider');
    _dom.therSaveBtn = document.querySelector('#screen-ther-viewer .btn--save');
    _dom.therUndoBtn = document.querySelector('#screen-ther-viewer .btn--undo');
    _dom.therProcessing = document.querySelector('#screen-ther-viewer .neural-processing');
    _dom.therSessionTimer = document.querySelector('#screen-ther-viewer .session-timer');
    _dom.therExitBtns = document.querySelectorAll('[id^="ther-exit-session"]');
    _dom.therAnnounce = document.getElementById('ther-slider-announce');
    _dom.therLimitMarker = document.querySelector('#screen-ther-viewer .slider__limit-marker');
    _dom.therAttMiniBar = document.querySelector('#screen-ther-viewer .attenuation-mini-bar__fill');
    _dom.therAttValue = document.querySelector('#screen-ther-viewer .viewer__attenuation-value');

    /* Vincular listeners */
    _bindAlzheimerListeners();
    _bindTherapeuticListeners();

    console.log('[ViewerView] Inicializado');
  }

  /* ========================================================================
     §2.2 Listeners — Vista Alzheimer (María Luisa)
     ========================================================================
     Ref: HTA-1 tareas 3.1-3.4 (visualizar → ajustar → confirmar → guardar)
     ======================================================================== */

  function _bindAlzheimerListeners() {
    /* Slider de claridad: interacción con teclado y puntero
       Ref: WCAG 2.1.1 (teclado), Modelo mental ML §2.1 */
    if (_dom.alzClaritySlider) {
      _dom.alzClaritySlider.addEventListener('keydown', _handleClarityKey);
      _dom.alzClaritySlider.addEventListener('pointerdown', _handleClarityPointerDown);
    }

    /* Botón guardar → D-01 (confirmar claridad)
       Ref: HTA-1 tarea 3.3; Tema 6 (ética: confirmación) */
    if (_dom.alzSaveBtn) {
      _dom.alzSaveBtn.addEventListener('click', _handleSaveClarity);
    }

    /* Botón deshacer → restaurar último valor guardado
       Ref: Gap §5.1 ("miedo a romper algo") → siempre poder volver */
    if (_dom.alzUndoBtn) {
      _dom.alzUndoBtn.addEventListener('click', _handleUndoClarity);
    }
  }

  /* ========================================================================
     §2.3 Listeners — Vista Terapéutica (Carlos)
     ========================================================================
     Ref: HTA-2 tareas 4.1-4.7 (sesión → seleccionar → atenuar → bienestar)
     ======================================================================== */

  function _bindTherapeuticListeners() {
    /* Slider de atenuación */
    if (_dom.therAttSlider) {
      _dom.therAttSlider.addEventListener('keydown', _handleAttenuationKey);
      _dom.therAttSlider.addEventListener('pointerdown', _handleAttenuationPointerDown);
    }

    /* Slider de bienestar (5 niveles discretos)
       Ref: HTA-2 tarea 4.5; Microinteracción §7 */
    if (_dom.therWellbeingSlider) {
      _dom.therWellbeingSlider.addEventListener('keydown', _handleWellbeingKey);
    }

    /* Botón guardar → D-02 (confirmar atenuación) */
    if (_dom.therSaveBtn) {
      _dom.therSaveBtn.addEventListener('click', _handleSaveAttenuation);
    }

    /* Botón deshacer */
    if (_dom.therUndoBtn) {
      _dom.therUndoBtn.addEventListener('click', _handleUndoAttenuation);
    }

    /* Botones de salir de sesión → D-06
       Ref: STD T34 — punto de salida siempre accesible (hay varios) */
    _dom.therExitBtns.forEach(btn => {
      btn.addEventListener('click', _handleExitSession);
    });
  }

  /* ========================================================================
     §3. CARGAR RECUERDO EN VISOR
     ========================================================================
     Punto de entrada para mostrar un recuerdo. Se llama desde navigation.js
     o search.js cuando el usuario selecciona una memory-card.
     ======================================================================== */

  /**
   * loadMemory(memoryId, mode) — Carga un recuerdo en el visor apropiado.
   *
   * @param {string} memoryId — ID del recuerdo (de data.js)
   * @param {'alzheimer'|'therapeutic'} mode — Qué visor usar
   */
  function loadMemory(memoryId, mode) {
    /* Obtener datos del recuerdo via data.js (Commit 10) */
    const memory = window.MnemosyneData
      ? window.MnemosyneData.getMemoryById(memoryId)
      : null;

    if (!memory) {
      console.warn(`[ViewerView] Recuerdo no encontrado: ${memoryId}`);
      _announce('No se pudo cargar el recuerdo');
      return;
    }

    /* Actualizar estado */
    _state.memoryId = memoryId;
    _state.memoryData = memory;
    _state.mode = mode;
    _state.isDirty = false;

    if (mode === 'alzheimer') {
      _loadAlzheimerViewer(memory);
    } else if (mode === 'therapeutic') {
      _loadTherapeuticViewer(memory);
    }
  }

  /* ========================================================================
     §3.1 Cargar visor Alzheimer
     ========================================================================
     Ref: wireframe §2.3 (visor ML); HTA-1 tarea 3.1 (visualizar)
     ======================================================================== */

  function _loadAlzheimerViewer(memory) {
    /* Nivel de claridad inicial del recuerdo */
    _state.currentClarity = memory.clarityLevel || 5;
    _state.savedClarity = _state.currentClarity;

    /* Renderizar imagen con filtro inicial */
    if (_dom.alzImage) {
      _dom.alzImage.src = memory.thumbnail || 'img/placeholder-memory.svg';
      _dom.alzImage.alt = `Recuerdo: ${memory.title}. ` +
                          `Personas: ${(memory.people || []).join(', ')}`;
      _applyClarityFilter(_state.currentClarity);
    }

    /* Configurar slider ARIA */
    if (_dom.alzClaritySlider) {
      _dom.alzClaritySlider.setAttribute('aria-valuenow', _state.currentClarity);
      _dom.alzClaritySlider.setAttribute('aria-valuetext',
        _getClarityDescriptor(_state.currentClarity));
      _updateSliderVisual(_dom.alzClaritySlider, _state.currentClarity, 0, 10);
    }

    /* Desactivar botones hasta que haya cambios */
    _setButtonStates('alzheimer', false);

    /* Poblar metadatos del recuerdo */
    _populateMemoryMeta('alzheimer', memory);

    /* Anunciar carga a SR */
    _announce(`Recuerdo cargado: ${memory.title}. Claridad: ${_getClarityDescriptor(_state.currentClarity)}`);

    console.log(`[ViewerView] Alzheimer viewer: ${memory.title}, claridad=${_state.currentClarity}`);
  }

  /* ========================================================================
     §3.2 Cargar visor Terapéutico + iniciar sesión
     ========================================================================
     Ref: wireframe §3.2; HTA-2 tareas 4.1-4.2; Modelo mental Carlos §2.2
     "sesión" → la carga del visor terapéutico implica inicio de sesión.
     ======================================================================== */

  function _loadTherapeuticViewer(memory) {
    /* Atenuación guardada del recuerdo o 0 */
    _state.currentAttenuation = memory.attenuationLevel || 0;
    _state.savedAttenuation = _state.currentAttenuation;
    _state.attenuationLimit = memory.therapistLimit || 70;
    _state.therapistName = memory.therapistName || 'Dr. Molina';

    /* Renderizar imagen */
    if (_dom.therImage) {
      _dom.therImage.src = memory.thumbnail || 'img/placeholder-memory.svg';
      _dom.therImage.alt = `Recuerdo: ${memory.title}. ` +
                            `Intensidad emocional: ${memory.emotionalLevel}/10`;
      _applyAttenuationFilter(_state.currentAttenuation);
    }

    /* Configurar slider ARIA con límite del terapeuta como max
       Ref: HTA-2 punto crítico 4.6 — el max del slider ES el límite */
    if (_dom.therAttSlider) {
      _dom.therAttSlider.setAttribute('aria-valuenow', _state.currentAttenuation);
      _dom.therAttSlider.setAttribute('aria-valuemax', _state.attenuationLimit);
      _dom.therAttSlider.setAttribute('aria-valuetext',
        `${_state.currentAttenuation} por ciento. ` +
        `Límite de tu terapeuta: ${_state.attenuationLimit} por ciento`);
      _updateSliderVisual(_dom.therAttSlider, _state.currentAttenuation, 0, _state.attenuationLimit);
    }

    /* Posicionar marcador de límite visual
       Ref: wireframe §3.2 — zona rayada naranja a partir del límite */
    if (_dom.therLimitMarker) {
      _dom.therLimitMarker.style.left = `${_state.attenuationLimit}%`;
    }

    /* Mini-barra de resumen */
    _updateAttenuationMiniBar();

    /* Resetear bienestar a "Neutro" */
    _state.wellbeingLevel = 3;
    _updateWellbeingVisual(3);

    _setButtonStates('therapeutic', false);
    _populateMemoryMeta('therapeutic', memory);

    /* Iniciar sesión terapéutica */
    _startSession();

    _announce(`Sesión iniciada. Recuerdo: ${memory.title}. ` +
              `Atenuación actual: ${_state.currentAttenuation}%`);
  }

  /* ========================================================================
     §4. FILTROS CSS EN TIEMPO REAL
     ========================================================================
     Ref: Microinteracciones §2 (claridad) y §3 (atenuación)
     Los filtros se aplican via CSS filter() sobre la imagen del recuerdo.
     Las CSS Custom Properties permiten transiciones suaves definidas en
     neuro-aesthetic.css (Commit 9).
     ======================================================================== */

  /**
   * §4.1 Aplicar filtro de claridad facial
   * Ref: Modelo mental ML §2.1 — "como ponerse gafas"
   * Mapeo: nivel 0-10 → blur(8px..0px) + contrast(0.6..1.2) + brightness
   */
  function _applyClarityFilter(level) {
    const t = level / 10; /* Normalizar a 0..1 */
    const cfg = VIEWER_CONFIG.clarity;

    /* Invertir blur: más nivel = menos blur */
    const blur = cfg.blurRange.max - (t * (cfg.blurRange.max - cfg.blurRange.min));
    const contrast = cfg.contrastRange.min + (t * (cfg.contrastRange.max - cfg.contrastRange.min));
    const brightness = cfg.brightnessRange.min + (t * (cfg.brightnessRange.max - cfg.brightnessRange.min));

    const filterStr = `blur(${blur.toFixed(1)}px) contrast(${contrast.toFixed(2)}) brightness(${brightness.toFixed(2)})`;

    if (_dom.alzImage) {
      _dom.alzImage.style.filter = filterStr;
      _dom.alzImage.style.transition = _prefersReducedMotion.matches
        ? 'none'
        : `filter ${cfg.transitionMs}ms ease-out`;
    }

    /* Actualizar CSS Custom Property para efectos neuro-estéticos */
    const viewer = _dom.alzViewer;
    if (viewer) {
      viewer.style.setProperty(cfg.cssProperty, t);
    }
  }

  /**
   * §4.2 Aplicar filtro de atenuación emocional
   * Ref: Modelo mental Carlos §2.2 — "bajar el volumen"
   * Mapeo: 0-100% → grayscale + opacity reducida + desaturación + sepia
   */
  function _applyAttenuationFilter(percent) {
    const t = percent / 100; /* Normalizar a 0..1 */
    const cfg = VIEWER_CONFIG.attenuation;

    const grayscale = cfg.grayscaleRange.min + (t * (cfg.grayscaleRange.max - cfg.grayscaleRange.min));
    const opacity = cfg.opacityRange.max - (t * (cfg.opacityRange.max - cfg.opacityRange.min));
    const saturate = cfg.saturateRange.max - (t * (cfg.saturateRange.max - cfg.saturateRange.min));
    const sepia = cfg.sepiaRange.min + (t * (cfg.sepiaRange.max - cfg.sepiaRange.min));

    const filterStr = `grayscale(${grayscale.toFixed(2)}) saturate(${saturate.toFixed(2)}) ` +
                      `sepia(${sepia.toFixed(2)}) opacity(${opacity.toFixed(2)})`;

    if (_dom.therImage) {
      _dom.therImage.style.filter = filterStr;
      _dom.therImage.style.transition = _prefersReducedMotion.matches
        ? 'none'
        : `filter ${cfg.transitionMs}ms ease-out`;
    }

    /* CSS Custom Property */
    const viewer = _dom.therViewer;
    if (viewer) {
      viewer.style.setProperty(cfg.cssProperty, t);
    }

    /* Actualizar mini-barra */
    _updateAttenuationMiniBar();
  }

  /* ========================================================================
     §5. HANDLERS DE SLIDER — CLARIDAD (María Luisa)
     ========================================================================
     Ref: WCAG 2.1.1 (teclado); wireframe §2.3
     El slider es un div con role="slider" (no <input type="range">),
     por lo que la interacción se gestiona manualmente.
     Paso = 1 unidad (0-10 discreto).
     ======================================================================== */

  function _handleClarityKey(e) {
    if (DialogController.isOpen()) return;

    const step = 1;
    let newVal = _state.currentClarity;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newVal = Math.min(10, newVal + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newVal = Math.max(0, newVal - step);
        break;
      case 'Home':
        newVal = 0;
        break;
      case 'End':
        newVal = 10;
        break;
      default:
        return; /* No consumir otras teclas */
    }

    e.preventDefault();
    _setClarityLevel(newVal);
  }

  function _handleClarityPointerDown(e) {
    if (DialogController.isOpen()) return;

    const slider = _dom.alzClaritySlider;
    if (!slider) return;

    const onMove = (ev) => {
      const rect = slider.getBoundingClientRect();
      const x = (ev.clientX || ev.touches?.[0]?.clientX || 0) - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const newVal = Math.round(pct * 10);
      _setClarityLevel(newVal);
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    onMove(e);
  }

  function _setClarityLevel(level) {
    if (level === _state.currentClarity) return;

    /* Detección de cambio brusco (D-03)
       Ref: Microinteracción §4; Tema 3 */
    _checkAbruptChange(level, _state.currentClarity, 10, async (reverted) => {
      if (reverted) {
        /* Restaurar valor anterior */
        _applyClarityFilter(_state.currentClarity);
        _updateClarityUI(_state.currentClarity);
        return;
      }
    });

    _state.currentClarity = level;
    _state.isDirty = (level !== _state.savedClarity);

    /* Aplicar filtro visual en tiempo real */
    _applyClarityFilter(level);
    _updateClarityUI(level);
    _setButtonStates('alzheimer', _state.isDirty);
  }

  function _updateClarityUI(level) {
    if (!_dom.alzClaritySlider) return;

    const desc = _getClarityDescriptor(level);
    _dom.alzClaritySlider.setAttribute('aria-valuenow', level);
    _dom.alzClaritySlider.setAttribute('aria-valuetext', desc);
    _updateSliderVisual(_dom.alzClaritySlider, level, 0, 10);

    /* Anunciar cambio (debounced para no saturar SR) */
    _announceDebounced(`Claridad: ${desc} (${level} de 10)`);
  }

  /* ========================================================================
     §6. HANDLERS DE SLIDER — ATENUACIÓN (Carlos)
     ========================================================================
     Ref: WCAG 2.1.1; wireframe §3.2; HTA-2 tarea 4.3
     Paso = 5% (Tema 3: gradualidad → pasos no demasiado grandes)
     Límite máximo = attenuationLimit (configurado por terapeuta)
     ======================================================================== */

  function _handleAttenuationKey(e) {
    if (DialogController.isOpen()) return;

    const step = 5; /* Ref: Tema 3 — gradualidad */
    let newVal = _state.currentAttenuation;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newVal = Math.min(_state.attenuationLimit, newVal + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newVal = Math.max(0, newVal - step);
        break;
      case 'Home':
        newVal = 0;
        break;
      case 'End':
        newVal = _state.attenuationLimit;
        break;
      default:
        return;
    }

    e.preventDefault();
    _setAttenuationLevel(newVal);
  }

  function _handleAttenuationPointerDown(e) {
    if (DialogController.isOpen()) return;

    const slider = _dom.therAttSlider;
    if (!slider) return;

    const onMove = (ev) => {
      const rect = slider.getBoundingClientRect();
      const x = (ev.clientX || ev.touches?.[0]?.clientX || 0) - rect.left;
      /* Mapear posición a 0..attenuationLimit
         El slider visual ocupa el 100% del ancho pero el max es el límite */
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const rawVal = Math.round(pct * 100);
      const newVal = Math.min(rawVal, _state.attenuationLimit);
      _setAttenuationLevel(newVal);
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      /* Snap a múltiplo de 5 al soltar (gradualidad) */
      const snapped = Math.round(_state.currentAttenuation / 5) * 5;
      if (snapped !== _state.currentAttenuation) {
        _setAttenuationLevel(snapped);
      }
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    onMove(e);
  }

  function _setAttenuationLevel(level) {
    /* Detectar si alcanzó el límite → D-04
       Ref: HTA-2 punto crítico 4.6 */
    if (level >= _state.attenuationLimit && _state.currentAttenuation < _state.attenuationLimit) {
      level = _state.attenuationLimit;
      notifyTherapistLimit(_state.attenuationLimit, _state.therapistName);
    }

    if (level === _state.currentAttenuation) return;

    /* Detección de cambio brusco (D-03) */
    _checkAbruptChange(level, _state.currentAttenuation, 100, async (reverted) => {
      if (reverted) {
        _applyAttenuationFilter(_state.currentAttenuation);
        _updateAttenuationUI(_state.currentAttenuation);
        return;
      }
    });

    _state.currentAttenuation = level;
    _state.isDirty = (level !== _state.savedAttenuation);
    _state.sessionChangesCount++;

    /* Resetear timer de inactividad (la sesión sigue activa) */
    _resetInactivityTimer();

    /* Aplicar filtro visual en tiempo real */
    _applyAttenuationFilter(level);
    _updateAttenuationUI(level);
    _setButtonStates('therapeutic', _state.isDirty);
  }

  function _updateAttenuationUI(level) {
    if (!_dom.therAttSlider) return;

    const desc = _getAttenuationDescriptor(level);
    _dom.therAttSlider.setAttribute('aria-valuenow', level);
    _dom.therAttSlider.setAttribute('aria-valuetext',
      `${level} por ciento, ${desc.toLowerCase()}. ` +
      `Límite de tu terapeuta: ${_state.attenuationLimit} por ciento`);
    _updateSliderVisual(_dom.therAttSlider, level, 0, _state.attenuationLimit);

    _announceDebounced(`Atenuación: ${desc} (${level}%)`);
  }

  function _updateAttenuationMiniBar() {
    if (_dom.therAttMiniBar) {
      _dom.therAttMiniBar.style.width = `${_state.currentAttenuation}%`;
    }
    if (_dom.therAttValue) {
      _dom.therAttValue.textContent =
        `${_state.currentAttenuation}% / ${_state.attenuationLimit}% límite`;
    }
  }

  /* ========================================================================
     §7. DETECCIÓN DE CAMBIO BRUSCO
     ========================================================================
     Ref: Microinteracción §4; Tema 3 "los cambios bruscos me asustan"
     Algoritmo: registra valor y timestamp en cada cambio. Si la diferencia
     supera el umbral en la ventana temporal, dispara D-03.
     ======================================================================== */

  async function _checkAbruptChange(newVal, oldVal, maxRange, onRevert) {
    const now = Date.now();
    const cfg = VIEWER_CONFIG.abruptChange;

    /* Calcular cambio normalizado al rango del slider */
    const changePct = Math.abs(newVal - oldVal) / maxRange * 100;

    if (_state.lastSliderTime !== null) {
      const elapsed = now - _state.lastSliderTime;
      if (changePct >= cfg.threshold && elapsed <= cfg.timeWindowMs) {
        /* Cambio brusco detectado → D-03 */
        const keep = await alertAbruptChange();
        if (!keep) {
          onRevert(true);
        }
        _state.lastSliderValue = null;
        _state.lastSliderTime = null;
        return;
      }
    }

    _state.lastSliderValue = newVal;
    _state.lastSliderTime = now;
  }

  /* ========================================================================
     §8. HANDLERS DE GUARDAR / DESHACER
     ========================================================================
     Ref: HTA-1 tarea 3.3-3.4; HTA-2 tarea 4.4
     ======================================================================== */

  /** §8.1 Guardar claridad → D-01 + animación neural */
  async function _handleSaveClarity() {
    if (!_state.isDirty) return;

    /* Diálogo D-01 */
    const confirmed = await confirmClarity();
    if (!confirmed) return;

    /* Animación de procesamiento neural
       Ref: Microinteracción §2 — "el implante procesa el cambio" */
    await _showProcessingAnimation('alzheimer');

    /* Persistir (simulado: actualizar en data.js) */
    _state.savedClarity = _state.currentClarity;
    _state.isDirty = false;

    if (window.MnemosyneData && _state.memoryId) {
      window.MnemosyneData.updateMemory(_state.memoryId, {
        clarityLevel: _state.currentClarity
      });
    }

    _setButtonStates('alzheimer', false);
    _showToast('Claridad guardada correctamente');
    _announce('Ajuste de claridad guardado');
  }

  /** §8.2 Deshacer claridad */
  function _handleUndoClarity() {
    _state.currentClarity = _state.savedClarity;
    _state.isDirty = false;
    _applyClarityFilter(_state.savedClarity);
    _updateClarityUI(_state.savedClarity);
    _setButtonStates('alzheimer', false);
    _announce('Cambios de claridad descartados');
  }

  /** §8.3 Guardar atenuación → D-02 + animación neural */
  async function _handleSaveAttenuation() {
    if (!_state.isDirty) return;

    /* Diálogo D-02 */
    const confirmed = await confirmAttenuation(
      _state.currentAttenuation,
      _state.attenuationLimit
    );
    if (!confirmed) return;

    await _showProcessingAnimation('therapeutic');

    _state.savedAttenuation = _state.currentAttenuation;
    _state.isDirty = false;

    if (window.MnemosyneData && _state.memoryId) {
      window.MnemosyneData.updateMemory(_state.memoryId, {
        attenuationLevel: _state.currentAttenuation
      });
    }

    _setButtonStates('therapeutic', false);
    _showToast('Atenuación emocional guardada');
    _announce('Ajuste de atenuación emocional guardado');
  }

  /** §8.4 Deshacer atenuación */
  function _handleUndoAttenuation() {
    _state.currentAttenuation = _state.savedAttenuation;
    _state.isDirty = false;
    _applyAttenuationFilter(_state.savedAttenuation);
    _updateAttenuationUI(_state.savedAttenuation);
    _setButtonStates('therapeutic', false);
    _resetInactivityTimer();
    _announce('Cambios de atenuación descartados');
  }

  /* ========================================================================
     §9. SESIÓN TERAPÉUTICA
     ========================================================================
     Ref: HTA-2 plan 4 (sesión temporal); Modelo mental Carlos §2.2
     La sesión es el contenedor temporal de la interacción terapéutica.
     Incluye timer de inactividad (D-05) y timer de sesión visible.
     ======================================================================== */

  /** §9.1 Iniciar sesión */
  function _startSession() {
    _state.sessionActive = true;
    _state.sessionStartTime = Date.now();
    _state.sessionChangesCount = 0;

    /* Timer de sesión visible (actualización cada segundo)
       Ref: wireframe §3.2 — cronómetro visible en la UI */
    _state.sessionTimer = setInterval(() => {
      _updateSessionTimerDisplay();
    }, 1000);

    /* Timer de inactividad → D-05
       Ref: STD T30; HTA-2 tarea 4.5 */
    _resetInactivityTimer();

    console.log('[ViewerView] Sesión terapéutica iniciada');
  }

  /** §9.2 Timer de inactividad */
  function _resetInactivityTimer() {
    if (_state.inactivityTimer) {
      clearTimeout(_state.inactivityTimer);
    }

    if (!_state.sessionActive) return;

    _state.inactivityTimer = setTimeout(async () => {
      /* D-05: Check de bienestar por inactividad */
      const continueSession = await checkWellbeing();
      if (!continueSession) {
        _endSession();
      } else {
        _resetInactivityTimer();
      }
    }, VIEWER_CONFIG.session.inactivityTimeoutMs);
  }

  /** §9.3 Actualizar display del cronómetro de sesión */
  function _updateSessionTimerDisplay() {
    if (!_state.sessionActive || !_dom.therSessionTimer) return;

    const elapsed = Date.now() - _state.sessionStartTime;
    const min = Math.floor(elapsed / 60000);
    const sec = Math.floor((elapsed % 60000) / 1000);
    const timeStr = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

    _dom.therSessionTimer.textContent = timeStr;

    /* Aviso suave si se acerca a duración máxima
       Ref: Entrevista P04 — "por la noche" → evitar sesiones largas */
    if (elapsed >= VIEWER_CONFIG.session.maxDurationMs * 0.9) {
      _dom.therSessionTimer.classList.add('session-timer--warning');
    }
  }

  /** §9.4 Salir de sesión → D-06 */
  async function _handleExitSession() {
    const sessionData = {
      startTime: _state.sessionStartTime,
      changesCount: _state.sessionChangesCount
    };

    const exit = await confirmExitSession(sessionData);
    if (!exit) {
      _resetInactivityTimer();
      return;
    }

    _endSession();
  }

  /** §9.5 Finalizar sesión (interno) */
  function _endSession() {
    _state.sessionActive = false;

    /* Limpiar timers */
    if (_state.inactivityTimer) clearTimeout(_state.inactivityTimer);
    if (_state.sessionTimer) clearInterval(_state.sessionTimer);
    _state.inactivityTimer = null;
    _state.sessionTimer = null;

    /* Si hay cambios sin guardar, deshacer
       Ref: Principio ético §7 — no guardar sin consentimiento explícito */
    if (_state.isDirty) {
      _handleUndoAttenuation();
    }

    /* Mostrar resumen de sesión (pantalla resumen)
       Ref: STD T35 → pantalla "Resumen de sesión" */
    _showSessionSummary();

    _announce('Sesión terapéutica finalizada');
    console.log('[ViewerView] Sesión finalizada. Duración:',
      Math.floor((Date.now() - _state.sessionStartTime) / 1000), 's');
  }

  function _showSessionSummary() {
    const duration = Date.now() - _state.sessionStartTime;
    const min = Math.floor(duration / 60000);

    /* Navegar a pantalla de resumen si existe */
    if (window.MnemosyneNav) {
      window.MnemosyneNav.goTo('screen-ther-summary', {
        duration: min,
        changes: _state.sessionChangesCount,
        finalAttenuation: _state.savedAttenuation,
        wellbeing: _state.wellbeingLevel
      });
    }
  }

  /* ========================================================================
     §10. SLIDER DE BIENESTAR
     ========================================================================
     Ref: HTA-2 tarea 4.5; Microinteracción §7
     5 niveles discretos (no continuo) — Gap §3.2: "no gamificar"
     ======================================================================== */

  const WELLBEING_LABELS = [
    'Muy mal',      /* 1 — 😰 */
    'Algo mal',     /* 2 — 😟 */
    'Neutro',       /* 3 — 😐 */
    'Bien',         /* 4 — 🙂 */
    'Muy bien'      /* 5 — 😌 */
  ];

  function _handleWellbeingKey(e) {
    let newVal = _state.wellbeingLevel;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newVal = Math.min(5, newVal + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newVal = Math.max(1, newVal - 1);
        break;
      default:
        return;
    }

    e.preventDefault();
    _state.wellbeingLevel = newVal;
    _updateWellbeingVisual(newVal);
    _resetInactivityTimer();
    _announce(`Bienestar: ${WELLBEING_LABELS[newVal - 1]}`);
  }

  function _updateWellbeingVisual(level) {
    const slider = _dom.therWellbeingSlider;
    if (!slider) return;

    slider.setAttribute('aria-valuenow', level);
    slider.setAttribute('aria-valuetext', WELLBEING_LABELS[level - 1]);
    _updateSliderVisual(slider, level, 1, 5);

    /* Actualizar output/description */
    const output = slider.parentElement?.querySelector('.wellbeing__description');
    if (output) output.textContent = WELLBEING_LABELS[level - 1];

    /* CSS custom property para posible cambio de color del thumb
       Ref: neuro-aesthetic.css — thumb cambia de color según bienestar */
    const container = slider.closest('.wellbeing-panel');
    if (container) {
      container.style.setProperty('--emotion-level', (level - 1) / 4);
    }
  }

  /* ========================================================================
     §11. UTILIDADES COMPARTIDAS
     ======================================================================== */

  /** §11.1 Actualizar visual del slider (fill y thumb position) */
  function _updateSliderVisual(sliderEl, value, min, max) {
    const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
    sliderEl.style.setProperty('--slider-fill', `${pct}%`);

    const fill = sliderEl.querySelector('.slider__fill');
    if (fill) fill.style.width = `${pct}%`;

    const thumb = sliderEl.querySelector('.slider__thumb');
    if (thumb) thumb.style.left = `${pct}%`;
  }

  /** §11.2 Habilitar/deshabilitar botones guardar/deshacer */
  function _setButtonStates(mode, dirty) {
    const saveBtn = mode === 'alzheimer' ? _dom.alzSaveBtn : _dom.therSaveBtn;
    const undoBtn = mode === 'alzheimer' ? _dom.alzUndoBtn : _dom.therUndoBtn;

    if (saveBtn) saveBtn.disabled = !dirty;
    if (undoBtn) undoBtn.disabled = !dirty;
  }

  /** §11.3 Poblar metadatos del recuerdo en la UI */
  function _populateMemoryMeta(mode, memory) {
    const prefix = mode === 'alzheimer' ? '#screen-alz-viewer' : '#screen-ther-viewer';
    const container = document.querySelector(prefix);
    if (!container) return;

    const titleEl = container.querySelector('.viewer__memory-title');
    const dateEl = container.querySelector('.viewer__memory-date');
    const placeEl = container.querySelector('.viewer__memory-place');
    const peopleEl = container.querySelector('.viewer__memory-people');
    const emotionEl = container.querySelector('.viewer__memory-emotion');

    if (titleEl) titleEl.textContent = memory.title || '';
    if (dateEl) dateEl.textContent = memory.dateFormatted || '';
    if (placeEl) placeEl.textContent = memory.place || '';
    if (peopleEl) peopleEl.textContent = (memory.people || []).join(', ');
    if (emotionEl) emotionEl.textContent = `${memory.emotionalLevel || '?'}/10`;
  }

  /** §11.4 Descriptores verbales */
  function _getClarityDescriptor(level) {
    const idx = Math.min(Math.floor(level / 2), VIEWER_CONFIG.clarity.descriptors.length - 1);
    return VIEWER_CONFIG.clarity.descriptors[idx];
  }

  function _getAttenuationDescriptor(percent) {
    const descs = VIEWER_CONFIG.attenuation.descriptors;
    if (percent < 15) return descs[0];
    if (percent < 30) return descs[1];
    if (percent < 50) return descs[2];
    if (percent < 70) return descs[3];
    return descs[4];
  }

  /** §11.5 Animación de procesamiento neural
      Ref: Microinteracción §2/§3 — "el implante procesa el cambio" */
  function _showProcessingAnimation(mode) {
    return new Promise(resolve => {
      const el = mode === 'alzheimer' ? _dom.alzProcessing : _dom.therProcessing;
      const duration = mode === 'alzheimer'
        ? VIEWER_CONFIG.clarity.processingMs
        : VIEWER_CONFIG.attenuation.processingMs;

      if (!el || _prefersReducedMotion.matches) {
        /* Sin animación si reduce-motion o no hay elemento */
        setTimeout(resolve, 300);
        return;
      }

      el.hidden = false;
      el.classList.add('neural-processing--active');
      _announce('Procesando cambio en el implante...');

      setTimeout(() => {
        el.classList.remove('neural-processing--active');
        el.hidden = true;
        resolve();
      }, duration);
    });
  }

  /** §11.6 Toast de feedback
      Ref: Microinteracción §6 — notificación temporal no intrusiva */
  function _showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    const msgEl = toast.querySelector('.toast__message');
    if (msgEl) msgEl.textContent = message;

    toast.hidden = false;
    toast.classList.add('toast--visible');

    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 3000);
  }

  /** §11.7 Anuncio a screen readers (aria-live) */
  function _announce(text) {
    const el = _state.mode === 'alzheimer' ? _dom.alzAnnounce : _dom.therAnnounce;
    const fallback = document.getElementById('global-status');
    const target = el || fallback;
    if (!target) return;
    target.textContent = '';
    requestAnimationFrame(() => { target.textContent = text; });
  }

  /** §11.8 Anuncio debounced (para cambios rápidos de slider) */
  let _announceTimer = null;
  function _announceDebounced(text, delayMs = 400) {
    if (_announceTimer) clearTimeout(_announceTimer);
    _announceTimer = setTimeout(() => _announce(text), delayMs);
  }

  /* ========================================================================
     §12. CLEANUP
     ======================================================================== */

  /** destroy() — Limpia timers y estado al salir del visor */
  function destroy() {
    if (_state.inactivityTimer) clearTimeout(_state.inactivityTimer);
    if (_state.sessionTimer) clearInterval(_state.sessionTimer);
    if (_announceTimer) clearTimeout(_announceTimer);
    _state.sessionActive = false;
    _state.memoryId = null;
    _state.isDirty = false;
  }

  /* ========================================================================
     §13. API PÚBLICA
     ======================================================================== */

  return {
    init,
    loadMemory,
    destroy,
    /* Getters para testing/debug */
    getState: () => ({ ..._state }),
    getMode: () => _state.mode,
    isSessionActive: () => _state.sessionActive
  };

})();

/* ==========================================================================
   §14. REGISTRO GLOBAL
   ========================================================================== */

window.ViewerView = ViewerView;
