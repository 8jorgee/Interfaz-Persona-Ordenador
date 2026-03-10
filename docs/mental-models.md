# Mnemosyne — Modelos Mentales

**Documento:** Mental Models v1.0  
**Fase DCU:** Exploración → Conceptualización  
**Referencia metodológica:** Norman (1988) [1]; Norman (2013) [2]; Johnson-Laird (1983) [3]  

---

## 1. Marco Teórico

Donald Norman (1988, 2013) establece que la usabilidad de un sistema depende críticamente del **grado de alineación** entre tres modelos [1][2]:

- **Modelo mental del usuario:** La representación interna que el usuario tiene de cómo funciona el sistema, basada en su experiencia previa, metáforas conocidas y la información que el sistema le proporciona.
- **Modelo conceptual del diseñador:** La visión que el equipo de diseño tiene de cómo debería entenderse el sistema.
- **Imagen del sistema:** Lo que el sistema efectivamente comunica al usuario a través de su interfaz.

El objetivo es que la **imagen del sistema** sea tan clara que el modelo mental del usuario se alinee con el modelo conceptual del diseñador. Cuando hay desajuste (gulf of execution / gulf of evaluation), aparecen los errores de usabilidad.

---

## 2. Modelo Mental de María Luisa (Alzheimer leve)

### 2.1. Metáforas previas

Basándose en los hallazgos del Tema 5 y las observaciones contextuales, María Luisa entiende el mundo digital a través de estas metáforas:

| Concepto del sistema | Modelo mental de María Luisa | Metáfora de origen |
|---|---|---|
| Recuerdo almacenado | "Una foto o un vídeo guardado, como los del álbum" | Álbum de fotos físico |
| Galería de recuerdos | "El cajón donde están todas las fotos" | Cajón de fotos del aparador |
| Búsqueda | "Pedir que te busquen la foto de alguien" | Pedirle a Carmen que busque en el álbum |
| Filtro de claridad | "Poner unas gafas mejores para ver la cara" | Gafas de lectura |
| Slider | "Una rueda o un mando, como el del volumen de la radio" | Radio analógica |
| Guardar ajuste | "Dejar la foto así, como está ahora" | Poner la foto en el marco |
| Deshacer | "Volver a como estaba antes" | Sacar la foto del marco |

### 2.2. Lagunas identificadas

| Concepto | Carencia del modelo mental | Riesgo | Decisión de diseño |
|---|---|---|---|
| Filtros no destructivos | María Luisa no entiende que el recuerdo original se preserva. Cree que "si cambio algo, se pierde" | Miedo a tocar el slider → infrautilización | Mensaje permanente: "El recuerdo original siempre se conserva" + indicador visual de "capa de filtro" |
| Niveles de atenuación | No tiene concepto de porcentaje numérico aplicado a un recuerdo | Confusión con indicadores numéricos | Acompañar el porcentaje con una representación visual analógica (barra de progreso coloreada) |
| Rol de cuidador vs. paciente | No entiende por qué Elena puede hacer cosas que ella no ve | Frustración: "¿Por qué yo no puedo tocar eso?" | No mostrar funciones bloqueadas. El modo paciente solo muestra las funciones disponibles, sin indicación de que existen más |

---

## 3. Modelo Mental de Carlos (TEPT)

### 3.1. Metáforas previas

Carlos, como programador, tiene un modelo mental más técnico pero emocionalmente cargado:

| Concepto del sistema | Modelo mental de Carlos | Metáfora de origen |
|---|---|---|
| Recuerdo almacenado | "Un archivo de vídeo con metadatos" | Sistema de archivos |
| Atenuación emocional | "Bajar el volumen del recuerdo, como en un ecualizador" | Ecualizador de audio / Mesa de mezclas |
| Slider de atenuación | "Un fader de volumen" | Producción de audio |
| Límite del terapeuta | "Un max-value que yo no puedo cambiar, como un permiso de admin" | Permisos de sistema Unix |
| Reversibilidad | "Control+Z, puedo deshacer siempre" | Historial de deshacer en editores |
| Sesión de uso | "Una sesión de trabajo con inicio y fin" | Sprint de trabajo / Sesión de terapia |

