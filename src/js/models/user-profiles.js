/* ==========================================================================
   MNEMOSYNE — Perfiles de Usuario (Tres Experiencias, Un Sistema)
   ==========================================================================
   Justificación DCU:
   - Alternativa C seleccionada (04_design_alternatives.md): cada persona 
     tiene su propia experiencia de interfaz
   - Personas (02_personas.md): María Luisa, Carlos, Elena
   - Configuración basada en requisitos RF/RNF (02_research_findings.md)
   ========================================================================== */

/**
 * Perfiles de usuario del sistema Mnemosyne.
 * Cada perfil configura la experiencia visual, los filtros disponibles,
 * los límites de interacción y las preferencias de accesibilidad.
 *
 * Trazabilidad:
 * - Campos de cada perfil → Persona correspondiente (02_personas.md)
 * - Capabilities → HTA específico de la persona (03_task_analysis.md)
 * - A11y settings → RNF-03 a RNF-05 (02_research_findings.md)
 */
const USER_PROFILES = {
  /* -------------------------------------------------------------------
     MARÍA LUISA — Persona primaria
     02_personas.md: 72 años, Alzheimer leve, nivel tecnológico bajo
     Objetivo vital: "Quiero reconocer las caras de mis nietos"
     ------------------------------------------------------------------- */
  'maria-luisa': {
    id: 'maria-luisa',
    name: 'María Luisa',
    fullName: 'María Luisa Fernández García',
    age: 72,
    role: 'patient',
    avatar: '👵',

    // Recuerdos que le pertenecen (filtrados desde memories.json)
    memoryOwnership: ['mem-001','mem-002','mem-003','mem-004','mem-005',
                      'mem-010','mem-011','mem-012'],

    // Capacidades habilitadas (derivadas del HTA-1)
    capabilities: {
      canSearch: true,          // HTA-1 subtarea 1.2
      canBrowseTimeline: true,  // Escenario E-01
      canFilterClarity: true,   // HTA-1 subtarea 3 (tarea principal)
      canFilterAttenuation: false, // NO — solo Carlos con supervisión
      canViewStats: false,      // NO — complejidad innecesaria
      canConfigureLimits: false,// NO — lo hace Elena
      canExport: false,
      canAddNotes: true,        // Notas simples sobre recuerdos
    },

    // Configuración visual (→ tokens.css data-user="maria-luisa")
    ui: {
      theme: 'warm',
      fontSize: 'large',       // --font-size-base: 1.125rem (20px)
      touchTargets: 'extra',   // --touch-target-safe: 64px
      sidebarWidth: 320,       // sidebar más ancha
      headerHeight: 88,        // header más alto
      animationLevel: 'subtle',// animaciones suaves, no llamativas
      maxCardsPerRow: 2,       // galería con cards grandes
      lineHeight: 'relaxed',   // --line-height-relaxed: 1.75
    },

    // Accesibilidad específica
    a11y: {
      highContrast: false,
      largeText: true,
      reducedMotion: false,    // Las animaciones suaves ayudan al feedback
      screenReaderOptimized: false,
      simplifiedLanguage: true,// Textos sin jerga técnica
      confirmActions: true,    // Diálogo D-01 siempre activo
    },

    // Mensajes personalizados (lenguaje natural, sin jerga)
    messages: {
      welcome: '¡Hola, María Luisa! ¿Qué recuerdo te gustaría ver hoy?',
      searchPlaceholder: 'Buscar por nombre, lugar o fecha...',
      emptySearch: 'No hemos encontrado ese recuerdo. ¿Quieres buscar de otra forma?',
      filterSaved: '¡Listo! El cambio se ha guardado. Puedes deshacerlo cuando quieras.',
      safetyMessage: '🔒 Tranquila, el recuerdo original siempre se conserva.',
    },
  },

  /* -------------------------------------------------------------------
     CARLOS — Persona secundaria
     02_personas.md: 38 años, TEPT, programador
     Objetivo vital: "Necesito poder dormir sin que el recuerdo me despierte"
     ------------------------------------------------------------------- */
  'carlos': {
    id: 'carlos',
    name: 'Carlos',
    fullName: 'Carlos Ramírez Torres',
    age: 38,
    role: 'patient',
    avatar: '👨‍💻',

    memoryOwnership: ['mem-006','mem-007','mem-008','mem-009',
                      'mem-013','mem-014','mem-015'],

    // Capacidades (derivadas del HTA-2)
    capabilities: {
      canSearch: true,
      canBrowseTimeline: true,
      canFilterClarity: true,
      canFilterAttenuation: true,  // HTA-2 — tarea principal de Carlos
      canViewStats: true,          // Puede ver su progreso
      canConfigureLimits: false,   // Límites los pone la Dra. Vega
      canExport: true,             // Puede exportar datos de sesión
      canAddNotes: true,
    },

    ui: {
      theme: 'neutral',
      fontSize: 'normal',
      touchTargets: 'standard',
      sidebarWidth: 280,
      headerHeight: 72,
      animationLevel: 'minimal',  // Mínimas distracciones
      maxCardsPerRow: 3,
      lineHeight: 'normal',
    },

    a11y: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReaderOptimized: false,
      simplifiedLanguage: false,  // Carlos tiene perfil técnico
      confirmActions: true,
    },

    // Configuración terapéutica
    therapeutic: {
      therapistId: 'therapist-01',
      therapistName: 'Dra. Vega',
      attenuationLimit: 0.75,      // HTA-2 punto crítico 4.6
      sessionDurationMax: 1800,    // 30 minutos máximo por sesión
      cooldownBetweenSessions: 86400, // 24h entre sesiones
      wellbeingCheckInterval: 30,  // Preguntar cada 30s de inactividad (D-05)
      emergencyExitAlways: true,   // Botón de salida siempre visible
    },

    messages: {
      welcome: 'Hola, Carlos. ¿Quieres continuar con una sesión o explorar tus recuerdos?',
      searchPlaceholder: 'Buscar recuerdos...',
      emptySearch: 'Sin resultados para esta búsqueda.',
      filterSaved: 'Cambio guardado. Puedes revertirlo en cualquier momento.',
      safetyMessage: '🔒 El original se conserva siempre.',
      sessionStart: 'Comenzando sesión de atenuación. Puedes parar en cualquier momento.',
      sessionEnd: 'Sesión finalizada. Resumen disponible.',
      wellbeingCheck: '¿Todo bien? Llevas un rato sin interactuar.',
      limitReached: 'Has alcanzado el límite configurado por la Dra. Vega.',
    },
  },

  /* -------------------------------------------------------------------
     ELENA — Persona terciaria (cuidadora)
     02_personas.md: 49 años, cuidadora de María Luisa, competente digital
     Objetivo: "Quiero asegurarme de que mamá usa bien el implante"
     ------------------------------------------------------------------- */
  'elena': {
    id: 'elena',
    name: 'Elena',
    fullName: 'Elena Fernández López',
    age: 49,
    role: 'caregiver',
    avatar: '👩‍⚕️',

    // Elena gestiona los recuerdos de María Luisa
    managedUser: 'maria-luisa',
    memoryOwnership: [],  // No tiene recuerdos propios en el sistema

    // Capacidades (derivadas del HTA-3)
    capabilities: {
      canSearch: true,
      canBrowseTimeline: true,
      canFilterClarity: true,    // Puede aplicar filtros para su madre
      canFilterAttenuation: true,// Puede aplicar atenuación con supervisión
      canViewStats: true,        // Dashboard de monitorización
      canConfigureLimits: true,  // HTA-3: configurar límites
      canExport: true,           // Exportar informes
      canAddNotes: true,
    },

    ui: {
      theme: 'functional',
      fontSize: 'compact',       // Puede manejar texto más pequeño
      touchTargets: 'standard',
      sidebarWidth: 240,         // Sidebar estrecha → más espacio para datos
      headerHeight: 72,
      animationLevel: 'minimal',
      maxCardsPerRow: 4,         // Grid denso
      lineHeight: 'normal',
    },

    a11y: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReaderOptimized: false,
      simplifiedLanguage: false,
      confirmActions: true,
    },

    messages: {
      welcome: 'Hola, Elena. Panel de gestión de María Luisa.',
      searchPlaceholder: 'Buscar en los recuerdos de María Luisa...',
      emptySearch: 'No se encontraron recuerdos con esos criterios.',
      filterSaved: 'Filtro aplicado correctamente.',
      safetyMessage: '🔒 Los recuerdos originales se conservan siempre.',
    },
  },
};

