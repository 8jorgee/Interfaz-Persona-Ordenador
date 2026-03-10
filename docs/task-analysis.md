# Mnemosyne — Análisis Jerárquico de Tareas (HTA)

**Documento:** Task Analysis v1.0  
**Fase DCU:** Exploración → Conceptualización (transición)  
**Referencia metodológica:** Annett & Duncan (1967) [1]; Stanton (2006) [2]; Diaper & Stanton (2004) [3]  
**Datos de entrada:** Escenarios de uso (02_scenarios.md), Requisitos de usuario (02_research_findings.md)  

---

## 1. Introducción al HTA en este proyecto

El Análisis Jerárquico de Tareas (Hierarchical Task Analysis) descompone los objetivos del usuario en sub-objetivos y operaciones concretas, identificando las relaciones de secuencia, selección y paralelismo entre ellas. Según Annett y Duncan (1967), el HTA permite detectar puntos críticos de la interacción donde el usuario puede cometer errores o necesitar soporte del sistema [1].

Para Mnemosyne se han elaborado **tres diagramas HTA** correspondientes a las tareas principales identificadas en los escenarios:

- **HTA-1:** Buscar un recuerdo y aplicar el filtro de Claridad Facial (Persona: María Luisa / Elena)
- **HTA-2:** Atenuar la carga emocional de un recuerdo traumático (Persona: Carlos)
- **HTA-3:** Configurar el sistema como cuidador (Persona: Elena)

Se utiliza la **notación tabular** complementada con **diagramas textuales** para cada HTA, siguiendo las convenciones de Stanton (2006) [2].

---

## 2. HTA-1: Buscar un recuerdo y aplicar Claridad Facial

**Objetivo de nivel 0:** Mejorar la claridad facial de un recuerdo para reconocer a una persona  
**Persona asociada:** María Luisa (con asistencia de Elena) — Escenario 1  
**Precondición:** Mnemosyne está abierto, sesión activa en modo paciente  

### 2.1. Diagrama jerárquico

```
0. Mejorar claridad facial de un recuerdo
│
├── 1. Localizar el recuerdo deseado
│   ├── 1.1. Acceder a la barra de búsqueda
│   ├── 1.2. Introducir término de búsqueda (nombre de persona, fecha o lugar)
│   ├── 1.3. Revisar los resultados de búsqueda
│   └── 1.4. Seleccionar el recuerdo deseado de la lista
│       Plan 1: Hacer 1.1 → 1.2 → 1.3 → 1.4
│       [Si no hay resultados: volver a 1.2 con otro término]
│
├── 2. Visualizar el recuerdo
│   ├── 2.1. Observar la imagen/vídeo en el Visor
│   ├── 2.2. Leer los metadatos (fecha, personas, lugar)
│   └── 2.3. Identificar el estado actual de claridad
│       Plan 2: Hacer 2.1 + 2.2 simultáneamente → 2.3
│
├── 3. Aplicar el filtro de Claridad Facial
│   ├── 3.1. Localizar el slider de Claridad Facial en el Panel de Filtros
│   ├── 3.2. Deslizar el control hacia la derecha (aumentar claridad)
│   ├── 3.3. Observar el feedback visual en tiempo real sobre la imagen
│   ├── 3.4. Ajustar hasta alcanzar el nivel deseado
│   └── 3.5. Leer el indicador numérico del porcentaje actual
│       Plan 3: Hacer 3.1 → 3.2 → (3.3 + 3.5 simultáneamente) → 3.4
│       [Repetir 3.2-3.4 hasta satisfacción]
│
└── 4. Confirmar y guardar el ajuste
    ├── 4.1. Pulsar el botón "Guardar ajuste"
    ├── 4.2. Leer el diálogo de confirmación
    ├── 4.3. Confirmar la acción ("Sí, guardar")
    └── 4.4. Verificar el mensaje de éxito y el icono de filtro activo
        Plan 4: Hacer 4.1 → 4.2 → 4.3 → 4.4
        [Si error o duda: pulsar "Cancelar" en 4.3 → volver a 3.2]
```

### 2.2. Tabla HTA detallada

