/* ==========================================================================
   MNEMOSYNE — Dashboard View (Elena — Cuidadora)
   ==========================================================================
   Renderiza el panel de monitorización del paciente gestionado.
   Muestra estadísticas de uso, actividad reciente, distribución emocional
   y estado de los filtros aplicados.
   
   Justificación DCU:
   - Wireframe dashboard Elena (04_wireframes.md)
   - HTA-3: tareas de monitorización y configuración
   - Escenario E-03: "Elena quiere ver cómo usa el implante su madre"
   - Persona Elena (02_personas.md): perfil digital competente, 
     necesita información densa y accionable
   ========================================================================== */

import * as DataService from '../services/dataService.js';
import { getUserProfile, IMPLANT_CONFIG } from '../models/userProfiles.js';
import {
  formatDate, levelToPercent, formatDuration,
  wellbeingIndicator, escapeHtml
} from '../utils/helpers.js';

/** Callback: al hacer click en un recuerdo desde el dashboard */
let _onMemorySelect = null;

/* ==========================================================================
   1. INICIALIZACIÓN
   ========================================================================== */

/**
 * Inicializa el dashboard.
 * @param {Function} onMemorySelect - Callback(memoryId)
 */
function init(onMemorySelect) {
  _onMemorySelect = onMemorySelect;
}

/* ==========================================================================
   2. RENDERIZADO PRINCIPAL
   ========================================================================== */

/**
 * Renderiza el dashboard completo para un usuario cuidador.
 * 
 * @param {string} caregiverId - ID de Elena
 */
function render(caregiverId) {
  const container = document.querySelector('.dashboard-content');
  if (!container) return;

  const profile = getUserProfile(caregiverId);
  if (!profile || profile.role !== 'caregiver') {
    container.innerHTML = _renderNotAuthorized();
    return;
  }

  const managedUserId = profile.managedUser;
  const managedProfile = getUserProfile(managedUserId);
  const stats = DataService.getStats(managedUserId);

  container.innerHTML = `
    ${_renderHeader(managedProfile)}
    <div class="dashboard-grid">
      ${_renderStatCards(stats)}
      ${_renderImplantStatus()}
      ${_renderEmotionalChart(stats)}
      ${_renderRecentActivity(stats)}
      ${_renderFilterSummary(stats, managedUserId)}
    </div>
  `;

  // Vincular clicks en actividad reciente
  _bindActivityClicks(container);
}

/* ==========================================================================
   3. CABECERA DEL DASHBOARD
   ========================================================================== */

function _renderHeader(managedProfile) {
  if (!managedProfile) return '';

  return `
    <div class="dashboard-header flex items-center justify-between mb-8">
      <div>
        <h2 class="section-header__title">
          Panel de ${escapeHtml(managedProfile.name)}
        </h2>
        <p class="section-header__subtitle">
          Monitorización del implante ${IMPLANT_CONFIG.name}
        </p>
      </div>
      <div class="implant-connection">
        <span class="implant-connection__dot"></span>
        <span class="implant-connection__label">
          ${IMPLANT_CONFIG.name} v${IMPLANT_CONFIG.version} — Conectado
        </span>
      </div>
    </div>
  `;
}

/* ==========================================================================
   4. TARJETAS DE ESTADÍSTICAS
   ========================================================================== */

/**
 * Renderiza las stat cards principales.
 * 
 * Justificación: HTA-3 subtarea 1 — "ver resumen de actividad"
 */
function _renderStatCards(stats) {
  const cards = [
    {
      label: 'Recuerdos almacenados',
      value: stats.totalMemories,
      icon: '🧠',
      detail: `${stats.protectedMemories} protegido${stats.protectedMemories !== 1 ? 's' : ''}`,
    },
    {
      label: 'Accedidos esta semana',
      value: stats.accessedThisWeek,
      icon: '📅',
      trend: stats.accessedThisWeek > 3 ? 'up' : null,
      detail: stats.accessedThisWeek > 3 ? 'Uso frecuente' : 'Uso normal',
    },
    {
      label: 'Filtros aplicados',
      value: stats.filtersApplied.total,
      icon: '⚙️',
      detail: `${stats.filtersApplied.clarity} claridad · ${stats.filtersApplied.attenuation} atenuación`,
    },
    {
      label: 'Claridad promedio',
      value: levelToPercent(stats.averageClarity),
      icon: '🔍',
      detail: stats.averageClarity >= 0.7 ? 'Buen nivel' : 'Puede mejorar',
      trend: stats.averageClarity >= 0.7 ? 'up' : 'down',
    },
  ];

  return cards.map(c => `
    <div class="stat-card">
      <span class="stat-card__label">${c.icon} ${escapeHtml(c.label)}</span>
      <span class="stat-card__value">${c.value}</span>
      <span class="stat-card__trend ${c.trend ? `stat-card__trend--${c.trend}` : ''}">
        ${c.trend === 'up' ? '↑' : c.trend === 'down' ? '↓' : ''}
        ${escapeHtml(c.detail)}
      </span>
    </div>
  `).join('');
}

