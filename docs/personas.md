# Mnemosyne — Personas

**Documento:** Personas v1.0  
**Fase DCU:** Exploración — Modelado de usuarios  
**Base de datos:** Hallazgos de 6 entrevistas, 2 observaciones contextuales y 1 grupo de discusión  
**Referencia metodológica:** Cooper, Reimann, Cronin & Noessel (2014). *About Face*, 4th ed. Cap. 3: "Modeling Users: Personas and Goals" [1]  

---

## Nota metodológica

Las Personas que se presentan a continuación son arquetipos basados en datos reales obtenidos durante la fase de exploración. Siguiendo las recomendaciones de Cooper et al. (2014), cada Persona representa un **patrón de comportamiento** detectado en la investigación, no un participante individual. Los datos demográficos son ficticios pero verosímiles; los objetivos, frustraciones y contextos de uso se derivan directamente de los hallazgos temáticos del documento `02_research_findings.md`.

Se han definido **3 Personas** que cubren los tres perfiles de usuario identificados en el Project Charter:

---

## Persona 1 — María Luisa Fernández (Persona Primaria)

### Datos demográficos

| Campo | Detalle |
|---|---|
| **Nombre** | María Luisa Fernández García |
| **Edad** | 72 años |
| **Residencia** | Piso en el centro de Salamanca, vive con su marido Tomás (75) |
| **Diagnóstico** | Alzheimer en fase leve (GDS 3-4), diagnosticada hace 18 meses |
| **Ocupación previa** | Maestra de primaria jubilada |
| **Nivel tecnológico** | Bajo. Usa una tablet para ver fotos y hacer videollamadas (con ayuda) |
| **Entorno de uso** | Salón de su domicilio, habitualmente sentada en su butaca. Tablet apoyada en una mesa auxiliar o en el regazo |

### Contexto personal

María Luisa fue maestra durante 35 años. Tiene dos hijos (Carmen, 49 y Pablo, 45) y cuatro nietos. Siempre fue una persona sociable y con buena memoria para nombres y caras; recuerda a alumnos de hace décadas. Hace un año empezó a tener dificultades para reconocer a sus nietos más pequeños (Lucía, 6 y Marco, 4), a quienes ve con menos frecuencia. Hace tres meses, durante una visita, no reconoció a su yerno de 20 años. Este episodio fue devastador para toda la familia.

Su marido Tomás gestiona la medicación y las citas médicas. Carmen, su hija mayor, la visita tres veces por semana y es quien le configuró la tablet. El implante NeuroLink V4 fue recomendado por su neuropsicóloga como herramienta complementaria a la estimulación cognitiva.

### Objetivos

| Tipo | Objetivo |
|---|---|
| **Objetivo vital** | Mantener su identidad y sus relaciones familiares el mayor tiempo posible |
| **Objetivo de experiencia** | Sentirse capaz y autónoma al usar el sistema, no "una enferma" |
| **Objetivo funcional 1** | Poder ver fotos/recuerdos de sus nietos con los rostros claros y reconocibles |
| **Objetivo funcional 2** | Explorar sus recuerdos de forma libre y segura, sin miedo a "estropear" nada |

### Frustraciones

- La vergüenza y la tristeza de no reconocer a un familiar.
- Sentir que depende de otros para todo lo tecnológico.
- Los interfaces con texto pequeño, muchos botones o mensajes en inglés.
- Las aplicaciones que cambian de aspecto entre usos (actualizaciones).
- Cuando la tablet le muestra un mensaje que no entiende y tiene que esperar a que venga Carmen.

### Cita representativa (basada en hallazgos)

> *"Yo quiero poder mirar a mis nietos y saber quiénes son. No pido más."*

### Escenario tecnológico

María Luisa accede a Mnemosyne desde su tablet, siempre con la configuración de **modo paciente**. Carmen ha preconfigurado los ajustes y ha marcado como favoritos los recuerdos de reuniones familiares. María Luisa solo necesita navegar la galería y tocar un recuerdo para verlo. Si quiere aplicar el filtro de claridad, mueve un slider grande. No tiene acceso a funciones de configuración avanzada.

### Mapa de empatía