| Nº Tarea | Descripción | Tipo | Notas / Condiciones |
|---|---|---|---|
| 0 | Mejorar claridad facial de un recuerdo | Objetivo | Tarea completa end-to-end |
| 1 | Localizar el recuerdo deseado | Sub-objetivo | Plan: secuencial (1.1→1.2→1.3→1.4) |
| 1.1 | Acceder a la barra de búsqueda | Operación | Toque/clic en campo de búsqueda. Debe ser visible sin scroll |
| 1.2 | Introducir término de búsqueda | Operación | Teclado virtual (tablet) o físico. Soporta nombres de personas, fechas, lugares |
| 1.3 | Revisar resultados | Operación | Los resultados muestran thumbnail + título + fecha. Máx. 6 por pantalla para legibilidad |
| 1.4 | Seleccionar recuerdo | Operación | Toque/clic en la tarjeta del recuerdo. Área mínima 48x48px |
| 2 | Visualizar el recuerdo | Sub-objetivo | Plan: 2.1 y 2.2 simultáneos → 2.3 |
| 2.1 | Observar imagen/vídeo | Operación | Imagen central, tamaño prominente (mín. 60% del viewport) |
| 2.2 | Leer metadatos | Operación | Texto superpuesto o adyacente. Fuente ≥18px |
| 2.3 | Identificar estado de claridad actual | Operación | Indicador numérico visible junto al slider |
| 3 | Aplicar filtro de Claridad Facial | Sub-objetivo | Plan: secuencial con bucle de ajuste |
| 3.1 | Localizar slider | Operación | Bajo la imagen. Etiqueta "Claridad Facial" visible. Slider mín. 200px de ancho |
| 3.2 | Deslizar control | Operación | Gesto de arrastre (táctil) o clic+arrastre (ratón). Rango 0-100% |
| 3.3 | Observar feedback visual | Operación | Cambio en CSS filters sobre la imagen en <200ms (RNF-06) |
| 3.4 | Ajustar nivel | Operación | Repetir 3.2-3.3 hasta satisfacción. El slider es analógico (continuo) |
| 3.5 | Leer indicador numérico | Operación | Porcentaje actualizado en tiempo real junto al slider |
| 4 | Confirmar y guardar | Sub-objetivo | Plan: secuencial |
| 4.1 | Pulsar "Guardar ajuste" | Operación | Botón prominente, mín. 48x48px, texto claro |
| 4.2 | Leer diálogo de confirmación | Operación | Modal con texto grande: "¿Guardar claridad al X%?" |
| 4.3 | Confirmar o cancelar | Operación | Dos botones grandes: "Sí, guardar" / "No, cancelar" |
| 4.4 | Verificar éxito | Operación | Mensaje de confirmación + icono de filtro activo visible |

### 2.3. Análisis de puntos críticos

| Punto | Riesgo identificado | Origen (hallazgo) | Mitigación propuesta |
|---|---|---|---|
| 1.2 | María Luisa puede no recordar qué término buscar | Tema 4 (OC1: olvido de pasos) | Ofrecer acceso alternativo: galería de Favoritos, recuerdos recientes, navegación por personas (fotos) |
| 3.2 | Movimiento accidental del slider (toque impreciso) | Tema 4, Escenario 4 | Detección de cambio brusco + botón "Deshacer" prominente |
| 4.2-4.3 | El diálogo de confirmación puede confundir a María Luisa | Tema 4 (diálogos inesperados) | Texto en lenguaje simple, botones con iconos + texto, colores diferenciados (verde confirmar, gris cancelar) |

---

## 3. HTA-2: Atenuar la carga emocional de un recuerdo

**Objetivo de nivel 0:** Reducir la intensidad emocional de un recuerdo traumático  
**Persona asociada:** Carlos Herrera — Escenario 2  
**Precondición:** Mnemosyne abierto en escritorio, sesión activa, sesión programada  

### 3.1. Diagrama jerárquico

```
0. Atenuar la carga emocional de un recuerdo traumático
│
├── 1. Preparar la sesión
│   ├── 1.1. Acceder al Dashboard y verificar estado del implante
│   ├── 1.2. Leer el aviso de bienvenida/seguridad
│   └── 1.3. Decidir continuar con la sesión
│       Plan 1: Hacer 1.1 → 1.2 → 1.3
│       [Si no se siente preparado: cerrar la sesión]
│
├── 2. Localizar el recuerdo traumático
│   ├── 2.1. Acceder a la barra de búsqueda
│   ├── 2.2. Introducir término de búsqueda
│   ├── 2.3. Revisar resultados (observar indicador de carga emocional)
│   └── 2.4. Seleccionar el recuerdo
│       Plan 2: Hacer 2.1 → 2.2 → 2.3 → 2.4
│
├── 3. Evaluar el estado actual del recuerdo
│   ├── 3.1. Observar la imagen/vídeo en el Visor
│   ├── 3.2. Leer metadatos y nivel de emoción actual
│   ├── 3.3. Verificar el nivel de atenuación actual
│   └── 3.4. Verificar el límite de atenuación configurado por el terapeuta
│       Plan 3: Hacer 3.1 → (3.2 + 3.3 + 3.4 simultáneamente)
│
├── 4. Aplicar atenuación emocional gradual
│   ├── 4.1. Localizar el slider de Atenuación Emocional
│   ├── 4.2. Deslizar el control lentamente (incremento gradual)
│   ├── 4.3. Observar los cambios visuales en tiempo real
│   │         (saturación ↓, contraste ↓, desenfoque ↑, viñeta ↑)
│   ├── 4.4. Leer el indicador numérico actualizado
│   ├── 4.5. Pausar y evaluar el estado emocional propio
│   └── 4.6. Continuar ajustando o detenerse
│       Plan 4: Hacer 4.1 → 4.2 → (4.3 + 4.4) → 4.5 → 4.6
│       [Repetir 4.2-4.6 hasta satisfacción o alcanzar límite]
│       [Si malestar excesivo en 4.5: detener → ir a 6]
│
├── 5. Guardar y documentar
│   ├── 5.1. Pulsar "Guardar ajuste"
│   ├── 5.2. Confirmar en el diálogo
│   ├── 5.3. Revisar el resumen de sesión
│   ├── 5.4. (Opcional) Actualizar indicador de bienestar
│   └── 5.5. (Opcional) Escribir nota para el terapeuta
│       Plan 5: Hacer 5.1 → 5.2 → 5.3 → [5.4 y/o 5.5 opcionales]
│
└── 6. Finalizar sesión
    ├── 6.1. Volver al Dashboard
    └── 6.2. Verificar contador de sesiones actualizado
        Plan 6: Hacer 6.1 → 6.2
```

