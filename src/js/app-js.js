/* ==========================================================================
   MNEMOSYNE — Punto de Entrada (app.js)
   ==========================================================================
   Orquesta la inicialización, gestiona el estado global, coordina los 
   módulos de vista y controladores.
   
   Actualizado en Commit 11: integración de galleryView, dashboardView 
   y searchController para navegación SPA completa.
   ========================================================================== */

import * as DataService from './services/dataService.js';
import {
  getUserProfile, getAllProfiles, getUserMessage,
  userCan, IMPLANT_CONFIG
} from './models/userProfiles.js';
import { formatDate, escapeHtml } from './utils/helpers.js';
import * as GalleryView from './views/galleryView.js';
import * as DashboardView from './views/dashboardView.js';
import * as SearchController from './controllers/searchController.js';

/* ==========================================================================
   1. ESTADO GLOBAL DE LA APLICACIÓN
   ========================================================================== */

const AppState = {
  currentUserId: null,
  currentView: 'dashboard',
  currentMemoryId: null,  // Recuerdo abierto en el visor (Commit 12)
  isLoading: true,
  implantStatus: IMPLANT_CONFIG.status,
  initialized: false,
};

/* ==========================================================================
   2. INICIALIZACIÓN
   ========================================================================== */

/**
 * Punto de entrada principal.
 * 
 * Secuencia:
 * 1. Mostrar indicador de conexión con implante
 * 2. Inicializar DataService (cargar BD)
 * 3. Mostrar selector de perfil
 * 4. Al seleccionar → configurar experiencia y renderizar vista
 */
async function initApp() {
  console.log(`[Mnemosyne] Iniciando ${IMPLANT_CONFIG.name} v${IMPLANT_CONFIG.version}...`);

  try {
    _showLoadingState('Conectando con NeuroLink V4...');

    const stats = await DataService.init();
    console.log(`[Mnemosyne] BD cargada:`, stats);

    _showLoadingState('Conexión establecida.');
    await _delay(400);

    AppState.isLoading = false;
    AppState.initialized = true;

    _renderUserSelector();

  } catch (err) {
    console.error('[Mnemosyne] Error fatal:', err);
    _showError('No se pudo conectar con el implante. Comprueba la conexión.');
  }
}

/* ==========================================================================
   3. SELECCIÓN DE USUARIO
   ========================================================================== */

/**
 * Renderiza la pantalla de selección de perfil.
 * 
 * Justificación: Alternativa C (04_design_alternatives.md)
 * "Tres Experiencias, Un Sistema" — el selector permite al evaluador 
 * probar las 3 experiencias.
 */
function _renderUserSelector() {
  const main = document.getElementById('main-content');
  if (!main) return;

  const profiles = getAllProfiles();
  const roleLabels = { patient: 'Paciente', caregiver: 'Cuidadora' };
  const roleDescriptions = {
    'maria-luisa': 'Buscar recuerdos y mejorar la claridad facial',
    'carlos': 'Gestionar recuerdos traumáticos con atenuación emocional',
    'elena': 'Monitorizar y configurar el implante de María Luisa',
  };

  main.innerHTML = `
    <div class="user-selector" role="region" aria-label="Selección de perfil">
      <div class="user-selector__header text-center mb-8">
        <div class="user-selector__logo text-2xl mb-4">🧠</div>
        <h1 class="text-2xl font-bold">Mnemosyne</h1>
        <p class="text-muted mt-2">Editor de Recuerdos — ${IMPLANT_CONFIG.name}</p>
        <div class="processing-indicator mt-4" style="display: inline-flex">
          <span class="implant-connection__dot"></span>
          <span class="text-sm text-success">Implante conectado</span>
        </div>
      </div>
      <div class="user-selector__cards" role="radiogroup" aria-label="Perfiles disponibles">
        ${profiles.map(p => `
          <button class="user-selector__card card"
                  data-user-id="${p.id}"
                  role="radio" aria-checked="false"
                  aria-label="${escapeHtml(p.name)} — ${roleLabels[p.role]}">
            <span class="user-selector__avatar">${p.avatar}</span>
            <span class="user-selector__name font-semibold">${escapeHtml(p.name)}</span>
            <span class="user-selector__role text-sm text-muted">${roleLabels[p.role]}</span>
            <span class="user-selector__desc text-xs text-muted mt-2">
              ${escapeHtml(roleDescriptions[p.id] || '')}
            </span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  main.querySelectorAll('.user-selector__card').forEach(card => {
    card.addEventListener('click', () => _selectUser(card.dataset.userId));
  });
}