```
┌─────────────────────────────────────────────────────────────┐
│                    MARÍA LUISA — 72 años                    │
├──────────────────────────┬──────────────────────────────────┤
│       PIENSA / SIENTE    │          DICE                    │
│                          │                                  │
│ "¿Quién es este chico?   │ "Este es... ¿Pablo? No, Pablo   │
│  Debería conocerlo..."   │  es mi hijo. ¿Es el marido de   │
│                          │  Carmen?"                        │
│ Miedo a que la situación │                                  │
│ empeore. Vergüenza de    │ "Ponme las fotos de la boda,    │
│ preguntar.               │  anda, que esas sí me las sé."  │
│                          │                                  │
│ Orgullo residual: "yo    │ "No me gusta que me traten      │
│ fui profesora, yo        │  como si no supiera nada."      │
│ sabía cosas"             │                                  │
├──────────────────────────┼──────────────────────────────────┤
│       VE                 │          HACE                    │
│                          │                                  │
│ Fotos enmarcadas por     │ Pide a Carmen que le enseñe      │
│ toda la casa con nombres │ fotos en la tablet cada tarde.   │
│ escritos debajo.         │                                  │
│                          │ Mira el marco digital del salón  │
│ A su marido Tomás cada   │ cuando se enciende. A veces      │
│ vez más preocupado.      │ señala y dice un nombre.         │
│                          │                                  │
│ A sus nietos intentando  │ Evita las reuniones grandes      │
│ que ella los reconozca.  │ porque "hay demasiada gente      │
│                          │ y me lío".                       │
├──────────────────────────┴──────────────────────────────────┤
│                     FRUSTRACIONES                           │
│                                                             │
│ • La tablet le muestra ventanas emergentes que no entiende  │
│ • Los botones son demasiado pequeños                        │
│ • Cuando toca algo "desaparece" la foto y no sabe volver    │
│ • Depender siempre de alguien para la tecnología            │
└─────────────────────────────────────────────────────────────┘
```

---

## Persona 2 — Carlos Herrera Ruiz (Persona Primaria)

### Datos demográficos

| Campo | Detalle |
|---|---|
| **Nombre** | Carlos Herrera Ruiz |
| **Edad** | 38 años |
| **Residencia** | Apartamento en Madrid, vive solo |
| **Diagnóstico** | TEPT diagnosticado hace 4 años (origen: accidente de tráfico grave con fallecimiento del copiloto) |
| **Ocupación** | Programador web, trabaja en remoto |
| **Nivel tecnológico** | Alto. Usuario diario de múltiples aplicaciones, cómodo con interfaces complejas |
| **Entorno de uso** | Despacho en su apartamento, escritorio con monitor de 27". Uso principal en sesiones programadas (martes y jueves por la tarde, recomendación de su terapeuta) |

### Contexto personal

Carlos era un programador activo y sociable antes del accidente. Hace 4 años, un accidente de tráfico le dejó con lesiones leves pero causó la muerte de su mejor amigo y copiloto, Diego. Desde entonces sufre flashbacks recurrentes: el sonido de frenos, el cristal rompiéndose, la imagen del airbag desplegado. Los flashbacks se desencadenan por estímulos sensoriales específicos (frenazos, sirenas, cristales rotos) y aparecen también durante el sueño.

Lleva 3 años en terapia EMDR con el Dr. Molina. Ha progresado significativamente pero sigue teniendo 2-3 episodios de flashback semanales. Su terapeuta le propuso usar Mnemosyne como herramienta complementaria de exposición controlada entre sesiones.

Carlos vive solo. No tiene cuidador, pero su terapeuta monitoriza su uso de Mnemosyne y ha establecido un límite de atenuación máxima del 70% (para preservar el trabajo terapéutico de procesamiento emocional).

### Objetivos

| Tipo | Objetivo |
|---|---|
| **Objetivo vital** | Recuperar su vida social y poder conducir de nuevo sin ataques de pánico |
| **Objetivo de experiencia** | Sentir que tiene el control de sus recuerdos, no que ellos le controlan a él |
| **Objetivo funcional 1** | Poder visualizar el recuerdo del accidente con la intensidad emocional reducida gradualmente |
| **Objetivo funcional 2** | Monitorizar su progreso (niveles de atenuación a lo largo del tiempo) |

### Frustraciones

- Los flashbacks que aparecen sin aviso y arruinan su jornada laboral.
- La sensación de que el recuerdo del accidente "está a todo volumen" y no puede bajarle.
- Las aplicaciones de mindfulness que le parecen demasiado genéricas y pasivas.
- La dependencia de las sesiones presenciales con el terapeuta (solo 1 vez por semana).
- El estigma social del TEPT entre sus compañeros de trabajo.

### Cita representativa (basada en hallazgos)

> *"No quiero olvidar a Diego. Solo quiero que el recuerdo no me destruya cada vez que aparece."*

### Escenario tecnológico

Carlos accede a Mnemosyne desde su escritorio, en un navegador de escritorio. Tiene fluidez técnica completa. Utiliza el sistema en **modo paciente** pero con acceso a funcionalidades avanzadas que su terapeuta ha habilitado. Puede navegar todos sus recuerdos, usar la búsqueda avanzada, y manipular el slider de Atenuación Emocional. El sistema le muestra el límite del 70% configurado por su terapeuta y le explica por qué existe.