/* ==========================================================================
   CONFIGURACIÓN DEL IMPLANTE (global)
   ========================================================================== */

const IMPLANT_CONFIG = {
  name: 'NeuroLink V4',
  version: '4.2.1',
  status: 'connected',       // connected | syncing | disconnected
  signalStrength: 0.95,      // 0-1
  batteryLevel: 0.82,
  lastSync: '2026-02-24T08:00:00',
  storageUsed: 0.34,         // 34% del almacenamiento usado
  totalMemories: 15,
  filtersApplied: 6,
};

/* ==========================================================================
   FUNCIONES DE ACCESO A PERFILES
   ========================================================================== */

/**
 * Obtiene el perfil completo de un usuario.
 * @param {string} userId - ID del usuario ('maria-luisa' | 'carlos' | 'elena')
 * @returns {Object|null} Perfil del usuario o null si no existe
 */
function getUserProfile(userId) {
  return USER_PROFILES[userId] || null;
}

/**
 * Verifica si un usuario tiene una capacidad específica.
 * @param {string} userId
 * @param {string} capability - Nombre de la capacidad (ej: 'canFilterAttenuation')
 * @returns {boolean}
 */
function userCan(userId, capability) {
  const profile = USER_PROFILES[userId];
  if (!profile) return false;
  return profile.capabilities[capability] === true;
}

