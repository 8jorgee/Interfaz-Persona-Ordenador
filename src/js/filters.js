/* ==========================================================================
   MNEMOSYNE — Search & Filter  |  filters.js
   Tag filters, category filters, date range, text search
   ========================================================================== */

import { searchMemories, sortMemories } from './memories.js';

/* --------------------------------------------------------------------------
   Filter State
   -------------------------------------------------------------------------- */
const _state = {
  query:      '',
  category:   null,   // null = all
  tags:       [],     // [] = all
  sortBy:     'date',
  sortOrder:  'desc',
  showProtected: true,
};

/* --------------------------------------------------------------------------
   State Setters (immutable updates)
   -------------------------------------------------------------------------- */

function setQuery(q) {
  _state.query = q || '';
}

function setCategory(cat) {
  _state.category = cat || null;
}

function toggleTag(tag) {
  if (_state.tags.includes(tag)) {
    _state.tags = _state.tags.filter(t => t !== tag);
  } else {
    _state.tags = [..._state.tags, tag];
  }
}

function clearTags() {
  _state.tags = [];
}

function setSort(sortBy, sortOrder = 'desc') {
  _state.sortBy    = sortBy;
  _state.sortOrder = sortOrder;
}

function resetFilters() {
  _state.query     = '';
  _state.category  = null;
  _state.tags      = [];
  _state.sortBy    = 'date';
  _state.sortOrder = 'desc';
}

function getFilterState() {
  return { ..._state, tags: [..._state.tags] };
}

/* --------------------------------------------------------------------------
   Apply Filters
   -------------------------------------------------------------------------- */

/**
 * Filter and sort a memory array using current filter state.
 * @param {Object[]} memories - User's memories (pre-scoped to user)
 * @returns {Object[]} Filtered + sorted
 */
function applyFilters(memories) {
  let result = [...memories];

  // Category
  if (_state.category) {
    result = result.filter(m => m.category === _state.category);
  }

  // Tags (AND logic — memory must have ALL selected tags)
  if (_state.tags.length > 0) {
    result = result.filter(m =>
      _state.tags.every(tag => m.tags?.includes(tag))
    );
  }

  // Text search
  if (_state.query.trim()) {
    result = searchMemories(result, _state.query);
    // searchMemories already sorts by relevance — skip default sort
    return result;
  }

  // Sort
  result = sortMemories(result, _state.sortBy, _state.sortOrder);

  return result;
}

/* --------------------------------------------------------------------------
   Derived helpers
   -------------------------------------------------------------------------- */

/**
 * Extract all unique tags from a memory array.
 * @param {Object[]} memories
 * @returns {string[]} Sorted alphabetically
 */
function getAvailableTags(memories) {
  const tagSet = new Set();
  memories.forEach(m => m.tags?.forEach(t => tagSet.add(t)));
  return [...tagSet].sort();
}

/**
 * Extract all unique categories.
 * @param {Object[]} memories
 * @returns {string[]}
 */
function getAvailableCategories(memories) {
  const catSet = new Set();
  memories.forEach(m => { if (m.category) catSet.add(m.category); });
  return [...catSet].sort();
}

/**
 * Count memories per category.
 * @param {Object[]} memories
 * @returns {Object} { [category]: count }
 */
function getCategoryCounts(memories) {
  return memories.reduce((acc, m) => {
    if (m.category) acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});
}

/**
 * True if any non-default filter is active.
 * @returns {boolean}
 */
function hasActiveFilters() {
  return (
    _state.query.trim() !== '' ||
    _state.category !== null   ||
    _state.tags.length > 0
  );
}

export {
  setQuery,
  setCategory,
  toggleTag,
  clearTags,
  setSort,
  resetFilters,
  getFilterState,
  applyFilters,
  getAvailableTags,
  getAvailableCategories,
  getCategoryCounts,
  hasActiveFilters,
};
