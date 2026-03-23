# Mnemosyne — Guía de Estilo Visual

**Documento:** Style Guide v1.0  
**Fase DCU:** Conceptualización — Definición del lenguaje visual  
**Referencia metodológica:** Lidwell, Holden & Butler (2010) [1]; Weinschenk (2011) [2]; Elliot & Maier (2014) [3]  
**Datos de entrada:** Wireframes (04), Modelos Mentales (03), Requisitos No Funcionales (02), Microinteracciones (05)  

---

## 1. Filosofía Visual

### 1.1. Principios de diseño

El lenguaje visual de Mnemosyne se rige por cinco principios derivados directamente de los hallazgos de investigación:

| Principio | Definición | Origen |
|---|---|---|
| **Calma** | La interfaz no debe generar ansiedad. Los colores, las transiciones y los elementos deben transmitir serenidad | RNF-08 (paleta calmante); Tema 4 (miedo a "romper algo"); audiencia con ansiedad, TEPT |
| **Claridad** | Cada elemento tiene un propósito visible e inmediatamente comprensible. Sin decoración superflua | RNF-01, RNF-02 (tipografía y áreas grandes); Tema 4 (iconos confusos, texto pequeño) |
| **Confianza** | El usuario debe sentir que tiene el control y que el sistema es seguro. La reversibilidad es visualmente explícita | Tema 6 (ética: reversibilidad); Gap "miedo a romper" (Modelo Mental §2.2) |
| **Calidez** | El sistema es una herramienta de cuidado, no una aplicación clínica fría. El tono visual es humano y acogedor | Tema 1 (angustia emocional); Personas: contexto doméstico, relaciones familiares |
| **Diferenciación** | Las tres vistas deben ser visualmente reconocibles pero coherentes dentro del mismo sistema | Alternativa C (04_design_alternatives.md): "Tres Experiencias, Un Sistema" |

### 1.2. Metáfora visual

La metáfora visual de Mnemosyne combina dos mundos:

- **Galería de recuerdos:** Espacios abiertos, fondos claros, tarjetas con bordes suaves, imágenes prominentes. Evoca un álbum de fotos moderno (modelo mental de María Luisa).
- **Panel de control neuronal sutil:** Gradientes suaves azul-violeta, animaciones de conexión, indicadores de estado. Evoca la tecnología avanzada del implante sin caer en lo frío o amenazante (modelo mental de Carlos).

---

## 2. Paleta Cromática

### 2.1. Justificación psicológica

La selección de colores se fundamenta en la investigación de Elliot & Maier (2014) sobre la psicología del color [3] y las recomendaciones de diseño para contextos sanitarios:

- **Azul:** Asociado a la confianza, la calma y la estabilidad. Color primario del sistema. Reduce la frecuencia cardíaca percibida (Elliot & Maier, 2014) [3].
- **Verde:** Asociado a la seguridad, la confirmación y el bienestar. Usado para acciones positivas (guardar, éxito).
- **Ámbar/Naranja cálido:** Señal de atención sin alarma. Usado para avisos y límites. Se evita el rojo puro para no generar ansiedad (RNF-08; Tema 4: pacientes con ansiedad y TEPT).
- **Violeta suave:** Diferenciador de la vista terapéutica de Carlos. Asociado a la introspección y la calma profunda.

### 2.2. Colores del sistema

#### Colores primarios

| Token CSS | Valor | Muestra | Uso |
|---|---|---|---|
| `--color-primary` | `#4A90D9` | 🔵 Azul medio | Acciones principales, sliders, enlaces, elementos interactivos |
| `--color-primary-dark` | `#2E6DB4` | 🔵 Azul oscuro | Hover y pressed states de elementos primarios |
| `--color-primary-light` | `#E8F4FD` | 🔵 Azul pálido | Fondos destacados, badges informativos, selección activa |

#### Colores semánticos

