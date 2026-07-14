# HILO LANDING — SPEC DE INTERACCIONES

Regla general: transiciones cortas y sobrias. La página debe sentirse calmada, coherente con el producto.
Todo respeta `prefers-reduced-motion: reduce` (sin reveals, sin crossfades; cambios instantáneos).

---

## 1. Navbar (sticky)

- `position: fixed` arriba, siempre visible.
- **Estado inicial (sobre el hero):** fondo transparente, logo y enlaces en blanco.
- **Estado scrolled:** al superar `scrollY > 40px`, fondo `--bg-page` (con sombra sutil `0 1px 12px rgba(21,21,20,.06)`), logo `#391754`, enlaces `#151514`.
- Transición: background y color 250ms ease.
- Implementación: clase `.is-scrolled` en `<header>` vía listener de scroll (throttle con rAF).
- Enlaces: scroll suave a anclas (`scroll-behavior: smooth` + `scroll-margin-top` en secciones = altura navbar + 24px).
- Hover enlace: subrayado con `text-underline-offset: 6px`, aparece 150ms.

## 2. Sistema de tabs (Diario 2 · Aprendizaje 4 · Contacto 3)

Un único componente reutilizado tres veces. Cada instancia: fila de chips + imagen de panel + bloque de texto (H3 + párrafo).

- Markup accesible: `role="tablist"`, chips `role="tab"` + `aria-selected`, contenido `role="tabpanel"`.
- Al hacer clic en chip:
  1. Chip activo: fondo `#222220`, texto `#e7e2cf`. Inactivos: fondo `#e7e1d0`, texto `#151514`. Hover inactivo: `#d0cab4`. Transición 150ms.
  2. Imagen del panel: crossfade 200ms (dos capas apiladas, opacity swap; nunca reflow de altura: contenedor con aspect-ratio fijo 1:1).
  3. Texto (H3 + párrafo): fade-out 120ms → swap → fade-in 150ms con translateY(6px)→0.
- Teclado: tabs enfocables, flechas izquierda/derecha mueven selección (nice to have; mínimo imprescindible: click + Enter + focus visible).
- Sin autoplay ni rotación automática.

## 3. FAQ (acordeón)

- Cada item: `<button aria-expanded>` con pregunta + icono a la derecha.
- Icono: `+` rota 45° al abrir (queda como aspa que visualmente equivale al estado abierto del Figma, que usa "—"; si se quiere fidelidad exacta, swap de + a − con fade 150ms).
- Apertura/cierre: animar con `grid-template-rows: 0fr → 1fr` (250ms ease), no max-height mágico.
- Items independientes: abrir uno NO cierra los demás.
- Estado cerrado por defecto en todos.

## 4. Botones (estados exactos del DS)

| Estilo | Default | Hover | Pressed |
|---|---|---|---|
| Primario | fill `#391754`, texto `#fff` | fill `#221230` | fill `#221230` + `transform: scale(.98)` |
| Secundario | fill `#efe9f7`, texto `#391754` | fill `#d8c2f5` | fill `#d8c2f5` + scale(.98) |
| Outline | fill `#fff`, borde 1px `#391754`, texto `#391754` | fill `#f2f2f2` | fill `#f7f4fb` |

- Transición: background 150ms, transform 100ms.
- Focus visible en todo elemento interactivo: `outline: 2px solid #391754; outline-offset: 2px` (sobre fondos oscuros: outline `#d8c2f5`).

## 5. Reveal on scroll

- Secciones y tarjetas entran con fade + translateY(16px→0), 450ms `cubic-bezier(0.16,1,0.3,1)`, una sola vez.
- IntersectionObserver, threshold 0.15. Stagger 80ms entre tarjetas hermanas (testimonios, FAQ).
- El hero NO tiene reveal (visible al cargar).

## 6. Testimonios

- Grid estático, sin carrusel.
- Hover en tarjeta: elevación sutil (`translateY(-4px)` + sombra), 200ms. Solo si no distrae; si duda, sin hover.
- Sin botones de play: no hay vídeos (decidido).

## 7. Rendimiento de interacción

- Solo se animan `opacity` y `transform` (nunca height/top/margin, salvo el acordeón con grid-rows).
- Imágenes de paneles: `loading="lazy"` excepto el panel visible inicial de cada sección; `decoding="async"`; las 2-4 imágenes de tabs de una sección se precargan al primer hover/focus sobre su tablist.
- Hero image: `fetchpriority="high"`.
