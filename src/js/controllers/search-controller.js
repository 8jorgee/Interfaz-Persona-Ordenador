/* ==========================================================================
   MNEMOSYNE — Search Controller
   ==========================================================================
   Conecta la barra de búsqueda y el panel de filtros del DOM con las 
   funciones de búsqueda/filtrado del DataService.
   
   Justificación DCU:
   - HTA-1 subtarea 1.2: "buscar por nombre de persona, lugar o fecha"
   - BNF búsqueda (03_dialogue_specification.md): texto libre + filtros
   - Modelo mental ML §2.1: "buscar como en Google"
   - STD navegación: transición "Galería → Galería filtrada"
   ========================================================================== */

import * as DataService from '../services/dataService.js';
import { debounce, escapeHtml } from '../utils/helpers.js';
import { userCan, getUserMessage } from '../models/userProfiles.js';

/* ==========================================================================
   1. ESTADO DEL CONTROLADOR
   ========================================================================== */

const SearchState = {
  currentQuery: '',
  activeFilters: {
    category: null,
    personId: null,
    emotionalValence: null,
    minEmotionalIntensity: null,
    maxEmotionalIntensity: null,
    dateFrom: null,
    dateTo: null,
    hasAttenuation: null,
  },
  viewMode: 'grid',      // 'grid' | 'timeline'
  sortBy: 'date',
  sortOrder: 'desc',
  resultCount: 0,
};

/** Callback externo que se invoca cuando cambian los resultados */
let _onResultsChange = null;

/* ==========================================================================
   2. INICIALIZACIÓN
   ========================================================================== */

/**
 * Inicializa el controlador de búsqueda.
 * Vincula la barra de búsqueda y el panel de filtros al DOM.
 * 
 * @param {string} userId - Usuario activo
 * @param {Function} onResultsChange - Callback({memories, query, filters, viewMode})
 */
function init(userId, onResultsChange) {
  _onResultsChange = onResultsChange;

  _bindSearchBar(userId);
  _bindFilterPanel(userId);
  _bindViewToggle();
  _bindSortControls();

  // Ejecutar búsqueda inicial (todos los recuerdos)
  _executeSearch(userId);
}

/**
 * Resetea todos los filtros y la búsqueda.
 * @param {string} userId
 */
function resetAll(userId) {
  SearchState.currentQuery = '';
  SearchState.activeFilters = {
    category: null, personId: null, emotionalValence: null,
    minEmotionalIntensity: null, maxEmotionalIntensity: null,
    dateFrom: null, dateTo: null, hasAttenuation: null,
  };
  SearchState.sortBy = 'date';
  SearchState.sortOrder = 'desc';

  // Limpiar UI
  const input = document.querySelector('.search-bar__input');
  if (input) input.value = '';

  document.querySelectorAll('.filter-chip--active').forEach(c =>
    c.classList.remove('filter-chip--active')
  );

  _executeSearch(userId);
}

/**
 * Obtiene el estado actual del controlador.
 * @returns {Object}
 */
function getState() {
  return { ...SearchState };
}

/* ==========================================================================
   3. BARRA DE BÚSQUEDA
   ========================================================================== */

/**
 * Vincula eventos de la barra de búsqueda.
 * 
 * Justificación: HTA-1 subtarea 1.2 — búsqueda por texto libre.
 * Se usa debounce(300ms) para no buscar en cada keystroke 
 * (helpers.js — optimización de rendimiento).
 */
function _bindSearchBar(userId) {
  const input = document.querySelector('.search-bar__input');
  const clearBtn = document.querySelector('.search-bar__clear');

  if (!input) return;

  // Placeholder personalizado por usuario
  const placeholder = getUserMessage(userId, 'searchPlaceholder');
  if (placeholder) input.placeholder = placeholder;

  // Búsqueda con debounce
  const debouncedSearch = debounce((query) => {
    SearchState.currentQuery = query;
    _executeSearch(userId);
  }, 300);

  input.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
  });

  // Búsqueda inmediata con Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      SearchState.currentQuery = input.value;
      _executeSearch(userId);
    }
  });

  // Botón limpiar
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      SearchState.currentQuery = '';
      _executeSearch(userId);
      input.focus();
    });
  }
}

