# Mnemosyne — Project Charter

**Proyecto:** Mnemosyne — Editor de Recuerdos  
**Asignatura:** Interacción Persona-Ordenador (IPO)  
**Universidad:** Universidad de Salamanca (USAL) — Grado en Ingeniería Informática  
**Fecha de inicio:** Febrero 2026  
**Entrega prevista:** 20 de mayo de 2026  

---

## 1. Resumen Ejecutivo

Mnemosyne es una interfaz web de tipo "panel de control" diseñada para gestionar un implante neuronal ficticio denominado **NeuroLink V4**. Este implante, de naturaleza simulada, indexa recuerdos audiovisuales del portador y permite su recuperación, visualización y manipulación mediante filtros cognitivos.

El prototipo funcional, desarrollado en HTML5, CSS3 y JavaScript vanilla, simula la experiencia completa de interacción con dicha tecnología, aplicando de forma rigurosa la metodología de **Diseño Centrado en el Usuario (DCU)** según la norma ISO 9241-210:2019.

---

## 2. Definición del Problema

### 2.1. La necesidad real

El proyecto nace de la intersección de dos problemáticas clínicas documentadas:

**A) Deterioro cognitivo asociado al Alzheimer y demencias leves**

La enfermedad de Alzheimer constituye la forma más común de demencia, representando entre el 60% y el 70% de los casos diagnosticados a nivel mundial. Según el informe de la Organización Mundial de la Salud (OMS, 2023), más de 55 millones de personas viven con alguna forma de demencia, y se prevé que esta cifra alcance los 139 millones en 2050 [1]. Uno de los síntomas más devastadores en fases tempranas es la **prosopagnosia progresiva**: la incapacidad gradual de reconocer rostros familiares, lo cual genera angustia severa tanto en el paciente como en su entorno cercano [2].

**B) Trastorno de Estrés Postraumático (TEPT)**

El TEPT afecta aproximadamente al 3,9% de la población mundial en algún momento de su vida (Koenen et al., 2017) [3]. Los pacientes experimentan re-vivencias intrusivas —flashbacks— de eventos traumáticos con una intensidad emocional comparable a la del evento original. Las terapias actuales, como la EMDR (Eye Movement Desensitization and Reprocessing) y la exposición prolongada, presentan tasas de abandono de entre el 20% y el 50% debido a la carga emocional que suponen (Schottenbauer et al., 2008) [4].

### 2.2. La brecha tecnológica

Actualmente no existe ningún dispositivo capaz de acceder directamente a los recuerdos almacenados en la memoria episódica humana. Sin embargo, avances recientes en interfaces cerebro-computadora (BCI), como los desarrollados por Neuralink (2024) o el proyecto BrainGate, sugieren que la lectura y estimulación de patrones neuronales específicos podría ser viable en las próximas décadas [5]. Mnemosyne se sitúa en este horizonte tecnológico y explora cómo debería diseñarse la interacción humana con dicha capacidad.

### 2.3. Formulación del problema

> **¿Cómo diseñar una interfaz accesible, segura y éticamente responsable que permita a personas con deterioro cognitivo leve o TEPT gestionar sus recuerdos mediante un implante neuronal, maximizando su autonomía y bienestar emocional?**

---

## 3. Visión del Producto

### 3.1. Propuesta de valor

Mnemosyne ofrece a sus usuarios un entorno visual, intuitivo y emocionalmente seguro donde pueden:

- **Buscar recuerdos** por fecha, persona, lugar o contenido emocional.
- **Visualizar recuerdos** con metadatos enriquecidos (personas presentes, lugar, emoción dominante).
- **Aplicar filtros cognitivos** en tiempo real:
  - *Claridad Facial*: mejora la nitidez de los rostros en el recuerdo, facilitando el reconocimiento para pacientes con prosopagnosia progresiva.
  - *Atenuación Emocional*: reduce la intensidad emocional del recuerdo (saturación, volumen, viveza), ofreciendo una alternativa complementaria a la terapia de exposición para TEPT.
- **Proteger recuerdos** mediante un sistema de confirmaciones y bloqueos que impida la modificación accidental de memorias valiosas.

