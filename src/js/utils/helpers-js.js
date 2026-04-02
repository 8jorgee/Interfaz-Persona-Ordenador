/* ==========================================================================
   MNEMOSYNE — Utilidades auxiliares
   ==========================================================================
   Funciones puras reutilizables en todo el proyecto.
   ========================================================================== */

/**
 * Formatea una fecha ISO a formato legible español.
 * Se usa en las cards de recuerdo y el timeline.
 * 
 * Justificación: Modelo mental ML §2.2 — "los recuerdos tienen un orden 
 * temporal". María Luisa necesita fechas en lenguaje natural, no ISO.
 * 
 * @param {string} isoDate
 * @param {Object} [options]
 * @param {boolean} [options.relative=false] - Usar formato relativo ("hace 3 días")
 * @param {boolean} [options.short=false] - Formato corto ("15 sep 2025")
 * @returns {string}
 */
function formatDate(isoDate, options = {}) {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Fecha desconocida';

  if (options.relative) {
    return _getRelativeTime(date);
  }

  if (options.short) {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  return date.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

/**
 * Formatea una duración en segundos a texto legible.
 * @param {number} seconds
 * @returns {string} Ej: "2h 30min", "45min", "30s"
 */
function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}min`;

  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/**
 * Convierte un nivel 0-1 a porcentaje legible.
 * @param {number} level - Valor entre 0.0 y 1.0
 * @param {boolean} [withSymbol=true] - Incluir símbolo %
 * @returns {string} Ej: "72%"
 */
function levelToPercent(level, withSymbol = true) {
  const pct = Math.round(Math.max(0, Math.min(1, level)) * 100);
  return withSymbol ? `${pct}%` : String(pct);
}

/**
 * Obtiene un descriptor verbal para un nivel de claridad.
 * 
 * Justificación: Modelo mental ML §2.1 — descriptores verbales en 
 * lenguaje natural, no valores numéricos.
 * 
 * @param {number} level - 0.0 a 1.0
 * @returns {string}
 */
function clarityDescriptor(level) {
  if (level >= 0.85) return 'Muy clara';
  if (level >= 0.65) return 'Clara';
  if (level >= 0.45) return 'Algo borrosa';
  if (level >= 0.25) return 'Borrosa';
  return 'Muy borrosa';
}

/**
 * Obtiene un descriptor verbal para un nivel de atenuación.
 * @param {number} level - 0.0 a 1.0
 * @returns {string}
 */
function attenuationDescriptor(level) {
  if (level >= 0.80) return 'Muy atenuado';
  if (level >= 0.60) return 'Bastante atenuado';
  if (level >= 0.40) return 'Moderadamente atenuado';
  if (level >= 0.20) return 'Ligeramente atenuado';
  if (level > 0)     return 'Apenas atenuado';
  return 'Sin atenuación';
}

/**
 * Obtiene emoji y descripción del nivel de bienestar.
 * 
 * Justificación: wireframe_viewer_carlos.svg — indicador con emoji.
 * HTA-2 subtarea 4.5: "monitorizar nivel de malestar"
 * 
 * @param {number} emotionalIntensity - 1-10
 * @param {string} valence - 'positive'|'negative'|'mixed'|'neutral'
 * @returns {{emoji: string, label: string, color: string}}
 */
function wellbeingIndicator(emotionalIntensity, valence) {
  if (valence === 'positive' && emotionalIntensity <= 4) {
    return { emoji: '😌', label: 'Bienestar alto', color: 'var(--color-emotion-calm)' };
  }
  if (valence === 'positive') {
    return { emoji: '🙂', label: 'Bienestar moderado', color: 'var(--color-secondary-400)' };
  }
  if (valence === 'neutral') {
    return { emoji: '😐', label: 'Neutral', color: 'var(--color-emotion-neutral)' };
  }
  if (emotionalIntensity <= 4) {
    return { emoji: '😐', label: 'Malestar leve', color: 'var(--color-emotion-neutral)' };
  }
  if (emotionalIntensity <= 7) {
    return { emoji: '😟', label: 'Malestar moderado', color: 'var(--color-warning)' };
  }
  return { emoji: '😰', label: 'Malestar elevado', color: 'var(--color-emotion-intense)' };
}

/**
 * Genera las clarity dots (indicador visual de 5 puntos) para una card.
 * @param {number} level - 0.0 a 1.0
 * @param {number} [maxDots=5]
 * @returns {boolean[]} Array de booleanos (true = relleno)
 */
function clarityDots(level, maxDots = 5) {
  const filled = Math.round(level * maxDots);
  return Array.from({ length: maxDots }, (_, i) => i < filled);
}

/**
 * Debounce: retrasa la ejecución de una función hasta que el usuario 
 * deje de interactuar.
 * Se usa en la barra de búsqueda para no buscar en cada keystroke.
 * 
 * @param {Function} fn
 * @param {number} delay - Milisegundos
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle: limita la frecuencia de ejecución de una función.
 * Se usa en el slider para no disparar updates en cada pixel.
 * 
 * @param {Function} fn
 * @param {number} limit - Milisegundos entre ejecuciones
 * @returns {Function}
 */
function throttle(fn, limit = 100) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

/**
 * Detecta si el cambio de un slider fue "brusco" (más de 30% de golpe).
 * 
 * Justificación: Diálogo D-03 — "Has movido el filtro rápidamente. 
 * ¿Es lo que querías?"
 * 
 * @param {number} prev - Valor anterior (0-1)
 * @param {number} next - Valor nuevo (0-1)
 * @param {number} [threshold=0.3] - Umbral de cambio brusco
 * @returns {boolean}
 */
function isAbruptChange(prev, next, threshold = 0.3) {
  return Math.abs(next - prev) >= threshold;
}

/**
 * Genera un ID único para eventos/cambios.
 * @returns {string}
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Escapa HTML para prevenir XSS al insertar texto dinámico.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* --- Funciones internas --- */

function _getRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Ahora mismo';
  if (mins < 60) return `Hace ${mins} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} semana${days >= 14 ? 's' : ''}`;

  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export {
  formatDate,
  formatDuration,
  levelToPercent,
  clarityDescriptor,
  attenuationDescriptor,
  wellbeingIndicator,
  clarityDots,
  debounce,
  throttle,
  isAbruptChange,
  generateId,
  escapeHtml,
};