/**
 * Activa un perfil y configura toda la experiencia.
 */
function _selectUser(userId) {
  const profile = getUserProfile(userId);
  if (!profile) return;

  AppState.currentUserId = userId;
  console.log(`[Mnemosyne] Perfil activo: ${profile.name} (${profile.role})`);

  // Aplicar data-user para estilos CSS por experiencia
  const appEl = document.querySelector('.app');
  if (appEl) appEl.setAttribute('data-user', userId);

  _applyA11ySettings(profile);
  _updateHeader(profile);
  _renderSidebar(profile);

  // Inicializar vistas y controladores
  GalleryView.init(_handleMemorySelect);
  DashboardView.init(_handleMemorySelect);

  // Mostrar vista por defecto según rol
  if (profile.role === 'caregiver') {
    _showView('dashboard');
  } else {
    _showView('gallery');
  }
}

/* ==========================================================================
   4. GESTIÓN DE VISTAS (SPA)
   ========================================================================== */

/**
 * Muestra una vista y oculta las demás.
 * Implementa navegación SPA sin recarga.
 * 
 * Trazabilidad: STD navegación global (03_dialogue_specification.md)
 * — cada transición de estado = cambio de vista.
 * 
 * Vistas disponibles:
 * - dashboard: resumen + bienvenida (paciente) o panel monitorización (Elena)
 * - gallery: galería de recuerdos (grid/timeline)
 * - viewer: visor de recuerdo con filtros (Commit 12)
 * - settings: configuración (Commit 12)
 */
function _showView(viewId) {
  const prevView = AppState.currentView;
  AppState.currentView = viewId;
  const userId = AppState.currentUserId;
  const profile = getUserProfile(userId);

  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach(v => v.classList.remove('view--active'));

  // Mostrar la vista seleccionada
  const target = document.getElementById(`view-${viewId}`);
  if (target) target.classList.add('view--active');

  // Actualizar nav activa en sidebar
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('nav-item--active', item.dataset.view === viewId);
  });

  // Inicializar contenido de la vista
  switch (viewId) {
    case 'dashboard':
      _initDashboardView(userId, profile);
      break;
    case 'gallery':
      _initGalleryView(userId);
      break;
    case 'viewer':
      // Se implementa en Commit 12
      break;
  }

  console.log(`[Mnemosyne] Vista: ${prevView} → ${viewId}`);
}

/**
 * Inicializa la vista de dashboard.
 * Contenido diferente según el rol del usuario.
 */
function _initDashboardView(userId, profile) {
  if (profile.role === 'caregiver') {
    DashboardView.render(userId);
  } else {
    // Dashboard de paciente: bienvenida + acceso rápido
    _renderPatientDashboard(userId, profile);
  }
}

/**
 * Inicializa la vista de galería con búsqueda y filtrado.
 */
function _initGalleryView(userId) {
  // Inicializar SearchController → al cambiar resultados, renderizar galería
  SearchController.init(userId, (searchResults) => {
    if (searchResults.viewModeChanged) {
      // Solo cambio de modo (grid/timeline): re-ejecutar con datos previos
      const state = SearchController.getState();
      const memories = searchResults.memories ||
        DataService.getMemories(userId, { sortBy: state.sortBy, sortOrder: state.sortOrder });
      GalleryView.render({
        memories,
        query: state.currentQuery,
        viewMode: searchResults.viewMode,
        resultCount: memories.length,
      });
    } else {
      GalleryView.render(searchResults);
    }
  });
}