/* ==========================================================================
   4. PANEL DE FILTROS
   ========================================================================== */

/**
 * Renderiza y vincula el panel de filtros.
 * 
 * Justificación DCU:
 * - STD navegación: estado "Galería filtrada" con transiciones
 * - Categorías derivadas de memories.json
 * - Personas del entorno del usuario (DataService.getPeople)
 * - Filtro emocional → HTA-2 (Carlos necesita encontrar recuerdos 
 *   por intensidad emocional)
 */
function _bindFilterPanel(userId) {
  const panel = document.querySelector('.filter-panel');
  if (!panel) return;

  const categories = DataService.getCategories();
  const people = DataService.getPeople(userId);

  panel.innerHTML = `
    ${_renderFilterSection('Categoría', 'category', categories.map(c => ({
      id: c.id, label: `${c.icon} ${c.label}`, value: c.id
    })))}

    ${people.length > 0 ? _renderFilterSection('Personas', 'person', people.map(p => ({
      id: p.id, label: p.name, value: p.id
    }))) : ''}

    ${_renderFilterSection('Emoción', 'valence', [
      { id: 'positive', label: '😊 Positivo', value: 'positive' },
      { id: 'negative', label: '😟 Negativo', value: 'negative' },
      { id: 'mixed',    label: '😐 Mixto',    value: 'mixed' },
      { id: 'neutral',  label: '😶 Neutro',   value: 'neutral' },
    ])}

    ${userCan(userId, 'canFilterAttenuation') ? _renderFilterSection('Estado', 'state', [
      { id: 'attenuated', label: '🔇 Con atenuación', value: 'attenuated' },
    ]) : ''}

    <div class="filter-section">
      <label class="filter-section__label text-xs font-semibold text-muted">Fecha</label>
      <div class="filter-date-range flex gap-2">
        <input type="date" class="filter-date-input" id="filter-date-from"
               aria-label="Desde fecha">
        <span class="text-muted text-sm items-center flex">—</span>
        <input type="date" class="filter-date-input" id="filter-date-to"
               aria-label="Hasta fecha">
      </div>
    </div>

    <button class="btn btn--ghost btn--sm w-full mt-4" id="filter-reset">
      ↩ Limpiar filtros
    </button>
  `;

  // Vincular clicks en chips de filtro
  panel.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const { filterType, filterValue } = chip.dataset;
      _toggleFilter(filterType, filterValue, chip, userId);
    });
  });

  // Vincular filtros de fecha
  const dateFrom = document.getElementById('filter-date-from');
  const dateTo = document.getElementById('filter-date-to');

  if (dateFrom) {
    dateFrom.addEventListener('change', () => {
      SearchState.activeFilters.dateFrom = dateFrom.value || null;
      _executeSearch(userId);
    });
  }

  if (dateTo) {
    dateTo.addEventListener('change', () => {
      SearchState.activeFilters.dateTo = dateTo.value || null;
      _executeSearch(userId);
    });
  }

  // Botón reset
  const resetBtn = document.getElementById('filter-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => resetAll(userId));
  }
}

/**
 * Genera HTML para una sección de filtros con chips.
 */
