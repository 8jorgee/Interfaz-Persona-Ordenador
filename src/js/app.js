/* ==========================================================================
   MNEMOSYNE — App Orchestrator  |  app.js
   Init, routing, profile selection, event wiring
   ========================================================================== */

import { loadMemories, getMemoriesForUser } from './memories.js';
import { resetFilters }                      from './filters.js';
import { getAllProfiles, getUserProfile }     from './models/user-profiles.js';
import {
  initUI,
  setActiveUser,
  showView,
  renderGallery,
  renderTimeline,
  renderDashboard,
  showProfileSelector,
  showToast,
} from './ui.js';

/* --------------------------------------------------------------------------
   App State
   -------------------------------------------------------------------------- */
let _activeUser    = null;
let _activeView    = 'gallery';
let _userMemories  = [];

/* --------------------------------------------------------------------------
   Bootstrap
   -------------------------------------------------------------------------- */

async function init() {
  try {
    // Load memories JSON first
    await loadMemories();
  } catch (err) {
    _showFatalError('No se pudo cargar la base de datos de recuerdos. ¿Está corriendo el servidor?');
    return;
  }

  // Wire UI core
  initUI({
    onFilterChange: _onFilterChange,
    onProfileExit:  _onProfileExit,
  });

  // Wire nav
  _wireNavigation();

  // Wire sidebar logout/exit
  document.getElementById('btn-exit-profile')?.addEventListener('click', _onProfileExit);

  // Show profile selector
  const profiles = getAllProfiles();
  showProfileSelector(profiles, _onProfileSelect);
}

/* --------------------------------------------------------------------------
   Profile Selection
   -------------------------------------------------------------------------- */

async function _onProfileSelect(userId) {
  _activeUser   = userId;
  _activeView   = 'gallery';
  _userMemories = getMemoriesForUser(userId);

  // Apply profile to DOM
  setActiveUser(userId, _userMemories);

  // Show app shell
  const app = document.getElementById('app');
  if (app) app.style.display = 'grid';

  // Render default view
  showView('gallery');
  renderGallery(_userMemories);

  // Therapeutic setup for Carlos
  const profile = getUserProfile(userId);
  if (profile?.therapeutic) {
    _startSessionTimer(profile.therapeutic);
  }

  // Font size control for María Luisa
  if (userId === 'user-maria') {
    _initFontSizeControl();
  } else {
    _teardownFontSizeControl();
  }
}

function _onProfileExit() {
  _activeUser   = null;
  _userMemories = [];
  resetFilters();

  // Hide app shell
  const app = document.getElementById('app');
  if (app) {
    app.style.display = 'none';
    app.removeAttribute('data-user');
  }

  // Show profile selector again
  const profiles = getAllProfiles();
  showProfileSelector(profiles, _onProfileSelect);
}

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */

function _wireNavigation() {
  // Sidebar nav items
  document.querySelectorAll('.sidebar-nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      _navigateTo(view);
    });
  });
}

function _navigateTo(view) {
  _activeView = view;

  // Update active nav item
  document.querySelectorAll('.sidebar-nav-item[data-view]').forEach(item => {
    item.classList.toggle('sidebar-nav-item--active', item.dataset.view === view);
  });

  showView(view);

  switch (view) {
    case 'gallery':
      renderGallery(_userMemories);
      break;
    case 'timeline':
      renderTimeline(_userMemories);
      break;
    case 'dashboard':
      renderDashboard(_activeUser);
      break;
  }
}

/* --------------------------------------------------------------------------
   Filter Change Handler
   -------------------------------------------------------------------------- */

function _onFilterChange() {
  if (_activeView === 'gallery') {
    renderGallery(_userMemories);
  } else if (_activeView === 'timeline') {
    renderTimeline(_userMemories);
  }
}

/* --------------------------------------------------------------------------
   Therapeutic Session Timer (Carlos)
   -------------------------------------------------------------------------- */

let _sessionTimer    = null;
let _wellbeingTimer  = null;
let _sessionStart    = null;

