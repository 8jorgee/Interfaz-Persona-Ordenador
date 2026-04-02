/* ==========================================================================
   MNEMOSYNE — Punto de Entrada (app.js)
   ==========================================================================
   Orquesta la inicialización del sistema, gestiona el estado global 
   (usuario activo) y coordina los módulos.
   
   Este commit (10) establece la infraestructura. Los commits siguientes 
   añadirán la lógica de interacción (11), los filtros (12), etc.
   
   Carga de módulos:
   - dataService.js  → Acceso a la BD de recuerdos
   - userProfiles.js → Perfiles y configuración por experiencia
   - helpers.js      → Utilidades (formateo, debounce, etc.)
   ========================================================================== */

import * as DataService from './services/dataService.js';
import {
  getUserProfile,
  getAllProfiles,
  getUserMessage,
  IMPLANT_CONFIG
} from './models/userProfiles.js';
import { formatDate, escapeHtml } from './utils/helpers.js';

/* ==========================================================================
   1. ESTADO GLOBAL DE LA APLICACIÓN
   ========================================================================== */

const AppState = {
  currentUserId: null,       // Usuario activo ('maria-luisa'|'carlos'|'elena')
  currentView: 'dashboard',  // Vista activa
  isLoading: true,           // Flag de carga inicial
  implantStatus: IMPLANT_CONFIG.status,
  initialized: false,
};

/* ==========================================================================
   2. INICIALIZACIÓN
   ========================================================================== */

/**
 * Punto de entrada principal. Se ejecuta al cargar el DOM.
 * 
 * Secuencia de arranque:
 * 1. Mostrar pantalla de carga (simula conexión con implante)
 * 2. Inicializar DataService (cargar BD)
 * 3. Mostrar selector de perfil
 * 4. Al seleccionar perfil → configurar experiencia y renderizar
 */
async function initApp() {
  console.log(`[Mnemosyne] Iniciando ${IMPLANT_CONFIG.name} v${IMPLANT_CONFIG.version}...`);

  try {
    // 1. Mostrar indicador de conexión
    _showLoadingState('Conectando con NeuroLink V4...');

    // 2. Cargar base de datos
    const stats = await DataService.init();
    console.log(`[Mnemosyne] BD cargada:`, stats);

    // 3. Mostrar selector de usuario
    _showLoadingState('Conexión establecida.');
    await _delay(400);  // Pausa para feedback visual

    AppState.isLoading = false;
    AppState.initialized = true;

    _renderUserSelector();

  } catch (err) {
    console.error('[Mnemosyne] Error fatal en la inicialización:', err);
    _showError('No se pudo conectar con el implante. Comprueba la conexión.');
  }
}

/* ==========================================================================
   3. SELECCIÓN DE USUARIO
   ========================================================================== */

/**
 * Renderiza la pantalla de selección de perfil.
 * 
 * Justificación DCU: 
 * - Alternativa C (04_design_alternatives.md): "Tres Experiencias, Un Sistema"
 * - Para el prototipo evaluable, el selector permite al evaluador 
 *   probar las 3 experiencias sin reiniciar la aplicación
 */
function _renderUserSelector() {
  const main = document.getElementById('main-content');
  if (!main) return;

  const profiles = getAllProfiles();

  const roleLabels = {
    patient: 'Paciente',
    caregiver: 'Cuidadora',
  };

  main.innerHTML = `
    <div class="user-selector" role="region" aria-label="Selección de perfil">
      <div class="user-selector__header">
        <h1 class="text-2xl font-bold text-center">Mnemosyne</h1>
        <p class="text-muted text-center mt-2">Selecciona tu perfil para continuar</p>
      </div>
      <div class="user-selector__cards" role="radiogroup" aria-label="Perfiles disponibles">
        ${profiles.map(p => `
          <button
            class="user-selector__card card"
            data-user-id="${p.id}"
            role="radio"
            aria-checked="false"
            aria-label="${escapeHtml(p.name)} — ${roleLabels[p.role] || p.role}"
          >
            <span class="user-selector__avatar">${p.avatar}</span>
            <span class="user-selector__name font-semibold">${escapeHtml(p.name)}</span>
            <span class="user-selector__role text-sm text-muted">${roleLabels[p.role] || p.role}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Vincular eventos
  main.querySelectorAll('.user-selector__card').forEach(card => {
    card.addEventListener('click', () => {
      const userId = card.dataset.userId;
      _selectUser(userId);
    });
  });
}