function _renderFilterSection(label, type, options) {
  return `
    <div class="filter-section">
      <span class="filter-section__label text-xs font-semibold text-muted">${escapeHtml(label)}</span>
      <div class="filter-chips flex flex-wrap gap-2 mt-2">
        ${options.map(opt => `
          <button class="filter-chip tag"
                  data-filter-type="${type}"
                  data-filter-value="${opt.value}"
                  aria-pressed="false"
                  role="switch">
            ${escapeHtml(opt.label)}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Activa/desactiva un filtro individual (toggle).
 * 
 * Comportamiento: dentro de una sección, solo un filtro activo a la vez
 * (radio-like), excepto "state" que es toggle puro.
 */
function _toggleFilter(type, value, chipElement, userId) {
  const isActive = chipElement.classList.contains('filter-chip--active');

  // Desactivar otros chips del mismo grupo
  const siblings = chipElement.parentElement.querySelectorAll('.filter-chip');
  siblings.forEach(s => {
    s.classList.remove('filter-chip--active');
    s.setAttribute('aria-pressed', 'false');
  });

  if (!isActive) {
    chipElement.classList.add('filter-chip--active');
    chipElement.setAttribute('aria-pressed', 'true');
  }

  // Actualizar estado
  switch (type) {
    case 'category':
      SearchState.activeFilters.category = isActive ? null : value;
      break;
    case 'person':
      SearchState.activeFilters.personId = isActive ? null : value;
      break;
    case 'valence':
      SearchState.activeFilters.emotionalValence = isActive ? null : value;
      break;
    case 'state':
      SearchState.activeFilters.hasAttenuation = isActive ? null : true;
      break;
  }

  _executeSearch(userId);
}

/* ==========================================================================
   5. VISTA Y ORDENACIÓN
   ========================================================================== */

/** Vincula toggle grid/timeline */
function _bindViewToggle() {
  const toggles = document.querySelectorAll('.view-toggle__btn');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      toggles.forEach(t => t.classList.remove('view-toggle__btn--active'));
      btn.classList.add('view-toggle__btn--active');
      SearchState.viewMode = btn.dataset.viewMode;

      // Disparar re-render sin re-buscar
      if (_onResultsChange) {
        _onResultsChange({
          viewModeChanged: true,
          viewMode: SearchState.viewMode,
        });
      }
    });
  });
}

/** Vincula controles de ordenación */
function _bindSortControls() {
  const sortSelect = document.querySelector('.sort-select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', (e) => {
    const [field, order] = e.target.value.split(':');
    SearchState.sortBy = field;
    SearchState.sortOrder = order;

    // Re-buscar con nuevo orden
    const userId = document.querySelector('.app')?.dataset.user;
    if (userId) _executeSearch(userId);
  });
}

/* ==========================================================================
   6. EJECUCIÓN DE BÚSQUEDA
   ========================================================================== */

/**
 * Ejecuta la búsqueda combinada (texto + filtros) y notifica resultados.
 * 
 * Flujo:
 * 1. Si hay query → searchMemories (búsqueda por texto con scoring)
 * 2. Si hay filtros activos → filterMemories sobre los resultados
 * 3. Notificar al callback con los resultados finales
 * 
 * Justificación: La BNF de búsqueda (03_dialogue_specification.md) 
 * define que texto y filtros se combinan con AND.
 */
function _executeSearch(userId) {
  let results;

  // Paso 1: búsqueda por texto o cargar todos
  if (SearchState.currentQuery.trim()) {
    results = DataService.searchMemories(userId, SearchState.currentQuery);
  } else {
    results = DataService.getMemories(userId, {
      sortBy: SearchState.sortBy,
      sortOrder: SearchState.sortOrder,
    });
  }

  // Paso 2: aplicar filtros activos sobre los resultados
  const filters = SearchState.activeFilters;
  const hasActiveFilters = Object.values(filters).some(v => v != null);

  if (hasActiveFilters) {
    results = _applyFiltersToResults(results, filters);
  }

  // Paso 3: ordenar si venimos de búsqueda (ya vienen por relevancia)
  if (SearchState.currentQuery.trim() === '' || hasActiveFilters) {
    results = _sortResults(results, SearchState.sortBy, SearchState.sortOrder);
  }

  SearchState.resultCount = results.length;

  // Actualizar contador en UI
  _updateResultCount(results.length, SearchState.currentQuery);

  // Actualizar status bar con filtros activos
  _updateStatusBar(filters);

  // Notificar al view para renderizar
  if (_onResultsChange) {
    _onResultsChange({
      memories: results,
      query: SearchState.currentQuery,
      filters: { ...filters },
      viewMode: SearchState.viewMode,
      resultCount: results.length,
    });
  }
}

