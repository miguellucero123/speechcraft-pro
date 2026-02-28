# SpeechCraft PRO — Arquitectura Senior Developer

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| **Vue 3** | Composition API, `<script setup>` |
| **Bootstrap 5** | Grid, utilidades, reset |
| **ES6+** | Módulos, arrow functions, destructuring |
| **Vite** | Build, HMR, path alias `@/` |

## Estructura del proyecto

```
src/
├── assets/              # Imágenes, estáticos
├── components/
│   ├── layout/          # Topbar, shells
│   ├── config/          # Tabs: Caso, Personas, Formato, Avanzado
│   ├── prompt/          # PromptEngine (Vista | Editor | Variables)
│   └── builder/         # BuilderView, resultado, historial
├── composables/        # useConfig, usePromptBuilder
├── data/                # constants.js, reclamosKnowledge.js
├── styles/
│   ├── styles.js        # Design tokens (colores, tipografía, spacing) — ES6
│   ├── variables.css    # CSS custom properties
│   ├── base.css         # Reset, body, #app
│   ├── components.css   # UI componentes
│   └── index.css        # Punto de entrada
├── utils/               # speechGenerator.js
├── App.vue
└── main.js
```

## Design system (`styles.js`)

Tokens exportados en ES6:

```js
import { colors, typography, spacing, breakpoints } from '@/styles/styles.js'
```

- **colors** — Paleta, contraste WCAG AA+
- **typography** — Fuentes, tamaños, pesos
- **spacing** — xs, sm, md, lg
- **breakpoints** — Alineados con Bootstrap

## Path alias

`@/` → `src/`

```js
import { TONES } from '@/data/constants'
import { generateSpeechByTemplate } from '@/utils/speechGenerator'
```

## Base de conocimiento

Ver `docs/KNOWLEDGE_BASE.md` — relación entre `reclamos.txt` y el código.

## Integración opcional con IA

`src/services/speechService.js` unifica generación por plantillas e IA. Para usar OpenAI:

1. Copiar `.env.example` → `.env`
2. `VITE_USE_AI=true`, `VITE_AI_API_URL`, `VITE_AI_API_KEY`
3. La app usará la API cuando esté configurada; si falla, hace fallback a plantillas.

## Convenciones

- **Componentes**: PascalCase, un directorio por feature
- **Composables**: prefijo `use`
- **Constantes**: UPPER_SNAKE en `data/`
- **Estilos**: variables en `:root`, componentes en `components.css`
