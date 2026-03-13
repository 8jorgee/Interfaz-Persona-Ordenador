# Mnemosyne — Wireframes de Baja Fidelidad

**Documento:** Wireframes v1.0  
**Fase DCU:** Conceptualización — Diseño de baja fidelidad  
**Alternativa seleccionada:** C — "Tres Experiencias, Un Sistema"  
**Referencia:** Snyder (2003) [1]; Buxton (2007) [2]  

---

## 1. Convenciones de los Wireframes

Los wireframes se presentan en **formato textual anotado** (ASCII art) complementados con **archivos SVG** en `docs/assets/`. Siguiendo a Snyder (2003), los bocetos de baja fidelidad deben comunicar estructura y jerarquía sin distraer con detalles visuales [1].

**Leyenda:**
- `[Botón]` → Elemento interactivo (botón, enlace)
- `[====slider====]` → Control deslizante
- `(●)` → Imagen/thumbnail placeholder
- `─── ───` → Línea separadora
- Las anotaciones al margen `← nota` vinculan cada decisión al hallazgo de origen.

---

## 2. VISTA PACIENTE-ALZHEIMER (María Luisa)

### 2.1. Pantalla: Dashboard

La pantalla de inicio de María Luisa debe funcionar como un **punto de partida seguro y reconocible**, análogo a la portada de un álbum de fotos (Modelo Mental §2.1).

```
┌──────────────────────────────────────────────────────────┐
│  ☰  MNEMOSYNE          Buenas tardes, María Luisa   (◉) │ ← Saludo personalizado
├──────────────────────────────────────────────────────────┤   (RNF-04: vocabulario
│                                                          │    natural del usuario)
│   ╔══════════════════════════════════════════════════╗   │
│   ║        🔍  Buscar un recuerdo...                 ║   │ ← Barra de búsqueda
│   ╚══════════════════════════════════════════════════╝   │   prominente pero NO
│                                                          │   el único camino
│   ── Tus personas favoritas ─────────────────────────   │   (HTA-1, punto crítico
│                                                          │    1.2: alternativa a
│   ┌──────────┐  ┌──────────┐  ┌──────────┐              │    búsqueda textual)
│   │          │  │          │  │          │              │
│   │   (●)    │  │   (●)    │  │   (●)    │              │ ← Navegación por
│   │          │  │          │  │          │              │   PERSONAS con foto
│   │  Lucía   │  │  Pablo   │  │  Tomás   │              │   y nombre grande
│   │          │  │          │  │          │              │   (Tema 5: vocabulario
│   └──────────┘  └──────────┘  └──────────┘              │    del usuario)
│                                                          │
│   ── Recuerdos favoritos ────────────────────────────   │ ← Acceso directo sin
│                                                          │   necesidad de buscar
│   ┌─────────────────────┐  ┌─────────────────────┐      │   (RNF-05: máx 3
│   │                     │  │                     │      │    acciones visibles)
│   │                     │  │                     │      │
│   │       (●)           │  │       (●)           │      │ ← Tarjetas grandes
│   │                     │  │                     │      │   (mín. 180x140px)
│   │                     │  │                     │      │   para facilitar
│   │ Navidad 2025        │  │ Paseo en el parque  │      │   el toque
│   │ 24 dic · 5 personas │  │ 15 oct · 3 personas │      │   (RNF-02: 48px mín)
│   └─────────────────────┘  └─────────────────────┘      │
│                                                          │
│   ┌─────────────────────┐  ┌─────────────────────┐      │
│   │                     │  │                     │      │
│   │       (●)           │  │       (●)           │      │
│   │                     │  │                     │      │
│   │ Bautizo de Marco    │  │ Cumpleaños Lucía    │      │
│   │ 12 jun · 8 personas │  │ 3 mar · 4 personas  │      │
│   └─────────────────────┘  └─────────────────────┘      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [  🏠 Inicio  ]    [  📷 Galería  ]    [  ⚙ Ajustes  ] │ ← Navegación inferior:
└──────────────────────────────────────────────────────────┘   3 opciones máximo
                                                               (RNF-05)
```

