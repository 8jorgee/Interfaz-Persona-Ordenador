/* ==========================================================================
   MNEMOSYNE — DataService  |  memories.js
   Loads memories.json, provides CRUD + search + undo log
   ========================================================================== */

import { getUserMemoryIds, getTherapeuticConfig } from './models/user-profiles.js';

/* --------------------------------------------------------------------------
   State
   -------------------------------------------------------------------------- */
let _allMemories    = [];  // Raw data from JSON — never mutated
let _workingCopy    = [];  // Active working set (filtered filters applied)
let _undoLog        = [];  // Array of {memoryId, field, before, after}
let _loaded         = false;

const MAX_UNDO = 50;

/* --------------------------------------------------------------------------
   Load
   -------------------------------------------------------------------------- */

/**
 * Fetch and parse memories.json.
 * Must be called once before anything else.
 * @returns {Promise<void>}
 */
async function loadMemories() {
  if (_loaded) return;
  try {
    const res = await fetch('./assets/memories.json');
    if (!res.ok) throw new Error(`HTTP ${res.status} loading memories.json`);
    const data = await res.json();
    _allMemories  = data.memories || [];
    _workingCopy  = _allMemories.map(m => ({ ...m }));  // Shallow clone
    _loaded = true;
  } catch (err) {
    console.error('[DataService] loadMemories failed:', err);
    throw err;
  }
}

/* --------------------------------------------------------------------------
   Read
   -------------------------------------------------------------------------- */

/**
 * Get all memories belonging to a user (or managed user for caregivers).
 * @param {string} userId
 * @returns {Object[]}
 */
function getMemoriesForUser(userId) {
  if (!_loaded) return [];
  const ids = getUserMemoryIds(userId);
  return _workingCopy.filter(m => ids.includes(m.id));
}

/**
 * Get single memory by id.
 * @param {string} memId
 * @returns {Object|null}
 */
function getMemoryById(memId) {
  return _workingCopy.find(m => m.id === memId) || null;
}

/**
 * Get original (unmodified) memory.
 * @param {string} memId
 * @returns {Object|null}
 */
function getOriginalMemory(memId) {
  return _allMemories.find(m => m.id === memId) || null;
}

/* --------------------------------------------------------------------------
   Update — immutable pattern, logs undo
   -------------------------------------------------------------------------- */

/**
 * Apply filter change to a memory. Logs undo entry.
 * @param {string} memId
 * @param {string} field  - 'clarityLevel' | 'attenuationLevel'
 * @param {number} value  - 0–1
 * @param {string} userId - For therapeutic limit check
 * @returns {{ success: boolean, limited?: boolean, message?: string }}
 */
function applyFilter(memId, field, value, userId) {
  const idx = _workingCopy.findIndex(m => m.id === memId);
  if (idx === -1) return { success: false, message: 'Memory not found' };

  const memory = _workingCopy[idx];

  // Therapeutic limit check (Carlos)
  if (field === 'attenuationLevel') {
    const tc = getTherapeuticConfig(userId);
    if (tc && value > tc.attenuationLimit) {
      return {
        success: false,
        limited: true,
        message: `Límite terapéutico: máximo ${Math.round(tc.attenuationLimit * 100)}%`
      };
    }
  }

  // Log undo
  _pushUndo({
    memoryId: memId,
    field,
    before: memory.filters?.[field] ?? (field === 'clarityLevel' ? memory.clarityLevel : memory.attenuationLevel),
    after: value,
  });

  // Immutable update
  _workingCopy[idx] = {
    ...memory,
    filters: {
      ...(memory.filters || {}),
      [field]: value,
    },
  };

  return { success: true };
}

/**
 * Add a note to a memory.
 * @param {string} memId
 * @param {string} noteText
 * @returns {boolean}
 */
function addNote(memId, noteText) {
  const idx = _workingCopy.findIndex(m => m.id === memId);
  if (idx === -1) return false;

  const memory = _workingCopy[idx];
  const newNote = {
    id: `note-${Date.now()}`,
    text: noteText.trim(),
    timestamp: new Date().toISOString(),
  };

  _workingCopy[idx] = {
    ...memory,
    notes: [...(memory.notes || []), newNote],
  };

  return true;
}

/* --------------------------------------------------------------------------
   Undo
   -------------------------------------------------------------------------- */

function _pushUndo(entry) {
  _undoLog.push(entry);
  if (_undoLog.length > MAX_UNDO) _undoLog.shift();
}

/**
 * Undo last filter change.
 * @returns {{ success: boolean, memoryId?: string, field?: string }}
 */
function undoLastFilter() {
  if (_undoLog.length === 0) return { success: false };

  const entry = _undoLog.pop();
  const idx = _workingCopy.findIndex(m => m.id === entry.memoryId);
  if (idx === -1) return { success: false };

  const memory = _workingCopy[idx];
  _workingCopy[idx] = {
    ...memory,
    filters: {
      ...(memory.filters || {}),
      [entry.field]: entry.before,
    },
  };

  return { success: true, memoryId: entry.memoryId, field: entry.field };
}

/**
 * Revert a memory fully to original values.
 * @param {string} memId
 * @returns {boolean}
 */