### 3.2. Tecnología futura simulada

| Componente | Descripción ficticia |
|---|---|
| **NeuroLink V4** | Implante neuronal subdermal en la corteza temporal medial. Indexa recuerdos episódicos audiovisuales en tiempo real. |
| **Protocolo MemoSync™** | Estándar de comunicación inalámbrica (BLE 7.0 ficticio) entre el implante y dispositivos certificados. |
| **Motor de Reconstrucción Neural** | Algoritmo que transforma patrones de activación del hipocampo en secuencias de vídeo con metadatos emocionales. |

### 3.3. Lo que NO es Mnemosyne

- **No es un editor destructivo**: Mnemosyne no borra ni sobrescribe recuerdos. Aplica "capas de filtro" reversibles, análogas a los filtros no destructivos de software de edición fotográfica.
- **No es un dispositivo médico real**: El prototipo simula la interacción mediante datos ficticios (JSON + imágenes/vídeos placeholder).
- **No sustituye la terapia clínica**: Se posiciona como herramienta complementaria bajo supervisión profesional.

---

## 4. Audiencia Objetivo

Se identifican tres perfiles de usuario que serán desarrollados como Personas completas en el Commit 2:

| Perfil | Descripción | Relación con el sistema |
|---|---|---|
| **Paciente con Alzheimer leve** | Persona mayor (65-80 años), deterioro cognitivo incipiente, nivel tecnológico bajo-medio | Usuario primario. Interactúa directamente con el visor de recuerdos y filtros de claridad. |
| **Paciente con TEPT** | Adulto (25-55 años), re-vivencias traumáticas recurrentes, nivel tecnológico medio-alto | Usuario primario. Utiliza principalmente la atenuación emocional bajo guía terapéutica. |
| **Cuidador / Familiar** | Adulto (40-65 años), gestiona el bienestar del paciente, nivel tecnológico medio | Usuario secundario. Configura el sistema, supervisa el uso y gestiona los ajustes de seguridad. |

---

## 5. Alcance del Prototipo

### 5.1. Funcionalidades incluidas (In Scope)

1. **Dashboard** con resumen del estado del implante y actividad reciente.
2. **Timeline / Galería** de recuerdos navegable, con búsqueda por texto y filtros por categoría.
3. **Visor de recuerdo** con imagen/vídeo placeholder y metadatos superpuestos.
4. **Panel de filtros cognitivos** con sliders de Claridad Facial y Atenuación Emocional, con feedback visual en tiempo real (CSS filters).
5. **Sistema de confirmación** para acciones sensibles (diálogos modales con doble confirmación).
6. **Diseño responsive** adaptado a escritorio y tablet (el uso principal se prevé en dispositivos de pantalla mediana-grande, no en móvil).

### 5.2. Funcionalidades excluidas (Out of Scope)

- Autenticación de usuario real (se simula una sesión activa).
- Comunicación real con hardware (no hay implante).
- Almacenamiento persistente (los datos se cargan desde JSON estático).
- Funcionalidades de administración clínica (gestión de múltiples pacientes).

---

## 6. Restricciones y Supuestos

### 6.1. Restricciones técnicas

- **Tecnologías permitidas**: HTML5, CSS3, JavaScript vanilla (sin frameworks como React, Vue, Angular).
- **Ejecución**: El prototipo debe funcionar en navegador moderno (Chrome/Firefox) sin necesidad de servidor backend.
- **Accesibilidad**: Cumplimiento mínimo WCAG 2.1 nivel AA, dada la audiencia objetivo.

### 6.2. Restricciones académicas

- Metodología DCU obligatoria (ISO 9241-210).
- Análisis de tareas obligatorio (HTA o GOMS).
- Especificación de diálogos obligatoria (STD, BNF o UAN).
- Pruebas con usuarios obligatorias.
- Informe técnico con bibliografía IEEE o APA.

### 6.3. Supuestos

- El usuario ya tiene el implante NeuroLink V4 instalado y sincronizado.
- Existe un cuidador o profesional de apoyo disponible para la configuración inicial.
- El entorno de uso principal es el hogar del paciente, en condiciones de iluminación y ruido controladas.
- El paciente conserva capacidad motora suficiente para interactuar con una pantalla táctil o ratón.

