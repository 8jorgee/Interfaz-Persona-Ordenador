/* ==========================================================================
   MNEMOSYNE — UI Renderer  |  ui.js
   All view rendering: gallery, timeline, dashboard, drawer, dialogs, toasts
   ========================================================================== */

import {
  getMemoryById,
  getOriginalMemory,
  applyFilter,
  addNote,
  undoLastFilter,
  revertMemory,
  hasChanges,
  getFilterValues,
  getStatsForUser,
} from './memories.js';

import {
  applyFilters,
  getAvailableTags,
  getAvailableCategories,
  getCategoryCounts,
  getFilterState,
  hasActiveFilters,
  setQuery,
  setCategory,
  toggleTag,
  setSort,
  resetFilters,
} from './filters.js';

import {
  getUserProfile,
  getUserMessage,
  IMPLANT_CONFIG,
} from './models/user-profiles.js';

/* --------------------------------------------------------------------------
   Category metadata (mirrors memories.json categories array)
   -------------------------------------------------------------------------- */
const _CATEGORY_META = {
  family:    { icon: '👨‍👩‍👧‍👦', color: '#2E6FCF' },
  personal:  { icon: '💛',       color: '#E8A838' },
  milestone: { icon: '⭐',       color: '#7C3AED' },
  trauma:    { icon: '⚠️',       color: '#D94452' },
  daily:     { icon: '☀️',       color: '#27A854' },
  medical:   { icon: '⚕️',       color: '#167638' },
  military:  { icon: '🎖️',      color: '#495057' },
};

/* --------------------------------------------------------------------------
   Internal state
   -------------------------------------------------------------------------- */
let _currentUser   = null;
let _currentMemories = [];
let _openDrawerMemId = null;

/* Callbacks wired by app.js */
const _callbacks = {
  onFilterChange: null,  // () => void — re-render gallery
  onProfileExit:  null,  // () => void — go back to profile selector
};

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */

/**
 * Wire DOM event listeners. Call once on app init.
 * @param {Object} callbacks
 */
function initUI(callbacks = {}) {
  Object.assign(_callbacks, callbacks);

  // Sidebar search input + clear button
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  if (searchInput) {
    searchInput.addEventListener('input', _debounce(e => {
      setQuery(e.target.value);
      _callbacks.onFilterChange?.();
      if (searchClear) searchClear.hidden = !e.target.value;
    }, 280));
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      setQuery('');
      _callbacks.onFilterChange?.();
      searchClear.hidden = true;
    });
  }

  // Custom sort select
  _initCustomSelect();

  // Drawer close
  document.getElementById('drawer-close')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', closeDrawer);

  // Dialog overlay click to close
  document.querySelector('.dialog-overlay')?.addEventListener('click', closeDialog);

  // Keyboard: Escape closes drawer/dialog
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (_openDrawerMemId) closeDrawer();
      else closeDialog();
    }
  });

  // Status bar implant info
  _renderStatusBar();
}

/* --------------------------------------------------------------------------
   Profile
   -------------------------------------------------------------------------- */

/**
 * Set active user profile. Updates DOM data-user attribute.
 * @param {string} userId
 * @param {Object[]} memories
 */
function setActiveUser(userId, memories) {
  _currentUser     = userId;
  _currentMemories = memories;

  const app = document.getElementById('app');
  if (app) app.setAttribute('data-user', userId);

  const profile = getUserProfile(userId);
  if (!profile) return;

  // Sidebar user badge
  const badge = document.getElementById('user-badge');
  if (badge) {
    badge.querySelector('.user-badge-avatar').textContent  = profile.avatar;
    badge.querySelector('.user-badge-name').textContent    = profile.name;
    badge.querySelector('.user-badge-role').textContent    = _roleLabel(profile.role);
  }

  // Welcome message
  const welcome = document.getElementById('sidebar-welcome');
  if (welcome) welcome.textContent = getUserMessage(userId, 'welcome');

  // Search placeholder
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.placeholder = getUserMessage(userId, 'searchPlaceholder') || 'Buscar...';

  // Managed user banner (Elena)
  const banner = document.getElementById('managed-user-banner');
  if (banner && profile.managedUser) {
    const managed = getUserProfile(profile.managedUser);
    banner.querySelector('.managed-user-name').textContent = managed?.name || '';
  }

  // Build sidebar filters (tags/categories)
  _renderSidebarFilters();
}

