/**
 * ============================================================================
 * MNEMOSYNE — dialogController.js
 * Commit 12: feat: Real-Time Simulation Effects (parte 3/4)
 * ============================================================================
 *
 * Sistema de diálogos modales accesible que implementa los 6 diálogos
 * especificados en el Commit 5 (Interaction Flow & Dialogue Specification).
 *
 * Catálogo de diálogos implementados:
 *   D-01  Confirmar aplicación de filtro de claridad (María Luisa)
 *   D-02  Confirmar guardado de atenuación emocional (Carlos)
 *   D-03  Cambio brusco detectado en slider
 *   D-04  Límite del terapeuta alcanzado
 *   D-05  Check de bienestar (inactividad / sesión prolongada)
 *   D-06  Confirmar salida de sesión terapéutica
 *
 * Justificación DCU global:
 *   - Focus group Tema 6: preocupaciones éticas → confirmación antes de
 *     cualquier cambio irreversible (D-01, D-02)
 *   - Tema 3: "los cambios bruscos me asustan" → detección automática de
 *     movimiento rápido en slider (D-03)
 *   - HTA-2 punto crítico 4.6: límite terapeuta como protección (D-04)
 *   - HTA-2 tarea 4.5: monitorización de bienestar durante sesión (D-05)
 *   - STD T34: punto de salida siempre accesible (D-06)
 *   - Diálogos §5.2: máximo 2 botones, nunca rojo para acción primaria
 *   - WCAG 2.1 AA: focus trap, aria-modal, escape para cerrar
 *
 * Dependencias:
 *   - Requiere elementos modales del HTML (Commit 7)
 *   - Usa clases CSS de components.css (Commit 9)
 *   - Integra con app.js (Commit 11) via MnemosyneApp.dialogController
 *
 * @author Jorge — Grupo PA1, USAL
 * ============================================================================
 */

'use strict';

/* ==========================================================================
   §1. CONFIGURACIÓN DE DIÁLOGOS
   ==========================================================================
   Ref: Commit 5, Tabla de diálogos D-01 a D-06
   Cada entrada define el contenido, comportamiento y callbacks del diálogo.
   Justificación: centralizar la configuración facilita la trazabilidad DCU
   y permite verificar que cada diálogo cumple su especificación.
   ========================================================================== */