/* ==========================================================================
   5. DASHBOARD DE PACIENTE
   ========================================================================== */

/**
 * Renderiza el dashboard personalizado para pacientes.
 * 
 * Justificación: Mensaje de bienvenida personalizado (userProfiles.js)
 * y acceso rápido a las acciones más frecuentes según el HTA.
 */
function _renderPatientDashboard(userId, profile) {
  const container = document.querySelector('.dashboard-content');
  if (!container) return;

  const welcome = getUserMessage(userId, 'welcome');
  const memories = DataService.getMemories(userId, { sortBy: 'lastAccessed', sortOrder: 'desc' });
  const recentMemories = memories.slice(0, 4);
  const safetyMsg = getUserMessage(userId, 'safetyMessage');

  container.innerHTML = `
    <div class="patient-dashboard">
      <div class="patient-dashboard__welcome mb-8">
        <div class="implant-connection mb-4">
          <span class="implant-connection__dot"></span>
          <div class="implant-connection__signal">
            <div class="implant-connection__signal-line"></div>
          </div>
          <span class="implant-connection__label">
            ${IMPLANT_CONFIG.name} — Conectado
          </span>
        </div>
        <h2 class="text-xl font-bold">${escapeHtml(welcome)}</h2>
      </div>

      ${recentMemories.length > 0 ? `
        <div class="patient-dashboard__recent">
          <h3 class="text-md font-semibold mb-4">Recuerdos recientes</h3>
          <div class="memory-grid">
            ${recentMemories.map(m => _renderQuickCard(m)).join('')}
          </div>
        </div>
      ` : ''}

      <div class="patient-dashboard__actions mt-8 flex gap-4 flex-wrap">
        <button class="btn btn--primary btn--lg" data-action="go-gallery">
          <span class="btn__icon">🔍</span>
          Buscar recuerdos
        </button>
        ${userCan(userId, 'canFilterAttenuation') ? `
          <button class="btn btn--secondary btn--lg" data-action="go-session">
            <span class="btn__icon">🧘</span>
            Iniciar sesión
          </button>
        ` : ''}
      </div>

      ${safetyMsg ? `
        <div class="safety-message mt-8">
          <span class="safety-message__icon">🔒</span>
          ${escapeHtml(safetyMsg)}
        </div>
      ` : ''}
    </div>
  `;

  // Vincular botones de acción
  container.querySelector('[data-action="go-gallery"]')?.addEventListener('click', () => {
    _showView('gallery');
  });

  container.querySelector('[data-action="go-session"]')?.addEventListener('click', () => {
    // Sesión de atenuación → se implementa completamente en Commit 12
    _showView('gallery');
  });

  // Vincular clicks en cards rápidas
  container.querySelectorAll('.quick-card[data-memory-id]').forEach(card => {
    card.addEventListener('click', () => _handleMemorySelect(card.dataset.memoryId));
  });
}

/**
 * Renderiza una card compacta para el dashboard de paciente.
 */
