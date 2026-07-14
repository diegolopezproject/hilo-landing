# CLAUDE.md — hilo-landing

## Qué es esto

Landing page de Hilo, app conceptual de acceso a terapia (proyecto académico, TFM de máster UX/UI). El diseño está cerrado en Figma. **Tu trabajo es replicarlo con la máxima fidelidad, no rediseñarlo ni "mejorarlo".** Cualquier duda visual se resuelve mirando las referencias en `/refs`, no improvisando.

## Stack (no negociable)

- HTML + CSS + JavaScript vanilla. Sin frameworks, sin build step, sin dependencias npm.
- Un solo `index.html`. CSS en `css/`, JS en `js/`.
- Deploy: Vercel (auto-deploy en push a main).

## Estructura

```
index.html
css/tokens.css      ← variables de diseño. NO editar valores sin autorización.
css/styles.css      ← todos los estilos, consumiendo tokens.
js/main.js          ← navbar scroll, tabs, acordeón, reveals.
assets/img/         ← fotos y paneles (WebP)
assets/img/panels/  ← 9 paneles de tabs exportados de Figma
assets/icons/       ← SVG (logo, iconos de chips, social)
refs/               ← capturas de Figma de referencia (en .vercelignore)
copy.md             ← copy definitivo. Única fuente de texto.
interacciones.md    ← spec de animaciones e interacciones.
```

## Reglas de fidelidad

1. **Colores:** solo los de `tokens.css`. Nunca inventes un hex.
2. **Texto:** solo el de `copy.md`, literal. No corrijas, no amplíes, no traduzcas.
3. **Antes de dar por terminada una sección**, compárala contra su captura en `/refs` y lista las diferencias que detectes en vez de ocultarlas.
4. Los paneles ilustrados de las secciones con tabs son **imágenes exportadas de Figma**, no se recrean en HTML/CSS.
5. Interacciones: exactamente las de `interacciones.md`. No añadas animaciones extra.

## Reglas de calidad (baseline, no opcional)

- HTML semántico: `header`, `main`, `section` con `aria-labelledby`, `footer`, un solo `h1`.
- Accesibilidad: focus visible en todo lo interactivo, tabs y acordeón con ARIA correcto, alt en todas las imágenes (los alt están en `copy.md`), contraste ya garantizado por los tokens.
- `prefers-reduced-motion` respetado globalmente.
- Imágenes: WebP, `loading="lazy"` salvo hero y primer panel visible, dimensiones width/height declaradas (evitar CLS).
- Sin console.log en producción, sin CSS muerto.

## Idioma

Todo el contenido visible en español. Comentarios de código y nombres de clases en inglés.

## Flujo de trabajo

- Trabajamos por sesiones, una zona de la página por sesión. No avances a la siguiente sección por tu cuenta.
- Cierre de cada sesión: `git add . && git commit -m "<mensaje>" && git push` y verificación del deploy en Vercel.
- Placeholders pendientes de URL: `{FIGMA_PROTO_URL}`, `{CASE_STUDY_URL}`, `{EMAIL}`. Si siguen sin valor, déjalos como `href="#"` con `data-todo="url"`.