### 3.2. Tabla HTA detallada

| Nº Tarea | Descripción | Tipo | Notas / Condiciones |
|---|---|---|---|
| 0 | Atenuar carga emocional de un recuerdo | Objetivo | Tarea completa de sesión terapéutica complementaria |
| 1 | Preparar la sesión | Sub-objetivo | Plan secuencial. Incluye evaluación de preparación emocional |
| 1.1 | Verificar estado del implante | Operación | Dashboard: indicador de conexión, último uso, sesiones restantes |
| 1.2 | Leer aviso de seguridad | Operación | Mensaje empático: "Puedes parar en cualquier momento" |
| 1.3 | Decidir continuar | Operación | Decisión del usuario. No forzar ninguna acción |
| 2 | Localizar recuerdo traumático | Sub-objetivo | Idéntico en estructura a HTA-1 tarea 1, pero con indicadores de emoción visibles |
| 2.3 | Revisar resultados con indicador emocional | Operación | Color del indicador (ámbar/rojo) según nivel emocional. No usar rojo saturado (RNF-08) |
| 3 | Evaluar estado actual | Sub-objetivo | Lectura pasiva antes de manipular. Permite al usuario prepararse |
| 3.4 | Verificar límite del terapeuta | Operación | Etiqueta visible: "Límite de atenuación: 70% (configurado por Dr. Molina)" |
| 4 | Aplicar atenuación gradual | Sub-objetivo | Plan iterativo con bucle y punto de salida por malestar |
| 4.2 | Deslizar control gradualmente | Operación | El slider tiene resolución fina (1%). Incrementos lentos recomendados |
| 4.3 | Observar cambios visuales | Operación | CSS filters: grayscale ↑, brightness ↓, blur ↑, vignette ↑. Respuesta <200ms |
| 4.5 | Evaluar estado emocional | Operación | Pausa voluntaria. Indicador de bienestar opcional disponible |
| 4.6 | Decidir continuar o parar | Operación | Si el slider alcanza el límite del terapeuta, se detiene con explicación |
| 5 | Guardar y documentar | Sub-objetivo | Incluye sub-tareas opcionales de autodocumentación |
| 5.3 | Revisar resumen de sesión | Operación | Antes→Después, duración, bienestar reportado |
| 5.5 | Escribir nota para terapeuta | Operación | Campo de texto libre. Opcional pero fomentado |
| 6 | Finalizar sesión | Sub-objetivo | Retorno al Dashboard con estado actualizado |

### 3.3. Análisis de puntos críticos

| Punto | Riesgo identificado | Origen | Mitigación propuesta |
|---|---|---|---|
| 1.3 | Carlos podría forzarse a continuar una sesión sin estar preparado | Tema 3 (hiperactivación) | Mensaje de seguridad no intrusivo pero siempre visible. Botón "Salir de la sesión" accesible en todo momento |
| 4.2 | Movimiento brusco del slider que cause una exposición emocional excesiva | Tema 3 (gradualidad) | Opción de "incremento suave" que limite la velocidad de cambio del slider. Detección de cambio brusco |
| 4.5-4.6 | Carlos experimenta malestar significativo y no sabe cómo reaccionar | Tema 3, E6 | Mensaje de apoyo contextual si permanece sin interactuar >30s: "¿Estás bien? Puedes parar o reducir la atenuación." |
| 4.6 | Carlos intenta superar el límite del terapeuta | Tema 6 (roles) | Slider se detiene físicamente en el límite. Mensaje explicativo: "Este límite lo ha establecido tu terapeuta como parte de tu plan" |