/**
 * Obtiene los IDs de recuerdos que pertenecen a un usuario.
 * Elena accede a los de María Luisa (rol cuidadora).
 * @param {string} userId
 * @returns {string[]}
 */
function getUserMemoryIds(userId) {
  const profile = USER_PROFILES[userId];
  if (!profile) return [];

  if (profile.role === 'caregiver' && profile.managedUser) {
    return USER_PROFILES[profile.managedUser]?.memoryOwnership || [];
  }

  return profile.memoryOwnership;
}

/**
 * Obtiene un mensaje localizado para el usuario actual.
 * @param {string} userId
 * @param {string} messageKey
 * @returns {string}
 */
function getUserMessage(userId, messageKey) {
  const profile = USER_PROFILES[userId];
  if (!profile || !profile.messages[messageKey]) {
    return '';
  }
  return profile.messages[messageKey];
}

/**
 * Comprueba si el usuario tiene restricciones terapéuticas activas.
 * @param {string} userId
 * @returns {Object|null} Configuración terapéutica o null
 */
function getTherapeuticConfig(userId) {
  const profile = USER_PROFILES[userId];
  return profile?.therapeutic || null;
}

/**
 * Devuelve la lista de todos los perfiles para la pantalla de selección.
 * @returns {Array<{id, name, role, avatar}>}
 */
function getAllProfiles() {
  return Object.values(USER_PROFILES).map(p => ({
    id: p.id,
    name: p.name,
    role: p.role,
    avatar: p.avatar,
  }));
}

// Exportar para uso modular
export {
  USER_PROFILES,
  IMPLANT_CONFIG,
  getUserProfile,
  userCan,
  getUserMemoryIds,
  getUserMessage,
  getTherapeuticConfig,
  getAllProfiles,
};
