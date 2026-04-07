/* ==========================================================================
   MNEMOSYNE — Gallery View
   ==========================================================================
   Renderiza la galería de recuerdos en dos modos: grid de cards o 
   timeline cronológico. Conecta con el SearchController para recibir 
   resultados y con app.js para la navegación al visor.
   
   Justificación DCU:
   - Wireframe galería (04_wireframes.md): grid de cards con thumbnail, 
     título, fecha, personas y claridad
   - Timeline: Modelo mental ML §2.2 — orden temporal "como un álbum"
   - Cards por experiencia: variantes María Luisa (grandes), Carlos 
     (sobrias), Elena (compactas) → responsive.css data-user
   ========================================================================== */

import {
  formatDate, clarityDots, levelToPercent,
  wellbeingIndicator, escapeHtml
} from '../utils/helpers.js';
import { getUserProfile, getUserMessage } from '../models/userProfiles.js';

/** Callback externo: se invoca al hacer click en un recuerdo */
let _onMemorySelect = null;

/* ==========================================================================
   1. INICIALIZACIÓN
   ========================================================================== */

/**
 * Inicializa la vista de galería.
 * @param {Function} onMemorySelect - Callback(memoryId) al seleccionar un recuerdo
 */
function init(onMemorySelect) {
  _onMemorySelect = onMemorySelect;
}

/* ==========================================================================
   2. RENDERIZADO PRINCIPAL
   ========================================================================== */

/**
 * Renderiza los recuerdos según los resultados de la búsqueda.
 * Se invoca como callback del SearchController.
 * 
 * @param {Object} params
 * @param {Object[]} params.memories - Array de recuerdos
 * @param {string} params.query - Query de búsqueda activa
 * @param {string} params.viewMode - 'grid' | 'timeline'
 * @param {number} params.resultCount
 */
function render({ memories, query, viewMode, resultCount }) {
  const container = document.querySelector('.gallery-content');
  if (!container) return;

  const userId = document.querySelector('.app')?.dataset.user;

  // Estado vacío
  if (!memories || memories.length === 0) {
    container.innerHTML = _renderEmptyState(query, userId);
    return;
  }

  if (viewMode === 'timeline') {
    container.innerHTML = _renderTimeline(memories, userId);
  } else {
    container.innerHTML = _renderGrid(memories, userId);
  }

  // Vincular clicks en las cards/items
  _bindCardClicks(container);
}

/* ==========================================================================
   3. GRID DE CARDS
   ========================================================================== */

/**
 * Renderiza el grid de memory cards.
 * 
 * Justificación: Wireframe galería (04_wireframes.md)
 * - Cada card muestra: thumbnail, título, fecha, personas, claridad
 * - Indicador emocional como barra de color en el thumbnail
 */
function _renderGrid(memories, userId) {
  const profile = getUserProfile(userId);

  const cards = memories.map(m => {
    const dots = clarityDots(m.clarityLevel);
    const emotionPct = `${m.emotionalIntensity * 10}%`;
    const wb = wellbeingIndicator(m.emotionalIntensity, m.emotionalValence);
    const dateStr = formatDate(m.date, { short: true });

    // Personas (máximo 3 avatares + counter)
    const visiblePeople = m.people.slice(0, 3);
    const extraCount = m.people.length - 3;

    return `
      <article class="memory-card" data-memory-id="${m.id}"
               role="button" tabindex="0"
               aria-label="${escapeHtml(m.title)}, ${dateStr}">
        <div class="memory-card__thumbnail">
          <img src="${m.thumbnail}" alt="" loading="lazy" aria-hidden="true">
          <div class="memory-card__emotion-bar"
               style="--emotion-level: ${emotionPct}"
               title="Intensidad emocional: ${m.emotionalIntensity}/10"
               aria-hidden="true">
          </div>
          ${m.filters.attenuationApplied ? `
            <span class="memory-card__filter-badge tag tag--emotion">
              🔇 Atenuado
            </span>
          ` : ''}
          ${m.isProtected ? `
            <span class="memory-card__protected-badge" title="Recuerdo protegido"
                  aria-label="Recuerdo protegido">
              🔒
            </span>
          ` : ''}
        </div>

        <div class="memory-card__body">
          <h3 class="memory-card__title">${escapeHtml(m.title)}</h3>
          <time class="memory-card__date" datetime="${m.date}">${dateStr}</time>

          <div class="memory-card__meta">
            ${visiblePeople.length > 0 ? `
              <div class="memory-card__people"
                   aria-label="${m.people.length} persona${m.people.length > 1 ? 's' : ''}">
                ${visiblePeople.map(p => `
                  <span class="memory-card__people-avatar"
                        title="${escapeHtml(p.name)} — Claridad: ${levelToPercent(p.faceClarity)}"
                        aria-hidden="true">
                  </span>
                `).join('')}
                ${extraCount > 0 ? `
                  <span class="memory-card__people-extra text-xs text-muted">
                    +${extraCount}
                  </span>
                ` : ''}
              </div>
            ` : ''}

            <div class="memory-card__clarity"
                 title="Claridad: ${levelToPercent(m.clarityLevel)}"
                 aria-label="Nivel de claridad: ${levelToPercent(m.clarityLevel)}">
              <span class="memory-card__clarity-dots">
                ${dots.map(filled => `
                  <span class="memory-card__clarity-dot${filled ? ' memory-card__clarity-dot--filled' : ''}"></span>
                `).join('')}
              </span>
            </div>
          </div>

          ${m.notes ? `
            <p class="memory-card__notes text-xs text-muted mt-2"
               title="${escapeHtml(m.notes)}">
              📝 ${escapeHtml(m.notes.length > 60 ? m.notes.slice(0, 60) + '...' : m.notes)}
            </p>
          ` : ''}
        </div>
      </article>
    `;
  }).join('');

  return `<div class="memory-grid" role="list">${cards}</div>`;
}