const DIALOG_CONFIG = {
  /**
   * D-01: Confirmar aplicación de filtro de claridad
   * Ref: HTA-1 tarea 3.3 (aplicar filtro); wireframe §2.3
   * Justificación: Tema 1 (angustia no-reconocimiento) → el usuario debe
   * confirmar antes de guardar porque el cambio afecta cómo percibe el
   * recuerdo. Gap §5.1: "miedo a romper algo".
   */
  'confirm-clarity': {
    modalId: 'modal-confirm',
    title: '¿Guardar el ajuste de claridad?',
    message: 'Las caras del recuerdo se mostrarán con el nuevo nivel de nitidez. ' +
             'Puedes volver a cambiarlo en cualquier momento.',
    confirmText: 'Sí, guardar',
    cancelText: 'Seguir ajustando',
    confirmIcon: '✓',
    cancelIcon: '↩',
    role: 'dialog',
    /* Ref: Principio ético §7 (transparencia) → mensaje explica el efecto */
    announceText: 'Diálogo de confirmación: guardar ajuste de claridad facial'
  },

  /**
   * D-02: Confirmar guardado de atenuación emocional
   * Ref: HTA-2 tarea 4.4 (guardar ajuste); wireframe §3.2
   * Justificación: Tema 3 (gradualidad) → confirmar que el nivel elegido
   * es intencional. La atenuación emocional tiene mayor impacto que la
   * claridad, por lo que el mensaje es más detallado.
   */
  'confirm-attenuation': {
    modalId: 'modal-confirm',
    title: '¿Guardar la atenuación emocional?',
    message: '', /* Se genera dinámicamente con el % actual */
    confirmText: 'Sí, guardar',
    cancelText: 'Seguir ajustando',
    confirmIcon: '✓',
    cancelIcon: '↩',
    role: 'dialog',
    announceText: 'Diálogo de confirmación: guardar nivel de atenuación emocional',
    /**
     * Generador dinámico de mensaje
     * Ref: Microinteracción §3 → feedback incluye nivel numérico
     */
    getMessage(level, limit) {
      const desc = level <= 20 ? 'ligera' : level <= 50 ? 'moderada' : 'alta';
      return `Atenuación ${desc} (${level}%). ` +
             `El recuerdo se sentirá menos intenso emocionalmente. ` +
             (limit ? `Tu límite configurado es ${limit}%. ` : '') +
             'Puedes ajustarlo de nuevo cuando quieras.';
    }
  },

  /**
   * D-03: Cambio brusco detectado
   * Ref: STD S12→S13 (detección de salto); Microinteracción §4
   * Justificación: Tema 3 "los cambios bruscos me asustan" → si el
   * slider se mueve más de 30 puntos en menos de 200ms, se interpreta
   * como movimiento accidental (especialmente relevante para María Luisa,
   * OC1: "toca accidentalmente la pantalla").
   * Gap analysis §4.3: usuario no entiende la magnitud del cambio.
   */
  'abrupt-change': {
    modalId: 'modal-abrupt',
    title: 'Cambio detectado',
    message: 'Has movido el filtro rápidamente. ¿Es lo que querías?',
    confirmText: 'Sí, mantener',
    cancelText: 'Deshacer',
    confirmIcon: '✓',
    cancelIcon: '↩',
    role: 'alertdialog',
    /* alertdialog porque requiere atención inmediata (WCAG 4.1.3) */
    announceText: 'Alerta: se ha detectado un cambio brusco en el filtro'
  },

  /**
   * D-04: Límite del terapeuta alcanzado
   * Ref: HTA-2 punto crítico 4.6; STD S14 (estado límite)
   * Justificación: el límite no es una restricción punitiva sino una
   * protección acordada en el plan de tratamiento (Gap §3.2).
   * Entrevista E3 (Dr. Molina): "dosificar la exposición".
   * El tono debe ser empático, no autoritario.
   */
  'therapist-limit': {
    modalId: 'modal-limit',
    title: 'Límite alcanzado',
    message: '', /* Se genera dinámicamente */
    confirmText: 'Entendido',
    cancelText: null, /* Solo 1 botón: no hay acción alternativa */
    confirmIcon: '✓',
    cancelIcon: null,
    role: 'dialog',
    announceText: 'Aviso: has alcanzado el límite de atenuación configurado por tu terapeuta',
    getMessage(limit, therapistName) {
      return `Has llegado al límite de atenuación (${limit}%) configurado por ` +
             `${therapistName || 'tu terapeuta'}. ` +
             'Esto forma parte de tu plan de tratamiento. ' +
             'Si necesitas hablar sobre este límite, contacta con tu terapeuta.';
    }
  },

  /**
   * D-05: Check de bienestar
   * Ref: HTA-2 tarea 4.5; STD T30 (timer inactividad 30s)
   * Justificación: Tema 3 (hiperactivación TEPT) → después de 30s de
   * inactividad durante una sesión de atenuación, el sistema pregunta
   * proactivamente. No se asume que el silencio es positivo.
   * Entrevista P04: sesiones por la noche → mayor riesgo emocional.
   */
  'wellbeing-check': {
    modalId: 'modal-wellbeing',
    title: '¿Cómo te encuentras?',
    message: 'Llevas un rato sin interactuar. ¿Quieres seguir con la sesión o prefieres parar?',
    confirmText: 'Seguir',
    cancelText: 'Parar sesión',
    confirmIcon: '▶',
    cancelIcon: '⏹',
    role: 'dialog',
    announceText: 'Comprobación de bienestar: ¿deseas continuar con la sesión?',
    /* Ref: Modelo mental Carlos §2.2: "sesión" implica temporalidad */
  },

  /**
   * D-06: Confirmar salida de sesión terapéutica
   * Ref: STD T34; Microinteracción §8
   * Justificación: la salida siempre está disponible (STD T34), pero se
   * confirma para evitar pérdida accidental del progreso de la sesión.
   * A diferencia de D-01/D-02, aquí la acción principal es "salir"
   * (cancelar = quedarse), lo que invierte la semántica habitual.
   */
  'exit-session': {
    modalId: 'modal-exit',
    title: '¿Salir de la sesión?',
    message: '', /* Se genera dinámicamente con resumen */
    confirmText: 'Sí, salir',
    cancelText: 'Continuar sesión',
    confirmIcon: '⏹',
    cancelIcon: '▶',
    role: 'dialog',
    announceText: 'Confirmación: ¿deseas salir de la sesión terapéutica?',
    getMessage(sessionData) {
      if (!sessionData) return '¿Seguro que quieres salir? Los cambios no guardados se perderán.';
      const dur = Math.floor((Date.now() - sessionData.startTime) / 60000);
      const changes = sessionData.changesCount || 0;
      return `Duración de la sesión: ${dur} minuto${dur !== 1 ? 's' : ''}. ` +
             (changes > 0
               ? `Has realizado ${changes} ajuste${changes !== 1 ? 's' : ''}. `
               : 'No has realizado ajustes. ') +
             'Los cambios no guardados se perderán.';
    }
  }
};

