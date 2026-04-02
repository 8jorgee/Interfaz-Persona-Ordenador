/* ==========================================================================
   MNEMOSYNE — Data Service (Motor de Datos Simulado)
   ==========================================================================
   Capa de abstracción sobre memories.json que expone una API tipo CRUD
   con búsqueda, filtrado y operaciones sobre recuerdos.
   
   Justificación DCU:
   - Operaciones de lectura → HTA-1 subtareas 1.1–1.3 (búsqueda/navegación)
   - Operaciones de escritura → HTA-1 subtarea 3 (aplicar filtros)
   - Filtrado emocional → HTA-2 subtareas 4.1–4.6 (atenuación)
   - Estadísticas → HTA-3 subtareas (dashboard Elena)
   
   Arquitectura: Módulo ES6 puro, sin dependencias externas.
   Los datos se mantienen en memoria (copia mutable del JSON original).
   ========================================================================== */

import { getUserMemoryIds, userCan, getTherapeuticConfig } from '../models/userProfiles.js';

/* ==========================================================================
   1. ESTADO INTERNO
   ========================================================================== */

let _memories = [];         // Copia mutable de la BD
let _categories = [];       // Categorías disponibles
let _people = [];           // Personas conocidas
let _isLoaded = false;      // Flag de inicialización
let _changeLog = [];        // Registro de cambios (undo/redo)

/* ==========================================================================
   2. INICIALIZACIÓN
   ========================================================================== */

/**
 * Carga la base de datos desde el JSON.
 * Simula una carga asíncrona con latencia artificial para testear 
 * los indicadores de procesamiento (neuro-aesthetic.css).
 * 
 * @param {string} [jsonPath='./data/memories.json'] - Ruta al JSON
 * @returns {Promise<{memories: number, categories: number, people: number}>}
 */
async function init(jsonPath = './data/memories.json') {
  if (_isLoaded) {
    return { memories: _memories.length, categories: _categories.length, people: _people.length };
  }

  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // Copia profunda para mantener inmutabilidad del original
    _memories = JSON.parse(JSON.stringify(data.memories || []));
    _categories = data.categories || [];
    _people = data.people || [];
    _isLoaded = true;

    // Latencia simulada (200ms) para mostrar indicador de conexión
    await _simulateLatency(200);

    console.log(`[Mnemosyne DataService] Cargados ${_memories.length} recuerdos, ${_categories.length} categorías, ${_people.length} personas.`);

    return { memories: _memories.length, categories: _categories.length, people: _people.length };
  } catch (err) {
    console.error('[Mnemosyne DataService] Error al cargar datos:', err);
    // Fallback: cargar datos embebidos mínimos para que no falle el prototipo
    _loadFallbackData();
    _isLoaded = true;
    return { memories: _memories.length, categories: _categories.length, people: _people.length };
  }
}

/* ==========================================================================
   3. LECTURA — Obtener recuerdos
   ========================================================================== */

/**
 * Obtiene todos los recuerdos accesibles para un usuario.
 * Filtra según el ownership del perfil.
 * 
 * Trazabilidad: HTA-1 subtarea 1.1 — "acceder a la galería de recuerdos"
 * 
 * @param {string} userId - ID del usuario actual
 * @param {Object} [options] - Opciones de ordenación
 * @param {string} [options.sortBy='date'] - Campo para ordenar
 * @param {string} [options.sortOrder='desc'] - 'asc' | 'desc'
 * @returns {Object[]} Array de recuerdos
 */