/* ==========================================================================
   4. VISTA TIMELINE
   ========================================================================== */

/**
 * Renderiza la vista de timeline cronológico.
 * 
 * Justificación: 
 * - Modelo mental ML §2.2: "los recuerdos tienen un orden temporal"
 * - Escenario E-01: María Luisa busca "Navidad pasada" → timeline 
 *   permite ubicar temporalmente el recuerdo
 * - components.css: timeline, timeline__group, timeline__item
 */
function _renderTimeline(memories, userId) {
  // Agrupar por año-mes
  const groups = {};
  memories.forEach(m => {
    const d = new Date(m.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    if (!groups[key]) groups[key] = { key, label, items: [] };
    groups[key].items.push(m);
  });

  // Ordenar grupos de más reciente a más antiguo
  const sorted = Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));

  const html = sorted.map(group => `
    <div class="timeline__group">
      <h3 class="timeline__group-label">${escapeHtml(group.label)}</h3>
      <div class="timeline__items" role="list">
        ${group.items.map(m => {
          const dateStr = formatDate(m.date, { short: true });
          const wb = wellbeingIndicator(m.emotionalIntensity, m.emotionalValence);

          return `
            <div class="timeline__item" data-memory-id="${m.id}"
                 role="listitem button" tabindex="0"
                 aria-label="${escapeHtml(m.title)}, ${dateStr}">
              <div class="timeline__item-thumb"
                   style="background-image: url('${m.thumbnail}'); background-size: cover;">
              </div>
              <div class="timeline__item-info">
                <span class="timeline__item-title">${escapeHtml(m.title)}</span>
                <time class="timeline__item-date" datetime="${m.date}">${dateStr}</time>
              </div>
              <span class="timeline__item-emotion" title="${wb.label}">${wb.emoji}</span>
              ${m.filters.attenuationApplied || m.filters.clarityApplied ? `
                <span class="timeline__item-filter text-xs text-primary">⚙</span>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  return `<div class="timeline" role="feed" aria-label="Línea temporal de recuerdos">${html}</div>`;
}

/* ==========================================================================
   5. EMPTY STATE
   ========================================================================== */

/**
 * Renderiza el estado vacío (sin resultados).
 * 
 * Justificación: STD navegación — estado "sin resultados" tras búsqueda.
 * components.css: .empty-state
 * Mensajes personalizados por usuario (userProfiles.js)
 */
function _renderEmptyState(query, userId) {
  const msg = getUserMessage(userId, 'emptySearch')
    || 'No se encontraron recuerdos.';

  if (query && query.trim()) {
    return `
      <div class="empty-state" role="status" aria-live="polite">
        <span class="empty-state__icon">🔍</span>
        <h3 class="empty-state__title">Sin resultados</h3>
        <p class="empty-state__description">
          ${escapeHtml(msg)}<br>
          <small class="text-muted">Búsqueda: "${escapeHtml(query)}"</small>
        </p>
      </div>
    `;
  }

  return `
    <div class="empty-state" role="status">
      <span class="empty-state__icon">🧠</span>
      <h3 class="empty-state__title">No hay recuerdos</h3>
      <p class="empty-state__description">
        Aún no hay recuerdos almacenados en el implante.
      </p>
    </div>
  `;
}

/* ==========================================================================
   6. EVENTOS
   ========================================================================== */

/**
 * Vincula eventos de click y teclado en las cards/items.
 * Al hacer click → navegar al visor del recuerdo.
 */
function _bindCardClicks(container) {
  const interactables = container.querySelectorAll(
    '.memory-card[data-memory-id], .timeline__item[data-memory-id]'
  );

  interactables.forEach(el => {
    const handler = () => {
      const memoryId = el.dataset.memoryId;
      if (memoryId && _onMemorySelect) {
        // Animación de salida sutil
        el.style.transform = 'scale(0.97)';
        el.style.opacity = '0.7';
        setTimeout(() => _onMemorySelect(memoryId), 150);
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
   7. ACTUALIZACIÓN PARCIAL
   ========================================================================== */

/**
 * Actualiza una card específica sin re-renderizar toda la galería.
 * Se usa tras aplicar un filtro (claridad/atenuación) al volver del visor.
 * 
 * @param {Object} memory - Recuerdo actualizado
 */
function updateCard(memory) {
  const card = document.querySelector(`.memory-card[data-memory-id="${memory.id}"]`);
  if (!card) return; // Si está en timeline u otra vista, no hacer nada

  // Actualizar clarity dots
  const dotsContainer = card.querySelector('.memory-card__clarity-dots');
  if (dotsContainer) {
    const dots = clarityDots(memory.clarityLevel);
    dotsContainer.innerHTML = dots.map(f =>
      `<span class="memory-card__clarity-dot${f ? ' memory-card__clarity-dot--filled' : ''}"></span>`
    ).join('');
  }

  // Actualizar barra emocional
  const emotionBar = card.querySelector('.memory-card__emotion-bar');
  if (emotionBar) {
    emotionBar.style.setProperty('--emotion-level', `${memory.emotionalIntensity * 10}%`);
  }

  // Flash sutil para indicar que algo cambió
  card.style.transition = 'box-shadow 0.3s ease';
  card.style.boxShadow = '0 0 0 3px var(--color-primary-200)';
  setTimeout(() => {
    card.style.boxShadow = '';
  }, 800);
}

/* ==========================================================================
   8. EXPORTACIÓN
   ========================================================================== */

export { init, render, updateCard };