/**
 * Activa un perfil de usuario y configura toda la experiencia.
 * @param {string} userId
 */
function _selectUser(userId) {
  const profile = getUserProfile(userId);
  if (!profile) return;

  AppState.currentUserId = userId;
  console.log(`[Mnemosyne] Perfil activo: ${profile.name} (${profile.role})`);

  // Aplicar data-user al root para activar estilos CSS por experiencia
  const appEl = document.querySelector('.app');
  if (appEl) {
    appEl.setAttribute('data-user', userId);
  }

  // Aplicar configuración de accesibilidad del perfil
  _applyA11ySettings(profile);

  // Actualizar header
  _updateHeader(profile);

  // Mostrar vista por defecto
  _showView('dashboard');

  // Mostrar mensaje de bienvenida en consola (debug)
  const welcome = getUserMessage(userId, 'welcome');
  console.log(`[Mnemosyne] ${welcome}`);
}

/* ==========================================================================
   4. GESTIÓN DE VISTAS
   ========================================================================== */

/**
 * Muestra una vista y oculta las demás.
 * 
 * Trazabilidad: STD de navegación global (03_dialogue_specification.md)
 * — cada transición de estado corresponde a un cambio de vista.
 * 
 * @param {string} viewId - ID de la vista ('dashboard'|'gallery'|'viewer'|'settings')
 */
function _showView(viewId) {
  AppState.currentView = viewId;

  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('view--active');
  });

  // Mostrar la vista seleccionada
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.add('view--active');
  }

  // Actualizar navegación activa en sidebar
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('nav-item--active', item.dataset.view === viewId);
  });

  console.log(`[Mnemosyne] Vista activa: ${viewId}`);
}

/* ==========================================================================
   5. FUNCIONES DE UI AUXILIARES
   ========================================================================== */

/** Muestra estado de carga */
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

/** Muestra un error */
function _showError(message) {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="empty-state">
      <span class="empty-state__icon">⚠️</span>
      <h2 class="empty-state__title">Error de conexión</h2>
      <p class="empty-state__description">${escapeHtml(message)}</p>
      <button class="btn btn--primary" onclick="location.reload()">
        Reintentar conexión
      </button>
    </div>
  `;
}

/** Actualiza el header con los datos del perfil activo */
function _updateHeader(profile) {
  const nameEl = document.querySelector('.app-header__user-name');
  if (nameEl) nameEl.textContent = profile.name;

  const avatarEl = document.querySelector('.app-header__avatar-emoji');
  if (avatarEl) avatarEl.textContent = profile.avatar;

  // Actualizar indicador de implante
  const statusEl = document.querySelector('.app-header__implant-label');
  if (statusEl) {
    statusEl.textContent = `${IMPLANT_CONFIG.name} — Conectado`;
  }
}

/** Aplica configuración de accesibilidad del perfil */
function _applyA11ySettings(profile) {
  const root = document.documentElement;

  if (profile.a11y.largeText) {
    root.style.setProperty('--font-size-base', '1.125rem');
  }

  if (profile.a11y.reducedMotion) {
    root.classList.add('prefers-reduced-motion');
  }

  if (profile.a11y.highContrast) {
    root.classList.add('high-contrast');
  }
}

/** Utilidad: delay con Promise */
function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ==========================================================================
   6. NAVEGACIÓN SIDEBAR
   ========================================================================== */

/** Vincula eventos de la sidebar */
function _initSidebarNav() {
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      _showView(item.dataset.view);
    });
  });

  // Toggle sidebar en mobile
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
   7. ARRANQUE
   ========================================================================== */

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  _initSidebarNav();
  initApp();
});

// Exportar para acceso desde otros módulos
export { AppState, _showView as showView, _selectUser as selectUser };