**Decisiones de diseño anotadas:**

| Elemento | Decisión | Justificación (trazabilidad) |
|---|---|---|
| Navegación por Personas (fotos) | Camino alternativo a la búsqueda textual | HTA-1 punto crítico 1.2: María Luisa puede no recordar qué buscar. Modelo Mental §2.1: "pedir que busquen la foto de alguien" |
| Tarjetas de recuerdo grandes (2 columnas) | Áreas de toque amplias, información mínima por tarjeta | RNF-02 (48px mín), Tema 4 (OC1: confunde gestos), RNF-05 (pocas opciones) |
| Solo 3 ítems en nav inferior | Minimizar opciones visibles | Hick-Hyman Law, RNF-05, Tema 4 (abandona si hay diálogo inesperado) |
| Sin indicador de "estado del implante" | Información técnica innecesaria para María Luisa | Modelo Mental §2.2: no entiende el concepto de implante como sistema técnico |
| Saludo personalizado con nombre | Orientación y familiaridad | Tema 1: angustia de no ser reconocida → el sistema sí la reconoce a ella |

### 2.2. Pantalla: Galería (resultado de búsqueda o exploración)

```
┌──────────────────────────────────────────────────────────┐
│  [← Volver]    Recuerdos con Lucía               (◉)   │ ← Título contextual
├──────────────────────────────────────────────────────────┤   claro: qué estamos
│                                                          │   viendo y por qué
│   ┌─────────────────────┐  ┌─────────────────────┐      │
│   │                     │  │                     │      │
│   │                     │  │                     │      │
│   │       (●)           │  │       (●)           │      │ ← Misma estructura
│   │                     │  │                     │      │   de tarjetas que
│   │                     │  │                     │      │   el Dashboard
│   │ Navidad 2025        │  │ Parque Tormes       │      │
│   │ 🔵 Claridad: 75%    │  │                     │      │ ← Indicador de filtro
│   └─────────────────────┘  └─────────────────────┘      │   activo visible
│                                                          │   (RF-10)
│   ┌─────────────────────┐  ┌─────────────────────┐      │
│   │                     │  │                     │      │
│   │       (●)           │  │       (●)           │      │
│   │                     │  │                     │      │
│   │ Primer día cole     │  │ Cumpleaños 7        │      │
│   │                     │  │                     │      │
│   └─────────────────────┘  └─────────────────────┘      │
│                                                          │
│                     [Ver más ↓]                          │ ← Scroll explícito
│                                                          │   con botón, no
├──────────────────────────────────────────────────────────┤   solo gesto
│  [  🏠 Inicio  ]    [  📷 Galería  ]    [  ⚙ Ajustes  ] │
└──────────────────────────────────────────────────────────┘
```

### 2.3. Pantalla: Visor de Recuerdo + Panel de Filtros (María Luisa)

Esta es la pantalla central de la experiencia para María Luisa. Concentra las tareas 2 y 3 del HTA-1.