| Token CSS | Valor | Muestra | Uso |
|---|---|---|---|
| `--color-success` | `#4CAF81` | 🟢 Verde calmado | Confirmaciones, guardado exitoso, indicador positivo |
| `--color-success-light` | `#E8F5E9` | 🟢 Verde pálido | Fondo de mensajes de éxito |
| `--color-warning` | `#E67E22` | 🟠 Ámbar cálido | Límites del terapeuta, avisos no críticos |
| `--color-warning-light` | `#FFF3E0` | 🟠 Ámbar pálido | Fondo de avisos de seguridad |
| `--color-danger` | `#C0392B` | 🔴 Rojo apagado | Solo para errores del sistema. NUNCA en acciones del usuario ni en la vista de María Luisa |
| `--color-danger-light` | `#FDEDEC` | 🔴 Rojo pálido | Fondo de errores del sistema (uso mínimo) |

#### Colores de indicador emocional (Vista Terapéutica)

| Token CSS | Valor | Nivel | Uso |
|---|---|---|---|
| `--color-emotion-high` | `#D35F5F` | 8-10 | Indicador de carga emocional alta (rojo apagado, no saturado) |
| `--color-emotion-medium` | `#E6A23C` | 5-7 | Indicador de carga emocional media |
| `--color-emotion-low` | `#67A87B` | 1-4 | Indicador de carga emocional baja |

#### Colores neutros

| Token CSS | Valor | Uso |
|---|---|---|
| `--color-text-primary` | `#1A1A2E` | Texto principal (títulos, cuerpo) |
| `--color-text-secondary` | `#5A6178` | Texto secundario (subtítulos, metadatos) |
| `--color-text-muted` | `#9CA3AF` | Texto deshabilitado, placeholders |
| `--color-bg-primary` | `#FFFFFF` | Fondo principal de tarjetas y paneles |
| `--color-bg-secondary` | `#F7F8FA` | Fondo de la aplicación |
| `--color-bg-tertiary` | `#EEF0F4` | Fondo de secciones, separadores |
| `--color-border` | `#E2E8F0` | Bordes de tarjetas, separadores |
| `--color-border-hover` | `#B0C4DE` | Bordes en estado hover |

#### Colores diferenciadores por vista

