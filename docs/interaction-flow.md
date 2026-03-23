# Mnemosyne — Flujos de Interacción

**Documento:** Interaction Flow v1.0  
**Fase DCU:** Conceptualización — Especificación detallada de navegación  
**Referencia metodológica:** Dix, Finlay, Abowd & Beale (2004) [1]; Cooper et al. (2014) [2]; Tidwell (2010) [3]  
**Datos de entrada:** Wireframes (04), STDs preliminares (03), HTAs (03), Escenarios (02)  

---

## 1. Introducción

Este documento expande la especificación de diálogos del Commit 3 con los **flujos de navegación completos** de las tres vistas definidas en la Alternativa C ("Tres Experiencias, Un Sistema"). Mientras que el Commit 3 definió los STDs a nivel de tarea individual, este commit especifica:

- La **arquitectura de navegación global** del sistema.
- Los **flujos detallados por vista** con todos los estados, transiciones y condiciones.
- La **gestión de errores y estados vacíos** para cada pantalla.
- Las **transiciones entre vistas** (cuidador → previsualización como paciente).
- Los **puntos de decisión** donde el sistema elige qué mostrar según el contexto.

---

## 2. Arquitectura de Navegación Global

### 2.1. Mapa de sitio por vistas

```
MNEMOSYNE — MAPA DE NAVEGACIÓN
═══════════════════════════════

SELECCIÓN DE VISTA (inicio de sesión simulado)
│
├──► VISTA PACIENTE-ALZHEIMER (María Luisa)
│    │
│    ├── Dashboard
│    │   ├── Personas favoritas ──► Galería filtrada por persona
│    │   ├── Recuerdos favoritos ──► Visor de Recuerdo
│    │   └── Barra de búsqueda ──► Galería (resultados)
│    │
│    ├── Galería
│    │   ├── Resultados de búsqueda ──► Visor de Recuerdo
│    │   └── [Volver] ──► Dashboard
│    │
│    ├── Visor de Recuerdo
│    │   ├── Slider Claridad ──► Filtro en Edición ──► Diálogo Confirmar
│    │   └── [Volver] ──► Galería o Dashboard (según origen)
│    │
│    └── Ajustes (simplificado)
│        ├── Tamaño de texto
│        └── Sonido on/off
│
├──► VISTA PACIENTE-TERAPÉUTICA (Carlos)
│    │
│    ├── Dashboard de Sesión
│    │   ├── Buscar recuerdos ──► Galería completa
│    │   ├── Historial de sesiones ──► Lista de sesiones pasadas
│    │   └── [Iniciar sesión] ──► Aviso seguridad ──► Buscar ──► Visor
│    │
│    ├── Galería Completa
│    │   ├── Búsqueda por texto, fecha, emoción
│    │   ├── Resultados ──► Visor de Recuerdo
│    │   └── [Volver] ──► Dashboard
│    │
│    ├── Visor + Panel Atenuación
│    │   ├── Slider Atenuación ──► Feedback tiempo real
│    │   ├── Indicador bienestar ──► Ajuste manual
│    │   ├── [Guardar] ──► Diálogo Confirmar ──► Resumen Sesión
│    │   └── [Salir sesión] ──► Diálogo "¿Guardar antes de salir?"
│    │
│    └── Resumen de Sesión
│        ├── Nota para terapeuta (opcional)
│        └── [Finalizar] ──► Dashboard
│
└──► VISTA CUIDADOR (Elena)
     │
     ├── Panel Principal
     │   ├── Resumen de actividad
     │   ├── Filtros activos
     │   └── [Previsualizar como paciente] ──► Vista Paciente (solo lectura)
     │
     ├── Biblioteca de Recuerdos
     │   ├── Búsqueda avanzada
     │   ├── Seleccionar recuerdo ──► Editor de Recuerdo
     │   └── [Volver] ──► Panel Principal
     │
     ├── Editor de Recuerdo (cuidador)
     │   ├── Editar metadatos
     │   ├── Preconfigurar filtros
     │   ├── Marcar como favorito
     │   └── [Guardar] ──► Diálogo Confirmar
     │
     ├── Permisos y Límites
     │   ├── Funciones habilitadas/deshabilitadas
     │   ├── Límites de intensidad
     │   └── [Guardar cambios] ──► Diálogo Confirmar
     │
     └── Mis Permisos
         └── Lista de lo que puede/no puede hacer
```