/* ==========================================================================
   §2. CLASE DialogController
   ==========================================================================
   Controlador central del sistema de diálogos. Gestiona:
   - Apertura/cierre con animación y focus trap (WCAG 2.4.3)
   - Cola de diálogos (nunca se apilan, §5.2)
   - Callbacks de confirmación/cancelación
   - Anuncio a lectores de pantalla via aria-live
   ========================================================================== */

const DialogController = (function () {

  /* --- Estado interno --- */
  let _activeDialog = null;     /* {modalId, resolve, previousFocus} */
  let _queue = [];              /* Cola FIFO de diálogos pendientes */
  let _isTransitioning = false; /* Evita doble apertura durante animación */

  /* --- Referencias DOM cacheadas --- */
  const _refs = {};
  const _statusEl = () => document.getElementById('global-status');

  /* ========================================================================
     §2.1 Inicialización
     ======================================================================== */

  /**
   * init() — Cachea referencias DOM y vincula event listeners globales.
   * Se llama una vez desde app.js durante el arranque.
   */
  function init() {
    /* Cachear todos los overlays modales */
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      const id = overlay.id;
      _refs[id] = {
        overlay,
        dialog: overlay.querySelector('.modal, [role="dialog"], [role="alertdialog"]'),
        title: overlay.querySelector('.modal__title'),
        message: overlay.querySelector('.modal__message'),
        btnConfirm: overlay.querySelector('.modal__btn-confirm'),
        btnCancel: overlay.querySelector('.modal__btn-cancel'),
        btnConfirmText: overlay.querySelector('.modal__btn-confirm .modal__btn-text'),
        btnCancelText: overlay.querySelector('.modal__btn-cancel .modal__btn-text'),
        btnConfirmIcon: overlay.querySelector('.modal__btn-confirm .modal__btn-icon'),
        btnCancelIcon: overlay.querySelector('.modal__btn-cancel .modal__btn-icon')
      };
    });

    /* Listener global de Escape
       Ref: WCAG 2.1.1 (teclado), §5.2 (Escape siempre cierra) */
    document.addEventListener('keydown', _handleKeydown);

    /* Listeners de click en overlays
       Ref: Diálogos §5.2 — overlay NO cierra el modal (prevención de
       toque accidental, OC1 María Luisa). Solo Escape o botones. */
    /* NO se añade click en overlay — decisión DCU deliberada */

    console.log('[DialogController] Inicializado con', Object.keys(_refs).length, 'modales');
  }

  /* ========================================================================
     §2.2 API Pública: open()
     ======================================================================== */

  /**
   * open(dialogKey, options) — Abre un diálogo y devuelve una Promise.
   *
   * @param {string} dialogKey — Clave de DIALOG_CONFIG (ej: 'confirm-clarity')
   * @param {Object} [options] — Parámetros dinámicos para getMessage()
   * @returns {Promise<boolean>} — true si confirma, false si cancela
   *
   * Ejemplo de uso:
   *   const confirmed = await DialogController.open('confirm-clarity');
   *   if (confirmed) { guardarCambio(); }
   */
  function open(dialogKey, options = {}) {
    const config = DIALOG_CONFIG[dialogKey];
    if (!config) {
      console.error(`[DialogController] Diálogo desconocido: "${dialogKey}"`);
      return Promise.resolve(false);
    }

    return new Promise(resolve => {
      /* Si hay un diálogo activo, encolar (§5.2: nunca apilar) */
      if (_activeDialog || _isTransitioning) {
        _queue.push({ dialogKey, options, resolve });
        return;
      }

      _show(config, options, resolve);
    });
  }

  /* ========================================================================
     §2.3 Lógica interna: mostrar diálogo
     ======================================================================== */

  function _show(config, options, resolve) {
    _isTransitioning = true;

    const ref = _refs[config.modalId];
    if (!ref) {
      console.error(`[DialogController] Modal no encontrado: "${config.modalId}"`);
      resolve(false);
      _isTransitioning = false;
      return;
    }

    /* Guardar foco actual para restaurar al cerrar (WCAG 2.4.3) */
    const previousFocus = document.activeElement;

    /* Configurar contenido */
    if (ref.title) ref.title.textContent = config.title;

    /* Mensaje: dinámico si tiene getMessage(), estático si no */
    const msg = (typeof config.getMessage === 'function')
      ? config.getMessage(options.level, options.limit || options.therapistName || options.sessionData)
      : config.message;
    if (ref.message) ref.message.textContent = msg;

    /* Botón confirmar */
    if (ref.btnConfirm) {
      if (ref.btnConfirmText) ref.btnConfirmText.textContent = config.confirmText;
      else ref.btnConfirm.lastChild.textContent = config.confirmText;
      if (ref.btnConfirmIcon) ref.btnConfirmIcon.textContent = config.confirmIcon;
      ref.btnConfirm.hidden = false;
    }

    /* Botón cancelar (puede ser null en D-04) */
    if (ref.btnCancel) {
      if (config.cancelText) {
        ref.btnCancel.hidden = false;
        if (ref.btnCancelText) ref.btnCancelText.textContent = config.cancelText;
        else ref.btnCancel.lastChild.textContent = config.cancelText;
        if (ref.btnCancelIcon) ref.btnCancelIcon.textContent = config.cancelIcon;
      } else {
        ref.btnCancel.hidden = true;
      }
    }

    /* Configurar role del dialog (dialog vs alertdialog) */
    if (ref.dialog) {
      ref.dialog.setAttribute('role', config.role || 'dialog');
    }

    /* Registrar estado activo */
    _activeDialog = {
      modalId: config.modalId,
      dialogKey: config.dialogKey,
      resolve,
      previousFocus,
      ref
    };

    /* Mostrar overlay */
    ref.overlay.hidden = false;
    ref.overlay.classList.add('modal-overlay--visible');

    /* Bloquear scroll del body */
    document.body.classList.add('has-modal');
    document.body.setAttribute('aria-hidden', 'false');

    /* Anunciar a screen readers
       Ref: WCAG 4.1.3 (mensajes de estado) */
    _announce(config.announceText || config.title);

    /* Vincular handlers de botones */
    const onConfirm = () => _close(true);
    const onCancel = () => _close(false);

    ref.btnConfirm.addEventListener('click', onConfirm, { once: true });
    if (ref.btnCancel && config.cancelText) {
      ref.btnCancel.addEventListener('click', onCancel, { once: true });
    }

    /* Guardar handlers para limpieza */
    _activeDialog._onConfirm = onConfirm;
    _activeDialog._onCancel = onCancel;

    /* Focus trap: mover foco al primer botón interactivo
       Ref: WCAG 2.4.3 (orden de foco) — autofocus en confirmar */
    requestAnimationFrame(() => {
      _isTransitioning = false;
      const focusTarget = ref.btnConfirm || ref.dialog;
      if (focusTarget) focusTarget.focus();
      _setupFocusTrap(ref);
    });
  }

  /* ========================================================================
     §2.4 Lógica interna: cerrar diálogo
     ======================================================================== */

  function _close(confirmed) {
    if (!_activeDialog) return;
    _isTransitioning = true;

    const { ref, resolve, previousFocus, _onConfirm, _onCancel } = _activeDialog;

    /* Limpiar handlers */
    ref.btnConfirm.removeEventListener('click', _onConfirm);
    if (ref.btnCancel) ref.btnCancel.removeEventListener('click', _onCancel);

    /* Animación de salida */
    ref.overlay.classList.remove('modal-overlay--visible');
    ref.overlay.classList.add('modal-overlay--closing');

    /* Desactivar focus trap */
    _removeFocusTrap(ref);

    /* Esperar fin de animación CSS (300ms definido en components.css) */
    const transitionDuration = 300;
    setTimeout(() => {
      ref.overlay.hidden = true;
      ref.overlay.classList.remove('modal-overlay--closing');

      /* Restaurar scroll */
      document.body.classList.remove('has-modal');

      /* Restaurar foco previo (WCAG 2.4.3) */
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }

      _activeDialog = null;
      _isTransitioning = false;

      /* Resolver la Promise */
      resolve(confirmed);

      /* Procesar cola si hay diálogos pendientes */
      _processQueue();
    }, transitionDuration);
  }

  /* ========================================================================
     §2.5 Focus Trap (accesibilidad)
     ========================================================================
     Ref: WCAG 2.4.3 — el foco debe permanecer dentro del diálogo mientras
     esté abierto. Implementación ligera sin dependencias externas.
     ======================================================================== */

  function _setupFocusTrap(ref) {
    ref._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;

      const focusable = ref.dialog.querySelectorAll(
        'button:not([hidden]):not([disabled]), ' +
        '[href], input:not([hidden]), select, textarea, ' +
        '[tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    ref.dialog.addEventListener('keydown', ref._focusTrapHandler);
  }

  function _removeFocusTrap(ref) {
    if (ref._focusTrapHandler) {
      ref.dialog.removeEventListener('keydown', ref._focusTrapHandler);
      ref._focusTrapHandler = null;
    }
  }

  /* ========================================================================
     §2.6 Gestión de teclado
     ========================================================================
     Ref: Diálogos §5.2 — Escape siempre cierra (equivale a cancelar).
     Excepción: en D-04 (límite), Escape = confirmar (único botón).
     ======================================================================== */

  function _handleKeydown(e) {
    if (e.key !== 'Escape' || !_activeDialog) return;
    e.preventDefault();
    e.stopPropagation();

    /* Si no hay botón cancelar (D-04), Escape = confirmar */
    const ref = _activeDialog.ref;
    if (ref.btnCancel && !ref.btnCancel.hidden) {
      _close(false);
    } else {
      _close(true);
    }
  }

  /* ========================================================================
     §2.7 Cola de diálogos
     ========================================================================
     Ref: §5.2 — nunca se apilan diálogos. Si se solicita un segundo
     diálogo mientras uno está abierto, se encola y se muestra al cerrar.
     ======================================================================== */

  function _processQueue() {
    if (_queue.length === 0 || _activeDialog || _isTransitioning) return;

    const next = _queue.shift();
    const config = DIALOG_CONFIG[next.dialogKey];
    if (config) {
      _show(config, next.options, next.resolve);
    } else {
      next.resolve(false);
      _processQueue();
    }
  }

  /* ========================================================================
     §2.8 Anuncios a screen readers
     ========================================================================
     Ref: WCAG 4.1.3 (mensajes de estado)
     Usa la región aria-live="assertive" definida en index.html (Commit 7)
     ======================================================================== */

  function _announce(text) {
    const el = _statusEl();
    if (!el) return;
    /* Vaciar y re-insertar para forzar re-lectura */
    el.textContent = '';
    requestAnimationFrame(() => {
      el.textContent = text;
    });
  }

  /* ========================================================================
     §2.9 Utilidades
     ======================================================================== */

  /** isOpen() — ¿Hay un diálogo abierto actualmente? */
  function isOpen() {
    return _activeDialog !== null;
  }

  /** closeAll() — Cierra el diálogo activo y vacía la cola */
  function closeAll() {
    _queue = [];
    if (_activeDialog) {
      _close(false);
    }
  }

  /** getActiveDialogKey() — Devuelve la clave del diálogo activo o null */
  function getActiveDialogKey() {
    return _activeDialog ? _activeDialog.dialogKey : null;
  }

  /* ========================================================================
     §3. API PÚBLICA
     ======================================================================== */

  return {
    init,
    open,
    isOpen,
    closeAll,
    getActiveDialogKey,
    /* Exponer config para testing/debug */
    _getConfig: () => ({ ...DIALOG_CONFIG })
  };

})();