### 3.2. Lagunas identificadas

| Concepto | Carencia del modelo mental | Riesgo | Decisión de diseño |
|---|---|---|---|
| Gradualidad terapéutica | Carlos entiende la atenuación técnicamente, pero puede subestimar su impacto emocional ("es solo un slider") | Exposición excesiva por exceso de confianza técnica | Incluir avisos empáticos periódicos. Opción de "modo gradual" que limita la velocidad del slider |
| Límite terapéutico como beneficio | Puede percibir el límite como restricción arbitraria, no como protección | Frustración, intento de eludir el límite | Explicar siempre el porqué: "Este límite forma parte de tu plan de tratamiento con Dr. Molina" |
| Progreso no es lineal | Puede esperar que cada sesión reduzca la emoción de forma lineal y permanente | Decepción si los flashbacks persisten | No gamificar el progreso. Presentar datos sin juicios: "Atenuación actual: 40%. Sesiones realizadas: 8" |

---

## 4. Modelo Mental de Elena (Cuidadora)

### 4.1. Metáforas previas

| Concepto del sistema | Modelo mental de Elena | Metáfora de origen |
|---|---|---|
| Panel de administración | "Es como configurar el móvil de mi madre, pero para el implante" | Configuración parental / Control de dispositivo |
| Previsualizar como paciente | "Ver cómo lo ve ella, ponerme en su lugar" | Función "vista previa" en emails/documentos |
| Editar metadatos | "Poner nombres a las fotos, como en el Google Fotos" | Etiquetado de fotos en apps |
| Favoritos | "Poner los más importantes en la pantalla principal, como los accesos directos" | Pantalla de inicio del móvil |
| Límites de seguridad | "Los controles parentales pero al revés: proteger a mi madre, no a un niño" | Control parental |

### 4.2. Lagunas identificadas

| Concepto | Carencia | Riesgo | Decisión de diseño |
|---|---|---|---|
| Alcance de sus permisos | No sabe exactamente qué puede y qué no puede hacer como cuidadora | Inseguridad: "¿Y si toco algo que no debo?" | Pantalla de "Mis permisos" clara. Tooltips en funciones sensibles |
| Impacto de los filtros | No tiene formación clínica para evaluar si un nivel de claridad es "bueno" | Configurar un nivel inadecuado | Valores recomendados sugeridos por el sistema: "La neuropsicóloga recomienda entre 50-80%" |
| Privacidad bidireccional | Duda de si está bien ver los recuerdos de su madre | Culpa, conflicto ético | El sistema muestra solo metadatos por defecto. Ver el contenido del recuerdo requiere acción explícita |

---

## 5. Gap Analysis: Modelo Mental vs. Modelo del Sistema

El siguiente análisis identifica los **desajustes** (gaps) entre lo que cada usuario espera y lo que el sistema necesita comunicar, siguiendo el framework de Norman (Gulfs of Execution and Evaluation) [2]:

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                     MODELO DEL DISEÑADOR                      │
│                                                               │
│  "Un editor no destructivo de recuerdos con filtros           │
│   reversibles, control gradual, roles diferenciados           │
│   y feedback en tiempo real"                                  │
│                                                               │
└──────────────────────────┬────────────────────────────────────┘
                           │
                    IMAGEN DEL SISTEMA
                    (lo que la UI comunica)
                           │
        ┌──────────────────┼──────────────────────┐
        │                  │                      │
        ▼                  ▼                      ▼
┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ MARÍA LUISA  │  │     CARLOS       │  │     ELENA        │
│              │  │                  │  │                  │
│ "Un álbum    │  │ "Un ecualizador  │  │ "Un panel de     │
│  mágico que  │  │  de recuerdos    │  │  control del     │
│  aclara      │  │  donde puedo     │  │  implante de     │
│  las caras"  │  │  bajar el        │  │  mi madre"       │
│              │  │  volumen"        │  │                  │
└──────┬───────┘  └────────┬─────────┘  └────────┬─────────┘
       │                   │                      │
       ▼                   ▼                      ▼
┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    GAPS      │  │      GAPS        │  │      GAPS        │
│              │  │                  │  │                  │
│ • No entiende│  │ • Subestima      │  │ • No sabe qué    │
│   la rever-  │  │   impacto        │  │   puede/no       │
│   sibilidad  │  │   emocional      │  │   puede hacer    │
│              │  │                  │  │                  │
│ • Miedo a    │  │ • Ve el límite   │  │ • Duda sobre     │
│   "romper"   │  │   como restricc. │  │   privacidad     │
│              │  │   no protección  │  │                  │
│ • No entiende│  │ • Espera progreso│  │ • No sabe qué    │
│   porcentajes│  │   lineal         │  │   nivel es       │
│              │  │                  │  │   adecuado       │
└──────────────┘  └──────────────────┘  └──────────────────┘
```

### 5.1. Estrategias de alineación

| Gap | Estrategia de diseño | Implementación concreta |
|---|---|---|
| Reversibilidad (María Luisa) | Metáfora visual explícita | Icono de "capa" sobre el recuerdo. Tooltip: "Esto es como unas gafas: puedes quitarlas cuando quieras" |
| Miedo a romper (María Luisa) | Eliminación de consecuencias irreversibles + "Deshacer" universal | Ninguna acción del modo paciente es destructiva. Botón "Deshacer" visible siempre |
| Porcentajes (María Luisa) | Representación dual | Número + barra de color + descriptor verbal ("Poco clara / Clara / Muy clara") |
| Impacto emocional (Carlos) | Feedback empático contextual | Mensajes periódicos no intrusivos durante la sesión. Pausa sugerida cada 5 minutos |
| Límite como protección (Carlos) | Transparencia del propósito | Etiqueta junto al límite explicando quién lo configuró y por qué |
| Progreso no lineal (Carlos) | Datos sin gamificación | Historial neutro: gráfico temporal de atenuación sin "puntuaciones" ni "logros" |
| Alcance de permisos (Elena) | Pantalla de permisos explícita | Sección "Mis permisos" con lista clara de lo que puede y no puede hacer |
| Privacidad (Elena) | Acceso progresivo | Metadatos visibles por defecto; contenido del recuerdo requiere acción explícita + justificación |
| Nivel adecuado (Elena) | Guía contextual | Rangos recomendados sugeridos en cada slider: "Rango recomendado: 50-80%" |

---

## 6. Implicaciones para la Fase de Conceptualización

Del análisis de modelos mentales se derivan las siguientes decisiones que guiarán directamente los wireframes (Commit 4) y los flujos de interacción (Commit 5):

1. **Dos modos de interfaz claramente diferenciados:** Modo Paciente (simplificado, sin funciones ocultas) y Modo Cuidador/Admin (completo, con previsualización y configuración).

2. **Representación dual de valores:** Todo slider tendrá un indicador numérico Y un descriptor verbal/visual (barra de color, etiqueta textual).

3. **Mensajes de seguridad integrados:** No como alertas intrusivas sino como elementos permanentes del contexto visual (banners suaves, tooltips, indicadores de capa).

4. **Transparencia de roles:** El sistema explica siempre quién ha configurado qué y por qué, especialmente para los límites terapéuticos.

5. **Navegación alternativa a la búsqueda:** Para María Luisa, la galería de Favoritos y la navegación por personas (con fotos) deben ser caminos de acceso principales, no solo la búsqueda por texto.

---

## 7. Referencias

[1] D. A. Norman, *The Psychology of Everyday Things*. New York, NY: Basic Books, 1988.

[2] D. A. Norman, *The Design of Everyday Things: Revised and Expanded Edition*. New York, NY: Basic Books, 2013.

[3] P. N. Johnson-Laird, *Mental Models: Towards a Cognitive Science of Language, Inference, and Consciousness*. Cambridge, MA: Harvard University Press, 1983.