function _startSessionTimer(tc) {
  _sessionStart = Date.now();

  // Session max duration
  if (tc.sessionDurationMax) {
    _sessionTimer = setTimeout(() => {
      showToast(
        'Has alcanzado el tiempo máximo de sesión configurado por tu terapeuta.',
        'info'
      );
      // Could force exit here; for prototype we just warn
    }, tc.sessionDurationMax * 1000);
  }

  // Wellbeing check on inactivity
  if (tc.wellbeingCheckInterval) {
    _resetWellbeingTimer(tc);
    document.addEventListener('click',     () => _resetWellbeingTimer(tc));
    document.addEventListener('keydown',   () => _resetWellbeingTimer(tc));
    document.addEventListener('mousemove', _debounce(() => _resetWellbeingTimer(tc), 5000));
  }
}

function _resetWellbeingTimer(tc) {
  clearTimeout(_wellbeingTimer);
  _wellbeingTimer = setTimeout(() => {
    showToast('¿Todo bien? Llevas un rato sin interactuar.', 'info');
  }, tc.wellbeingCheckInterval * 1000);
}

function _stopSessionTimers() {
  clearTimeout(_sessionTimer);
  clearTimeout(_wellbeingTimer);
  _sessionStart = null;
}

/* --------------------------------------------------------------------------
   Font Size Control (María Luisa)
   -------------------------------------------------------------------------- */

const _FONT_SIZE_KEY = 'mnemosyne_font_size';
const _FONT_SIZE_MIN = 16;
const _FONT_SIZE_MAX = 22;
const _FONT_SIZE_STEP = 1;

function _initFontSizeControl() {
  const saved = parseInt(sessionStorage.getItem(_FONT_SIZE_KEY), 10);
  const size  = (saved >= _FONT_SIZE_MIN && saved <= _FONT_SIZE_MAX) ? saved : 17;
  _applyFontSize(size);

  document.getElementById('btn-font-increase')?.addEventListener('click', _onFontIncrease);
  document.getElementById('btn-font-decrease')?.addEventListener('click', _onFontDecrease);
}

function _teardownFontSizeControl() {
  document.documentElement.style.removeProperty('font-size');
  document.getElementById('btn-font-increase')?.removeEventListener('click', _onFontIncrease);
  document.getElementById('btn-font-decrease')?.removeEventListener('click', _onFontDecrease);
}

function _onFontIncrease() {
  const cur = _getCurrentFontSize();
  _applyFontSize(Math.min(cur + _FONT_SIZE_STEP, _FONT_SIZE_MAX));
}

function _onFontDecrease() {
  const cur = _getCurrentFontSize();
  _applyFontSize(Math.max(cur - _FONT_SIZE_STEP, _FONT_SIZE_MIN));
}

function _getCurrentFontSize() {
  return parseInt(sessionStorage.getItem(_FONT_SIZE_KEY), 10) || 17;
}

function _applyFontSize(size) {
  document.documentElement.style.fontSize = size + 'px';
  sessionStorage.setItem(_FONT_SIZE_KEY, size);
}

/* --------------------------------------------------------------------------
   Fatal error
   -------------------------------------------------------------------------- */

function _showFatalError(message) {
  const body = document.body;
  const errorEl = document.createElement('div');
  errorEl.style.cssText = `
    position: fixed; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem;
    background: #06080F; color: #FF4D6D; font-family: monospace;
    font-size: 0.9rem; padding: 2rem; text-align: center; z-index: 9999;
  `;
  errorEl.innerHTML = `
    <div style="font-size: 2rem;">⚠</div>
    <div>${message}</div>
    <div style="color: #4A5568; font-size: 0.75rem;">
      Ejecuta: <code>python -m http.server 8080</code> desde el directorio <code>src/</code>
    </div>`;
  body.appendChild(errorEl);
}

/* --------------------------------------------------------------------------
   Utilities
   -------------------------------------------------------------------------- */

function _debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* --------------------------------------------------------------------------
   Entry point
   -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', init);