/* ==========================================================================
   §4. FUNCIONES HELPER DE ALTO NIVEL
   ==========================================================================
   Funciones de conveniencia que abstraen el uso típico de cada diálogo.
   Permiten que otros módulos (sliderController, viewerView, sessionManager)
   invoquen diálogos sin conocer las claves internas.
   ========================================================================== */

/**
 * Confirmar guardado de claridad facial.
 * Ref: HTA-1 tarea 3.3 → se llama desde el botón "Guardar" del visor ML
 * @returns {Promise<boolean>}
 */
function confirmClarity() {
  return DialogController.open('confirm-clarity');
}

/**
 * Confirmar guardado de atenuación emocional.
 * Ref: HTA-2 tarea 4.4 → se llama desde el botón "Guardar" del visor Carlos
 * @param {number} level — Porcentaje actual de atenuación (0-100)
 * @param {number} [limit] — Límite del terapeuta si existe
 * @returns {Promise<boolean>}
 */
function confirmAttenuation(level, limit) {
  return DialogController.open('confirm-attenuation', { level, limit });
}

/**
 * Alertar de cambio brusco en slider.
 * Ref: Microinteracción §4; Tema 3; OC1 (toque accidental)
 * @returns {Promise<boolean>} — true = mantener, false = deshacer
 */