/* --------------------------------------------------------------------------
   Views
   -------------------------------------------------------------------------- */

/**
 * Show a named view, hide others.
 * @param {'gallery'|'timeline'|'dashboard'} viewName
 */
function showView(viewName) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('view--active', v.dataset.view === viewName);
  });
}

/* --------------------------------------------------------------------------
   Gallery View
   -------------------------------------------------------------------------- */

/**
 * Render memory gallery with current filters applied.
 * @param {Object[]} memories - User's full memory array
 */
function renderGallery(memories) {
  _currentMemories = memories;
  const filtered = applyFilters(memories);

  const grid = document.getElementById('memory-grid');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">◎</div>
        <p class="empty-state-text">${hasActiveFilters()
          ? (getUserMessage(_currentUser, 'emptySearch') || 'Sin resultados.')
          : 'No hay recuerdos disponibles.'}</p>
        ${hasActiveFilters()
          ? '<button class="btn btn--ghost" id="clear-filters-btn">Limpiar filtros</button>'
          : ''}
      </div>`;

    document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
      resetFilters();
      _callbacks.onFilterChange?.();
    });
    return;
  }

  grid.innerHTML = '';
  filtered.forEach((memory, idx) => {
    const card = _buildMemoryCard(memory, idx);
    grid.appendChild(card);
  });

  // Update count badge
  const countEl = document.getElementById('memory-count');
  if (countEl) countEl.textContent = `${filtered.length} recuerdos`;
}

function _buildMemoryCard(memory, idx) {
  const card = document.createElement('article');
  card.className  = 'memory-card';
  card.dataset.id = memory.id;
  card.style.setProperty('--card-index', idx);

  const filters    = getFilterValues(memory.id);
  const clarity    = Math.round(filters.clarityLevel * 100);
  const attenuation = Math.round(filters.attenuationLevel * 100);
  const modified   = hasChanges(memory.id);

  const intensity  = memory.emotionalIntensity || 0;
  const intensityClass = intensity >= 7 ? 'intense' : intensity >= 4 ? 'neutral' : 'calm';

  const photoSrc    = memory.photoUrl || memory.thumbnail || '';
  const svgFallback = memory.photoUrl && memory.thumbnail ? memory.thumbnail : '';

  const locationName = typeof memory.location === 'object' ? memory.location?.name : memory.location;

  const catMeta  = _CATEGORY_META[memory.category] || {};
  const catBadge = catMeta.icon
    ? `<span class="memory-card-category" style="--cat-color:${catMeta.color}" title="${_esc(memory.category)}">${catMeta.icon}</span>`
    : '';

  const eegSegs = Array.from({length: 10}, (_, i) =>
    `<span class="eeg-seg ${i < intensity ? 'eeg-seg--on' : ''}" style="--seg-idx:${i}"></span>`
  ).join('');

  card.innerHTML = `
    ${photoSrc ? `
      <div class="memory-card-thumb" aria-hidden="true">
        <img src="${photoSrc}" alt="${_esc(memory.title)}" style="width:100%;height:100%;object-fit:cover;"
          ${svgFallback ? `data-fallback="${_esc(svgFallback)}" onerror="this.onerror=null;this.src=this.dataset.fallback"` : ''} />
        <div class="memory-card-thumb-overlay"></div>
        ${catBadge}
      </div>` : `<div class="memory-card-thumb memory-card-thumb--empty">${catBadge}</div>`}
    <div class="memory-card-body">
      <div class="memory-card-header">
        <h3 class="memory-card-title">${_esc(memory.title)}</h3>
        ${modified ? '<span class="memory-card-modified" title="Filtros aplicados">●</span>' : ''}
        ${memory.isProtected ? '<span class="memory-card-protected" title="Recuerdo protegido">🔒</span>' : ''}
      </div>
      <p class="memory-card-meta">
        <span class="memory-card-date">🕐 ${_formatDate(memory.date)}</span>
        ${locationName ? `<span class="memory-card-sep">·</span><span class="memory-card-location">${_esc(locationName)}</span>` : ''}
      </p>
      <p class="memory-card-desc">${_esc(_truncate(memory.description || '', 90))}</p>
      <div class="eeg-bar" aria-hidden="true">${eegSegs}</div>
      <div class="memory-card-footer">
        <div class="memory-card-badges">
          <span class="memory-card-intensity intensity--${intensityClass}" title="Intensidad emocional">${intensity}/10</span>
          <span class="memory-card-clarity" title="Claridad: ${clarity}%">◐ ${clarity}%</span>
          ${attenuation > 0 ? `<span class="memory-card-attenuation" title="Atenuación: ${attenuation}%">◌ ${attenuation}%</span>` : ''}
        </div>
        ${memory.tags?.length ? `
          <div class="memory-card-tags">
            ${memory.tags.slice(0, 3).map(t => `<span class="tag">${_esc(t)}</span>`).join('')}
          </div>` : ''}
      </div>
    </div>`;

  card.addEventListener('click', () => openDrawer(memory.id));
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDrawer(memory.id);
    }
  });

  return card;
}

/* --------------------------------------------------------------------------
   Timeline View
   -------------------------------------------------------------------------- */

/**
 * Render timeline sorted by date.
 * @param {Object[]} memories
 */
function renderTimeline(memories) {
  const container = document.getElementById('timeline-list');
  if (!container) return;

  const sorted = [...memories].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Group by year
  const byYear = {};
  sorted.forEach(m => {
    const yr = new Date(m.date).getFullYear();
    if (!byYear[yr]) byYear[yr] = [];
    byYear[yr].push(m);
  });

  container.innerHTML = '';
  Object.keys(byYear).sort((a, b) => b - a).forEach(year => {
    const group = document.createElement('div');
    group.className = 'timeline-group';
    group.innerHTML = `<div class="timeline-year">${year}</div>`;

    byYear[year].forEach(m => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-date">${_formatDate(m.date)}</div>
          <div class="timeline-title">${_esc(m.title)}</div>
          ${m.location ? `<div class="timeline-location">${_esc(typeof m.location === 'object' ? m.location?.name : m.location)}</div>` : ''}
        </div>`;
      item.addEventListener('click', () => openDrawer(m.id));
      group.appendChild(item);
    });

    container.appendChild(group);
  });
}