### 2.2. Principios de navegación

| Principio | Implementación | Justificación |
|---|---|---|
| **Profundidad máxima: 3 niveles** | Dashboard → Galería → Visor | Tema 4: María Luisa se pierde en jerarquías. Tidwell (2010) recomienda ≤3 niveles para interfaces accesibles [3] |
| **Retorno siempre visible** | Botón "← Volver" fijo en header | Heurística Nielsen 3 (control del usuario). HTA-1 punto crítico: María Luisa necesita poder volver |
| **Navegación consistente por vista** | Cada vista mantiene su propia barra de nav | Alternativa C: las vistas son experiencias separadas, no modos de una misma interfaz |
| **Sin navegación entre vistas** | María Luisa no accede a la vista de Carlos ni a la de Elena | Modelo Mental §2.2: no mostrar funciones bloqueadas. No hay concepto de "cambiar de modo" |
| **Transición cuidador → paciente** | Elena puede "previsualizar" pero en modo solo lectura | HTA-3 tarea 3.1. No puede modificar filtros desde la previsualización |

---

## 3. STD Completo: Vista Paciente-Alzheimer (María Luisa)

### 3.1. Diagrama de estados

```
                           ┌─────────────────┐
                           │   SELECCIÓN DE   │
                           │      VISTA       │
                           └────────┬─────────┘
                                    │ Perfil = María Luisa
                                    ▼
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                     VISTA PACIENTE-ALZHEIMER                        │
│                                                                      │
│   ┌──────────────┐                                                   │
│   │  DASHBOARD   │◄─────────────────────────────────────────────┐   │
│   │              │                                              │   │
│   │ • Personas   │                                              │   │
│   │ • Favoritos  │                                              │   │
│   │ • Búsqueda   │                                              │   │
│   └──┬──┬──┬─────┘                                              │   │
│      │  │  │                                                    │   │
│    (a) (b) (c)                                                  │   │
│      │  │  │                                                    │   │
│      │  │  └──────────────────────┐                             │   │
│      │  │                         │                             │   │
│      │  │    Clic en recuerdo     │  Clic en barra              │   │
│      │  │    favorito             │  de búsqueda                │   │
│      │  │                         ▼                             │   │
│      │  │                  ┌──────────────┐                     │   │
│      │  │                  │  BÚSQUEDA /  │                     │   │
│      │  │                  │   GALERÍA    │                     │   │
│      │  │                  │              │◄──┐                 │   │
│      │  │                  │ • Resultados │   │ Nueva           │   │
│      │  │                  │ • "Ver más"  │   │ búsqueda        │   │
│      │  │                  └──┬───────┬───┘   │                 │   │
│      │  │                     │       │       │                 │   │
│      │  │   Clic en persona   │  Clic │recuerdo                │   │
│      ▼  ▼                     │       │                        │   │
│   ┌──────────────┐            │       │ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐│   │
│   │  GALERÍA     │◄───────────┘       │                       ││   │
│   │  FILTRADA    │                    │ │  Camino directo:    ││   │
│   │  (por persona│                    │    Dashboard →        ││   │
│   │   o búsqueda)│                    │ │  Visor (favorito)   ││   │
│   └──────┬───────┘                    │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │   │
│          │                            │                        │   │
│     Clic en recuerdo                  │                        │   │
│          │    ┌───────────────────────┘                        │   │
│          ▼    ▼                                                │   │
│   ┌─────────────────────┐                                      │   │
│   │  VISOR DE RECUERDO  │                                      │   │
│   │                     │◄─────────────┐                       │   │
│   │ • Imagen + metadata │              │                       │   │
│   │ • Slider claridad   │              │ Cancelar / Deshacer   │   │
│   │ • Guardar / Deshacer│              │                       │   │
│   └──┬──────────────────┘              │                       │   │
│      │                                 │                       │   │
│    Mover slider                        │                       │   │
│      │                                 │                       │   │
│      ▼                                 │                       │   │
│   ┌─────────────────────┐              │                       │   │
│   │ FILTRO EN EDICIÓN   │              │                       │   │
│   │                     │──Cancelar───►│                       │   │
│   │ • Feedback en vivo  │              │                       │   │
│   │ • Indicador %       │                                      │   │
│   └──┬──────────────────┘                                      │   │
│      │                                                         │   │
│    Guardar                                                     │   │
│      │         ┌─────────────┐                                 │   │
│      ▼         │  CAMBIO     │                                 │   │
│   ┌────────────┤  BRUSCO     │◄── Cambio >30%                 │   │
│   │ DIÁLOGO    │  DETECTADO  │    en <0.5s                     │   │
│   │ CONFIRMAR  │             │                                 │   │
│   │            │ "¿Es lo que │                                 │   │
│   │ "¿Guardar │  querías?"  │                                 │   │
│   │  al X%?"  └──┬──────┬───┘                                 │   │
│   └──┬──────┬──┘  │      │                                     │   │
│    Sí│    No│  Mantener Deshacer                               │   │
│      │      │     │      │                                     │   │
│      │      └─────┼──────┘──────► VISOR (sin cambios)          │   │
│      ▼            │                                            │   │
│   ┌────────────┐  │                                            │   │
│   │  ÉXITO     │◄─┘                                            │   │
│   │ (2 seg)    │                                               │   │
│   └────┬───────┘                                               │   │
│        │                                                       │   │
│        ▼                                                       │   │
│   VISOR (actualizado, icono filtro visible) ───── Volver ──────┘   │
│                                                                      │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### 3.2. Tabla de transiciones completa

| # | Estado origen | Evento / Acción | Estado destino | Condición | Feedback al usuario |
|---|---|---|---|---|---|
| T01 | DASHBOARD | Clic en persona favorita | GALERÍA FILTRADA | Persona tiene recuerdos | Título: "Recuerdos con [nombre]" |
| T02 | DASHBOARD | Clic en persona favorita | GALERÍA FILTRADA (vacía) | Persona sin recuerdos | Estado vacío: "Aún no hay recuerdos con [nombre]" |
| T03 | DASHBOARD | Clic en recuerdo favorito | VISOR DE RECUERDO | — | Transición con fade suave (300ms) |
| T04 | DASHBOARD | Clic en barra de búsqueda | BÚSQUEDA (teclado activo) | — | Cursor en campo de texto, teclado visible |
| T05 | BÚSQUEDA | Intro texto + Enter | GALERÍA (resultados) | Resultados > 0 | Título: "Resultados para '[texto]'" |
| T06 | BÚSQUEDA | Intro texto + Enter | GALERÍA (sin resultados) | Resultados = 0 | Mensaje: "No se encontraron recuerdos. Prueba con otro nombre o fecha." |
| T07 | GALERÍA | Clic en tarjeta recuerdo | VISOR DE RECUERDO | — | Transición con fade (300ms) |
| T08 | GALERÍA | Clic "Ver más" | GALERÍA (más resultados) | Hay más items | Scroll suave, nuevas tarjetas aparecen con animación |
| T09 | GALERÍA | Clic "← Volver" | DASHBOARD | — | Transición inversa |
| T10 | VISOR | Toque/arrastre slider | FILTRO EN EDICIÓN | Slider habilitado | Imagen cambia en tiempo real (<200ms) |
| T11 | FILTRO EN EDICIÓN | Soltar slider + "Guardar" | DIÁLOGO CONFIRMAR | — | Modal con texto grande |
| T12 | FILTRO EN EDICIÓN | Cambio >30% en <0.5s | DIÁLOGO CAMBIO BRUSCO | Auto-detectado | Modal alternativo: "¿Es lo que querías?" |
| T13 | FILTRO EN EDICIÓN | "Cancelar" | VISOR (sin cambios) | — | Slider vuelve a posición previa con animación |
| T14 | DIÁLOGO CONFIRMAR | "Sí, guardar" | ÉXITO | — | Mensaje: "Listo. Ajuste guardado." + icono filtro |
| T15 | DIÁLOGO CONFIRMAR | "No, cancelar" | VISOR (sin cambios) | — | Slider vuelve a posición previa |
| T16 | DIÁLOGO CAMBIO BRUSCO | "Sí, mantener" | FILTRO EN EDICIÓN | — | Continúa con nuevo valor |
| T17 | DIÁLOGO CAMBIO BRUSCO | "Deshacer" | VISOR (sin cambios) | — | Slider vuelve a posición previa |
| T18 | ÉXITO | Timeout 2s | VISOR (actualizado) | — | Mensaje desaparece, icono de filtro permanece |
| T19 | VISOR | Clic "← Volver" | Último estado previo | Según historial | Vuelve a Galería o Dashboard según origen |

---

## 4. STD Completo: Vista Paciente-Terapéutica (Carlos)

### 4.1. Diagrama de estados

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                     VISTA PACIENTE-TERAPÉUTICA                             │
│                                                                            │
│   ┌────────────────┐                                                       │
│   │  DASHBOARD     │◄──────────────────────────────────────────────────┐  │
│   │  DE SESIÓN     │                                                   │  │
│   │                │◄───────────── Finalizar sesión ────────────┐      │  │
│   │ • Estado       │                                            │      │  │
│   │ • Recuerdos    │                                            │      │  │
│   │ • [Iniciar]    │                                            │      │  │
│   │ • [Buscar]     │                                            │      │  │
│   │ • [Historial]  │                                            │      │  │
│   └──┬──┬──┬───────┘                                            │      │  │
│      │  │  │                                                    │      │  │
│  Iniciar│ Buscar                                                │      │  │
│  sesión │  │                                                    │      │  │
│      │  │  ▼                                                    │      │  │
│      │  │ ┌──────────────┐                                      │      │  │
│      │  │ │  GALERÍA     │                                      │      │  │
│      │  │ │  COMPLETA    │──── Clic recuerdo ──┐                │      │  │
│      │  │ │              │                     │                │      │  │
│      │  │ │ • Búsqueda   │                     │ (fuera de      │      │  │
│      │  │ │   avanzada   │                     │  sesión:       │      │  │
│      │  │ │ • Filtros    │                     │  solo ver)     │      │  │
│      │  │ └──────────────┘                     │                │      │  │
│      │  │        Historial                     │                │      │  │
│      │  │        │                             │                │      │  │
│      │  │        ▼                             │                │      │  │
│      │  │ ┌──────────────┐                     │                │      │  │
│      │  │ │  HISTORIAL   │                     │                │      │  │
│      │  │ │  SESIONES    │                     │                │      │  │
│      │  │ │              │                     │                │      │  │
│      │  │ │ • Lista      │                     │                │      │  │
│      │  │ │ • Gráfico    │                     │                │      │  │
│      │  │ │   temporal   │                     │                │      │  │
│      │  │ └──────────────┘                     │                │      │  │
│      │  │                                      │                │      │  │
│      ▼  │                                      │                │      │  │
│   ┌─────────────────┐                          │                │      │  │
│   │  AVISO DE       │                          │                │      │  │
│   │  SEGURIDAD      │                          │                │      │  │
│   │                 │                          │                │      │  │
│   │ "Puedes parar   │                          │                │      │  │
│   │  en cualquier   │                          │                │      │  │
│   │  momento"       │                          │                │      │  │
│   └──┬────────┬─────┘                          │                │      │  │
│   Continuar  Salir──────────────────────────── │ ───────────────│──────┘  │
│      │                                         │                │         │
│      ▼                                         │                │         │
│   ┌─────────────────┐                          │                │         │
│   │  SELECCIÓN DE   │◄─────────────────────────┘                │         │
│   │  RECUERDO       │                                           │         │
│   │  (en sesión)    │                                           │         │
│   └──────┬──────────┘                                           │         │
│          │ Seleccionar                                          │         │
│          ▼                                                      │         │
│   ┌─────────────────────────────────────┐                       │         │
│   │  VISOR + PANEL ATENUACIÓN           │                       │         │
│   │                                     │◄──────┐               │         │
│   │ • Imagen con filtros en vivo        │       │               │         │
│   │ • Slider atenuación + límite        │       │ Cancelar      │         │
│   │ • Indicador bienestar               │       │               │         │
│   │ • Temporizador de sesión            │       │               │         │
│   └──┬───┬───┬──────────────────────────┘       │               │         │
│      │   │   │                                  │               │         │
│   Guardar│  Salir                               │               │         │
│      │   │   sesión                             │               │         │
│      │   │   │                                  │               │         │
│      │   │   ▼                                  │               │         │
│      │   │ ┌──────────────────┐                 │               │         │
│      │   │ │ DIÁLOGO:         │                 │               │         │
│      │   │ │ "¿Guardar antes  │                 │               │         │
│      │   │ │  de salir?"      │                 │               │         │
│      │   │ └──┬──────────┬────┘                 │               │         │
│      │   │  Guardar   Salir sin                 │               │         │
│      │   │  y salir   guardar                   │               │         │
│      │   │    │          │                       │               │         │
│      │   │    ▼          └───────────────────────│───────────────┘         │
│      │   │                                       │                         │
│      │  Inactividad >30s                         │                         │
│      │   │                                       │                         │
│      │   ▼                                       │                         │
│      │ ┌──────────────────┐                      │                         │
│      │ │ AVISO BIENESTAR  │                      │                         │
│      │ │                  │                      │                         │
│      │ │ "¿Estás bien?"   │                      │                         │
│      │ └──┬───────────┬───┘                      │                         │
│      │ Continuar    Parar ───────────────────────│─────────────────────────┘
│      │    │                                      │
│      │    └──────────────────────────────────────┘
│      │
│      ▼
│   ┌──────────────────┐
│   │ DIÁLOGO CONFIRMAR│
│   │ "¿Guardar        │
│   │  atenuación      │
│   │  al X%?"         │
│   └──┬───────────┬───┘
│    Sí           No ──────────────► VISOR (sin cambios)
│      │
│      ▼
│   ┌──────────────────┐           ┌──────────────────┐
│   │  ÉXITO (2 seg)   │──────────►│ RESUMEN SESIÓN   │
│   └──────────────────┘           │                  │
│                                  │ • Antes→Después  │
│                                  │ • Duración       │
│                                  │ • Bienestar      │
│                                  │ • [Nota]         │
│                                  │ • [Finalizar]    │
│                                  └────────┬─────────┘
│                                           │
│                                           └──────► DASHBOARD (actualizado)
│                                                                            │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### 4.2. Tabla de transiciones — Vista Terapéutica

| # | Estado origen | Evento / Acción | Estado destino | Condición | Feedback |
|---|---|---|---|---|---|
| T20 | DASHBOARD | Clic "Iniciar sesión" | AVISO SEGURIDAD | Sesiones restantes > 0 | Modal empático |
| T21 | DASHBOARD | Clic "Iniciar sesión" | DASHBOARD (aviso) | Sesiones restantes = 0 | "Has completado tus sesiones de esta semana. Si necesitas más, contacta a tu terapeuta." |
| T22 | AVISO SEGURIDAD | "Continuar" | SELECCIÓN RECUERDO | — | Transición suave a búsqueda |
| T23 | AVISO SEGURIDAD | "Salir" | DASHBOARD | — | Sin cambios |
| T24 | SELECCIÓN RECUERDO | Clic en recuerdo | VISOR + ATENUACIÓN | — | Imagen carga, slider aparece con valor actual, temporizador inicia |
| T25 | VISOR + ATENUACIÓN | Mover slider | VISOR (feedback vivo) | Valor ≤ límite terapeuta | Filtros CSS se aplican en tiempo real |
| T26 | VISOR + ATENUACIÓN | Mover slider al límite | VISOR (slider bloqueado) | Valor = límite terapeuta | Slider se detiene. Tooltip: "Límite del X% (Dr. [nombre])" |
| T27 | VISOR + ATENUACIÓN | Ajustar indicador bienestar | VISOR (actualizado) | — | Etiqueta verbal se actualiza ("Alto malestar" → "Malestar moderado" etc.) |
| T28 | VISOR + ATENUACIÓN | Inactividad > 30s | AVISO BIENESTAR | Sesión activa | Modal: "¿Estás bien? Puedes parar cuando quieras." |
| T29 | AVISO BIENESTAR | "Sí, continuar" | VISOR + ATENUACIÓN | — | Modal se cierra. Timer de inactividad se reinicia |
| T30 | AVISO BIENESTAR | "Quiero parar" | DIÁLOGO SALIR | — | "¿Guardar antes de salir?" |
| T31 | VISOR + ATENUACIÓN | "Guardar" | DIÁLOGO CONFIRMAR | — | Modal de confirmación |
| T32 | DIÁLOGO CONFIRMAR | "Sí" | ÉXITO → RESUMEN | — | Mensaje éxito 2s, luego transición a resumen |
| T33 | DIÁLOGO CONFIRMAR | "No" | VISOR (sin cambios) | — | Slider mantiene posición pero no se persiste |
| T34 | VISOR + ATENUACIÓN | "Salir de sesión" | DIÁLOGO SALIR | — | "¿Guardar antes de salir?" |
| T35 | DIÁLOGO SALIR | "Guardar y salir" | RESUMEN SESIÓN | — | Persiste datos → muestra resumen |
| T36 | DIÁLOGO SALIR | "Salir sin guardar" | DASHBOARD | — | Descarta cambios, contabiliza sesión |
| T37 | RESUMEN SESIÓN | Escribir nota | RESUMEN (con nota) | Opcional | Campo de texto activo |
| T38 | RESUMEN SESIÓN | "Finalizar" | DASHBOARD (actualizado) | — | Contador de sesiones incrementa |

---

## 5. STD Completo: Vista Cuidador (Elena)

### 5.1. Diagrama de estados

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                        VISTA CUIDADOR                                    │
│                                                                          │
│   ┌──────────────────┐                                                   │
│   │  PANEL PRINCIPAL │◄─────────────────────────────────────────────┐   │
│   │                  │                                              │   │
│   │  Sidebar:        │                                              │   │
│   │  • Resumen       │                                              │   │
│   │  • Biblioteca    │                                              │   │
│   │  • Metadatos     │                                              │   │
│   │  • Permisos      │                                              │   │
│   │  • Previsualizar │                                              │   │
│   │  • Mis permisos  │                                              │   │
│   └──┬──┬──┬──┬──┬───┘                                              │   │
│      │  │  │  │  │                                                  │   │
│      │  │  │  │  └──────── "Previsualizar" ──┐                      │   │
│      │  │  │  │                              │                      │   │
│      │  │  │  └── "Permisos" ──┐             ▼                      │   │
│      │  │  │                   │    ┌─────────────────────┐         │   │
│      │  │  │                   │    │  PREVISUALIZACIÓN   │         │   │
│      │  │  └── "Metadatos"     │    │  COMO PACIENTE      │         │   │
│      │  │       │              │    │  (solo lectura)     │         │   │
│      │  │       ▼              │    │                     │         │   │
│      │  │ ┌─────────────┐     │    │ • Ve exactamente lo │         │   │
│      │  │ │  EDITOR DE  │     │    │   que ve el paciente│         │   │
│      │  │ │  METADATOS  │     │    │ • No puede editar   │         │   │
│      │  │ │             │     │    │ • Banner: "Modo     │         │   │
│      │  │ │ • Nombres   │     │    │   previsualización" │         │   │
│      │  │ │ • Fechas    │     │    └──────────┬──────────┘         │   │
│      │  │ │ • Lugares   │     │               │ "Salir             │   │
│      │  │ └──────┬──────┘     │               │  previsualización" │   │
│      │  │        │            │               └────────────────────┘   │
│      │  │   [Guardar]         │                                        │   │
│      │  │        │            ▼                                        │   │
│      │  │        │   ┌──────────────────┐                              │   │
│      │  │        │   │  PERMISOS Y      │                              │   │
│      │  │        │   │  LÍMITES         │                              │   │
│      │  │        │   │                  │                              │   │
│      │  │        │   │ • On/Off funcs.  │                              │   │
│      │  │        │   │ • Límites slider │                              │   │
│      │  │        │   └──────┬───────────┘                              │   │
│      │  │        │          │                                          │   │
│      │  │        │     [Guardar]                                       │   │
│      │  │        │          │                                          │   │
│      │  │        ▼          ▼                                          │   │
│      │  │   ┌────────────────────┐                                     │   │
│      │  │   │ DIÁLOGO CONFIRMAR  │                                     │   │
│      │  │   │ (resumen cambios)  │                                     │   │
│      │  │   └──┬─────────────┬───┘                                     │   │
│      │  │    Sí             No ────────────────────────────────────────┘   │
│      │  │      │                                                          │
│      │  │      ▼                                                          │
│      │  │   ┌────────────────┐                                            │
│      │  │   │  ÉXITO         │─────────────────────────────────────────┘  │
│      │  │   └────────────────┘                                            │
│      │  │                                                                 │
│      │  └── "Biblioteca" ──┐                                              │
│      │                     ▼                                              │
│      │              ┌──────────────────┐                                  │
│      │              │  BIBLIOTECA DE   │                                  │
│      │              │  RECUERDOS       │                                  │
│      │              │                  │                                  │
│      │              │ • Lista completa │                                  │
│      │              │ • Búsqueda       │                                  │
│      │              │ • Estado filtros  │                                  │
│      │              └──────┬───────────┘                                  │
│      │                     │ Seleccionar                                  │
│      │                     ▼                                              │
│      │              ┌──────────────────┐                                  │
│      │              │  EDITOR DE       │                                  │
│      │              │  RECUERDO        │                                  │
│      │              │                  │                                  │
│      │              │ • Metadatos      │                                  │
│      │              │ • Preconfigurar  │                                  │
│      │              │   filtros        │                                  │
│      │              │ • Favorito ☆/★   │                                  │
│      │              │ • [Guardar]      │                                  │
│      │              └──────────────────┘                                  │
│      │                                                                    │
│      └── "Mis permisos" ──► MIS PERMISOS (solo lectura)                   │
│                                                                           │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

---

## 6. Gestión de Estados Vacíos y Errores

Un sistema bien diseñado debe contemplar qué ocurre cuando las cosas no van según lo esperado. Según Cooper et al. (2014), los estados vacíos son "la primera impresión que el usuario tiene del sistema" y deben orientar, no frustrar [2].

### 6.1. Catálogo de estados vacíos

| Pantalla | Condición | Mensaje propuesto | Acción ofrecida |
|---|---|---|---|
| Dashboard (María Luisa) | No hay favoritos configurados | "Aún no tienes recuerdos favoritos. Pide a tu cuidador que te ayude a seleccionar algunos." | — (el paciente no puede añadir favoritos) |
| Dashboard (María Luisa) | No hay personas favoritas | "Aún no hay personas favoritas. Tu cuidador puede configurarlas." | — |
| Galería | Búsqueda sin resultados | "No se encontraron recuerdos con '[término]'. Prueba con otro nombre o fecha." | Botón: "Volver a buscar" |
| Galería | Persona sin recuerdos | "Aún no hay recuerdos con [persona]." | Botón: "Volver al inicio" |
| Visor (Carlos) | Recuerdo sin slider habilitado | "Tu terapeuta aún no ha habilitado los filtros para este recuerdo." | Botón: "Volver" |
| Dashboard (Carlos) | Sesiones semanales agotadas | "Has completado tus 2 sesiones de esta semana. Si necesitas más, contacta a Dr. [nombre]." | — (límite terapéutico) |
| Panel cuidador | Sin actividad reciente | "María Luisa no ha usado Mnemosyne esta semana." | — (informativo) |

### 6.2. Catálogo de errores del sistema

| Error | Origen | Mensaje | Estilo visual |
|---|---|---|---|
| Implante desconectado | Conexión BLE ficticia perdida | "El implante no está conectado. Los recuerdos que ya has descargado siguen disponibles." | Banner ámbar, no rojo (RNF-08). No bloquea la interfaz |
| Error al guardar filtro | Fallo ficticio de persistencia | "No se ha podido guardar el ajuste. ¿Quieres intentarlo de nuevo?" | Banner ámbar + botón reintentar |
| Timeout de sesión | Inactividad > 10 min en sesión de Carlos | "Tu sesión ha expirado por inactividad. Tus cambios no guardados se han perdido." | Pantalla informativa con botón "Volver al inicio" |

### 6.3. Principios de gestión de errores

| Principio | Implementación | Referencia |
|---|---|---|
| **No culpar al usuario** | Los mensajes de error nunca implican que el usuario hizo algo mal | Heurística Nielsen 9; Cooper (2014) [2] |
| **No usar rojo para María Luisa** | Los errores usan ámbar/naranja cálido, no rojo | RNF-08; Tema 4 (ansiedad ante lo inesperado) |
| **Ofrecer siempre una salida** | Todo error incluye al menos un botón de acción | Heurística Nielsen 3 (control del usuario) |
| **Degradación elegante** | Si el implante se desconecta, los datos ya cargados siguen disponibles | Principio de robustez; no dejar al usuario sin funcionalidad |

---

## 7. Flujo de Transición entre Vistas (Previsualización)

La función "Previsualizar como paciente" (Elena) conecta la Vista Cuidador con la Vista Paciente. Este flujo merece una especificación detallada porque implica un **cambio de contexto visual**:

```
VISTA CUIDADOR (Elena)                    VISTA PACIENTE (previsualización)
┌───────────────────────┐                 ┌───────────────────────────────┐
│                       │                 │ ┌───────────────────────────┐ │
│  Panel Principal      │   Clic          │ │ ⚠️ MODO PREVISUALIZACIÓN  │ │
│                       │  "Previsualizar │ │ Estás viendo la interfaz  │ │
│  [👁 Previsualizar   ├──como María ───►│ │ de María Luisa.           │ │
│   como María Luisa]   │   Luisa"        │ │ No puedes hacer cambios.  │ │
│                       │                 │ │          [✕ Salir]        │ │
└───────────────────────┘                 │ └───────────────────────────┘ │
                                          │                               │
        ┌─────────────────────────────────│  Dashboard de María Luisa    │
        │     Clic "✕ Salir              │  (réplica exacta, solo       │
        │      previsualización"          │   lectura)                   │
        │                                 │                               │
        ▼                                 │  • Personas favoritas        │