/**
 * Aplica filtros a un array de recuerdos ya obtenidos.
 * (Se usa cuando la búsqueda textual ya redujo el set.)
 */
function _applyFiltersToResults(memories, filters) {
  let results = [...memories];

  if (filters.category) {
    results = results.filter(m => m.category === filters.category);
  }
  if (filters.personId) {
    results = results.filter(m => m.people.some(p => p.id === filters.personId));
  }
  if (filters.emotionalValence) {
    results = results.filter(m => m.emotionalValence === filters.emotionalValence);
  }
  if (filters.minEmotionalIntensity != null) {
    results = results.filter(m => m.emotionalIntensity >= filters.minEmotionalIntensity);
  }
  if (filters.maxEmotionalIntensity != null) {
    results = results.filter(m => m.emotionalIntensity <= filters.maxEmotionalIntensity);
  }
  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    results = results.filter(m => new Date(m.date).getTime() >= from);
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime();
    results = results.filter(m => new Date(m.date).getTime() <= to);
  }
  if (filters.hasAttenuation === true) {
    results = results.filter(m => m.attenuationLevel > 0);
  }

  return results;
}

/** Ordena resultados por campo */
function _sortResults(memories, sortBy, sortOrder) {
  return [...memories].sort((a, b) => {
    let vA, vB;
    switch (sortBy) {
      case 'date': vA = new Date(a.date); vB = new Date(b.date); break;
      case 'emotionalIntensity': vA = a.emotionalIntensity; vB = b.emotionalIntensity; break;
      case 'clarity': vA = a.clarityLevel; vB = b.clarityLevel; break;
      case 'lastAccessed': vA = new Date(a.lastAccessed); vB = new Date(b.lastAccessed); break;
      default: vA = new Date(a.date); vB = new Date(b.date);
    }
    return sortOrder === 'desc' ? vB - vA : vA - vB;
  });
}

/* ==========================================================================
   7. ACTUALIZACIONES DE UI AUXILIARES
   ========================================================================== */

/** Actualiza el contador de resultados */
function _updateResultCount(count, query) {
  const el = document.querySelector('.search-results__count');
  if (!el) return;

  if (query.trim()) {
    el.textContent = `${count} recuerdo${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''} para "${escapeHtml(query)}"`;
    el.classList.add('search-results__count--visible');
  } else {
    el.textContent = `${count} recuerdo${count !== 1 ? 's' : ''}`;
    el.classList.remove('search-results__count--visible');
  }
}

/** Actualiza la status bar con los filtros activos */
function _updateStatusBar(filters) {
  const container = document.querySelector('.app-status__filters');
  if (!container) return;

  container.innerHTML = '';

  const categories = DataService.getCategories();
  const people = DataService.getPeople(
    document.querySelector('.app')?.dataset.user || ''
  );

  if (filters.category) {
    const cat = categories.find(c => c.id === filters.category);
    if (cat) _appendStatusTag(container, `${cat.icon} ${cat.label}`);
  }

  if (filters.personId) {
    const person = people.find(p => p.id === filters.personId);
    if (person) _appendStatusTag(container, `👤 ${person.name}`);
  }

  if (filters.emotionalValence) {
    const labels = { positive: '😊 Positivo', negative: '😟 Negativo', mixed: '😐 Mixto', neutral: '😶 Neutro' };
    _appendStatusTag(container, labels[filters.emotionalValence] || filters.emotionalValence);
  }

  if (filters.hasAttenuation) {
    _appendStatusTag(container, '🔇 Con atenuación');
  }

  if (filters.dateFrom || filters.dateTo) {
    const from = filters.dateFrom || '...';
    const to = filters.dateTo || '...';
    _appendStatusTag(container, `📅 ${from} → ${to}`);
  }
}

function _appendStatusTag(container, text) {
  const tag = document.createElement('span');
  tag.className = 'app-status__filter-tag';
  tag.textContent = text;
  container.appendChild(tag);
}

/* ==========================================================================
   8. EXPORTACIÓN
   ========================================================================== */

export { init, resetAll, getState, SearchState };