---

## Persona 3 — Elena Navarro Soto (Persona Secundaria)

### Datos demográficos

| Campo | Detalle |
|---|---|
| **Nombre** | Elena Navarro Soto |
| **Edad** | 49 años |
| **Residencia** | Salamanca, vive cerca de la casa de su madre (María Luisa) |
| **Ocupación** | Administrativa en la USAL, jornada reducida para conciliar el cuidado |
| **Nivel tecnológico** | Medio-alto. Maneja con soltura su smartphone, correo, apps de salud y banca online |
| **Relación con el sistema** | Cuidadora principal. Configura y supervisa el implante de su madre |
| **Entorno de uso** | Desde su propio móvil o tablet, y también en la tablet de su madre cuando la visita |

### Contexto personal

Elena es la hija mayor de María Luisa (Persona 1). Desde el diagnóstico de su madre, ha asumido gradualmente el rol de cuidadora principal, reduciendo su jornada laboral al 75%. Coordina con su hermano Pablo (que vive en Barcelona), el neurólogo y la neuropsicóloga de su madre. Se siente responsable de la calidad de vida de María Luisa y a menudo experimenta culpa cuando no puede estar presente.

Elena fue quien investigó sobre el implante NeuroLink V4 y convenció al resto de la familia. Es la administradora del sistema Mnemosyne para su madre: configuró el perfil, seleccionó los recuerdos favoritos, ajustó el tamaño de letra y los permisos.

### Objetivos

| Tipo | Objetivo |
|---|---|
| **Objetivo vital** | Que su madre mantenga su dignidad y conexión emocional con la familia |
| **Objetivo de experiencia** | Sentirse segura de que el sistema es beneficioso y no va a causar daño |
| **Objetivo funcional 1** | Configurar los ajustes de la interfaz de su madre de forma rápida y sin errores |
| **Objetivo funcional 2** | Monitorizar qué recuerdos consulta su madre y cómo reacciona |
| **Objetivo funcional 3** | Poder añadir etiquetas y contexto a los recuerdos para facilitar la identificación |

### Frustraciones

- No poder estar siempre presente cuando su madre usa la tablet.
- El miedo a que una mala configuración perjudique a su madre.
- Los sistemas de permisos complejos que no entiende del todo.
- La falta de información clara sobre qué hace exactamente cada filtro.
- La sensación de estar invadiendo la privacidad de su madre al ver sus recuerdos.

### Cita representativa (basada en hallazgos)

> *"Necesito que el sistema me diga, de forma clara, qué estoy cambiando y qué efecto va a tener. No quiero tocar algo y fastidiarla."*

---

## Resumen Comparativo de Personas

| Atributo | María Luisa (P1) | Carlos (P2) | Elena (P3) |
|---|---|---|---|
| **Tipo** | Primaria | Primaria | Secundaria |
| **Edad** | 72 | 38 | 49 |
| **Patología** | Alzheimer leve | TEPT | — (cuidadora) |
| **Nivel tech** | Bajo | Alto | Medio-alto |
| **Función principal** | Claridad Facial | Atenuación Emocional | Configuración / Supervisión |
| **Dispositivo** | Tablet | Escritorio | Móvil / Tablet |
| **Autonomía** | Baja (necesita ayuda) | Alta | Alta |
| **Sensibilidad ética** | Autonomía, dignidad | Control, no borrar identidad | Seguridad, no hacer daño |

---

## Justificación de la Selección de Personas

Se han creado dos Personas Primarias y una Secundaria porque el sistema tiene **dos casos de uso radicalmente distintos** (Alzheimer y TEPT) que generan requisitos diferentes e incluso potencialmente conflictivos:

- **María Luisa** representa la necesidad de **simplicidad extrema** y la funcionalidad de **Claridad Facial**. Sus requisitos priorizan accesibilidad, elementos grandes y protección contra errores.
- **Carlos** representa la necesidad de **control fino** y la funcionalidad de **Atenuación Emocional**. Sus requisitos priorizan la precisión del slider, el feedback en tiempo real y la monitorización del progreso.
- **Elena** representa al **usuario que configura sin ser paciente**. Su existencia es fundamental porque en la investigación (Tema 4) se confirmó que los pacientes con deterioro cognitivo no configuran el sistema por sí mismos.

El reto de diseño central de Mnemosyne es **satisfacer simultáneamente** las necesidades de María Luisa (interfaz simple) y de Carlos (interfaz con control fino), probablemente mediante un sistema de modos o vistas diferenciadas.

---

## Referencias

[1] A. Cooper, R. Reimann, D. Cronin, and C. Noessel, *About Face: The Essentials of Interaction Design*, 4th ed. Indianapolis, IN: Wiley, 2014.