function revertMemory(memId) {
  const original = getOriginalMemory(memId);
  if (!original) return false;

  const idx = _workingCopy.findIndex(m => m.id === memId);
  if (idx === -1) return false;

  _workingCopy[idx] = {
    ...original,
    filters: {
      clarityLevel:    original.clarityLevel,
      attenuationLevel: original.attenuationLevel,
    },
  };

  // Clear undo log for this memory
  _undoLog = _undoLog.filter(e => e.memoryId !== memId);

  return true;
}

/**
 * Check if memory has pending changes vs original.
 * @param {string} memId
 * @returns {boolean}
 */
function hasChanges(memId) {
  return _undoLog.some(e => e.memoryId === memId);
}

/* --------------------------------------------------------------------------
   Search + Sort
   -------------------------------------------------------------------------- */

/**
 * Search memories using basic scoring.
 * @param {Object[]} memories - Pre-filtered to user's memories
 * @param {string}   query    - Search string
 * @returns {Object[]} Sorted by relevance (high first)
 */
function searchMemories(memories, query) {
  if (!query || !query.trim()) return memories;

  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/);

  const scored = memories.map(m => {
    let score = 0;

    // Title match (high weight)
    if (m.title.toLowerCase().includes(q)) score += 10;
    tokens.forEach(t => {
      if (m.title.toLowerCase().includes(t)) score += 3;
    });

    // Description
    if (m.description?.toLowerCase().includes(q)) score += 5;
    tokens.forEach(t => {
      if (m.description?.toLowerCase().includes(t)) score += 1;
    });

    // Location
    if (m.location?.toLowerCase().includes(q)) score += 4;

    // People
    m.people?.forEach(p => {
      if (p.name.toLowerCase().includes(q)) score += 6;
      tokens.forEach(t => {
        if (p.name.toLowerCase().includes(t)) score += 2;
      });
    });

    // Tags
    m.tags?.forEach(tag => {
      if (tag.toLowerCase().includes(q)) score += 3;
    });

    // Date match
    if (m.date?.includes(q)) score += 4;

    return { memory: m, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.memory);
}

/**
 * Sort memories by field.
 * @param {Object[]} memories
 * @param {'date'|'title'|'emotionalIntensity'|'clarityLevel'} sortBy
 * @param {'asc'|'desc'} order
 * @returns {Object[]} New sorted array
 */
function sortMemories(memories, sortBy = 'date', order = 'desc') {
  return [...memories].sort((a, b) => {
    let va, vb;

    switch (sortBy) {
      case 'date':
        va = new Date(a.date).getTime();
        vb = new Date(b.date).getTime();
        break;
      case 'title':
        va = a.title.toLowerCase();
        vb = b.title.toLowerCase();
        break;
      case 'emotionalIntensity':
        va = a.emotionalIntensity || 0;
        vb = b.emotionalIntensity || 0;
        break;
      case 'clarityLevel':
        va = a.filters?.clarityLevel ?? a.clarityLevel ?? 1;
        vb = b.filters?.clarityLevel ?? b.clarityLevel ?? 1;
        break;
      default:
        return 0;
    }

    if (va < vb) return order === 'asc' ? -1 : 1;
    if (va > vb) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/* --------------------------------------------------------------------------
   Stats (for Carlos / Elena dashboard)
   -------------------------------------------------------------------------- */

/**
 * Compute stats for a user's memory set.
 * @param {string} userId
 * @returns {Object}
 */
function getStatsForUser(userId) {
  const memories = getMemoriesForUser(userId);
  if (memories.length === 0) return { total: 0 };

  const avgIntensity = memories.reduce((sum, m) => sum + (m.emotionalIntensity || 0), 0) / memories.length;
  const avgClarity   = memories.reduce((sum, m) => sum + (m.filters?.clarityLevel ?? m.clarityLevel ?? 1), 0) / memories.length;
  const avgAtten     = memories.reduce((sum, m) => sum + (m.filters?.attenuationLevel ?? m.attenuationLevel ?? 0), 0) / memories.length;

  const categories = {};
  memories.forEach(m => {
    categories[m.category] = (categories[m.category] || 0) + 1;
  });

  const modifiedCount = memories.filter(m => hasChanges(m.id)).length;

  return {
    total:           memories.length,
    avgIntensity:    Math.round(avgIntensity * 10) / 10,
    avgClarity:      Math.round(avgClarity * 100),
    avgAttenuation:  Math.round(avgAtten * 100),
    categories,
    modifiedCount,
    protectedCount:  memories.filter(m => m.isProtected).length,
  };
}

/* --------------------------------------------------------------------------
   Export
   -------------------------------------------------------------------------- */

/**
 * Get current filter values for display on slider.
 * @param {string} memId
 * @returns {{ clarityLevel: number, attenuationLevel: number }}
 */
function getFilterValues(memId) {
  const m = getMemoryById(memId);
  if (!m) return { clarityLevel: 1, attenuationLevel: 0 };
  return {
    clarityLevel:    m.filters?.clarityLevel    ?? m.clarityLevel    ?? 1,
    attenuationLevel: m.filters?.attenuationLevel ?? m.attenuationLevel ?? 0,
  };
}

export {
  loadMemories,
  getMemoriesForUser,
  getMemoryById,
  getOriginalMemory,
  applyFilter,
  addNote,
  undoLastFilter,
  revertMemory,
  hasChanges,
  searchMemories,
  sortMemories,
  getStatsForUser,
  getFilterValues,
};