```
┌──────────────────────────────────────────────────────────┐
│  [← Volver]         Navidad 2025                  (◉)   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────────────────────────────────────────────┐   │
│   │                                                  │   │
│   │                                                  │   │
│   │                                                  │   │
│   │               IMAGEN DEL RECUERDO                │   │ ← Área de imagen:
│   │                                                  │   │   mín. 60% del
│   │                   (●)                            │   │   viewport
│   │                                                  │   │   (HTA-1, tarea 2.1)
│   │                                                  │   │
│   │                                                  │   │
│   │                                  [🔵 Filtro: 75%]│   │ ← Indicador de
│   └──────────────────────────────────────────────────┘   │   filtro activo
│                                                          │   permanente
│   24 de diciembre, 2025                                  │   (RF-10)
│   📍 Casa familiar · 👥 Lucía, Tomás, Pablo, Elena       │ ← Metadatos
│                                                          │   (RF-07, RNF-01:
│   ── Claridad Facial ───────────────────────────────    │    fuente ≥18px)
│                                                          │
│   Poco clara          ◆═══════════════●══╡  Muy clara   │ ← Slider con:
│                                     75%                  │   - Descriptor verbal
│                                                          │     (Modelo Mental §2.2:
│   ℹ️ El recuerdo original siempre se conserva            │      no entiende %)
│                                                          │   - Valor numérico
│   ┌──────────────────┐  ┌────────────────────┐          │   - Mensaje de
│   │                  │  │                    │          │     reversibilidad
│   │  💾 Guardar      │  │   ↩ Deshacer       │          │     permanente
│   │     ajuste       │  │                    │          │     (Gap §5.1)
│   │                  │  │                    │          │
│   └──────────────────┘  └────────────────────┘          │ ← Dos botones
│                                                          │   grandes: guardar
├──────────────────────────────────────────────────────────┤   y deshacer
│  [  🏠 Inicio  ]    [  📷 Galería  ]    [  ⚙ Ajustes  ] │   (Diálogo §5.2:
└──────────────────────────────────────────────────────────┘    máx 2 opciones)
```

**Decisiones de diseño anotadas:**

| Elemento | Decisión | Justificación |
|---|---|---|
| Descriptor verbal del slider ("Poco clara / Muy clara") | Representación dual número + texto | Modelo Mental §2.2: María Luisa no entiende porcentajes. Estrategia de alineación §5.1 |
| Mensaje "El recuerdo original siempre se conserva" | Permanente, no en tooltip | Gap "Miedo a romper" (§2.2). Debe ser visible sin interacción, no oculto |
| Botón "Deshacer" al mismo nivel que "Guardar" | Igual prominencia visual | Heurística Nielsen 9 (recuperación de errores). Escenario 4: María Luisa toca sin querer |
| Solo 1 slider visible (Claridad Facial) | Atenuación Emocional no es relevante para María Luisa | HTA-1 no incluye atenuación. RF-09: funciones por rol. RNF-05: máx 3 acciones |
| Metadatos con iconos + texto | Redundancia visual | Tema 4: iconos solos no se entienden; texto solo no se escanea rápido |

---

## 3. VISTA PACIENTE-TERAPÉUTICA (Carlos)

### 3.1. Pantalla: Dashboard de Sesión

```
┌──────────────────────────────────────────────────────────────────┐
│  MNEMOSYNE                              Carlos Herrera    [⚙]   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  ESTADO DEL IMPLANTE                                      │  │
│  │  ● Conectado    Último uso: Jueves 18:30                  │  │ ← Info técnica
│  │  Sesiones esta semana: 1/2                                │  │   relevante para
│  └────────────────────────────────────────────────────────────┘  │   Carlos (alto
│                                                                  │   nivel tech)
│  ┌──────────────────────────┐  ┌──────────────────────────┐     │
│  │                          │  │                          │     │
│  │  🔍 Buscar recuerdos     │  │  📊 Historial de         │     │ ← Búsqueda
│  │                          │  │     sesiones             │     │   completa +
│  │  Búsqueda avanzada por   │  │                          │     │   historial
│  │  texto, fecha, emoción   │  │  Ver progreso temporal   │     │   (Escenario 2,
│  │                          │  │  de atenuación           │     │    tarea 5.3)
│  └──────────────────────────┘  └──────────────────────────┘     │
│                                                                  │
│  ── Recuerdos recientes ──────────────────────────────────────  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Accidente 14/03/2022                                     │  │
│  │  🔴 Emoción: 9/10  ·  Atenuación actual: 40%  ·  A-6     │  │ ← Indicador de
│  │  Último ajuste: Mar 18:30 (15% → 40%)                    │  │   emoción visible
│  └───────────────────────────────────────────────────────────┘  │   (RF-10)
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Funeral Diego 22/03/2022                                 │  │
│  │  🟠 Emoción: 7/10  ·  Atenuación actual: 25%             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           [ ▶  Iniciar sesión de atenuación ]            │   │ ← CTA principal
│  └──────────────────────────────────────────────────────────┘   │   (HTA-2, tarea 1)
│                                                                  │
│  💬 Recuerda: puedes parar en cualquier momento.                │ ← Aviso empático
│                                                                  │   permanente
└──────────────────────────────────────────────────────────────────┘
```

