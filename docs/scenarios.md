# Mnemosyne — Escenarios de Uso

**Documento:** Scenarios v1.0  
**Fase DCU:** Exploración — Narrativas de uso  
**Referencia metodológica:** Rosson & Carroll (2002). *Usability Engineering: Scenario-Based Development of Human-Computer Interaction* [1]; Cooper et al. (2014), Cap. 5: "Designing for Personas: Scenario-Based Design" [2]  

---

## Nota metodológica

Los escenarios que se presentan son **narrativas de uso** que describen cómo cada Persona interactúa con Mnemosyne en un contexto realista. Siguiendo a Rosson & Carroll (2002), cada escenario incluye el contexto (dónde, cuándo, con quién), la motivación (por qué), la secuencia de acciones y el resultado esperado. Los escenarios están vinculados directamente a los hallazgos de la investigación y servirán como base para el Análisis de Tareas (Commit 3).

---

## Escenario 1 — María Luisa reconoce a su nieta

**Persona:** María Luisa Fernández (Persona Primaria — Alzheimer leve)  
**Función principal:** Claridad Facial  
**Vinculación con hallazgos:** Tema 1 (angustia del no-reconocimiento), Tema 2 (estrategias actuales), Tema 4 (barreras tecnológicas)

### Contexto

Es domingo por la tarde. Elena (hija de María Luisa) ha venido de visita como cada semana. María Luisa está sentada en su butaca del salón con la tablet apoyada en la mesa auxiliar. Mañana es el cumpleaños de su nieta Lucía (7 años) y la familia vendrá a merendar. En las dos últimas visitas, María Luisa no ha reconocido a Lucía, lo cual ha sido angustiante para todos.

Elena quiere ayudar a su madre a "repasar" cómo es Lucía antes de la visita de mañana.

### Secuencia

1. Elena abre Mnemosyne en la tablet de su madre. La interfaz muestra el **Dashboard** con un saludo: *"Buenas tardes, María Luisa"* y los recuerdos recientes en formato galería.

2. Elena toca la **barra de búsqueda** y escribe "Lucía". El sistema muestra una lista de recuerdos etiquetados con la presencia de Lucía, ordenados cronológicamente: la Navidad pasada, un paseo por el parque, el primer día de colegio.

3. Elena selecciona el recuerdo de la **Navidad 2025**. Se abre el **Visor de Recuerdo**: una imagen (placeholder) de la cena de Nochebuena con metadatos superpuestos: *"24 de diciembre, 2025 · Domicilio familiar · Personas: Lucía, Pablo, Tomás, Elena, Marco"*. La imagen se muestra ligeramente borrosa (el implante registra los recuerdos con la claridad que percibe el paciente, que en este caso ha degradado).

4. Elena le dice a su madre: *"Mira mamá, esto es la cena de Navidad. ¿Ves a la niña de la izquierda? Vamos a verla más clarita."* María Luisa asiente.

5. Elena desliza el **slider de Claridad Facial** hacia la derecha. El rostro de Lucía en la imagen pasa gradualmente de borroso a nítido. A medida que Elena mueve el slider, la imagen se actualiza en tiempo real. Un indicador muestra *"Claridad: 75%"*.

6. María Luisa mira la imagen y dice: *"¡Ay, si es Lucía! Mira qué guapa. Se parece a ti de pequeña."* Elena sonríe.

7. Elena toca el botón **"Guardar ajuste"**. Aparece un diálogo de confirmación con texto grande: *"¿Guardar la claridad al 75% para este recuerdo?"* con dos botones claros: *"Sí, guardar"* y *"No, cancelar"*. Elena pulsa *"Sí, guardar"*.

8. El sistema confirma con una animación suave y un mensaje: *"Ajuste guardado. Puedes cambiarlo cuando quieras."* Un pequeño icono de filtro activo queda visible en la esquina del recuerdo.

9. Elena retrocede a la galería y repiten el proceso con otros 2 recuerdos de Lucía.

### Resultado