/* ==========================================================================
   5. ESTADO DEL IMPLANTE
   ========================================================================== */

/**
 * Renderiza la tarjeta de estado del implante.
 * 
 * Justificación: Gap analysis §4.1 — Elena necesita confirmar que 
 * el implante funciona correctamente para su madre.
 */
function _renderImplantStatus() {
  const signal = Math.round(IMPLANT_CONFIG.signalStrength * 100);
  const battery = Math.round(IMPLANT_CONFIG.batteryLevel * 100);
  const storage = Math.round(IMPLANT_CONFIG.storageUsed * 100);
  const lastSync = formatDate(IMPLANT_CONFIG.lastSync, { relative: true });

  return `
    <div class="stat-card dashboard-grid__wide">
      <span class="stat-card__label">📡 Estado del implante</span>
      <div class="implant-stats flex gap-8 mt-4">
        <div class="implant-stat">
          <span class="text-xs text-muted">Señal</span>
          <div class="implant-stat__bar">
            <div class="implant-stat__fill" style="width: ${signal}%;
                 background-color: ${signal > 80 ? 'var(--color-secondary-500)' : 'var(--color-warning)'}">
            </div>
          </div>
          <span class="text-sm font-medium">${signal}%</span>
        </div>
        <div class="implant-stat">
          <span class="text-xs text-muted">Batería</span>
          <div class="implant-stat__bar">
            <div class="implant-stat__fill" style="width: ${battery}%;
                 background-color: ${battery > 30 ? 'var(--color-secondary-500)' : 'var(--color-error)'}">
            </div>
          </div>
          <span class="text-sm font-medium">${battery}%</span>
        </div>
        <div class="implant-stat">
          <span class="text-xs text-muted">Almacenamiento</span>
          <div class="implant-stat__bar">
            <div class="implant-stat__fill" style="width: ${storage}%;
                 background-color: var(--color-primary-400)">
            </div>
          </div>
          <span class="text-sm font-medium">${storage}% usado</span>
        </div>
        <div class="implant-stat">
          <span class="text-xs text-muted">Última sincronización</span>
          <span class="text-sm font-medium mt-2">${lastSync}</span>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   6. DISTRIBUCIÓN EMOCIONAL
   ========================================================================== */

/**
 * Renderiza el gráfico de distribución emocional (barras horizontales).
 * 
 * Justificación: HTA-3 — Elena monitoriza el balance emocional 
 * de los recuerdos de su madre.
 */
function _renderEmotionalChart(stats) {
  const dist = stats.emotionalDistribution;
  const total = Object.values(dist).reduce((s, v) => s + v, 0) || 1;

  const bars = [
    { key: 'positive', label: '😊 Positivos',  color: 'var(--color-emotion-calm)', count: dist.positive },
    { key: 'mixed',    label: '😐 Mixtos',     color: 'var(--color-emotion-neutral)', count: dist.mixed },
    { key: 'negative', label: '😟 Negativos',  color: 'var(--color-emotion-intense)', count: dist.negative },
    { key: 'neutral',  label: '😶 Neutros',    color: 'var(--color-neutral-400)', count: dist.neutral },
  ];

  return `
    <div class="stat-card">
      <span class="stat-card__label">📊 Distribución emocional</span>
      <div class="emotion-chart flex-col gap-3 mt-4">
        ${bars.map(b => {
          const pct = Math.round((b.count / total) * 100);
          return `
            <div class="emotion-chart__row">
              <span class="emotion-chart__label text-sm">${b.label}</span>
              <div class="emotion-chart__bar-bg">
                <div class="emotion-chart__bar-fill"
                     style="width: ${pct}%; background-color: ${b.color}">
                </div>
              </div>
              <span class="emotion-chart__value text-xs font-medium">${b.count} (${pct}%)</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* ==========================================================================
   7. ACTIVIDAD RECIENTE
   ========================================================================== */

/**
 * Renderiza la tabla de actividad reciente.
 * 
 * Justificación: Escenario E-03 — Elena quiere ver qué recuerdos 
 * ha accedido su madre recientemente y qué filtros ha usado.
 */
function _renderRecentActivity(stats) {
  if (!stats.recentActivity || stats.recentActivity.length === 0) {
    return `
      <div class="stat-card dashboard-grid__wide">
        <span class="stat-card__label">📋 Actividad reciente</span>
        <p class="text-muted text-sm mt-4">No hay actividad registrada.</p>
      </div>
    `;
  }

  const actionLabels = {
    view: '👁 Visualizado',
    clarity: '🔍 Claridad ajustada',
    attenuation: '🔇 Atenuación aplicada',
  };

  const rows = stats.recentActivity.map(a => `
    <tr class="activity-log__row" data-memory-id="${a.id}"
        role="button" tabindex="0" style="cursor: pointer">
      <td>${escapeHtml(a.title)}</td>
      <td>${actionLabels[a.action] || a.action}</td>
      <td>${formatDate(a.lastAccessed, { relative: true })}</td>
    </tr>
  `).join('');

  return `
    <div class="stat-card dashboard-grid__wide">
      <span class="stat-card__label">📋 Actividad reciente</span>
      <table class="activity-log mt-4" role="grid">
        <thead>
          <tr>
            <th scope="col">Recuerdo</th>
            <th scope="col">Acción</th>
            <th scope="col">Cuándo</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/* ==========================================================================
   8. RESUMEN DE FILTROS
   ========================================================================== */

/**
 * Renderiza un resumen de los recuerdos con filtros activos.
 * 
 * Justificación: Principio ético de transparencia — Elena puede ver 
 * exactamente qué filtros están aplicados en cada recuerdo.
 */
function _renderFilterSummary(stats, managedUserId) {
  const memories = DataService.getMemories(managedUserId);
  const filtered = memories.filter(m =>
    m.filters.clarityApplied || m.filters.attenuationApplied
  );

  if (filtered.length === 0) {
    return `
      <div class="stat-card">
        <span class="stat-card__label">🔧 Filtros activos</span>
        <p class="text-muted text-sm mt-4">Ningún filtro aplicado.</p>
      </div>
    `;
  }

  const items = filtered.map(m => {
    const filters = [];
    if (m.filters.clarityApplied) {
      filters.push(`🔍 Claridad: ${levelToPercent(m.clarityLevel)}`);
    }
    if (m.filters.attenuationApplied) {
      filters.push(`🔇 Atenuación: ${levelToPercent(m.attenuationLevel)}`);
    }
    const modified = m.filters.lastModified
      ? formatDate(m.filters.lastModified, { relative: true })
      : '';

    return `
      <div class="filter-summary__item flex items-center justify-between py-2 border-b"
           data-memory-id="${m.id}" role="button" tabindex="0" style="cursor: pointer">
        <div>
          <span class="text-sm font-medium">${escapeHtml(m.title)}</span>
          <span class="text-xs text-muted ml-auto">${modified}</span>
        </div>
        <div class="flex gap-2">
          ${filters.map(f => `<span class="tag tag--emotion text-xs">${f}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="stat-card dashboard-grid__wide">
      <span class="stat-card__label">🔧 Filtros activos (${filtered.length} recuerdo${filtered.length > 1 ? 's' : ''})</span>
      <div class="filter-summary mt-4">
        ${items}
      </div>
      <div class="safety-message mt-4">
        <span class="safety-message__icon">🔒</span>
        Los recuerdos originales se conservan siempre.
      </div>
    </div>
  `;
}

/* ==========================================================================
   9. ESTADO NO AUTORIZADO
   ========================================================================== */

function _renderNotAuthorized() {
  return `
    <div class="empty-state">
      <span class="empty-state__icon">🔐</span>
      <h3 class="empty-state__title">Acceso restringido</h3>
      <p class="empty-state__description">
        El panel de monitorización solo está disponible para el perfil de cuidadora.
      </p>
    </div>
  `;
}

/* ==========================================================================
   10. EVENTOS
   ========================================================================== */

function _bindActivityClicks(container) {
  const clickables = container.querySelectorAll(
    '.activity-log__row[data-memory-id], .filter-summary__item[data-memory-id]'
  );

  clickables.forEach(el => {
    const handler = () => {
      const memoryId = el.dataset.memoryId;
      if (memoryId && _onMemorySelect) {
        _onMemorySelect(memoryId);
      }
    };

    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
}

/* ==========================================================================
   11. EXPORTACIÓN
   ========================================================================== */

export { init, render };