/* --------------------------------------------------------------------------
   Dashboard View
   -------------------------------------------------------------------------- */

/**
 * Render dashboard stats widgets.
 * @param {string} userId
 */
function renderDashboard(userId) {
  const stats = getStatsForUser(userId);
  const profile = getUserProfile(userId);

  // Total memories widget
  _setWidget('widget-total', stats.total, 'Recuerdos');

  // Avg clarity
  _setWidget('widget-clarity', `${stats.avgClarity}%`, 'Claridad media');

  // Avg attenuation
  _setWidget('widget-attenuation', `${stats.avgAttenuation}%`, 'Atenuación media');

  // Modified
  _setWidget('widget-modified', stats.modifiedCount, 'Con filtros');

  // Category breakdown
  const catGrid = document.getElementById('category-grid');
  if (catGrid && stats.categories) {
    catGrid.innerHTML = Object.entries(stats.categories)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, cnt]) => `
        <div class="category-item">
          <span class="category-name">${_esc(cat)}</span>
          <span class="category-count">${cnt}</span>
        </div>`).join('');
  }

  // Implant status
  _renderImplantWidget();
}

function _setWidget(id, value, label) {
  const el = document.getElementById(id);
  if (!el) return;
  const valEl = el.querySelector('.widget-value');
  const labEl = el.querySelector('.widget-label');
  if (valEl) valEl.textContent = value;
  if (labEl) labEl.textContent = label;
}

