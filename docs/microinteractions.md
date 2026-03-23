# Mnemosyne — Especificación de Microinteracciones

**Documento:** Microinteractions v1.0  
**Fase DCU:** Conceptualización — Diseño de comportamiento fino  
**Referencia metodológica:** Saffer (2013) [1]  
**Datos de entrada:** Wireframes (04), STDs (05), HTAs (03), Modelos Mentales (03)  

---

## 1. Marco Teórico

Dan Saffer (2013) define las microinteracciones como "momentos contenidos alrededor de un solo caso de uso" compuestos por cuatro partes: Trigger, Rules, Feedback y Loops/Modes [1]. Para Mnemosyne, las microinteracciones son especialmente críticas porque la audiencia primaria (María Luisa) necesita feedback explícito para cada acción, y la audiencia terapéutica (Carlos) necesita feedback emocional y proporcionado.

---

## 2. Microinteracción: Slider de Claridad Facial

### Componente para: María Luisa (Vista Paciente-Alzheimer)

| Parte | Especificación |
|---|---|
| **Trigger** | Toque/clic en el thumb del slider o en cualquier punto de la barra |
| **Rules** | Rango: 0-100%. Resolución: 1%. El valor actual se aplica en tiempo real a la imagen. Si el cambio es >30% en <0.5s, se activa el diálogo de cambio brusco (T12). No hay límite de terapeuta en este slider (María Luisa no tiene atenuación emocional) |
| **Feedback visual** | La imagen cambia en <200ms (RNF-06). CSS: `filter: blur()` se reduce proporcionalmente al % de claridad. El indicador numérico se actualiza. La etiqueta verbal cambia: 0-30% "Poco clara", 31-60% "Clara", 61-100% "Muy clara" |
| **Feedback sonoro** | Opcional: sonido sutil de "enfoque" al soltar el slider (click suave). Desactivable en Ajustes |
| **Loops** | El slider mantiene su posición al soltar. No hay auto-retorno. El valor persiste visualmente hasta que se guarde o deshaga |

### Especificación de estados visuales del slider

```
INACTIVO (no tocado):
┌──────────────────────────────────────────────────┐
│  ○═══════════════════════════════════════════════ │  Track: gris claro (#E0E0E0)
│  ↑                                               │  Thumb: borde gris
│  Thumb en posición 0%                            │
└──────────────────────────────────────────────────┘

ACTIVO (en arrastre):
┌──────────────────────────────────────────────────┐
│  ●━━━━━━━━━━━━━━━━━━━━━━●═══════════════════════ │  Track llenado: azul (#4A90D9)
│                         ↑                        │  Thumb: azul, escala 1.2x
│                    Posición 55%                   │  Sombra: 0 2px 8px rgba(74,144,217,0.3)
└──────────────────────────────────────────────────┘

GUARDADO:
┌──────────────────────────────────────────────────┐
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●═════════════ │  Checkmark (✓) aparece brevemente
│                                   ↑              │  sobre el thumb durante 1s
│                              Posición 75%        │
└──────────────────────────────────────────────────┘
```

### Comportamiento táctil (tablet de María Luisa)

| Gesto | Respuesta |
|---|---|
| Toque en thumb + arrastre | Slider sigue el dedo. Feedback inmediato en imagen |
| Toque en la barra (fuera del thumb) | Thumb salta a la posición tocada (con animación de 150ms) |
| Doble toque en thumb | Sin efecto (evitar confusión) |
| Toque fuera del slider | Sin efecto (no cierra ni descarta) |
| Toque largo en thumb | Sin efecto (no hay menú contextual) |

---

## 3. Microinteracción: Slider de Atenuación Emocional

### Componente para: Carlos (Vista Paciente-Terapéutica)

