# Mnemosyne — Exploración de Alternativas de Diseño

**Documento:** Design Alternatives v1.0  
**Fase DCU:** Conceptualización — Exploración de conceptos  
**Referencia metodológica:** Buxton (2007) [1]; Tohidi et al. (2006) [2]  
**Datos de entrada:** Personas (02), Escenarios (02), HTA (03), Modelos Mentales (03), Diálogos (03)  

---

## 1. Justificación de la Exploración de Alternativas

Buxton (2007) argumenta que el diseño de calidad exige la generación y evaluación de múltiples alternativas antes de comprometerse con una solución [1]. Tohidi et al. (2006) demostraron experimentalmente que presentar múltiples conceptos a los usuarios genera un feedback más rico y crítico que presentar un único diseño [2].

Se han explorado **tres alternativas conceptuales** para la arquitectura de la interfaz de Mnemosyne. Cada alternativa responde de forma diferente al reto central identificado en el análisis de Personas (02_personas.md, §Justificación):

> **Reto:** Satisfacer simultáneamente las necesidades de María Luisa (simplicidad extrema, elementos grandes, mínima carga cognitiva) y de Carlos (control fino, feedback preciso, estructura de sesión terapéutica).

---

## 2. Alternativa A — "Interfaz Unificada Adaptativa"

### Concepto

Una única interfaz que adapta dinámicamente su complejidad según el perfil del usuario. Cuando María Luisa inicia sesión, los controles avanzados se ocultan y la tipografía se agranda automáticamente. Cuando Carlos inicia sesión, aparecen paneles adicionales con controles finos.

### Esquema conceptual

```
┌─────────────────────────────────────────┐
│  MNEMOSYNE — Interfaz única             │
│                                         │
│  [Si usuario = María Luisa]             │
│  → Ocultar: búsqueda avanzada,          │
│    indicador bienestar, notas           │
│  → Agrandar: tipografía, botones        │
│  → Mostrar: solo Favoritos + Claridad   │
│                                         │
│  [Si usuario = Carlos]                  │
│  → Mostrar: todo                        │
│  → Añadir: panel de sesión, historial   │
│                                         │
│  [Si usuario = Elena]                   │
│  → Mostrar: panel admin + previsualizar │
└─────────────────────────────────────────┘
```

### Evaluación

| Criterio | Valoración | Justificación |
|---|---|---|
| Simplicidad para María Luisa | ⚠️ Media | La interfaz base sigue siendo la misma; se ocultan elementos pero la estructura visual es compleja y puede "filtrar" complejidad residual |
| Control para Carlos | ✅ Alta | Tiene acceso a todos los controles que necesita |
| Consistencia | ❌ Baja | La misma pantalla se ve radicalmente diferente según el usuario, lo cual dificulta que Elena ayude a María Luisa (ve una versión distinta) |
| Coste de desarrollo | ⚠️ Medio | Requiere lógica condicional extensa para cada elemento de UI |
| Alineación con Modelo Mental de María Luisa | ❌ Baja | María Luisa espera un "álbum de fotos mágico" (§2.1 Modelos Mentales); una interfaz adaptativa con paneles ocultos no mapea a esta metáfora |

**Veredicto:** ❌ Descartada. La inconsistencia entre perfiles genera confusión para Elena (cuidadora), que necesita ver lo mismo que María Luisa para poder ayudarla. Además, el modelo mental de María Luisa requiere una experiencia diseñada desde cero para ella, no una versión simplificada de una interfaz compleja.

---

## 3. Alternativa B — "Dos Modos Explícitos"

### Concepto

La aplicación presenta dos **modos totalmente diferenciados** con navegación y diseño visual distintos:

- **Modo Paciente**: Interfaz ultra-simplificada tipo galería de fotos. Grandes thumbnails, navegación por Favoritos o Personas, visor de recuerdo con slider de filtro único y prominente.
- **Modo Cuidador/Admin**: Interfaz tipo panel de control con sidebar, búsqueda avanzada, edición de metadatos, configuración de permisos, monitorización de actividad.

Ambos modos coexisten en la misma aplicación pero tienen layouts distintos. El cambio de modo es explícito (selector en la barra superior) y el modo cuidador incluye "Previsualizar como paciente".

### Esquema conceptual