María Luisa ha visto a Lucía con los rasgos claros en tres recuerdos recientes. Al día siguiente, cuando Lucía llega, María Luisa la reconoce con una sonrisa: *"¡Mi Lucía!"*. Aunque no podemos asegurar causalidad, la sesión de repaso ha estimulado las conexiones de reconocimiento facial.

### Requisitos evidenciados

- RF-02 (slider de Claridad Facial continuo)
- RF-05 (feedback visual inmediato)
- RF-06 (confirmación antes de guardar)
- RNF-01 (tipografía grande)
- RNF-02 (áreas de toque amplias)
- RNF-05 (máximo 3 acciones por pantalla)

---

## Escenario 2 — Carlos atenúa un flashback entre sesiones

**Persona:** Carlos Herrera (Persona Primaria — TEPT)  
**Función principal:** Atenuación Emocional  
**Vinculación con hallazgos:** Tema 3 (control gradual), Tema 5 (metáfora del ecualizador), Tema 6 (límites éticos)

### Contexto

Es martes a las 18:00. Carlos está en su despacho, frente a su monitor de 27". Hoy es uno de sus días programados de uso de Mnemosyne (acordados con su terapeuta, el Dr. Molina). Esta semana ha tenido un flashback especialmente intenso: el lunes, al frenar bruscamente un autobús junto a él, revivió el impacto del accidente. Quiere trabajar con ese recuerdo antes de su próxima sesión de EMDR (viernes).

### Secuencia

1. Carlos abre Mnemosyne en su navegador de escritorio. El **Dashboard** muestra un resumen: *"Estado del implante: Conectado · Último uso: Jueves 18:30 · Sesiones esta semana: 0/2"*. También muestra un aviso suave: *"Recuerda: puedes parar en cualquier momento."*

2. Carlos accede a la **barra de búsqueda** y escribe "accidente 2022". El sistema muestra un único resultado con un **indicador de carga emocional** en rojo: *"Nivel emocional: 9/10"*. Al lado, un indicador muestra: *"Atenuación actual: 15%"* (aplicada en sesiones anteriores).

3. Carlos hace clic en el recuerdo. El **Visor** se abre. La imagen placeholder muestra una escena de carretera nocturna con destellos. Los metadatos dicen: *"14 de marzo, 2022 · A-6, km 23 · Personas: Carlos, Diego† · Emoción dominante: Terror"*. La imagen tiene una saturación alta y un contraste intenso, representando la viveza del recuerdo.

4. Debajo de la imagen, el **Panel de Filtros** muestra dos sliders:
   - *Claridad Facial*: deshabilitado para este recuerdo (no es relevante).
   - *Atenuación Emocional*: posicionado en 15%, con un indicador de **límite máximo al 70%** (configurado por el Dr. Molina). Una pequeña etiqueta explica: *"Tu terapeuta ha establecido un límite de atenuación del 70% para este recuerdo. Esto forma parte de tu plan de tratamiento."*

5. Carlos comienza a mover lentamente el slider de Atenuación Emocional del 15% al 25%. La imagen responde en tiempo real: la saturación disminuye ligeramente, el contraste se suaviza, una capa sutil de desenfoque atenúa los detalles más nítidos del impacto. Un indicador numérico acompaña el movimiento: *"Atenuación: 16%... 19%... 22%... 25%"*.

6. Carlos pausa, respira. La interfaz muestra un **indicador de bienestar** opcional (un simple termómetro que el usuario puede actualizar manualmente): Carlos lo ajusta de "Alto malestar" a "Malestar moderado".

7. Se siente preparado y sube el slider hasta el 40%. La imagen se suaviza notablemente: los colores se atenúan, se aplica un sutil efecto de viñeta, los bordes se difuminan. Carlos siente que puede observar el recuerdo sin que le invada.

8. Pulsa **"Guardar ajuste"**. Aparece el diálogo de confirmación: *"¿Guardar la atenuación al 40%? Puedes revertirlo cuando quieras."* Dos botones: *"Guardar"* y *"Cancelar"*. Carlos confirma.