| Parte | Especificación |
|---|---|
| **Trigger** | Clic/arrastre en el slider. También acepta teclas de flecha (←/→) para ajuste fino (±1%) |
| **Rules** | Rango: 0% a [límite terapeuta]%. El slider NO puede superar el límite. Resolución: 1%. Un "modo gradual" opcional limita la velocidad de cambio a máx. 5%/segundo |
| **Feedback visual** | Imagen: `grayscale()` ↑ + `brightness()` ↓ + `blur()` sutil ↑ + efecto viñeta. Todo en <200ms. Zona del track más allá del límite se muestra rayada/deshabilitada |
| **Feedback textual** | Indicador numérico actualizado en tiempo real. Descriptor verbal: 0-20% "Intenso", 21-50% "Moderado", 51-80% "Suave", 81-100% "Muy suave" |
| **Límite** | Al alcanzar el límite del terapeuta: thumb se detiene, se muestra tooltip explicativo durante 3s, el track más allá se resalta en naranja (#E67E22) |
| **Loops** | Timer de inactividad: 30s sin interacción → aviso de bienestar (T28). Timer se reinicia con cualquier interacción |

### Comportamiento del límite del terapeuta

```
SLIDER CON LÍMITE:

  0%          Posición actual          Límite         100%
  │               │                     │               │
  ├━━━━━━━━━━━━━━━●═════════════════════╫▓▓▓▓▓▓▓▓▓▓▓▓▓┤
  │    Track      │     Track           │  Zona        │
  │   llenado     │   disponible        │  bloqueada   │
  │   (azul)      │   (gris claro)      │  (rayado     │
  │               │                     │   naranja)   │
                                        │
                                        └── Marca visual del límite:
                                            Línea naranja + etiqueta
                                            "Límite: 70% (Dr. Molina)"

ALCANZAR EL LÍMITE:

  ├━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●╫▓▓▓▓▓▓▓▓▓▓▓▓┤
                                        ↑
                                   Thumb se detiene.
                                   Tooltip (3s):
                                   ┌─────────────────────────────┐
                                   │ Este límite lo ha           │
                                   │ establecido tu terapeuta    │
                                   │ como parte de tu plan.      │
                                   └─────────────────────────────┘
```

---

## 4. Microinteracción: Tarjeta de Recuerdo (touch/hover)

### Componente compartido — comportamiento diferenciado por vista

| Estado | María Luisa (tablet) | Carlos (escritorio) |
|---|---|---|
| **Reposo** | Borde sutil (#E0E0E0), sombra ligera. Thumbnail + título + fecha | Borde sutil. Thumbnail + título + fecha + indicador emoción |
| **Hover / touch-down** | Touch: escala 1.02 (150ms ease-out). Sombra se intensifica | Hover: escala 1.03, sombra más pronunciada. Cursor: pointer |
| **Indicador de filtro** | Esquina inferior derecha: badge azul circular "🔵 75%" si hay filtro activo | Badge más pequeño + indicador de emoción coloreado |
| **Presión / clic** | Escala 0.98 (50ms) → transición a Visor (fade 300ms) | Escala 0.98 → transición a Visor |
| **Feedback filtro activo** | Badge permanente. No se puede ocultar | Badge + tooltip on hover: "Claridad al 75% aplicada" |

### Especificación visual

```
TARJETA — ESTADO REPOSO:
┌─────────────────────────┐
│                         │
│     ┌───────────┐       │  border-radius: 12px
│     │ thumbnail │       │  box-shadow: 0 2px 8px rgba(0,0,0,0.08)
│     │    (●)    │       │  padding: 12px
│     └───────────┘       │
│                         │
│  Navidad 2025           │  font-size: 16px (María Luisa)
│  24 dic · 5 personas    │  font-size: 14px (subtítulo)
│                 [🔵75%] │  badge: 28px circular
└─────────────────────────┘

TARJETA — ESTADO HOVER/TOUCH:
┌─────────────────────────┐
│                         │  transform: scale(1.02)
│     ┌───────────┐       │  box-shadow: 0 4px 16px rgba(0,0,0,0.12)
│     │ thumbnail │       │  transition: all 150ms ease-out
│     │    (●)    │       │  border: 2px solid #4A90D9 (azul primario)
│     └───────────┘       │
│                         │
│  Navidad 2025           │
│  24 dic · 5 personas    │
│                 [🔵75%] │
└─────────────────────────┘
```

---

## 5. Microinteracción: Diálogo de Confirmación

### Animación de entrada y salida

| Fase | Duración | Comportamiento |
|---|---|---|
| **Overlay aparece** | 200ms | Fondo oscuro (rgba(0,0,0,0.4)) con fade-in |
| **Modal aparece** | 300ms | Scale de 0.95 → 1.0 + fade-in. Ease: cubic-bezier(0.34, 1.56, 0.64, 1) (ligero rebote) |
| **Focus automático** | 0ms después del modal | El botón primario ("Sí, guardar") recibe focus visual (outline azul) para navegación por teclado |
| **Cierre (confirmar)** | 200ms | Modal: fade-out + scale 1.0 → 1.02 (efecto de "confirmación"). Overlay: fade-out |
| **Cierre (cancelar)** | 200ms | Modal: fade-out + scale 1.0 → 0.95 (efecto de "retroceso"). Overlay: fade-out |

### Reglas de interacción

| Regla | Especificación | Justificación |
|---|---|---|
| Clic en overlay NO cierra el modal | Requiere acción explícita en botón | Tema 4: María Luisa podría tocar accidentalmente el fondo |
| Tecla Escape cierra (= Cancelar) | Solo en vista de Carlos (escritorio) | Carlos tiene fluidez técnica; María Luisa no usa teclado |
| Solo 2 botones visibles | Nunca 3 o más opciones en un modal | Hick-Hyman Law; Diálogos §5.2 (Commit 3) |
| Timeout de inactividad: 30s | Si nadie toca nada, el modal permanece. NO se cierra solo | Seguridad: la acción pendiente no debe resolverse sin decisión consciente |

---

## 6. Microinteracción: Feedback de Guardado Exitoso

### Secuencia de animación

```
ESTADO 1: Modal de confirmación visible
         ┌──────────────────────┐
         │ ¿Guardar al 75%?     │
         │ [Sí]      [No]       │
         └──────────────────────┘
                    │
                 Clic "Sí"
                    │
                    ▼ (200ms: modal cierra)

ESTADO 2: Mensaje de éxito (2 segundos)
    ┌────────────────────────────────────────┐
    │  ✓  Listo. Ajuste guardado.            │   Aparece como toast/banner
    │     Puedes cambiarlo cuando quieras.   │   en la parte superior del Visor
    └────────────────────────────────────────┘   background: #E8F5E9
                                                  border-left: 4px solid #4CAF81
                    │                             Fade-in: 200ms
                    │ 2000ms
                    ▼

ESTADO 3: Toast desaparece (300ms fade-out)
    El Visor vuelve a su estado normal.
    El badge de filtro en la imagen se actualiza.
    El badge aparece con una animación de "pop" (scale 0→1, 300ms).
```

---

## 7. Microinteracción: Indicador de Bienestar (Carlos)

### Componente exclusivo de la Vista Terapéutica

| Parte | Especificación |
|---|---|
| **Trigger** | Clic/arrastre en el slider de bienestar (voluntario, no obligatorio) |
| **Rules** | 5 niveles discretos (no continuo): Alto malestar, Malestar moderado, Neutro, Bienestar moderado, Bajo malestar. Carlos puede ajustarlo en cualquier momento durante la sesión |
| **Feedback visual** | Emoji cambia según nivel: 😰 → 😟 → 😐 → 🙂 → 😌. Transición con crossfade (200ms). Color del track cambia gradualmente de rojo (#E74C3C) a verde (#27AE60) |
| **Feedback textual** | Etiqueta verbal bajo el slider se actualiza: "Alto malestar" → "Malestar moderado" etc. |
| **Loops** | El valor se captura en el resumen de sesión como dato del antes/después |

### Principio de no gamificación

El indicador de bienestar NO es una "puntuación". No se acumulan puntos, no hay logros, no se compara con sesiones anteriores de forma competitiva. La presentación es siempre neutra y descriptiva, alineada con el Gap identificado en el Modelo Mental de Carlos §3.2: "Progreso no es lineal → no gamificar".

---

## 8. Microinteracción: Animación de "Procesamiento Neural" (Transición Visor)

### Efecto de ambientación al abrir un recuerdo

| Fase | Duración | Efecto |
|---|---|---|
| **Pantalla anterior** → fade out | 150ms | La galería se atenúa |
| **Loading state** | 400ms | Pantalla con fondo oscuro (#1a1a2e). Animación de 3 puntos pulsantes conectados por líneas (simulando actividad neuronal). Texto: "Accediendo al recuerdo..." |
| **Imagen emerge** | 300ms | La imagen del recuerdo aparece con un efecto de "revelado" (clip-path circular que se expande desde el centro) |
| **Metadatos aparecen** | 200ms (delay: 100ms) | Fade-in desde abajo, escalonado |
| **Slider aparece** | 200ms (delay: 200ms) | Fade-in + slide desde abajo |

**Justificación:** Esta animación cumple una doble función:
1. **Funcional:** Cubre el tiempo de carga ficticio, dando feedback de que algo está ocurriendo (Heurística Nielsen 1: visibilidad del estado).
2. **Narrativa:** Refuerza la ficción del implante neuronal, creando la sensación de que el sistema está "accediendo" al cerebro. Esto alinea la imagen del sistema con el modelo mental del usuario (Commit 3, §1).

### Para María Luisa vs. Carlos

| Aspecto | María Luisa | Carlos |
|---|---|---|
| Duración total | 600ms (más corta: no abrumar) | 850ms (más atmosférica) |
| Mensaje | "Abriendo recuerdo..." | "Accediendo al recuerdo..." |
| Estilo visual | Puntos azules suaves, fondo blanco | Puntos azulados, fondo oscuro (#1a1a2e) |
| Sonido | Ninguno (por defecto) | Tono sutil ambiental (opcional) |

---

## 9. Tabla de Tiempos de Animación (Design Tokens)

| Token | Valor | Uso |
|---|---|---|
| `--transition-instant` | 50ms | Press feedback (scale down) |
| `--transition-fast` | 150ms | Hover states, tooltip show |
| `--transition-normal` | 300ms | Navegación entre pantallas, modal open/close |
| `--transition-slow` | 500ms | Animación de procesamiento neural |
| `--transition-emphasis` | 800ms | Reveal de imagen del recuerdo |
| `--ease-default` | ease-out | Mayoría de transiciones |
| `--ease-bounce` | cubic-bezier(0.34, 1.56, 0.64, 1) | Aparición de modales, pop de badges |
| `--ease-smooth` | cubic-bezier(0.4, 0, 0.2, 1) | Slider movement, fade transitions |

---

## 10. Mapa de Feedback por Acción

| Acción del usuario | Feedback inmediato (<100ms) | Feedback completo (<500ms) | Feedback final |
|---|---|---|---|
| Tocar tarjeta de recuerdo | Scale 0.98 + sombra | Animación neural + reveal imagen | Visor completo cargado |
| Mover slider claridad | Imagen cambia en tiempo real | Indicador % se actualiza | Etiqueta verbal cambia |
| Mover slider atenuación | Imagen cambia en tiempo real | Indicador % + check de límite | Etiqueta verbal + tooltip si límite |
| Pulsar "Guardar" | Botón: scale 0.95 + color pressed | Modal aparece (300ms) | Modal completamente visible con focus |
| Confirmar guardado | Modal cierra (200ms) | Toast de éxito aparece | Badge de filtro actualizado (pop) |
| Pulsar "Deshacer" | Botón: scale 0.95 | Slider vuelve a posición previa (300ms ease) | Imagen restaurada |
| Clic "← Volver" | Botón: color pressed | Transición de pantalla (300ms fade) | Pantalla anterior restaurada |

---

## 11. Referencias

[1] D. Saffer, *Microinteractions: Designing with Details*. Sebastopol, CA: O'Reilly Media, 2013.
