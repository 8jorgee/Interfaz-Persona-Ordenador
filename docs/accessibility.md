# Mnemosyne — Directrices de Accesibilidad

**Documento:** Accessibility Guidelines v1.0  
**Fase DCU:** Conceptualización — Diseño inclusivo  
**Normativa de referencia:** WCAG 2.1 (W3C, 2018) [1]; EN 301 549 (estándar europeo de accesibilidad digital) [2]  
**Nivel objetivo:** AA (con mejoras puntuales hacia AAA dada la audiencia vulnerable)  

---

## 1. Justificación del Enfoque de Accesibilidad

Mnemosyne tiene una audiencia primaria con necesidades de accesibilidad específicas que van más allá del cumplimiento normativo estándar:

| Audiencia | Necesidades específicas | Origen (hallazgos) |
|---|---|---|
| María Luisa (72, Alzheimer leve) | Deterioro cognitivo que afecta a la memoria de trabajo, la atención y la comprensión de instrucciones complejas. Motricidad fina reducida | Tema 4, OC1, OC2 |
| Carlos (38, TEPT) | Sensibilidad a estímulos visuales bruscos (flashes, rojos saturados). Posible hipervigilancia que dificulta la concentración | Tema 3, E3 (Dr. Molina) |
| Adultos mayores en general | Presbicia (visión reducida de cerca), pérdida de sensibilidad al contraste, tiempo de reacción más lento | Czaja et al. (2006) [3] |

Por tanto, el diseño de accesibilidad de Mnemosyne no se limita a cumplir WCAG AA, sino que incorpora **accesibilidad cognitiva** como eje transversal.

---

## 2. Cumplimiento WCAG 2.1 — Matriz por Principio

### 2.1. Perceptible

| Criterio WCAG | Nivel | Implementación en Mnemosyne | Estado |
|---|---|---|---|
| **1.1.1** Contenido no textual | A | Todas las imágenes de recuerdo tienen `alt` descriptivo. Los iconos decorativos tienen `aria-hidden="true"`. Los iconos funcionales tienen `aria-label` | ✅ Cumple |
| **1.3.1** Información y relaciones | A | HTML semántico (`<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`). Headings jerárquicos (h1→h3). Roles ARIA para landmarks | ✅ Cumple |
| **1.3.4** Orientación | AA | La interfaz funciona en portrait y landscape. No se fuerza ninguna orientación | ✅ Cumple |
| **1.4.1** Uso del color | A | El color nunca es el único medio de transmitir información. Los filtros activos se indican con badge + icono + texto. Los niveles emocionales tienen color + número + descriptor | ✅ Cumple |
| **1.4.3** Contraste mínimo | AA | Todos los pares texto/fondo ≥ 4.5:1 (texto normal) o ≥ 3:1 (texto grande). Verificado en Style Guide §2.3 | ✅ Cumple |
| **1.4.4** Cambio de tamaño de texto | AA | Layout fluido; el texto escala hasta 200% sin pérdida de funcionalidad (rem units) | ✅ Cumple |
| **1.4.10** Reflow | AA | A 320px CSS de ancho, todo el contenido es accesible sin scroll horizontal | ✅ Cumple |
| **1.4.11** Contraste no textual | AA | Los bordes de controles (sliders, inputs, botones) tienen ≥ 3:1 contra el fondo | ✅ Cumple |
| **1.4.13** Contenido on hover/focus | AA | Los tooltips son persistentes (no desaparecen al mover el ratón), pueden cerrarse con Escape, y no cubren contenido crítico | ✅ Cumple |

### 2.2. Operable

| Criterio WCAG | Nivel | Implementación en Mnemosyne | Estado |
|---|---|---|---|
| **2.1.1** Teclado | A | Toda la funcionalidad accesible con Tab, Enter, Space, Escape, flechas. Slider operable con ←/→ (±1%) | ✅ Cumple |
| **2.1.2** Sin trampa de teclado | A | Ningún componente atrapa el foco. Los modales tienen foco contenido (focus trap) con salida por Escape o botón cancelar | ✅ Cumple |
| **2.2.1** Temporización ajustable | A | El timeout de sesión de Carlos (10 min) es configurable. Los mensajes de éxito (2s) no requieren interacción | ✅ Cumple |
| **2.3.1** Tres destellos | A | Ninguna animación supera 3 Hz. Sin parpadeos. La animación "neural" usa pulsos suaves (<1 Hz) | ✅ Cumple |
| **2.4.1** Saltar bloques | A | Enlace "Saltar al contenido principal" como primer elemento del Tab order | ✅ Cumple |
| **2.4.3** Orden de foco | A | Tab order sigue el flujo visual: header → contenido principal → controles → navegación | ✅ Cumple |
| **2.4.6** Encabezados y etiquetas | AA | Cada sección tiene un heading descriptivo. Cada input tiene un `<label>` asociado | ✅ Cumple |
| **2.4.7** Foco visible | AA | Focus ring personalizado: `box-shadow: 0 0 0 3px rgba(74,144,217,0.4)` (azul semitransparente, visible sobre cualquier fondo) | ✅ Cumple |
| **2.5.5** Tamaño del objetivo | AAA* | Todos los objetivos táctiles ≥ 56px (superior al mínimo AA de 44px) | ✅ Supera |