---

## 7. Consideraciones Éticas

Dado que Mnemosyne trata con un tema extremadamente sensible (la manipulación de recuerdos humanos), el diseño incorpora principios éticos desde la fase fundacional:

1. **Autonomía**: El usuario siempre mantiene el control. Ningún filtro se aplica sin confirmación explícita.
2. **No maleficencia**: Los filtros son reversibles. No se "borran" recuerdos; se aplican capas de atenuación que pueden retirarse.
3. **Beneficencia**: Cada funcionalidad se justifica por su potencial terapéutico documentado.
4. **Transparencia**: El sistema muestra en todo momento qué filtros están activos y su nivel de intensidad.
5. **Supervisión profesional**: El diseño prevé un rol de cuidador/terapeuta que puede establecer límites de uso.

Estas consideraciones éticas informarán directamente las decisiones de diseño de interacción (Commits 4-6) y serán evaluadas durante las pruebas de usabilidad (Commit 13).

---

## 8. Metodología DCU: Planificación de Fases

El proyecto sigue el ciclo iterativo de la norma ISO 9241-210:2019 [6]:

```
  ┌──────────────────────────────────────────────────┐
  │          COMPRENDER EL CONTEXTO DE USO           │
  │            (Commits 1-2: Exploración)            │
  └──────────────┬───────────────────────────────────┘
                 │
                 ▼
  ┌──────────────────────────────────────────────────┐
  │     ESPECIFICAR REQUISITOS DE USUARIO            │
  │        (Commit 3: Análisis de tareas)            │
  └──────────────┬───────────────────────────────────┘
                 │
                 ▼
  ┌──────────────────────────────────────────────────┐
  │       PRODUCIR SOLUCIONES DE DISEÑO              │
  │    (Commits 4-9: Diseño y Prototipado)           │
  └──────────────┬───────────────────────────────────┘
                 │
                 ▼
  ┌──────────────────────────────────────────────────┐
  │        EVALUAR FRENTE A REQUISITOS               │
  │      (Commits 13-14: Tests e Iteración)          │◄── Iteración
  └──────────────────────────────────────────────────┘
```

---

## 9. Hitos y Calendario

| Semana | Hito | Commits |
|---|---|---|
| S1-S2 (Feb) | Exploración y análisis | 1, 2, 3 |
| S3-S4 (Mar) | Conceptualización y diseño | 4, 5, 6 |
| S5-S7 (Mar-Abr) | Prototipado HTML/CSS | 7, 8, 9 |
| S8-S10 (Abr) | Desarrollo funcional JS | 10, 11, 12 |
| S11-S12 (May) | Evaluación, iteración y entrega | 13, 14, 15 |
| 20 May | **Entrega final** | — |
| 21-22 May | **Defensa oral** | — |

---

## 10. Referencias

[1] World Health Organization, "Dementia," WHO Fact Sheets, Mar. 2023. [Online]. Available: https://www.who.int/news-room/fact-sheets/detail/dementia

[2] M. F. Mendez, "The Relationship Between Anxiety and Alzheimer's Disease," *Journal of Alzheimer's Disease Reports*, vol. 5, no. 1, pp. 171–177, 2021.

[3] K. C. Koenen et al., "Posttraumatic stress disorder in the World Mental Health Surveys," *Psychological Medicine*, vol. 47, no. 13, pp. 2260–2274, 2017.

[4] M. A. Schottenbauer, C. R. Glass, D. B. Arnkoff, and S. H. Gray, "Contributions of psychodynamic approaches to treatment of PTSD and trauma: A review of the empirical treatment and psychopathology literature," *Psychiatry*, vol. 71, no. 1, pp. 13–34, 2008.

[5] A. N. Belkacem, S. Jamil, and C. Chen, "Brain Computer Interfaces for Improving the Quality of Life of Older Adults and Elderly Patients," *Frontiers in Neuroscience*, vol. 14, art. 692, 2020.

[6] International Organization for Standardization, "ISO 9241-210:2019 Ergonomics of human-system interaction — Part 210: Human-centred design for interactive systems," ISO, Geneva, 2019.