9. El sistema guarda y muestra un **resumen de la sesión**: *"Sesión de hoy: Atenuación ajustada de 15% → 40% · Duración: 12 minutos · Bienestar reportado: Moderado → Bajo malestar"*. Un botón ofrece: *"¿Quieres añadir una nota para tu terapeuta?"*. Carlos escribe: *"He podido llegar al 40% sin taquicardia. Creo que estoy preparado para más."*

10. Carlos cierra el visor y vuelve al Dashboard, que ahora muestra: *"Sesiones esta semana: 1/2"*.

### Resultado

Carlos ha trabajado autónomamente con su recuerdo traumático, incrementando la atenuación de forma gradual y controlada. La nota para su terapeuta quedará disponible para la sesión del viernes. El Dr. Molina podrá valorar si modificar el límite.

### Requisitos evidenciados

- RF-03 (slider de Atenuación Emocional continuo)
- RF-04 (reversibilidad de filtros)
- RF-05 (feedback visual inmediato)
- RF-06 (confirmación explícita)
- RF-09 (roles diferenciados: límite del terapeuta)
- RF-10 (indicadores de filtros activos)
- RNF-04 (vocabulario del usuario, no clínico)
- RNF-06 (respuesta visual < 200ms)

---

## Escenario 3 — Elena configura el sistema para su madre

**Persona:** Elena Navarro (Persona Secundaria — Cuidadora)  
**Función principal:** Configuración y supervisión  
**Vinculación con hallazgos:** Tema 2 (carga del cuidador), Tema 4 (barreras tech), Tema 6 (ética y permisos)

### Contexto

Es lunes por la noche. Elena está en su casa después de dejar a su madre acostada. Ha recibido un correo de la neuropsicóloga de María Luisa con una recomendación: incorporar los recuerdos de la última celebración familiar (el bautizo de Marco, hace 6 meses) al repertorio de estimulación. Elena quiere configurar esos recuerdos en Mnemosyne desde su propio móvil para que estén listos cuando visite a su madre el miércoles.

### Secuencia

1. Elena abre Mnemosyne desde su smartphone. El sistema la identifica como **cuidadora** y muestra el panel de administración: *"Panel de Elena — Gestionando: María Luisa Fernández"*. El dashboard muestra un resumen de la actividad de su madre: último uso, recuerdos visitados, filtros aplicados.

2. Elena accede a la sección **"Biblioteca de recuerdos"** y busca "bautizo Marco". Encuentra el recuerdo en la lista. El sistema muestra que actualmente no está en los **Favoritos** de María Luisa y no tiene filtros aplicados.

3. Elena toca **"Editar metadatos"** y verifica que las personas están correctamente etiquetadas: *Marco, Pablo, Carmen (su madre, no la hija), Elena, María Luisa, Tomás, cura, madrina*. Corrige un nombre que el sistema había identificado erróneamente.

4. Elena toca **"Previsualizar como paciente"** para ver cómo lo verá su madre. La imagen aparece con cierta borrosidad en los rostros (estado natural del recuerdo según el implante). Elena aplica un **filtro de Claridad Facial al 60%** como punto de partida. Los rostros se enfocan parcialmente.

5. Elena marca el recuerdo como **Favorito** (estrella). Esto hará que aparezca en la pantalla principal de María Luisa.

6. Antes de guardar, el sistema muestra un resumen: *"Cambios realizados: Claridad Facial → 60% · Añadido a Favoritos · Metadatos corregidos"*. Elena confirma.

7. Elena revisa la sección **"Actividad reciente"**: ve que su madre usó Mnemosyne el domingo con ella (Escenario 1) y revisó 3 recuerdos de Lucía. Sonríe al ver que el nivel de uso va aumentando.

8. Antes de cerrar, revisa los **"Límites de seguridad"**: confirma que María Luisa no tiene acceso a la función de Atenuación Emocional (no es relevante para su caso) y que los filtros de Claridad tienen un límite máximo del 90% (recomendación de la neuropsicóloga para no crear dependencia excesiva del filtro).

### Resultado

Elena ha configurado un nuevo recuerdo para su madre en menos de 5 minutos desde su móvil. El miércoles, cuando visite a María Luisa, el recuerdo del bautizo estará listo en la pantalla principal con los rostros parcialmente mejorados.

### Requisitos evidenciados