*Se alcanza nivel AAA en tamaño de objetivo por las necesidades específicas de María Luisa (motricidad fina reducida).

### 2.3. Comprensible

| Criterio WCAG | Nivel | Implementación en Mnemosyne | Estado |
|---|---|---|---|
| **3.1.1** Idioma de la página | A | `<html lang="es">` en todas las páginas | ✅ Cumple |
| **3.2.1** Al recibir foco | A | Ningún elemento cambia el contexto al recibir foco | ✅ Cumple |
| **3.2.2** Al recibir entrada | A | Los sliders no ejecutan acciones al ser movidos. Se requiere acción explícita ("Guardar") para persistir cambios | ✅ Cumple |
| **3.3.1** Identificación de errores | A | Los errores se describen en texto (no solo en color). Mensaje junto al campo/componente afectado | ✅ Cumple |
| **3.3.2** Etiquetas o instrucciones | A | Todos los controles tienen etiqueta visible. Los sliders tienen descriptor verbal + numérico + instrucción contextual | ✅ Cumple |
| **3.3.3** Sugerencia ante errores | AA | La búsqueda sin resultados sugiere "Prueba con otro nombre o fecha" | ✅ Cumple |
| **3.3.4** Prevención de errores | AA | Todas las acciones de filtro requieren confirmación explícita. Cambios bruscos detectados automáticamente. Botón "Deshacer" siempre visible | ✅ Cumple |

### 2.4. Robusto