function getMemories(userId, options = {}) {
  _ensureLoaded();
  const { sortBy = 'date', sortOrder = 'desc' } = options;
  const allowedIds = getUserMemoryIds(userId);

  let results = _memories.filter(m => allowedIds.includes(m.id));

  // Ordenación
  results.sort((a, b) => {
    let valA, valB;
    switch (sortBy) {
      case 'date':
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
        break;
      case 'emotionalIntensity':
        valA = a.emotionalIntensity;
        valB = b.emotionalIntensity;
        break;
      case 'clarity':
        valA = a.clarityLevel;
        valB = b.clarityLevel;
        break;
      case 'lastAccessed':
        valA = new Date(a.lastAccessed).getTime();
        valB = new Date(b.lastAccessed).getTime();
        break;
      default:
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
    }
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  return results;
}

/**
 * Obtiene un recuerdo por su ID.
 * Actualiza lastAccessed (simula acceso al implante).
 * 
 * @param {string} memoryId
 * @param {string} userId - Para verificar permisos
 * @returns {Object|null}
 */
function getMemoryById(memoryId, userId) {
  _ensureLoaded();
  const allowedIds = getUserMemoryIds(userId);
  const memory = _memories.find(m => m.id === memoryId);

  if (!memory || !allowedIds.includes(memoryId)) return null;

  // Actualizar último acceso
  memory.lastAccessed = new Date().toISOString();
  return { ...memory };  // Devolver copia
}

/**
 * Obtiene recuerdos agrupados por período temporal.
 * 
 * Trazabilidad: Timeline visual (04_wireframes.md) — vista cronológica
 * Modelo mental ML §2.2: "los recuerdos tienen un orden temporal"
 * 
 * @param {string} userId
 * @returns {Object[]} Array de { period, label, memories }
 */
function getMemoriesByTimeline(userId) {
  const memories = getMemories(userId, { sortBy: 'date', sortOrder: 'desc' });
  const groups = {};

  memories.forEach(m => {
    const d = new Date(m.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });

    if (!groups[key]) {
      groups[key] = { period: key, label, memories: [] };
    }
    groups[key].memories.push(m);
  });

  // Ordenar períodos de más reciente a más antiguo
  return Object.values(groups).sort((a, b) => b.period.localeCompare(a.period));
}

/* ==========================================================================
   4. BÚSQUEDA
   ========================================================================== */

/**
 * Busca recuerdos por texto libre.
 * Busca en: título, descripción, personas, tags, lugar y notas.
 * 
 * Trazabilidad: 
 * - HTA-1 subtarea 1.2: "buscar por nombre de persona, lugar o fecha"
 * - BNF búsqueda (03_dialogue_specification.md): acepta texto libre
 * - Modelo mental ML §2.1: "buscar como en Google"
 * 
 * @param {string} userId
 * @param {string} query - Texto de búsqueda
 * @returns {Object[]} Recuerdos coincidentes, ordenados por relevancia
 */
function searchMemories(userId, query) {
  if (!query || query.trim().length === 0) {
    return getMemories(userId);
  }

  const terms = query.toLowerCase().trim().split(/\s+/);
  const memories = getMemories(userId);

  const scored = memories.map(m => {
    let score = 0;
    const searchable = _buildSearchableText(m);

    terms.forEach(term => {
      // Título (peso alto)
      if (m.title.toLowerCase().includes(term)) score += 10;

      // Personas (peso alto — búsqueda principal de María Luisa)
      const personMatch = m.people.some(p => p.name.toLowerCase().includes(term));
      if (personMatch) score += 8;

      // Lugar
      if (m.location.name.toLowerCase().includes(term)) score += 6;

      // Tags
      if (m.tags.some(t => t.toLowerCase().includes(term))) score += 5;

      // Descripción
      if (m.description.toLowerCase().includes(term)) score += 3;

      // Notas del usuario
      if (m.notes && m.notes.toLowerCase().includes(term)) score += 2;

      // Fecha (búsqueda por año o mes)
      const dateStr = new Date(m.date).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
      }).toLowerCase();
      if (dateStr.includes(term)) score += 4;
    });

    return { memory: m, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.memory);
}

/**
 * Filtra recuerdos por criterios múltiples.
 * 
 * Trazabilidad: STD de navegación (03_dialogue_specification.md)
 * — transición "Galería → Galería filtrada"
 * 
 * @param {string} userId
 * @param {Object} filters
 * @param {string} [filters.category] - ID de categoría
 * @param {string} [filters.personId] - ID de persona
 * @param {number} [filters.minEmotionalIntensity] - Intensidad mínima (1-10)
 * @param {number} [filters.maxEmotionalIntensity] - Intensidad máxima (1-10)
 * @param {string} [filters.emotionalValence] - 'positive'|'negative'|'mixed'|'neutral'
 * @param {string} [filters.dateFrom] - Fecha ISO inicio
 * @param {string} [filters.dateTo] - Fecha ISO fin
 * @param {boolean} [filters.hasAttenuation] - Solo recuerdos con atenuación
 * @param {boolean} [filters.isProtected] - Solo recuerdos protegidos
 * @returns {Object[]}
 */
function filterMemories(userId, filters = {}) {
  let results = getMemories(userId);

  if (filters.category) {
    results = results.filter(m => m.category === filters.category);
  }

  if (filters.personId) {
    results = results.filter(m => m.people.some(p => p.id === filters.personId));
  }

  if (filters.minEmotionalIntensity != null) {
    results = results.filter(m => m.emotionalIntensity >= filters.minEmotionalIntensity);
  }

  if (filters.maxEmotionalIntensity != null) {
    results = results.filter(m => m.emotionalIntensity <= filters.maxEmotionalIntensity);
  }

  if (filters.emotionalValence) {
    results = results.filter(m => m.emotionalValence === filters.emotionalValence);
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

  if (filters.isProtected === true) {
    results = results.filter(m => m.isProtected === true);
  }

  return results;
}

/* ==========================================================================
   5. ESCRITURA — Modificar recuerdos (filtros)
   ========================================================================== */

/**
 * Aplica o modifica el nivel de claridad facial de un recuerdo.
 * 
 * Trazabilidad: HTA-1 subtarea 3: "ajustar el slider de claridad"
 * Diálogo D-01: "¿Guardar la claridad al X%?"
 * 
 * @param {string} memoryId
 * @param {string} userId
 * @param {number} newLevel - Nuevo nivel (0.0 a 1.0)
 * @returns {{success: boolean, memory?: Object, error?: string}}
 */
function updateClarityLevel(memoryId, userId, newLevel) {
  _ensureLoaded();

  if (!userCan(userId, 'canFilterClarity')) {
    return { success: false, error: 'NO_PERMISSION' };
  }

  const memory = _memories.find(m => m.id === memoryId);
  if (!memory || !getUserMemoryIds(userId).includes(memoryId)) {
    return { success: false, error: 'NOT_FOUND' };
  }

  const clampedLevel = Math.max(0, Math.min(1, newLevel));

  // Registrar cambio para undo
  _logChange({
    type: 'clarity',
    memoryId,
    previousValue: memory.clarityLevel,
    newValue: clampedLevel,
    timestamp: new Date().toISOString(),
    userId,
  });

  // Aplicar cambio
  memory.clarityLevel = clampedLevel;
  memory.filters.clarityApplied = true;
  memory.filters.lastModified = new Date().toISOString();

  // Actualizar claridad facial de las personas proporcionalmente
  // (simulación: al subir claridad general, mejora la de cada persona)
  memory.people.forEach(p => {
    const boost = (clampedLevel - 0.5) * 0.3;
    p.faceClarity = Math.max(0, Math.min(1, p.faceClarity + boost));
  });

  return { success: true, memory: { ...memory } };
}

/**
 * Aplica o modifica el nivel de atenuación emocional.
 * Incluye verificación del límite terapéutico.
 * 
 * Trazabilidad:
 * - HTA-2 subtarea 4.3: "ajustar el slider de atenuación"
 * - HTA-2 punto crítico 4.6: límite del terapeuta
 * - Diálogo D-02: "¿Guardar la atenuación al X%?"
 * - Diálogo D-04: "Has llegado al límite de atenuación"
 * 
 * @param {string} memoryId
 * @param {string} userId
 * @param {number} newLevel - Nuevo nivel (0.0 a 1.0)
 * @returns {{success: boolean, memory?: Object, limitReached?: boolean, error?: string}}
 */
function updateAttenuationLevel(memoryId, userId, newLevel) {
  _ensureLoaded();

  if (!userCan(userId, 'canFilterAttenuation')) {
    return { success: false, error: 'NO_PERMISSION' };
  }

  const memory = _memories.find(m => m.id === memoryId);
  if (!memory || !getUserMemoryIds(userId).includes(memoryId)) {
    return { success: false, error: 'NOT_FOUND' };
  }

  let clampedLevel = Math.max(0, Math.min(1, newLevel));
  let limitReached = false;

  // Verificar límite terapéutico (HTA-2 punto crítico 4.6)
  const therapeutic = getTherapeuticConfig(userId);
  if (therapeutic && clampedLevel > therapeutic.attenuationLimit) {
    clampedLevel = therapeutic.attenuationLimit;
    limitReached = true;
  }

  // Registrar cambio para undo
  _logChange({
    type: 'attenuation',
    memoryId,
    previousValue: memory.attenuationLevel,
    newValue: clampedLevel,
    timestamp: new Date().toISOString(),
    userId,
  });

  // Aplicar cambio
  memory.attenuationLevel = clampedLevel;
  memory.filters.attenuationApplied = clampedLevel > 0;
  memory.filters.lastModified = new Date().toISOString();

  // Actualizar datos terapéuticos del recuerdo
  if (memory.therapeuticMeta) {
    memory.therapeuticMeta.lastSessionDate = new Date().toISOString();
  }

  return { success: true, memory: { ...memory }, limitReached };
}

/**
 * Actualiza las notas del usuario sobre un recuerdo.
 * 
 * @param {string} memoryId
 * @param {string} userId
 * @param {string} notes - Texto de las notas
 * @returns {{success: boolean, error?: string}}
 */
function updateMemoryNotes(memoryId, userId, notes) {
  _ensureLoaded();

  if (!userCan(userId, 'canAddNotes')) {
    return { success: false, error: 'NO_PERMISSION' };
  }

  const memory = _memories.find(m => m.id === memoryId);
  if (!memory || !getUserMemoryIds(userId).includes(memoryId)) {
    return { success: false, error: 'NOT_FOUND' };
  }

  memory.notes = notes;
  return { success: true };
}

/* ==========================================================================
   6. UNDO — Deshacer cambios
   ========================================================================== */

/**
 * Deshace el último cambio realizado por el usuario.
 * 
 * Justificación: Principio ético de reversibilidad 
 * (01_project_charter.md §7.2). Principio de diseño de diálogos §5.2.2:
 * "acción reversible siempre visible"
 * 
 * @param {string} userId
 * @returns {{success: boolean, change?: Object, error?: string}}
 */
function undoLastChange(userId) {
  const userChanges = _changeLog.filter(c => c.userId === userId);
  if (userChanges.length === 0) {
    return { success: false, error: 'NO_CHANGES' };
  }

  const lastChange = userChanges[userChanges.length - 1];
  const memory = _memories.find(m => m.id === lastChange.memoryId);
  if (!memory) {
    return { success: false, error: 'MEMORY_NOT_FOUND' };
  }

  // Revertir según tipo
  switch (lastChange.type) {
    case 'clarity':
      memory.clarityLevel = lastChange.previousValue;
      memory.filters.clarityApplied = lastChange.previousValue !== memory.clarityLevel;
      break;
    case 'attenuation':
      memory.attenuationLevel = lastChange.previousValue;
      memory.filters.attenuationApplied = lastChange.previousValue > 0;
      break;
  }

  memory.filters.lastModified = new Date().toISOString();

  // Eliminar del log
  const idx = _changeLog.indexOf(lastChange);
  if (idx > -1) _changeLog.splice(idx, 1);

  return { success: true, change: lastChange };
}

/**
 * Indica si hay cambios que deshacer.
 * @param {string} userId
 * @returns {boolean}
 */
function canUndo(userId) {
  return _changeLog.some(c => c.userId === userId);
}

/* ==========================================================================
   7. ESTADÍSTICAS — Dashboard de Elena
   ========================================================================== */

/**
 * Obtiene estadísticas del uso del sistema para el dashboard de Elena.
 * 
 * Trazabilidad: HTA-3 — tareas de monitorización (Elena)
 * Wireframe dashboard Elena (04_wireframes.md)
 * 
 * @param {string} managedUserId - ID del usuario gestionado
 * @returns {Object} Estadísticas agregadas
 */
function getStats(managedUserId) {
  _ensureLoaded();
  const memoryIds = getUserMemoryIds(managedUserId);
  const memories = _memories.filter(m => memoryIds.includes(m.id));

  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  // Recuerdos accedidos esta semana
  const accessedThisWeek = memories.filter(m =>
    new Date(m.lastAccessed) >= weekAgo
  );

  // Filtros aplicados
  const withClarity = memories.filter(m => m.filters.clarityApplied);
  const withAttenuation = memories.filter(m => m.filters.attenuationApplied);

  // Distribución emocional
  const emotionDist = { positive: 0, negative: 0, mixed: 0, neutral: 0 };
  memories.forEach(m => { emotionDist[m.emotionalValence]++; });

  // Claridad promedio
  const avgClarity = memories.length > 0
    ? memories.reduce((sum, m) => sum + m.clarityLevel, 0) / memories.length
    : 0;

  // Recuerdos protegidos
  const protectedCount = memories.filter(m => m.isProtected).length;

  // Actividad reciente (últimos 5 recuerdos accedidos)
  const recentActivity = [...memories]
    .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
    .slice(0, 5)
    .map(m => ({
      id: m.id,
      title: m.title,
      lastAccessed: m.lastAccessed,
      action: m.filters.lastModified
        ? (m.filters.attenuationApplied ? 'attenuation' : 'clarity')
        : 'view',
    }));

  return {
    totalMemories: memories.length,
    accessedThisWeek: accessedThisWeek.length,
    filtersApplied: {
      clarity: withClarity.length,
      attenuation: withAttenuation.length,
      total: withClarity.length + withAttenuation.length,
    },
    emotionalDistribution: emotionDist,
    averageClarity: Math.round(avgClarity * 100) / 100,
    protectedMemories: protectedCount,
    recentActivity,
    changeLogSize: _changeLog.length,
  };
}

/* ==========================================================================
   8. CATÁLOGOS
   ========================================================================== */

/** @returns {Object[]} Lista de categorías disponibles */
function getCategories() {
  _ensureLoaded();
  return [..._categories];
}

/** @returns {Object[]} Lista de personas conocidas */
function getPeople(userId) {
  _ensureLoaded();
  // Filtrar personas por owner del usuario o compartidas
  return _people.filter(p =>
    p.owner === userId || p.owner === 'shared'
  );
}

/* ==========================================================================
   9. FUNCIONES INTERNAS
   ========================================================================== */

/** Verifica que la BD está cargada */
function _ensureLoaded() {
  if (!_isLoaded) {
    throw new Error('[DataService] Base de datos no inicializada. Llama a init() primero.');
  }
}

/** Construye texto buscable de un recuerdo */
function _buildSearchableText(m) {
  return [
    m.title,
    m.description,
    m.location.name,
    ...m.tags,
    ...m.people.map(p => `${p.name} ${p.relationship}`),
    m.notes || '',
  ].join(' ').toLowerCase();
}

/** Registra un cambio para undo */
function _logChange(change) {
  _changeLog.push(change);
  // Mantener máximo 50 cambios en el log
  if (_changeLog.length > 50) {
    _changeLog.shift();
  }
}

/** Simula latencia de red/implante */
function _simulateLatency(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Datos de fallback si falla la carga del JSON */
function _loadFallbackData() {
  _memories = [{
    id: 'mem-fallback',
    title: 'Recuerdo de prueba',
    description: 'Este es un recuerdo de respaldo porque la base de datos no pudo cargarse.',
    date: new Date().toISOString(),
    location: { name: 'Desconocido', coordinates: { lat: 0, lng: 0 } },
    people: [],
    tags: ['prueba'],
    emotionalIntensity: 1,
    emotionalValence: 'neutral',
    clarityLevel: 1,
    attenuationLevel: 0,
    thumbnail: '',
    duration: 0,
    category: 'daily',
    isProtected: false,
    lastAccessed: new Date().toISOString(),
    filters: { clarityApplied: false, attenuationApplied: false, lastModified: null },
    notes: '',
  }];
  _categories = [{ id: 'daily', label: 'Cotidiano', icon: '☀️', color: '#27A854' }];
  _people = [];
  console.warn('[DataService] Cargados datos de fallback.');
}

/* ==========================================================================
   10. EXPORTACIÓN
   ========================================================================== */

export {
  init,
  getMemories,
  getMemoryById,
  getMemoriesByTimeline,
  searchMemories,
  filterMemories,
  updateClarityLevel,
  updateAttenuationLevel,
  updateMemoryNotes,
  undoLastChange,
  canUndo,
  getStats,
  getCategories,
  getPeople,
};