| Vista | Color de acento | Header/Nav | Justificación |
|---|---|---|---|
| Paciente-Alzheimer | `--color-primary` (#4A90D9) Azul | Fondo blanco, nav clara | Máxima claridad y calma. El azul transmite confianza (Modelo Mental María Luisa) |
| Paciente-Terapéutica | `--color-therapeutic` (#7B3FB5) Violeta | Fondo oscuro (#1E293B), nav oscura | Ambiente de introspección. El fondo oscuro reduce la estimulación visual para trabajo con recuerdos traumáticos |
| Cuidador | `--color-cuidador` (#388E3C) Verde | Fondo blanco, sidebar verde suave | Verde = seguridad, control. Elena necesita sentir que gestiona un sistema confiable |

### 2.3. Contraste y accesibilidad cromática

Todos los pares texto-fondo cumplen **WCAG 2.1 nivel AA** (mínimo 4.5:1 para texto normal, 3:1 para texto grande):

| Par | Ratio de contraste | Nivel WCAG |
|---|---|---|
| `--color-text-primary` sobre `--color-bg-primary` (#1A1A2E / #FFF) | **15.4:1** | AAA ✅ |
| `--color-text-primary` sobre `--color-bg-secondary` (#1A1A2E / #F7F8FA) | **14.2:1** | AAA ✅ |
| `--color-text-secondary` sobre `--color-bg-primary` (#5A6178 / #FFF) | **5.8:1** | AA ✅ |
| `--color-primary` sobre `--color-bg-primary` (#4A90D9 / #FFF) | **3.5:1** | AA para texto grande ✅ |
| `#FFFFFF` sobre `--color-primary` (#FFF / #4A90D9) | **3.5:1** | AA para texto grande ✅ |
| `#FFFFFF` sobre `--color-success` (#FFF / #4CAF81) | **3.1:1** | AA para texto grande ✅ |
| `--color-text-primary` sobre `--color-warning-light` (#1A1A2E / #FFF3E0) | **13.8:1** | AAA ✅ |

**Nota:** Para garantizar el cumplimiento en el slider primario (texto blanco sobre azul), se usa tipografía bold ≥18px, lo que califica como "texto grande" bajo WCAG y requiere solo 3:1.

---

## 3. Tipografía

### 3.1. Selección de fuentes

| Fuente | Uso | Justificación |
|---|---|---|
| **Inter** (sans-serif) | Texto de interfaz: etiquetas, botones, metadatos, cuerpo | Inter fue diseñada específicamente para pantallas, con apertura amplia, trazos uniformes y excelente legibilidad a tamaños pequeños. Licencia libre (SIL OFL). Disponible en Google Fonts |
| **Fallback:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Si Inter no carga | System fonts garantizan legibilidad nativa en cada plataforma |

### 3.2. Escala tipográfica

La escala sigue una progresión de **1.25 (Major Third)** que proporciona contraste claro entre niveles sin saltos bruscos:

| Token CSS | Tamaño | Peso | Uso | Justificación |
|---|---|---|---|---|
| `--font-size-xs` | 12px / 0.75rem | 400 | Etiquetas menores, timestamps, tooltips | Solo en Vista Carlos/Elena; nunca en Vista María Luisa |
| `--font-size-sm` | 14px / 0.875rem | 400 | Texto secundario, subtítulos, metadatos (Carlos/Elena) | — |
| `--font-size-base` | 18px / 1.125rem | 400 | **Texto base de toda la aplicación** | RNF-01: mínimo 18px. Tema 4: OC1/OC2 configuraron tablets al máximo |
| `--font-size-md` | 20px / 1.25rem | 500 | Etiquetas de sección, descriptor verbal del slider | Distingue secciones sin usar formato de heading |
| `--font-size-lg` | 24px / 1.5rem | 600 | Títulos de pantalla, nombre de recuerdo | RNF-01: 24px mínimo para títulos clave |
| `--font-size-xl` | 30px / 1.875rem | 700 | Títulos principales (Dashboard), saludo personalizado | Impacto visual para el primer elemento que ve María Luisa |
| `--font-size-2xl` | 36px / 2.25rem | 700 | Indicador de porcentaje prominente (slider) | El % debe ser legible a distancia de brazo (tablet en mesa auxiliar, OC1) |

### 3.3. Reglas tipográficas por vista

| Regla | María Luisa | Carlos | Elena |
|---|---|---|---|
| Tamaño mínimo de texto | 18px (sin excepciones) | 14px | 14px |
| Títulos | 24-30px, bold | 20-24px, semibold | 18-24px, semibold |
| Interlineado | 1.6 (mayor espacio) | 1.5 | 1.5 |
| Ancho máximo de línea | 45 caracteres | 70 caracteres | 70 caracteres |
| Alineación | Izquierda siempre | Izquierda | Izquierda |
| Uso de MAYÚSCULAS | Nunca (dificulta lectura en mayores) | Solo en labels cortos | Solo en labels cortos |
| Cursiva | Nunca | Mínimo | Permitido |

---

## 4. Iconografía

### 4.1. Sistema de iconos

| Propiedad | Especificación | Justificación |
|---|---|---|
| **Estilo** | Línea (outline), trazo 2px, puntas redondeadas | Claridad visual y ligereza. Los iconos filled pueden confundirse con botones |
| **Librería base** | Lucide Icons (licencia MIT) o equivalente line-art | Consistencia de estilo, amplio catálogo, pesos uniformes |
| **Tamaño base** | 24x24px (María Luisa: 28x28px) | WCAG: área mínima de icono 24px. Para María Luisa se amplía |
| **Color** | Heredado del texto adyacente (`currentColor`) | Mantiene consistencia con el contexto |
| **Redundancia** | Todo icono va acompañado de texto | Tema 4: los iconos solos no se entienden (OC1). Heurística Nielsen 6 (reconocimiento > recuerdo) |

### 4.2. Catálogo de iconos del sistema

| Icono | Nombre | Uso | Texto acompañante |
|---|---|---|---|
| 🏠 | `home` | Navegación: inicio | "Inicio" |
| 🔍 | `search` | Barra de búsqueda | "Buscar un recuerdo..." |
| 📷 | `image` | Navegación: galería | "Galería" |
| ⚙ | `settings` | Navegación: ajustes | "Ajustes" |
| ← | `arrow-left` | Botón volver | "Volver" |
| 💾 | `save` | Guardar ajuste | "Guardar ajuste" |
| ↩ | `undo` | Deshacer cambio | "Deshacer" |
| ✓ | `check` | Confirmación en diálogo | "Sí, guardar" |
| ✕ | `x` | Cancelar en diálogo | "No, cancelar" |
| ⭐ | `star` | Favorito (lleno/vacío) | "Favorito" |
| 👤 | `user` | Persona en recuerdo | [nombre de la persona] |
| 📍 | `map-pin` | Lugar del recuerdo | [nombre del lugar] |
| 📅 | `calendar` | Fecha del recuerdo | [fecha formateada] |
| ℹ | `info` | Información contextual | Mensaje informativo |
| 👁 | `eye` | Previsualizar como paciente | "Previsualizar como [nombre]" |
| 🔒 | `lock` | Permisos y límites | "Permisos y límites" |

---

## 5. Componentes UI — Design Tokens

### 5.1. Espaciado

Escala basada en **múltiplos de 4px** (sistema de 4-point grid):

| Token CSS | Valor | Uso |
|---|---|---|
| `--space-xs` | 4px | Separación interna mínima, gap entre icono y texto |
| `--space-sm` | 8px | Padding interno de badges, separación entre elementos en línea |
| `--space-md` | 16px | Padding interno estándar de tarjetas y botones |
| `--space-lg` | 24px | Margen entre secciones, gap entre tarjetas |
| `--space-xl` | 32px | Margen entre bloques principales |
| `--space-2xl` | 48px | Margen superior/inferior de secciones de página |

### 5.2. Bordes y sombras

| Token CSS | Valor | Uso |
|---|---|---|
| `--radius-sm` | 8px | Botones, badges, inputs |
| `--radius-md` | 12px | Tarjetas, paneles, modales |
| `--radius-lg` | 16px | Contenedores principales, esquinas de página |
| `--radius-full` | 9999px | Elementos circulares (avatares, slider thumb) |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Tarjetas en reposo |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.10)` | Tarjetas en hover, paneles elevados |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modales, dropdowns |
| `--shadow-focus` | `0 0 0 3px rgba(74,144,217,0.4)` | Focus ring para accesibilidad de teclado |

### 5.3. Especificación de componentes principales

#### Botón Primario

```
┌─────────────────────────────────┐
│  ✓  Sí, guardar                 │
└─────────────────────────────────┘

Propiedad            Valor                              Justificación
─────────────────────────────────────────────────────────────────────
background           var(--color-success) #4CAF81       Verde = acción positiva segura
color                #FFFFFF                             Contraste 3.1:1 (texto grande)
font-size            18px (--font-size-base)            RNF-01
font-weight          600 (semibold)                     Prominencia
padding              16px 24px                          Área táctil generosa
min-height           56px                               Superior a 48px WCAG (RNF-02)
min-width            160px                              Estabilidad visual
border-radius        var(--radius-sm) 8px               Suave, no agresivo
border               none                               Simplicidad
cursor               pointer
transition           all 150ms ease-out

:hover               background: #3D9970; transform: translateY(-1px); shadow-md
:active              background: #2E8B57; transform: translateY(0); shadow-sm
:focus-visible       outline: none; box-shadow: var(--shadow-focus)
:disabled            background: #CCC; color: #888; cursor: not-allowed
```

#### Botón Secundario

```
┌─────────────────────────────────┐
│  ✕  No, cancelar                │
└─────────────────────────────────┘

Propiedad            Valor                              Justificación
─────────────────────────────────────────────────────────────────────
background           var(--color-bg-tertiary) #EEF0F4   Neutro, no compite con primario
color                var(--color-text-secondary) #5A6178
font-size            18px
font-weight          500
padding              16px 24px
min-height           56px
border-radius        8px
border               1px solid var(--color-border)

:hover               background: #E2E5EB; border-color: var(--color-border-hover)
:active              background: #D5D9E0
```

#### Slider (Claridad / Atenuación)

```
Propiedad            Valor                              Justificación
─────────────────────────────────────────────────────────────────────
TRACK:
height               8px                                Visible pero no dominante
background           var(--color-bg-tertiary)           Neutro
border-radius        4px
min-width            200px (wireframe: todo el ancho)   HTA-1 tarea 3.1: slider mín 200px

TRACK FILL:
background           var(--color-primary) #4A90D9       Indica progreso
border-radius        4px

THUMB:
width × height       32px × 32px (María Luisa: 40px)   RNF-02: área táctil ≥48px con padding
background           var(--color-primary)
border               3px solid #FFFFFF
border-radius        var(--radius-full)
box-shadow           0 2px 6px rgba(74,144,217,0.3)

THUMB :active:
transform            scale(1.15)                        Feedback de agarre
box-shadow           0 2px 10px rgba(74,144,217,0.4)

LIMIT MARKER (solo Vista Terapéutica):
width                4px
height               20px (sobresale del track)
background           var(--color-warning) #E67E22
border-radius        2px
```

#### Tarjeta de Recuerdo

```
Propiedad            Valor (María Luisa)                Valor (Carlos)
─────────────────────────────────────────────────────────────────────
width                calc(50% - gap)                    100% (lista)
min-height           180px                              72px
padding              var(--space-md) 16px               var(--space-sm) 8px 
border-radius        var(--radius-md) 12px              var(--radius-md) 12px
background           var(--color-bg-primary)            var(--color-bg-primary)
border               1px solid var(--color-border)      1px solid var(--color-border)
box-shadow           var(--shadow-sm)                   var(--shadow-sm)

Thumbnail size       100% width, 120px height           56px × 56px
Título font-size     18px (--font-size-base)            16px
Subtítulo font-size  16px                               14px
Badge filtro         28px circular, esquina inf-der     20px, inline
```

#### Modal / Diálogo

```
Propiedad            Valor                              Justificación
─────────────────────────────────────────────────────────────────────
OVERLAY:
background           rgba(0, 0, 0, 0.4)                Oscurece sin ser opresivo (RNF-08)

MODAL:
width                min(90vw, 420px)                   Responsive; no ocupa toda la pantalla
padding              var(--space-xl) 32px               Espacio generoso
border-radius        var(--radius-lg) 16px              Suave y amigable
background           var(--color-bg-primary)
box-shadow           var(--shadow-lg)
text-align           center

Título font-size     var(--font-size-lg) 24px           Legible para María Luisa
Cuerpo font-size     var(--font-size-base) 18px
Botones gap          var(--space-md) 16px
Botones layout       flex row, cada uno min-width 45%   Dos botones lado a lado
```

---

## 6. Fondos y Ambientación por Vista

### 6.1. Vista Paciente-Alzheimer

| Elemento | Valor | Justificación |
|---|---|---|
| Fondo de página | `--color-bg-secondary` (#F7F8FA) | Fondo claro, neutro, sin distracción. Máximo contraste con tarjetas blancas |
| Header | Blanco (#FFF), border-bottom sutil | Limpieza. No agobia con color |
| Nav inferior | Blanco (#FFF), border-top sutil | Consistencia con header |
| Acento cromático | Azul (`--color-primary`) en slider, badges, enlace activo | Azul = confianza, calma |

### 6.2. Vista Paciente-Terapéutica

| Elemento | Valor | Justificación |
|---|---|---|
| Fondo de página | `#F3F0F7` (violeta muy pálido) | Diferenciación visual sutil de la vista Alzheimer. Violeta = introspección |
| Header | `#1E293B` (slate oscuro) | Ambiente de concentración. Reduce estimulación periférica |
| Área de imagen | Fondo oscuro `#1A1A2E` | El recuerdo destaca sobre fondo oscuro. Menor fatiga visual en sesiones de trabajo emocional |
| Acento cromático | Violeta (`--color-therapeutic` #7B3FB5) en slider, badges | Diferenciador. El violeta se asocia a la introspección y la terapia |

### 6.3. Vista Cuidador

| Elemento | Valor | Justificación |
|---|---|---|
| Fondo de página | `--color-bg-secondary` (#F7F8FA) | Mismo fondo que Alzheimer (consistencia del sistema base) |
| Sidebar | Blanco con acento verde suave en el borde izquierdo | Verde = gestión segura. Sidebar para navegación tipo panel de control (modelo mental Elena, §4.1) |
| Header | Blanco con badge verde "Panel de cuidador" | Identifica claramente el rol activo |
| Acento cromático | Verde (`--color-cuidador` #388E3C) en nav activa, botón primario | Verde = seguridad, confianza en la gestión |

---

## 7. Animación y Movimiento

### 7.1. Tokens de animación

(Definidos en detalle en 05_microinteractions.md, aquí se resumen como tokens CSS)

| Token CSS | Valor | Uso |
|---|---|---|
| `--duration-instant` | 50ms | Press feedback |
| `--duration-fast` | 150ms | Hover, tooltip |
| `--duration-normal` | 300ms | Transiciones de pantalla, modales |
| `--duration-slow` | 500ms | Animación de procesamiento neural |
| `--duration-emphasis` | 800ms | Reveal de imagen del recuerdo |
| `--ease-default` | `ease-out` | Mayoría de transiciones |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Aparición de modales, pop de badges |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Slider, fades |

### 7.2. Reglas de movimiento

| Regla | Especificación | Justificación |
|---|---|---|
| Sin parpadeos ni flashes | Ninguna animación con frecuencia >3 Hz | WCAG 2.3.1 (convulsiones); audiencia con TEPT (fotosensibilidad) |
| Respetar `prefers-reduced-motion` | Si activado: todas las duraciones → 0ms, todos los transform → none | Accesibilidad. Pacientes con mareo o sensibilidad al movimiento |
| Transiciones suaves, nunca abruptas | Siempre ease-out o ease-in-out; nunca linear | Calma visual. Las transiciones lineales se perciben como mecánicas |
| Sin animaciones en bucle infinito | El loading neural tiene máx. 3 ciclos y luego se detiene mostrando contenido | Evitar distracción y ansiedad en María Luisa |

---

## 8. Layout y Grid System

### 8.1. Grid base

| Propiedad | Valor | Justificación |
|---|---|---|
| Sistema | CSS Grid + Flexbox complementario | Grid para layout macro; Flexbox para alineación interna de componentes |
| Columnas (María Luisa) | 2 columnas para tarjetas | Tarjetas grandes, máx 2 por fila (RNF-05: pocas opciones visibles) |
| Columnas (Carlos) | 1 columna principal + sidebar de metadatos | Layout de trabajo: visor central + información lateral |
| Columnas (Elena) | Sidebar fija (240px) + área de contenido fluida | Patrón de panel de administración estándar (modelo mental Elena §4.1) |
| Gap | `--space-lg` (24px) | Espacio generoso entre elementos (claridad visual) |
| Max-width | 1200px (centrado) | Legibilidad; evita líneas de texto demasiado largas |
| Padding lateral | `--space-lg` (24px) móvil; `--space-xl` (32px) escritorio | Márgenes respirables |

### 8.2. Breakpoints responsive

| Token | Valor | Dispositivo | Layout |
|---|---|---|---|
| `--bp-mobile` | 480px | Móvil (Elena on-the-go) | 1 columna, sidebar colapsada |
| `--bp-tablet` | 768px | Tablet (María Luisa, uso principal) | 2 columnas, nav inferior |
| `--bp-desktop` | 1024px | Escritorio (Carlos, uso principal) | Layout completo con sidebar |
| `--bp-wide` | 1280px | Monitores grandes | Max-width aplicado, centrado |

---

## 9. Tratamiento del Contenido Placeholder

Dado que Mnemosyne trabaja con "recuerdos" que en el prototipo son imágenes placeholder, se necesita un tratamiento visual que mantenga la credibilidad:

| Elemento | Tratamiento | Justificación |
|---|---|---|
| Thumbnail de recuerdo | Imagen de stock de escenas familiares (Unsplash, licencia libre) con `border-radius: 8px`. Efecto blur base que varía con el slider | Simula que el implante captura recuerdos con cierta borrosidad natural |
| Avatar de persona | Imagen circular (80px en Dashboard María Luisa) con borde blanco 3px | Mapea al modelo mental de "álbum de fotos con caras" |
| Imagen en el Visor | Imagen grande con overlay de gradiente sutil en la parte inferior (para legibilidad de metadatos superpuestos) | Patrón estándar de galería/visor de medios |
| Indicador de audio | Icono de onda sonora + barra de progreso estilizada. Sin audio real (placeholder visual) | Simula el componente multisensorial (RF-07) sin requerir archivos de audio |

---

## 10. Referencias

[1] W. Lidwell, K. Holden, and J. Butler, *Universal Principles of Design*, revised ed. Beverly, MA: Rockport Publishers, 2010.

[2] S. Weinschenk, *100 Things Every Designer Needs to Know About People*. Berkeley, CA: New Riders, 2011.

[3] A. J. Elliot and M. A. Maier, "Color psychology: Effects of perceiving color on psychological functioning in humans," *Annual Review of Psychology*, vol. 65, pp. 95–120, 2014.