```
┌──────────────────────────────────────────────────────────┐
│                    MNEMOSYNE                             │
│                                                          │
│  ┌─────────────────┐      ┌────────────────────────────┐ │
│  │  MODO PACIENTE  │      │     MODO CUIDADOR          │ │
│  │                 │      │                            │ │
│  │ ┌─────┐┌─────┐ │      │ ┌──────┐ ┌──────────────┐ │ │
│  │ │     ││     │ │      │ │ Side │ │  Contenido   │ │ │
│  │ │ Foto││ Foto│ │      │ │ bar  │ │  principal   │ │ │
│  │ │     ││     │ │      │ │      │ │              │ │ │
│  │ └─────┘└─────┘ │      │ │•Buscar│ │  Tabla de    │ │ │
│  │ ┌─────┐┌─────┐ │      │ │•Config│ │  recuerdos   │ │ │
│  │ │     ││     │ │      │ │•Roles │ │  con filtros │ │ │
│  │ │ Foto││ Foto│ │      │ │•Activ.│ │  y metadatos │ │ │
│  │ │     ││     │ │      │ │      │ │              │ │ │
│  │ └─────┘└─────┘ │      │ └──────┘ └──────────────┘ │ │
│  │                 │      │                            │ │
│  │ [Slider grande] │      │ [Múltiples controles]      │ │
│  └─────────────────┘      └────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Evaluación

| Criterio | Valoración | Justificación |
|---|---|---|
| Simplicidad para María Luisa | ✅ Alta | Modo diseñado exclusivamente para ella. Sin complejidad residual |
| Control para Carlos | ⚠️ Media | Carlos es paciente pero necesita controles avanzados. ¿Qué modo usa? El modo paciente es demasiado simple; el modo cuidador está orientado a admin, no a terapia |
| Consistencia | ✅ Alta | Cada modo es internamente consistente. Elena puede previsualizar el modo paciente |
| Coste de desarrollo | ⚠️ Alto | Dos layouts completamente distintos a mantener |
| Alineación con modelos mentales | ⚠️ Media | María Luisa → ✅ álbum de fotos. Carlos → ❌ no encaja en ningún modo. Elena → ✅ panel de control |

**Veredicto:** ⚠️ Parcialmente válida. Resuelve bien a María Luisa y Elena, pero deja a Carlos en tierra de nadie. Necesita un tercer modo o que el modo paciente sea configurable.

---

## 4. Alternativa C — "Tres Experiencias, Un Sistema" (SELECCIONADA ✅)

### Concepto

Evolución de la Alternativa B. El sistema ofrece **tres experiencias diferenciadas** que comparten el backend de datos pero tienen cada una un layout optimizado:

- **Vista Paciente-Alzheimer (María Luisa):** Galería ultra-simplificada. Solo Favoritos y navegación por Personas. Slider grande de Claridad Facial. Sin búsqueda avanzada. Tipografía extra-grande.
- **Vista Paciente-Terapéutica (Carlos):** Panel de sesión con estructura explícita (inicio → trabajo → resumen). Búsqueda completa. Slider fino de Atenuación Emocional con indicadores de límite y bienestar. Historial de sesiones.
- **Vista Cuidador (Elena):** Panel de administración con sidebar. Búsqueda avanzada, edición de metadatos, configuración de permisos, monitorización. Función "Previsualizar como paciente".

La selección de vista se realiza al inicio de sesión (simulado) y es configurable por el cuidador o terapeuta.

### Esquema conceptual

```
┌────────────────────────────────────────────────────────────────────────┐
│                          MNEMOSYNE                                    │
│                                                                       │
│  ┌─────────────────┐ ┌──────────────────────┐ ┌────────────────────┐  │
│  │ VISTA ALZHEIMER │ │ VISTA TERAPÉUTICA    │ │ VISTA CUIDADOR     │  │
│  │   (María Luisa) │ │      (Carlos)        │ │     (Elena)        │  │
│  │                 │ │                      │ │                    │  │
│  │  Gran galería   │ │  Panel de sesión     │ │  Sidebar + Panel   │  │
│  │  de favoritos   │ │  estructurada        │ │  de admin          │  │
│  │                 │ │                      │ │                    │  │
│  │  Navegación     │ │  Búsqueda completa   │ │  Búsqueda + Editar │  │
│  │  por personas   │ │                      │ │  metadatos         │  │
│  │                 │ │  Slider atenuación   │ │                    │  │
│  │  Slider grande  │ │  con límites         │ │  Configurar roles  │  │
│  │  de claridad    │ │                      │ │  y permisos        │  │
│  │                 │ │  Indicador bienestar │ │                    │  │
│  │  Confirmaciones │ │  + Notas terapeuta   │ │  Previsualizar     │  │
│  │  ultra-claras   │ │                      │ │  como paciente     │  │
│  │                 │ │  Resumen de sesión   │ │                    │  │
│  └─────────────────┘ └──────────────────────┘ └────────────────────┘  │
│                                                                       │
│              ┌──────────────────────────────────┐                     │
│              │   MOTOR DE DATOS COMPARTIDO      │                     │
│              │   (JSON de recuerdos + estados)  │                     │
│              └──────────────────────────────────┘                     │
└────────────────────────────────────────────────────────────────────────┘
```

### Evaluación

| Criterio | Valoración | Justificación |
|---|---|---|
| Simplicidad para María Luisa | ✅ Alta | Vista diseñada exclusivamente para su modelo mental ("álbum mágico") |
| Control para Carlos | ✅ Alta | Vista diseñada específicamente para sesiones terapéuticas con controles finos |
| Consistencia | ✅ Alta | Cada vista es internamente consistente. Elena puede previsualizar cualquier vista |
| Coste de desarrollo | ⚠️ Alto | Tres layouts, pero comparten componentes base (slider, visor, tarjetas) |
| Alineación con modelos mentales | ✅ Alta | María Luisa → álbum. Carlos → ecualizador/sesión. Elena → panel de control |

**Veredicto:** ✅ **Seleccionada.** Resuelve el reto central al no imponer compromisos entre perfiles radicalmente distintos. El coste de desarrollo se mitiga reutilizando componentes comunes (slider, visor, tarjetas de recuerdo).

---

## 5. Matriz Comparativa Final

| Criterio (peso basado en hallazgos) | Alt. A Adaptativa | Alt. B Dos Modos | Alt. C Tres Vistas ✅ |
|---|---|---|---|
| Simplicidad María Luisa (peso alto: Tema 4) | ⚠️ 5/10 | ✅ 9/10 | ✅ 9/10 |
| Control fino Carlos (peso alto: Tema 3) | ✅ 8/10 | ⚠️ 5/10 | ✅ 9/10 |
| Experiencia Elena (peso medio: Tema 2) | ⚠️ 6/10 | ✅ 8/10 | ✅ 8/10 |
| Consistencia interna (peso alto: Heurística Nielsen) | ❌ 3/10 | ✅ 8/10 | ✅ 9/10 |
| Alineación con modelos mentales (Commit 3) | ❌ 4/10 | ⚠️ 6/10 | ✅ 9/10 |
| Viabilidad de desarrollo (restricción técnica) | ⚠️ 6/10 | ⚠️ 5/10 | ⚠️ 5/10 |
| **TOTAL PONDERADO** | **5.2** | **6.8** | **8.5** |

---

## 6. Decisión y Justificación

Se selecciona la **Alternativa C: "Tres Experiencias, Un Sistema"** por las siguientes razones, cada una trazable a los datos de exploración:

1. **Respeta los modelos mentales** de las tres Personas sin forzar compromisos (03_mental_models.md, §5.1).
2. **Resuelve el reto central** identificado en 02_personas.md: satisfacer a María Luisa Y Carlos simultáneamente.
3. **Habilita la función "Previsualizar como paciente"** que Elena necesita (HTA-3, tarea 3.1, Escenario 3).
4. **Se alinea con los STDs** definidos en 03_dialogue_specification.md, donde los flujos de María Luisa y Carlos ya eran estructuralmente distintos.
5. **Maximiza la puntuación ponderada** en la matriz comparativa al priorizar los criterios derivados de los hallazgos de mayor peso (Temas 3 y 4).

Para el alcance del prototipo funcional (HTML/CSS/JS), se implementará completamente la **Vista Paciente-Alzheimer** (María Luisa) como vista principal, con la **Vista Paciente-Terapéutica** (Carlos) como segunda vista navegable, y una versión simplificada de la **Vista Cuidador** (Elena). Las tres vistas se simularán como secciones de una misma SPA.

---

## 7. Referencias

[1] B. Buxton, *Sketching User Experiences: Getting the Design Right and the Right Design*. San Francisco, CA: Morgan Kaufmann, 2007.

[2] M. Tohidi, W. Buxton, R. Baecker, and A. Sellen, "Getting the right design and the design right: Testing many is better than one," in *Proc. SIGCHI Conf. Human Factors in Computing Systems (CHI '06)*, New York, NY: ACM, 2006, pp. 1243–1252.
