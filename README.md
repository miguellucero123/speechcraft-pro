# SpeechCraft PRO — Prompt Engine

Motor de prompts para generar **speeches de entrenamiento normativo** (SERNAC · SUBTEL), basado en la base de conocimiento de `reclamos.txt`.

## 🚀 Inicio Rápido

```bash
cd speechcraft
npm install
npm run dev
```

## 📁 Estructura del Proyecto (Senior Developer)

```
speechcraft/
├── src/
│   ├── components/
│   │   ├── layout/       # Topbar
│   │   ├── config/       # 4 Tabs: Caso, Personas, Formato, Avanzado
│   │   ├── prompt/       # Prompt Engine (Vista Previa | Editor | Variables)
│   │   └── builder/      # Vista Builder (resultado, historial)
│   ├── composables/      # useConfig, usePromptBuilder
│   ├── data/             # constants.js, reclamosKnowledge.js
│   ├── styles/
│   │   ├── styles.js     # Design tokens ES6 (colores, tipografía, spacing)
│   │   ├── variables.css # CSS custom properties
│   │   ├── base.css      # Reset, layout global
│   │   ├── components.css# UI componentes
│   │   └── index.css     # Punto de entrada
│   ├── utils/            # speechGenerator.js
│   ├── App.vue
│   └── main.js
├── ARCHITECTURE.md       # Detalle técnico y convenciones
├── jsconfig.json         # Path alias @/ para Vite
├── public/
└── index.html
```

**Stack**: Vue 3 (Composition API), Bootstrap 5, ES6+, Vite. Path alias `@/` → `src/`.

**Rendimiento**: Lazy loading de ConfigPanel, PromptEngine y BuilderView. PWA instalable con uso offline.

## 🎯 Funcionalidades

### 3 Modos del Prompt Engine
| Modo | Descripción |
|------|-------------|
| **👁 Vista Previa** | Renderiza el prompt con syntax highlighting (headers ámbar, JSON verde, plazos violeta, variables cyan) |
| **✏️ Editor** | Terminal editable tipo VSCode para modificar el prompt en tiempo real |
| **⚙ Variables** | Panel de variables dinámicas ({ORGANISMO}, {EJECUTIVO}, etc.) con clic para copiar |

### 4 Tabs de Configuración
| Tab | Contenido |
|-----|-----------|
| **Caso** | Organismo, servicio, descripción, tono del cliente |
| **Personas** | Ejecutivo + área, cliente + RUT + perfil, antecedentes |
| **Formato** | Complejidad, N° fases, elementos, registro idiomático, región |
| **Avanzado** | Instrucciones extra, restricciones, temperatura, max tokens |

### Base de Conocimiento (`reclamos.txt`)
- 12 categorías de reclamos (Equipos, Compras, Cobros, Línea, Prepago, Hogar, Fraude, etc.)
- 60+ speeches documentados con diálogos reales (Juan + clientes)
- Marco legal: Ley 19.496, plazos normativos, garantías

## 🎯 Generación de speeches

**Por defecto** la app genera speeches **por plantillas** (sin IA, 100% local):

- Respuestas normativas por tipo de servicio (Ley 19.496, plazos SUBTEL)
- Objeciones según tono del cliente (molesto, furioso, calmado, etc.)
- Sin coste, sin API keys

**Opcional**: Integración con APIs de IA (OpenAI, etc.). Ver `.env.example` y `docs/KNOWLEDGE_BASE.md`.

## 🛠 Scripts

- `npm run dev` — Servidor de desarrollo
- `npm run build` — Build de producción
- `npm run preview` — Vista previa del build
- `npm run test` — Tests unitarios (Vitest)
- `npm run test:watch` — Tests en modo watch
- `npm run test:e2e` — Tests e2e (Playwright)

## 🚀 Despliegue en Netlify

El proyecto incluye `netlify.toml` y `public/_redirects` listos para Netlify.

1. Crea un repositorio en GitHub y sube el proyecto.
2. En [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Conecta GitHub y selecciona el repositorio.
4. Netlify detectará automáticamente:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Despliega.

## 📄 Licencia

Uso interno AIEP.