VISTA CUIDADOR (Elena)                    │  • Recuerdos favoritos       │
(restaura estado previo)                  │  • Puede navegar pero        │
                                          │    no modificar filtros      │
                                          └───────────────────────────────┘
```

**Reglas de la previsualización:**
- Elena ve exactamente lo que vería María Luisa: mismo layout, mismos tamaños, mismos recuerdos disponibles.
- Un **banner fijo superior** recuerda a Elena que está en modo previsualización y que no puede modificar nada.
- Los sliders son visibles pero **no interactivos** (estado disabled con visual claro).
- Elena puede navegar entre Dashboard, Galería y Visor para comprobar la experiencia completa.
- Clic en "Salir" la devuelve al Panel de Cuidador exactamente donde estaba.

---

## 8. Resumen: Inventario de Estados del Sistema

| Vista | Pantallas | Estados (inc. errores y vacíos) | Transiciones |
|---|---|---|---|
| Paciente-Alzheimer | 4 (Dashboard, Galería, Visor, Ajustes) | 12 | 19 (T01-T19) |
| Paciente-Terapéutica | 5 (Dashboard, Galería, Historial, Visor+Panel, Resumen) | 16 | 19 (T20-T38) |
| Cuidador | 6 (Panel, Biblioteca, Editor Recuerdo, Editor Metadatos, Permisos, Mis Permisos) + Previsualización | 10 | 12 |
| **Total** | **15 pantallas + 1 previsualización** | **38 estados** | **50 transiciones** |

---

## 9. Referencias

[1] A. Dix, J. Finlay, G. D. Abowd, and R. Beale, *Human-Computer Interaction*, 3rd ed. Harlow, England: Pearson Education, 2004.

[2] A. Cooper, R. Reimann, D. Cronin, and C. Noessel, *About Face: The Essentials of Interaction Design*, 4th ed. Indianapolis, IN: Wiley, 2014.

[3] J. Tidwell, *Designing Interfaces: Patterns for Effective Interaction Design*, 2nd ed. Sebastopol, CA: O'Reilly Media, 2010.