- RF-01 (búsqueda de recuerdos)
- RF-07 (recuerdos con metadatos)
- RF-09 (roles: cuidadora configura, paciente usa)
- RF-10 (indicadores de filtros)
- RNF-04 (vocabulario natural)
- RNF-07 (responsive en móvil)

---

## Escenario 4 — Situación de error: María Luisa toca algo sin querer

**Persona:** María Luisa Fernández (Persona Primaria)  
**Función principal:** Prevención y recuperación de errores  
**Vinculación con hallazgos:** Tema 4 (miedo a "romper algo"), OC1, OC2

### Contexto

María Luisa está sola en casa (Tomás ha salido a comprar). Está explorando la galería de Mnemosyne por sí misma, algo que ha empezado a hacer con más confianza. Sin querer, toca dos veces seguidas en el slider de Claridad Facial y lo mueve al 100%.

### Secuencia

1. María Luisa ve que la imagen ha cambiado bruscamente: los rostros se ven extremadamente nítidos, casi artificiales. Se asusta: *"¿Qué he hecho?"*.

2. El sistema detecta un **cambio brusco** (de 75% a 100% en menos de 0,5 segundos) y muestra un aviso prominente con texto grande y colores calmantes (no rojos): *"Has movido el filtro de Claridad. ¿Es lo que querías?"*. Dos botones grandes: **"Sí, mantener"** y **"Deshacer"** (con icono de flecha hacia atrás).

3. María Luisa no está segura, pero reconoce el botón de *"Deshacer"* porque tiene una flecha clara. Lo pulsa.

4. El slider vuelve a la posición anterior (75%). La imagen se restaura. Un mensaje de confirmación aparece brevemente: *"Listo. Todo está como antes."*

5. María Luisa se tranquiliza y sigue explorando.

### Resultado

El sistema ha prevenido una modificación accidental mediante detección de cambio brusco y ha ofrecido una recuperación con un solo toque. María Luisa no ha perdido confianza en el sistema.

### Requisitos evidenciados

- RF-04 (reversibilidad)
- RF-06 (confirmación ante cambios)
- RNF-01, RNF-02 (tipografía y áreas grandes)
- RNF-08 (colores no alarmantes)
- Principio de diseño: **Prevención de errores** (Nielsen, Heurística 5) y **Recuperación de errores** (Heurística 9)

---

## Matriz Escenarios × Requisitos

| Requisito | Esc. 1 (María Luisa) | Esc. 2 (Carlos) | Esc. 3 (Elena) | Esc. 4 (Error) |
|---|---|---|---|---|
| RF-01 Búsqueda | ✓ | ✓ | ✓ | |
| RF-02 Claridad Facial | ✓ | | ✓ | ✓ |
| RF-03 Atenuación Emocional | | ✓ | | |
| RF-04 Reversibilidad | | ✓ | | ✓ |
| RF-05 Feedback inmediato | ✓ | ✓ | | |
| RF-06 Confirmación | ✓ | ✓ | ✓ | ✓ |
| RF-07 Multisensorial | | ✓ | ✓ | |
| RF-08 Timeline | | | | |
| RF-09 Roles | | ✓ | ✓ | |
| RF-10 Indicador filtros | | ✓ | ✓ | |
| RNF-01 Tipografía grande | ✓ | | | ✓ |
| RNF-02 Áreas toque 48px | ✓ | | | ✓ |
| RNF-04 Vocabulario natural | | ✓ | ✓ | |
| RNF-05 Máx. 3 acciones | ✓ | | | |
| RNF-06 Respuesta < 200ms | | ✓ | | |
| RNF-07 Responsive | | | ✓ | |
| RNF-08 Paleta calmante | | | | ✓ |

---

## Referencias

[1] M. B. Rosson and J. M. Carroll, *Usability Engineering: Scenario-Based Development of Human-Computer Interaction*. San Francisco, CA: Morgan Kaufmann, 2002.

[2] A. Cooper, R. Reimann, D. Cronin, and C. Noessel, *About Face: The Essentials of Interaction Design*, 4th ed. Indianapolis, IN: Wiley, 2014.