---

## 4. HTA-3: Configurar el sistema como cuidador

**Objetivo de nivel 0:** Preparar un recuerdo para que la paciente lo use con filtros preconfigurados  
**Persona asociada:** Elena Navarro — Escenario 3  
**Precondición:** Sesión activa con rol de cuidadora  

### 4.1. Diagrama jerárquico

```
0. Configurar un recuerdo para la paciente
│
├── 1. Acceder al panel de administración
│   ├── 1.1. Abrir Mnemosyne (móvil o tablet)
│   ├── 1.2. Verificar rol activo (Cuidadora)
│   └── 1.3. Revisar resumen de actividad de la paciente
│       Plan 1: Hacer 1.1 → 1.2 → 1.3
│
├── 2. Localizar y preparar el recuerdo
│   ├── 2.1. Acceder a "Biblioteca de recuerdos"
│   ├── 2.2. Buscar el recuerdo por término
│   ├── 2.3. Seleccionar el recuerdo
│   └── 2.4. Verificar y corregir metadatos (personas, fecha, lugar)
│       Plan 2: Hacer 2.1 → 2.2 → 2.3 → 2.4
│
├── 3. Preconfigurar filtros
│   ├── 3.1. Activar "Previsualizar como paciente"
│   ├── 3.2. Ajustar slider de Claridad Facial al nivel deseado
│   ├── 3.3. Verificar el resultado visual
│   └── 3.4. Marcar como Favorito (si procede)
│       Plan 3: Hacer 3.1 → 3.2 → 3.3 → 3.4
│       [Repetir 3.2-3.3 si el resultado no es satisfactorio]
│
├── 4. Guardar cambios
│   ├── 4.1. Revisar resumen de cambios realizados
│   ├── 4.2. Confirmar guardado
│   └── 4.3. Verificar confirmación de éxito
│       Plan 4: Hacer 4.1 → 4.2 → 4.3
│
└── 5. (Opcional) Revisar configuración de seguridad
    ├── 5.1. Acceder a "Límites de seguridad"
    ├── 5.2. Verificar funciones habilitadas/deshabilitadas para la paciente
    └── 5.3. Verificar límites de intensidad de filtros
        Plan 5: Hacer 5.1 → 5.2 → 5.3
```

### 4.2. Tabla HTA resumida

| Nº Tarea | Descripción | Tipo | Notas clave |
|---|---|---|---|
| 0 | Configurar un recuerdo para la paciente | Objetivo | Tarea de administración, no terapéutica |
| 1 | Acceder al panel de admin | Sub-objetivo | El sistema distingue roles automáticamente |
| 2 | Localizar y preparar recuerdo | Sub-objetivo | Incluye edición de metadatos (corrección de nombres) |
| 2.4 | Verificar/corregir metadatos | Operación | Crítico: si el implante etiqueta mal a una persona, la cuidadora debe poder corregirlo |
| 3 | Preconfigurar filtros | Sub-objetivo | "Previsualizar como paciente" permite ver el resultado final |
| 3.4 | Marcar como Favorito | Operación | Los Favoritos aparecen en la pantalla principal de la paciente |
| 4 | Guardar cambios | Sub-objetivo | Resumen de cambios antes de confirmar (transparencia) |
| 5 | Revisar seguridad | Sub-objetivo | Opcional pero recomendado periódicamente |

---

## 5. Resumen de Operaciones Críticas por Persona

| Persona | Operaciones frecuentes | Operaciones críticas (alto riesgo de error) |
|---|---|---|
| **María Luisa** | Navegar galería, ver recuerdos, mover slider claridad | Búsqueda por texto (barrera cognitiva), confirmación de diálogos (barrera tech) |
| **Carlos** | Buscar recuerdo, ajustar atenuación, guardar, documentar | Exposición emocional (riesgo clínico), alcanzar límite del terapeuta |
| **Elena** | Buscar recuerdos, editar metadatos, configurar filtros, revisar actividad | Corrección de metadatos erróneos, gestión de permisos de seguridad |

---

## 6. Referencias

[1] J. Annett and K. D. Duncan, "Task analysis and training design," *Occupational Psychology*, vol. 41, pp. 211–221, 1967.

[2] N. A. Stanton, "Hierarchical task analysis: Developments, applications, and extensions," *Applied Ergonomics*, vol. 37, no. 1, pp. 55–79, 2006.

[3] D. Diaper and N. A. Stanton, Eds., *The Handbook of Task Analysis for Human-Computer Interaction*. Mahwah, NJ: Lawrence Erlbaum Associates, 2004.