function _renderImplantWidget() {
  const el = document.getElementById('widget-implant');
  if (!el) return;

  const sig  = Math.round(IMPLANT_CONFIG.signalStrength * 100);
  const bat  = Math.round(IMPLANT_CONFIG.batteryLevel * 100);
  const stor = Math.round(IMPLANT_CONFIG.storageUsed * 100);

  el.innerHTML = `
    <div class="widget-implant-row">
      <span class="widget-implant-label">Señal</span>
      <span class="widget-implant-value">${sig}%</span>
    </div>
    <div class="widget-implant-row">
      <span class="widget-implant-label">Batería</span>
      <span class="widget-implant-value">${bat}%</span>
    </div>
    <div class="widget-implant-row">
      <span class="widget-implant-label">Almacenamiento</span>
      <span class="widget-implant-value">${stor}%</span>
    </div>
    <div class="widget-implant-status status--${IMPLANT_CONFIG.status}">
      ${IMPLANT_CONFIG.status === 'connected' ? '● CONECTADO' : '○ DESCONECTADO'}
    </div>`;
}

/* --------------------------------------------------------------------------
   Sidebar Filters
   -------------------------------------------------------------------------- */

function _renderSidebarFilters() {
  if (!_currentUser || _currentMemories.length === 0) return;

  const tags  = getAvailableTags(_currentMemories);
  const cats  = getAvailableCategories(_currentMemories);
  const state = getFilterState();

  // Category filter
  const catContainer = document.getElementById('category-filters');
  if (catContainer) {
    catContainer.innerHTML = `
      <button class="filter-chip ${!state.category ? 'filter-chip--active' : ''}" data-cat="">
        Todos
      </button>
      ${cats.map(c => `
        <button class="filter-chip ${state.category === c ? 'filter-chip--active' : ''}" data-cat="${_esc(c)}">
          ${_esc(c)}
        </button>`).join('')}`;

    catContainer.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        setCategory(btn.dataset.cat || null);
        _callbacks.onFilterChange?.();
        _renderSidebarFilters();  // Re-render to update active state
      });
    });
  }

  // Tag filter
  const tagContainer = document.getElementById('tag-filters');
  if (tagContainer) {
    tagContainer.innerHTML = tags.map(t => `
      <button class="filter-chip ${state.tags.includes(t) ? 'filter-chip--active' : ''}" data-tag="${_esc(t)}">
        ${_esc(t)}
      </button>`).join('');

    tagContainer.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleTag(btn.dataset.tag);
        _callbacks.onFilterChange?.();
        _renderSidebarFilters();
      });
    });
  }
}

/* --------------------------------------------------------------------------
   Drawer
   -------------------------------------------------------------------------- */

/**
 * Open memory detail drawer.
 * @param {string} memId
 */
function openDrawer(memId) {
  const memory = getMemoryById(memId);
  if (!memory) return;

  _openDrawerMemId = memId;

  _renderDrawerContent(memory);

  document.getElementById('drawer')?.classList.add('drawer--open');
  document.getElementById('drawer-backdrop')?.classList.add('drawer-backdrop--visible');

  // Announce for screen readers
  document.getElementById('drawer')?.setAttribute('aria-hidden', 'false');
}

/**
 * Close drawer.
 */
function closeDrawer() {
  _openDrawerMemId = null;
  document.getElementById('drawer')?.classList.remove('drawer--open');
  document.getElementById('drawer-backdrop')?.classList.remove('drawer-backdrop--visible');
  document.getElementById('drawer')?.setAttribute('aria-hidden', 'true');
}