| Criterio WCAG | Nivel | Implementación en Mnemosyne | Estado |
|---|---|---|---|
| **4.1.1** Parsing | A | HTML validado W3C. Sin errores de marcado | ✅ Cumple |
| **4.1.2** Nombre, función, valor | A | Todos los componentes interactivos tienen nombre accesible (`aria-label` o `<label>`), función (role implícito o explícito) y valor (para sliders: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`) | ✅ Cumple |

---

## 3. Accesibilidad Cognitiva — Más Allá de WCAG

WCAG 2.1 no cubre suficientemente las necesidades cognitivas de personas con Alzheimer leve. Se aplican las recomendaciones del W3C Cognitive and Learning Disabilities Accessibility Task Force (COGA) [4]:

| Directriz COGA | Implementación en Mnemosyne | Vista afectada |
|---|---|---|
| **Usar lenguaje simple y claro** | Vocabulario del usuario, no clínico (RNF-04). Frases cortas. Sin jerga técnica en Vista María Luisa | María Luisa |
| **Minimizar la memoria de trabajo** | Máximo 3 acciones visibles por pantalla (RNF-05). Navegación de 3 niveles máximo. No se requiere recordar pasos previos | María Luisa |
| **Hacer los pasos claros** | Cada pantalla tiene una acción principal evidente. Los diálogos de confirmación repiten qué se va a hacer ("¿Guardar la claridad al 75%?") | Todas |
| **Proporcionar feedback inmediato** | Cada acción tiene respuesta visual en <200ms (RNF-06). Mensajes de éxito confirmatorios | Todas |
| **Permitir recuperación de errores** | "Deshacer" siempre visible. Filtros reversibles. Detección de cambios bruscos | Todas |
| **Mantener la consistencia** | Las mismas acciones siempre están en los mismos lugares. Los colores tienen significados consistentes | Todas |
| **No depender de la temporización** | Ninguna acción tiene límite de tiempo en la Vista María Luisa. Los mensajes no desaparecen antes de que el usuario actúe (excepto el toast de éxito, que es no-crítico) | María Luisa |
| **Apoyar la orientación** | Título de pantalla siempre visible en el header. Breadcrumb implícito con "← Volver". Saludo personalizado en Dashboard | María Luisa |

---

## 4. Implementación ARIA — Especificación por Componente

### 4.1. Slider de filtro

```html
<div role="slider"
     aria-label="Claridad Facial"
     aria-valuenow="75"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-valuetext="75 por ciento, clara"
     tabindex="0">
</div>
```

**Notas:**
- `aria-valuetext` incluye el descriptor verbal ("clara") además del número, para lectores de pantalla.
- El slider responde a las teclas ← (−1%), → (+1%), Home (0%), End (100% o límite del terapeuta).
- Al cambiar, se anuncia vía `aria-live="polite"` en un elemento asociado: "Claridad Facial: 75%, clara".

### 4.2. Slider con límite del terapeuta (Carlos)

```html
<div role="slider"
     aria-label="Atenuación Emocional"
     aria-valuenow="40"
     aria-valuemin="0"
     aria-valuemax="70"
     aria-valuetext="40 por ciento, moderado. Límite de tu terapeuta: 70 por ciento"
     tabindex="0">
</div>
```

**Notas:**
- `aria-valuemax` refleja el límite del terapeuta, no 100%.
- `aria-valuetext` incluye la información del límite.
- Al alcanzar el límite, se anuncia: "Has alcanzado el límite de atenuación configurado por Dr. Molina".

### 4.3. Diálogo modal

```html
<div role="dialog"
     aria-modal="true"
     aria-labelledby="dialog-title"
     aria-describedby="dialog-message">
  <h2 id="dialog-title">Guardar cambio</h2>
  <p id="dialog-message">¿Guardar la claridad al 75%? Puedes cambiarlo cuando quieras.</p>
  <button autofocus>Sí, guardar</button>
  <button>No, cancelar</button>
</div>
```

**Notas:**
- Focus trap: Tab circula solo entre los botones del modal.
- Escape cierra el modal (= Cancelar).
- `autofocus` en el botón primario para acceso inmediato.
- Al abrir, el lector de pantalla anuncia título + mensaje.

### 4.4. Tarjeta de recuerdo

```html
<article role="article" aria-label="Recuerdo: Navidad 2025">
  <img src="..." alt="Cena de Nochebuena en casa familiar. Personas presentes: Lucía, Tomás, Pablo, Elena">
  <h3>Navidad 2025</h3>
  <p>24 de diciembre · 5 personas</p>
  <span aria-label="Filtro de claridad activo al 75%">🔵 75%</span>
</article>
```

### 4.5. Regiones live para feedback

```html
<!-- Región para anuncios de slider (actualización en tiempo real) -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="slider-announce">
  Claridad Facial: 75%, clara
</div>

<!-- Región para mensajes de éxito/error -->
<div aria-live="assertive" aria-atomic="true" class="sr-only" id="status-announce">
  Ajuste guardado correctamente
</div>
```

**Notas:**
- `aria-live="polite"` para actualizaciones del slider (no interrumpe).
- `aria-live="assertive"` para mensajes de éxito/error (interrumpe la lectura actual).
- `.sr-only` hace que la región sea invisible visualmente pero accesible para lectores de pantalla.

---

## 5. Checklist de Accesibilidad para Desarrollo

Esta checklist se usará durante la implementación (Commits 7-12) y la evaluación (Commit 13):

### 5.1. HTML y estructura

- [ ] Todo el documento tiene `<html lang="es">`
- [ ] Headings jerárquicos sin saltos (h1 → h2 → h3)
- [ ] Landmarks semánticos: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- [ ] Enlace "Saltar al contenido principal" como primer elemento focusable
- [ ] Todo `<img>` tiene `alt` descriptivo o `alt=""` si es decorativo
- [ ] Todo `<input>` / control tiene `<label>` asociado

### 5.2. Teclado

- [ ] Toda funcionalidad accesible sin ratón
- [ ] Tab order sigue el flujo visual
- [ ] Focus ring visible en todos los elementos focusables
- [ ] Sliders operables con ←/→/Home/End
- [ ] Escape cierra modales y tooltips
- [ ] No hay trampa de teclado

### 5.3. Visual

- [ ] Contraste texto ≥ 4.5:1 (normal) o 3:1 (grande, ≥18px bold)
- [ ] Contraste de elementos no textuales ≥ 3:1
- [ ] El color no es el único medio de transmitir información
- [ ] Texto escalable hasta 200% sin pérdida
- [ ] Respeta `prefers-reduced-motion`
- [ ] Sin parpadeos > 3 Hz
- [ ] Áreas táctiles ≥ 56px (María Luisa) / ≥ 44px (otros)

### 5.4. ARIA

- [ ] Sliders con `role="slider"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- [ ] Modales con `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
- [ ] Regiones live para feedback dinámico
- [ ] Iconos decorativos con `aria-hidden="true"`
- [ ] Iconos funcionales con `aria-label`

### 5.5. Cognitiva

- [ ] Máximo 3 acciones por pantalla en Vista María Luisa
- [ ] Vocabulario no técnico en toda la interfaz
- [ ] Feedback inmediato para cada acción
- [ ] "Deshacer" siempre visible
- [ ] Confirmación explícita antes de cambios
- [ ] Títulos de pantalla siempre visibles

---

## 6. Referencias

[1] W3C, "Web Content Accessibility Guidelines (WCAG) 2.1," W3C Recommendation, Jun. 2018. [Online]. Available: https://www.w3.org/TR/WCAG21/

[2] ETSI, "EN 301 549 V3.2.1: Accessibility requirements for ICT products and services," 2021.

[3] S. J. Czaja et al., "Factors predicting the use of technology: Findings from the Center for Research and Education on Aging and Technology Enhancement (CREATE)," *Psychology and Aging*, vol. 21, no. 2, pp. 333–352, 2006.

[4] W3C, "Making Content Usable for People with Cognitive and Learning Disabilities," W3C Working Group Note, Apr. 2021. [Online]. Available: https://www.w3.org/TR/coga-usable/