function alertAbruptChange() {
  return DialogController.open('abrupt-change');
}

/**
 * Notificar límite del terapeuta alcanzado.
 * Ref: HTA-2 punto crítico 4.6; Gap §3.2
 * @param {number} limit — Porcentaje del límite
 * @param {string} [therapistName] — Nombre del terapeuta
 * @returns {Promise<boolean>} — siempre true (solo botón "Entendido")
 */
function notifyTherapistLimit(limit, therapistName) {
  return DialogController.open('therapist-limit', { level: limit, limit, therapistName });
}

/**
 * Check de bienestar por inactividad.
 * Ref: HTA-2 tarea 4.5; STD T30
 * @returns {Promise<boolean>} — true = seguir, false = parar sesión
 */
function checkWellbeing() {
  return DialogController.open('wellbeing-check');
}

/**
 * Confirmar salida de sesión terapéutica.
 * Ref: STD T34; Microinteracción §8
 * @param {Object} [sessionData] — {startTime, changesCount}
 * @returns {Promise<boolean>} — true = salir, false = continuar
 */
function confirmExitSession(sessionData) {
  return DialogController.open('exit-session', { sessionData });
}

/* ==========================================================================
   §5. REGISTRO GLOBAL
   ==========================================================================
   Se expone en window para que app.js pueda inicializarlo y otros
   módulos puedan acceder. En un proyecto con ES modules, estas serían
   exportaciones nombradas.
   ========================================================================== */

window.DialogController = DialogController;
window.MnemosyneDialogs = {
  confirmClarity,
  confirmAttenuation,
  alertAbruptChange,
  notifyTherapistLimit,
  checkWellbeing,
  confirmExitSession
};