function _renderDrawerContent(memory) {
  const body = document.getElementById('drawer-body');
  if (!body) return;

  const profile    = getUserProfile(_currentUser);
  const filters    = getFilterValues(memory.id);
  const original   = getOriginalMemory(memory.id);
  const modified   = hasChanges(memory.id);
  const therapeutic = profile?.therapeutic;

  const limitPct = therapeutic
    ? `${Math.round(therapeutic.attenuationLimit * 100)}%`
    : '100%';

  const canAttenuation = profile?.capabilities?.canFilterAttenuation;
  const canClarity     = profile?.capabilities?.canFilterClarity;
  const safetyMsg      = getUserMessage(_currentUser, 'safetyMessage');

  const drawerPhotoSrc  = memory.photoUrl || memory.thumbnail || '';
  const drawerSvgFallback = memory.photoUrl && memory.thumbnail ? memory.thumbnail : '';

  body.innerHTML = `
    <!-- Photo header -->
    ${drawerPhotoSrc ? `
      <div class="drawer-photo-header" aria-hidden="true">
        <img src="${drawerPhotoSrc}" alt="${_esc(memory.title)}" class="drawer-photo-img"
          ${drawerSvgFallback ? `data-fallback="${_esc(drawerSvgFallback)}" onerror="this.onerror=null;this.src=this.dataset.fallback"` : ''} />
        <div class="drawer-photo-vignette"></div>
      </div>` : ''}

    <!-- Header info -->
    <div class="drawer-section">
      <h2 class="drawer-title">${_esc(memory.title)}</h2>
      <p class="drawer-meta">
        <span class="drawer-meta-date">🕐 ${_formatDate(memory.date)}</span>
        ${memory.location ? `<span class="drawer-sep">·</span><span class="drawer-meta-location">📍 ${_esc(typeof memory.location === 'object' ? memory.location?.name : memory.location)}</span>` : ''}
        ${memory.isProtected ? '<span class="drawer-badge drawer-badge--protected">🔒 Protegido</span>' : ''}
        ${modified ? '<span class="drawer-badge drawer-badge--modified">Modificado</span>' : ''}
      </p>
      <p class="drawer-desc">${_esc(memory.description || '')}</p>
    </div>

    <!-- People -->
    ${memory.people?.length ? `
      <div class="drawer-section">
        <h3 class="drawer-section-title">Personas</h3>
        <ul class="drawer-people">
          ${memory.people.map(p => {
            const fc = p.faceClarity ?? 1;
            const fcPct = Math.round(fc * 100);
            const ringColor = fc >= 0.8 ? '#00D9C0' : fc >= 0.5 ? '#F0A500' : '#FF4D6D';
            const ringDeg   = Math.round(fc * 360);
            const initial   = p.name ? p.name.charAt(0).toUpperCase() : '?';
            return `
            <li class="drawer-person">
              <div class="drawer-person-avatar-wrap">
                <div class="drawer-person-avatar" style="--ring-color:${ringColor};--ring-deg:${ringDeg}deg">${initial}</div>
              </div>
              <div class="drawer-person-info">
                <span class="drawer-person-name">${_esc(p.name)}</span>
                <span class="drawer-person-relation">${_esc(p.relationship || '')}</span>
              </div>
              <span class="drawer-person-clarity" title="Claridad facial">◐ ${fcPct}%</span>
            </li>`;
          }).join('')}
        </ul>
      </div>` : ''}

    <!-- Therapeutic meta (clinical info for Carlos) -->
    ${memory.therapeuticMeta ? `
      <div class="drawer-section">
        <h3 class="drawer-section-title">Información clínica</h3>
        <div class="therapeutic-card">
          ${memory.therapeuticMeta.sessionCount != null ? `<div class="therapeutic-row"><span class="therapeutic-label">Sesiones</span><span class="therapeutic-value">${memory.therapeuticMeta.sessionCount}</span></div>` : ''}
          ${memory.therapeuticMeta.lastSessionDate ? `<div class="therapeutic-row"><span class="therapeutic-label">Última sesión</span><span class="therapeutic-value">${_formatDate(memory.therapeuticMeta.lastSessionDate)}</span></div>` : ''}
          ${memory.therapeuticMeta.progressNotes ? `<div class="therapeutic-row therapeutic-row--note"><span class="therapeutic-label">Nota</span><span class="therapeutic-value">${_esc(memory.therapeuticMeta.progressNotes)}</span></div>` : ''}
        </div>
      </div>` : ''}

    <!-- Tags -->
    ${memory.tags?.length ? `
      <div class="drawer-section">
        <div class="drawer-tags">
          ${memory.tags.map(t => `<span class="tag">${_esc(t)}</span>`).join('')}
        </div>
      </div>` : ''}

    <!-- Emotional intensity -->
    <div class="drawer-section">
      <h3 class="drawer-section-title">Intensidad emocional</h3>
      <div class="intensity-bar">
        <div class="intensity-fill intensity-fill--${memory.emotionalIntensity >= 7 ? 'intense' : memory.emotionalIntensity >= 4 ? 'neutral' : 'calm'}"
             style="width: ${memory.emotionalIntensity * 10}%"></div>
      </div>
      <span class="intensity-label">${memory.emotionalIntensity}/10</span>
    </div>

    <!-- Clarity slider -->
    ${canClarity ? `
      <div class="drawer-section">
        <h3 class="drawer-section-title">Claridad visual</h3>
        <p class="drawer-section-desc">Ajusta qué tan nítido se percibe este recuerdo.</p>
        <div class="slider-wrap">
          <div class="slider-labels">
            <span>Borroso</span>
            <span class="slider-value" id="clarity-value">${Math.round(filters.clarityLevel * 100)}%</span>
            <span>Nítido</span>
          </div>
          <input
            type="range"
            class="slider-input"
            id="clarity-slider"
            min="0" max="100"
            value="${Math.round(filters.clarityLevel * 100)}"
            aria-label="Claridad visual"
          />
        </div>
        ${safetyMsg ? `<p class="safety-msg">${safetyMsg}</p>` : ''}
      </div>` : ''}

    <!-- Attenuation slider -->
    ${canAttenuation ? `
      <div class="drawer-section attenuation-section">
        <h3 class="drawer-section-title">Atenuación emocional</h3>
        <p class="drawer-section-desc">Reduce la carga emocional de este recuerdo.</p>
        <div class="slider-wrap" style="position: relative;">
          <div class="slider-labels">
            <span>Sin efecto</span>
            <span class="slider-value" id="attenuation-value">${Math.round(filters.attenuationLevel * 100)}%</span>
            <span>Máximo</span>
          </div>
          <div style="position: relative;">
            <input
              type="range"
              class="slider-input slider-input--attenuation"
              id="attenuation-slider"
              min="0" max="100"
              value="${Math.round(filters.attenuationLevel * 100)}"
              aria-label="Atenuación emocional"
            />
            <div class="slider-limit-marker" style="--limit-pct: ${limitPct}"></div>
          </div>
          ${therapeutic ? `
            <p class="therapist-info">
              <span class="therapist-info-icon">⚕</span>
              Límite configurado por ${therapeutic.therapistName}: ${limitPct}
            </p>` : ''}
        </div>
        ${safetyMsg ? `<p class="safety-msg">${safetyMsg}</p>` : ''}
      </div>` : ''}

    <!-- Undo / Revert -->
    ${modified ? `
      <div class="drawer-section drawer-actions">
        <button class="btn btn--ghost btn--sm" id="drawer-undo-btn">↩ Deshacer último</button>
        <button class="btn btn--ghost btn--sm btn--alert" id="drawer-revert-btn">⟲ Restaurar original</button>
      </div>` : ''}

    <!-- Notes -->
    <div class="drawer-section">
      <h3 class="drawer-section-title">Notas</h3>
      ${(memory.notes || []).map(n => `
        <div class="drawer-note">
          <p class="drawer-note-text">${_esc(n.text)}</p>
          <span class="drawer-note-time">${_formatDate(n.timestamp)}</span>
        </div>`).join('')}
      ${profile?.capabilities?.canAddNotes ? `
        <div class="drawer-note-input-wrap">
          <textarea class="drawer-note-input" id="note-input"
            placeholder="Añadir nota..." rows="2"></textarea>
          <button class="btn btn--primary btn--sm" id="save-note-btn">Guardar nota</button>
        </div>` : ''}
    </div>`;

  // Wire slider events after render
  _wireDrawerSliders(memory.id);

  // Wire note save
  document.getElementById('save-note-btn')?.addEventListener('click', () => {
    const txt = document.getElementById('note-input')?.value?.trim();
    if (!txt) return;
    addNote(memory.id, txt);
    showToast('Nota guardada.');
    // Re-render drawer to show new note
    const updatedMemory = getMemoryById(memory.id);
    if (updatedMemory) _renderDrawerContent(updatedMemory);
  });

  // Undo / Revert
  document.getElementById('drawer-undo-btn')?.addEventListener('click', () => {
    const result = undoLastFilter();
    if (result.success) {
      showToast('Cambio deshecho.');
      const updated = getMemoryById(memory.id);
      if (updated) _renderDrawerContent(updated);
      _callbacks.onFilterChange?.();
    }
  });

  document.getElementById('drawer-revert-btn')?.addEventListener('click', () => {
    showConfirmDialog(
      '¿Restaurar recuerdo original?',
      'Se eliminarán todos los filtros aplicados. El recuerdo original siempre se conserva.',
      () => {
        revertMemory(memory.id);
        showToast('Recuerdo restaurado al original.');
        const updated = getMemoryById(memory.id);
        if (updated) _renderDrawerContent(updated);
        _callbacks.onFilterChange?.();
      }
    );
  });
}