function _renderQuickCard(memory) {
  const dateStr = formatDate(memory.date, { relative: true });
  return `
    <div class="quick-card card cursor-pointer" data-memory-id="${memory.id}"
         role="button" tabindex="0"
         aria-label="${escapeHtml(memory.title)}">
      <div class="flex items-center gap-4">
        <div class="quick-card__thumb rounded-md"
             style="width:56px; height:56px; background: url('${memory.thumbnail}') center/cover;
                    flex-shrink:0; background-color: var(--color-neutral-200);">
        </div>
        <div class="flex-1">
          <span class="font-medium">${escapeHtml(memory.title)}</span>
          <span class="text-xs text-muted block mt-1">${dateStr}</span>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   6. NAVEGACIÓN ENTRE RECUERDOS
   ========================================================================== */

/**
 * Maneja la selección de un recuerdo desde cualquier vista.
 * Navega al visor del recuerdo.
 * 
 * Trazabilidad: STD navegación — transición "Galería → Visor"
 * 
 * @param {string} memoryId
 */
function _handleMemorySelect(memoryId) {
  const userId = AppState.currentUserId;
  const memory = DataService.getMemoryById(memoryId, userId);

  if (!memory) {
    console.warn(`[Mnemosyne] Recuerdo no encontrado: ${memoryId}`);
    return;
  }

  AppState.currentMemoryId = memoryId;
  console.log(`[Mnemosyne] Recuerdo seleccionado: "${memory.title}" (${memoryId})`);

  // Navegar al visor (el renderizado completo se implementa en Commit 12)
  _showView('viewer');

  // Renderizado provisional del visor
  _renderViewerPlaceholder(memory, userId);
}

/**
 * Renderizado provisional del visor de recuerdo.
 * Se reemplazará completamente en el Commit 12.
 */
function _renderViewerPlaceholder(memory, userId) {
  const container = document.querySelector('.viewer-content');
  if (!container) return;

  const profile = getUserProfile(userId);
  const dateStr = formatDate(memory.date);

  container.innerHTML = `
    <div class="viewer-layout">
      <div class="memory-viewer">
        <img class="memory-viewer__image" src="${memory.thumbnail}"
             alt="${escapeHtml(memory.title)}">
        <div class="memory-viewer__overlay">
          <h2 class="memory-viewer__overlay-title">${escapeHtml(memory.title)}</h2>
          <p class="memory-viewer__overlay-date">${dateStr}</p>
        </div>
        <div class="neural-particles" aria-hidden="true">
          ${Array.from({length: 8}, (_, i) =>
            `<span class="neural-particles__dot"></span>`
          ).join('')}
          <div class="neural-particles__connections"></div>
        </div>
      </div>

      <div class="viewer-controls">
        <p class="text-muted text-sm mb-4">${escapeHtml(memory.description)}</p>

        ${memory.people.length > 0 ? `
          <div class="mb-4">
            <span class="text-xs font-semibold text-muted">Personas</span>
            <div class="flex flex-wrap gap-2 mt-2">
              ${memory.people.map(p => `
                <span class="tag tag--person">
                  ${escapeHtml(p.name)} — ${Math.round(p.faceClarity * 100)}%
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="mb-4">
          <span class="text-xs font-semibold text-muted">Etiquetas</span>
          <div class="flex flex-wrap gap-2 mt-2">
            ${memory.tags.map(t => `
              <span class="tag tag--place">${escapeHtml(t)}</span>
            `).join('')}
          </div>
        </div>

        <div class="text-xs text-muted mt-4 p-3 bg-subtle rounded-md">
          ⚙ Los controles de filtro (claridad y atenuación) se implementan
          en el Commit 12.
        </div>

        <button class="btn btn--secondary w-full mt-6" data-action="back-gallery">
          ← Volver a la galería
        </button>
      </div>
    </div>
  `;

  container.querySelector('[data-action="back-gallery"]')?.addEventListener('click', () => {
    AppState.currentMemoryId = null;
    _showView('gallery');
  });
}

/* ==========================================================================
   7. SIDEBAR
   ========================================================================== */

/**
 * Renderiza la sidebar con navegación adaptada al perfil.
 * 
 * Justificación: HTA punto crítico 1.2 — nav. siempre accesible.
 * Items diferentes según capabilities del perfil.
 */
function _renderSidebar(profile) {
  const nav = document.querySelector('.app-sidebar__nav');
  if (!nav) return;

  const items = [];

  // Dashboard siempre presente
  items.push({ id: 'dashboard', icon: '🏠', label: profile.role === 'caregiver' ? 'Panel' : 'Inicio' });

  // Galería de recuerdos
  if (profile.capabilities.canSearch || profile.capabilities.canBrowseTimeline) {
    items.push({ id: 'gallery', icon: '🧠', label: 'Recuerdos' });
  }

  // Visor (se activa al seleccionar un recuerdo, no desde nav directamente)
  // No se incluye en nav — se accede desde galería/dashboard

  nav.innerHTML = `
    <span class="app-sidebar__section-label">Navegación</span>
    ${items.map(item => `
      <a href="#" class="nav-item ${item.id === AppState.currentView ? 'nav-item--active' : ''}"
         data-view="${item.id}" role="link"
         aria-label="${escapeHtml(item.label)}"
         aria-current="${item.id === AppState.currentView ? 'page' : 'false'}">
        <span class="nav-item__icon" aria-hidden="true">${item.icon}</span>
        <span>${escapeHtml(item.label)}</span>
      </a>
    `).join('')}

    <span class="app-sidebar__section-label mt-6">Perfil</span>
    <button class="nav-item" data-action="switch-user"
            aria-label="Cambiar de perfil">
      <span class="nav-item__icon" aria-hidden="true">🔄</span>
      <span>Cambiar perfil</span>
    </button>
  `;

  // Vincular navegación
  nav.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      _showView(item.dataset.view);
    });
  });

  // Vincular cambio de perfil
  nav.querySelector('[data-action="switch-user"]')?.addEventListener('click', () => {
    AppState.currentUserId = null;
    AppState.currentView = 'dashboard';
    AppState.currentMemoryId = null;
    const appEl = document.querySelector('.app');
    if (appEl) appEl.removeAttribute('data-user');
    _renderUserSelector();
  });

  // Información del implante en el footer
  const footer = document.querySelector('.app-sidebar__footer');
  if (footer) {
    footer.innerHTML = `
      <div class="implant-info">
        <span>${IMPLANT_CONFIG.name} v${IMPLANT_CONFIG.version}</span>
        <span>Almacenamiento: ${Math.round(IMPLANT_CONFIG.storageUsed * 100)}%</span>
        <span>Batería: ${Math.round(IMPLANT_CONFIG.batteryLevel * 100)}%</span>
      </div>
    `;
  }
}

/* ==========================================================================
   8. FUNCIONES DE UI AUXILIARES
   ========================================================================== */

function _showLoadingState(message) {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="empty-state">
      <div class="processing-indicator">
        <div class="processing-indicator__dots">
          <span class="processing-indicator__dot"></span>
          <span class="processing-indicator__dot"></span>
          <span class="processing-indicator__dot"></span>
        </div>
        <span>${escapeHtml(message)}</span>
      </div>
    </div>
  `;
}

function _showError(message) {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="empty-state">
      <span class="empty-state__icon">⚠️</span>
      <h2 class="empty-state__title">Error de conexión</h2>
      <p class="empty-state__description">${escapeHtml(message)}</p>
      <button class="btn btn--primary" onclick="location.reload()">Reintentar</button>
    </div>
  `;
}

function _updateHeader(profile) {
  const nameEl = document.querySelector('.app-header__user-name');
  if (nameEl) nameEl.textContent = profile.name;

  const avatarEl = document.querySelector('.app-header__avatar-emoji');
  if (avatarEl) avatarEl.textContent = profile.avatar;

  const statusEl = document.querySelector('.app-header__implant-label');
  if (statusEl) statusEl.textContent = `${IMPLANT_CONFIG.name} — Conectado`;
}

function _applyA11ySettings(profile) {
  const root = document.documentElement;
  if (profile.a11y.largeText) root.style.setProperty('--font-size-base', '1.125rem');
  if (profile.a11y.reducedMotion) root.classList.add('prefers-reduced-motion');
  if (profile.a11y.highContrast) root.classList.add('high-contrast');
}

function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ==========================================================================
   9. SIDEBAR MOBILE TOGGLE
   ========================================================================== */

function _initMobileToggle() {
  const toggle = document.querySelector('.app-header__menu-toggle');
  const sidebar = document.querySelector('.app-sidebar');
  const backdrop = document.querySelector('.sidebar-backdrop');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('app-sidebar--open');
      backdrop?.classList.toggle('sidebar-backdrop--visible');
    });

    backdrop?.addEventListener('click', () => {
      sidebar.classList.remove('app-sidebar--open');
      backdrop.classList.remove('sidebar-backdrop--visible');
    });
  }
}

/* ==========================================================================
   10. ARRANQUE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  _initMobileToggle();
  initApp();
});

export { AppState, _showView as showView, _selectUser as selectUser };