### 3.2. Pantalla: Visor + Panel de Atenuación Emocional (Carlos)

```
┌──────────────────────────────────────────────────────────────────┐
│  [← Salir de sesión]    Sesión de atenuación        12:34 ⏱    │ ← Duración de
├──────────────────────────────────────────────────────────────────┤   sesión visible
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │                                                            │  │
│  │                    IMAGEN DEL RECUERDO                     │  │ ← Imagen con
│  │                                                            │  │   filtros CSS
│  │                        (●)                                 │  │   aplicados en
│  │                                                            │  │   tiempo real
│  │                                                            │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Accidente — 14 de marzo, 2022                                  │
│  📍 A-6, km 23 · 👥 Carlos, Diego†                              │
│  Emoción dominante: Terror · Nivel: 9/10                        │
│                                                                  │
│  ── Atenuación Emocional ────────────────────────────────────   │
│                                                                  │
│  Intenso    ◆═══════════════════●══════════╡▓▓▓╡  Suave        │
│                               40%       Límite:70%              │ ← Slider con:
│                                                                  │   - Descriptor verbal
│  ℹ️ Límite del 70% configurado por Dr. Molina                   │   - Límite visual
│     (parte de tu plan de tratamiento)                           │   - Explicación del
│                                                                  │     límite (Gap §3.2)
│  ── ¿Cómo te sientes? ──────────────────────────────────────   │
│                                                                  │
│  😰 ─────────────●────────────── 😌                             │ ← Indicador de
│       Alto malestar    Bajo malestar                            │   bienestar manual
│                                                                  │   (HTA-2, tarea 4.5)
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────┐     │
│  │   💾 Guardar ajuste      │  │   ↩ Deshacer cambios     │     │
│  └──────────────────────────┘  └──────────────────────────┘     │
│                                                                  │
│  [ Puedes parar en cualquier momento → Salir de sesión ]        │ ← Salida siempre
└──────────────────────────────────────────────────────────────────┘   accesible
```

### 3.3. Pantalla: Resumen de Sesión