function _wireDrawerSliders(memId) {
  const claritySlider     = document.getElementById('clarity-slider');
  const clarityValue      = document.getElementById('clarity-value');
  const attenuationSlider = document.getElementById('attenuation-slider');
  const attenuationValue  = document.getElementById('attenuation-value');

  if (claritySlider) {
    claritySlider.addEventListener('input', e => {
      const val = parseInt(e.target.value) / 100;
      if (clarityValue) clarityValue.textContent = `${Math.round(val * 100)}%`;
    });

    claritySlider.addEventListener('change', e => {
      const val = parseInt(e.target.value) / 100;
      const result = applyFilter(memId, 'clarityLevel', val, _currentUser);
      if (result.success) {
        showToast(getUserMessage(_currentUser, 'filterSaved') || 'Filtro guardado.');
        _callbacks.onFilterChange?.();
      } else {
        showToast(result.message || 'No se pudo aplicar el filtro.', 'error');
        // Reset slider to current value
        const current = getFilterValues(memId);
        claritySlider.value = Math.round(current.clarityLevel * 100);
      }
    });
  }

  if (attenuationSlider) {
    attenuationSlider.addEventListener('input', e => {
      const val = parseInt(e.target.value) / 100;
      if (attenuationValue) attenuationValue.textContent = `${Math.round(val * 100)}%`;
    });

    attenuationSlider.addEventListener('change', e => {
      const val = parseInt(e.target.value) / 100;
      const result = applyFilter(memId, 'attenuationLevel', val, _currentUser);
      if (result.success) {
        showToast(getUserMessage(_currentUser, 'filterSaved') || 'Filtro guardado.');
        _callbacks.onFilterChange?.();
      } else {
        showToast(result.message || 'No se pudo aplicar el filtro.', 'error');
        if (result.limited) {
          const current = getFilterValues(memId);
          attenuationSlider.value = Math.round(current.attenuationLevel * 100);
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Status Bar
   -------------------------------------------------------------------------- */

function _renderStatusBar() {
  const el = document.getElementById('status-bar');
  if (!el) return;

  const sig = Math.round(IMPLANT_CONFIG.signalStrength * 100);
  const bat = Math.round(IMPLANT_CONFIG.batteryLevel * 100);

  // Neural signal bars
  const barsEl = el.querySelector('.neural-bars');
  if (barsEl) {
    const level = Math.ceil(IMPLANT_CONFIG.signalStrength * 5);
    barsEl.querySelectorAll('.neural-bar').forEach((bar, i) => {
      bar.classList.toggle('neural-bar--active', i < level);
    });
  }

  const sigEl = el.querySelector('#status-signal');
  const batEl = el.querySelector('#status-battery');
  const verEl = el.querySelector('#status-version');

  if (sigEl) sigEl.textContent = `${sig}%`;
  if (batEl) batEl.textContent = `${bat}%`;
  if (verEl) verEl.textContent = `${IMPLANT_CONFIG.name} v${IMPLANT_CONFIG.version}`;
}

/* --------------------------------------------------------------------------
   Dialog
   -------------------------------------------------------------------------- */

let _dialogConfirmCallback = null;

/**
 * Show a confirmation dialog.
 * @param {string}   title
 * @param {string}   message
 * @param {Function} onConfirm
 * @param {string}   confirmLabel
 */
function showConfirmDialog(title, message, onConfirm, confirmLabel = 'Confirmar') {
  _dialogConfirmCallback = onConfirm;

  const titleEl   = document.getElementById('dialog-title');
  const msgEl     = document.getElementById('dialog-message');
  const confirmEl = document.getElementById('dialog-confirm');
  const cancelEl  = document.getElementById('dialog-cancel');

  if (titleEl)   titleEl.textContent   = title;
  if (msgEl)     msgEl.textContent     = message;
  if (confirmEl) confirmEl.textContent = confirmLabel;

  const container = document.getElementById('dialog-container');
  container?.classList.add('dialog--open');

  // Wire buttons
  confirmEl?.addEventListener('click', _handleDialogConfirm, { once: true });
  cancelEl?.addEventListener('click', closeDialog, { once: true });
}

function _handleDialogConfirm() {
  closeDialog();
  _dialogConfirmCallback?.();
  _dialogConfirmCallback = null;
}

function closeDialog() {
  const container = document.getElementById('dialog-container');
  container?.classList.remove('dialog--open');
  _dialogConfirmCallback = null;
}

/* --------------------------------------------------------------------------
   Toast
   -------------------------------------------------------------------------- */

const TOAST_DURATION = 3000;

/**
 * Show toast notification.
 * @param {string} message
 * @param {'info'|'success'|'error'} type
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add('toast--visible'));

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, TOAST_DURATION);
}

/* --------------------------------------------------------------------------
   Profile Selector
   -------------------------------------------------------------------------- */

/**
 * Show profile selector screen, wire profile card clicks.
 * @param {Array<{id, name, role, avatar}>} profiles
 * @param {Function} onSelect - (userId) => void
 */
function showProfileSelector(profiles, onSelect) {
  const selector = document.getElementById('profile-selector');
  const grid     = document.getElementById('profile-grid');

  if (!selector || !grid) return;

  grid.innerHTML = profiles.map(p => `
    <button class="ps-card" data-user-id="${p.id}" aria-label="Entrar como ${_esc(p.name)}">
      <span class="ps-card-avatar">${p.avatar}</span>
      <span class="ps-card-name">${_esc(p.name)}</span>
      <span class="ps-card-role">${_roleLabel(p.role)}</span>
    </button>`).join('');

  grid.querySelectorAll('.ps-card').forEach(card => {
    card.addEventListener('click', () => {
      selector.classList.add('ps--hidden');
      onSelect(card.dataset.userId);
    });
  });

  selector.classList.remove('ps--hidden');
}

/* --------------------------------------------------------------------------
   Utilities
   -------------------------------------------------------------------------- */

function _esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _truncate(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

function _formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch {
    return iso;
  }
}

function _roleLabel(role) {
  return { patient: 'Paciente', caregiver: 'Cuidadora', therapist: 'Terapeuta' }[role] || role;
}

function _debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* --------------------------------------------------------------------------
   Custom Sort Select
   -------------------------------------------------------------------------- */

function _initCustomSelect() {
  const container = document.getElementById('sort-select');
  if (!container) return;

  const trigger = container.querySelector('.custom-select__trigger');
  const menu    = container.querySelector('.custom-select__menu');
  const valueEl = container.querySelector('.custom-select__value');
  const items   = container.querySelectorAll('.custom-select__item');

  function openMenu() {
    container.classList.add('custom-select--open');
    container.setAttribute('aria-expanded', 'true');
    menu.removeAttribute('hidden');
  }

  function closeMenu() {
    container.classList.remove('custom-select--open');
    container.setAttribute('aria-expanded', 'false');
    menu.setAttribute('hidden', '');
  }

  // Start closed
  menu.setAttribute('hidden', '');

  trigger.addEventListener('click', () => {
    container.classList.contains('custom-select--open') ? closeMenu() : openMenu();
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      // Update UI
      items.forEach(i => { i.classList.remove('custom-select__item--selected'); i.setAttribute('aria-selected', 'false'); });
      item.classList.add('custom-select__item--selected');
      item.setAttribute('aria-selected', 'true');
      valueEl.textContent = item.textContent.trim();
      closeMenu();

      // Trigger sort — reuse same split logic as original native select
      const value = item.dataset.value || '';
      const [field, order] = value.split('-');
      setSort(field, order || 'desc');
      _callbacks.onFilterChange?.();
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!container.contains(e.target)) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

export {
  initUI,
  setActiveUser,
  showView,
  renderGallery,
  renderTimeline,
  renderDashboard,
  openDrawer,
  closeDrawer,
  showConfirmDialog,
  closeDialog,
  showToast,
  showProfileSelector,
};