```
┌──────────────────────────────────────────────────────────────────┐
│                    Resumen de tu sesión                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  📅 Martes 17 febrero, 2026                                │  │
│  │  ⏱  Duración: 12 minutos                                  │  │
│  │                                                            │  │
│  │  Recuerdo trabajado: Accidente 14/03/2022                  │  │
│  │                                                            │  │
│  │  Atenuación:  15% ──────────────► 40%                     │  │ ← Visualización
│  │               (antes)              (ahora)                 │  │   antes/después
│  │                                                            │  │   clara y neutral
│  │  Bienestar:   Alto malestar ─────► Bajo malestar          │  │   (Gap §3.2:
│  │                                                            │  │    no gamificar)
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ── Nota para tu terapeuta (opcional) ───────────────────────   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │ ← Campo libre
│  │  He podido llegar al 40% sin taquicardia. Creo que        │  │   (HTA-2,
│  │  estoy preparado para más.                                │  │    tarea 5.5)
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              [ ✓ Finalizar sesión ]                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. VISTA CUIDADOR (Elena)

### 4.1. Pantalla: Panel de Administración

```
┌──────────────────────────────────────────────────────────────────────────┐
│  MNEMOSYNE — Panel de cuidador             Elena Navarro         [⚙]   │
├──────────────┬───────────────────────────────────────────────────────────┤
│              │                                                          │
│  MENÚ       │  Gestionando: María Luisa Fernández                      │
│              │                                                          │
│  📊 Resumen  │  ┌─────────────────────────────────────────────────────┐ │
│              │  │ ACTIVIDAD RECIENTE                                  │ │
│  📷 Biblioteca│ │                                                     │ │
│    de        │  │ • Dom 16 feb: Revisó 3 recuerdos de Lucía (con     │ │ ← Monitorización
│    recuerdos │  │   Elena). Claridad ajustada al 75%.                │ │   de actividad
│              │  │ • Sáb 15 feb: Exploró Favoritos (5 min, sola).     │ │   (Escenario 3,
│  🏷 Editar   │  │ • Jue 13 feb: No usó Mnemosyne.                   │ │    tarea 1.3)
│    metadatos │  │                                                     │ │
│              │  └─────────────────────────────────────────────────────┘ │
│  🔒 Permisos │                                                          │
│    y límites │  ┌─────────────────────────────────────────────────────┐ │
│              │  │ FILTROS ACTIVOS                                     │ │
│  👁 Previsua-│  │                                                     │ │ ← Vista rápida
│    lizar     │  │ Navidad 2025: Claridad 75%                         │ │   de filtros
│    como      │  │ Paseo parque: Claridad 60%                         │ │   aplicados
│    paciente  │  │ Bautizo Marco: Claridad 60% (nuevo)                │ │   (RF-10)
│              │  │                                                     │ │
│  ─────────── │  └─────────────────────────────────────────────────────┘ │
│              │                                                          │
│  ℹ️ Mis      │  ┌──────────────────────────────────────────────┐       │
│    permisos  │  │  [ 👁 Previsualizar como María Luisa ]       │       │ ← Función clave
│              │  └──────────────────────────────────────────────┘       │   (HTA-3, tarea 3.1)
│              │                                                          │
└──────────────┴───────────────────────────────────────────────────────────┘
```

---

## 5. Wireframe de Diálogo Modal (compartido)

```
    ┌────────────────────────────────────────────┐
    │                                            │
    │         ¿Guardar la claridad al 75%?       │ ← Texto grande
    │                                            │   (RNF-01: ≥18px)
    │    Puedes cambiarlo cuando quieras.        │ ← Mensaje de
    │                                            │   reversibilidad
    │   ┌─────────────────┐ ┌─────────────────┐ │
    │   │                 │ │                 │ │
    │   │  ✓ Sí, guardar  │ │  ✕ No, cancelar │ │ ← Icono + texto
    │   │                 │ │                 │ │   (Diálogos §5.2)
    │   │   (verde)       │ │    (gris)       │ │   Botones ≥56px
    │   └─────────────────┘ └─────────────────┘ │
    │                                            │
    └────────────────────────────────────────────┘
```

---

## 6. Resumen de Pantallas y Cobertura

| Pantalla | Vista | Persona | HTA cubierto | Escenario cubierto |
|---|---|---|---|---|
| Dashboard Alzheimer | Paciente-Alzheimer | María Luisa | HTA-1 (inicio) | Esc. 1 (paso 1-2) |
| Galería | Paciente-Alzheimer | María Luisa | HTA-1 (tarea 1) | Esc. 1 (paso 2-3) |
| Visor + Claridad | Paciente-Alzheimer | María Luisa | HTA-1 (tareas 2-4) | Esc. 1 (pasos 3-8), Esc. 4 |
| Dashboard Sesión | Paciente-Terapéutica | Carlos | HTA-2 (tarea 1) | Esc. 2 (pasos 1-2) |
| Visor + Atenuación | Paciente-Terapéutica | Carlos | HTA-2 (tareas 2-5) | Esc. 2 (pasos 3-8) |
| Resumen Sesión | Paciente-Terapéutica | Carlos | HTA-2 (tareas 5-6) | Esc. 2 (pasos 9-10) |
| Panel Cuidador | Cuidador | Elena | HTA-3 (todas) | Esc. 3 (todos) |
| Diálogo Modal | Todas | Todas | Tarea 4 (todos) | Esc. 1, 2, 4 |

---

## 7. Referencias

[1] C. Snyder, *Paper Prototyping: The Fast and Easy Way to Design and Refine User Interfaces*. San Francisco, CA: Morgan Kaufmann, 2003.

[2] B. Buxton, *Sketching User Experiences: Getting the Design Right and the Right Design*. San Francisco, CA: Morgan Kaufmann, 2007.
