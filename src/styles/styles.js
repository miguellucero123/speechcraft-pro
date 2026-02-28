/**
 * SpeechCraft PRO — Design System
 * Tokens y configuración centralizada (ES6)
 * @module styles
 */

/** Paleta de colores — contraste WCAG AA+ */
export const colors = {
  ink: '#0d0d12',
  paper: '#13131a',
  card: '#18181f',
  card2: '#1e1e28',
  line: 'rgba(255,255,255,0.12)',
  line2: 'rgba(255,255,255,0.08)',
  amber: '#f0a500',
  amber2: '#fbbf24',
  cyan: '#22d3ee',
  violet: '#a78bfa',
  green: '#34d399',
  red: '#f87171',
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    muted: '#64748b',
  },
}

/** Tipografía */
export const typography = {
  mono: "'Space Mono', monospace",
  serif: "'Fraunces', serif",
  sans: "'DM Sans', sans-serif",
  sizes: {
    xs: '9px',
    sm: '10px',
    base: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
}

/** Espaciado y bordes */
export const spacing = {
  xs: '4px',
  sm: '6px',
  md: '12px',
  lg: '18px',
  xl: '24px',
  '2xl': '32px',
}

export const borderRadius = {
  sm: '6px',
  md: '12px',
  lg: '18px',
  full: '9999px',
}

/** Sombras */
export const shadows = {
  base: '0 4px 32px rgba(0,0,0,0.5)',
  amber: '0 0 32px rgba(240,165,0,0.15)',
  amberHover: '0 8px 28px rgba(240,165,0,0.4)',
}

/** Breakpoints (alineados con Bootstrap) */
export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
}

/** Genera variables CSS para :root */
export const toCssVariables = () => {
  const vars = []
  const add = (prefix, obj) => {
    Object.entries(obj).forEach(([k, v]) => {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        add(`${prefix}-${k}`, v)
      } else {
        vars.push(`  --${prefix}-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`)
      }
    })
  }
  add('color', colors)
  add('font', typography)
  add('space', spacing)
  add('radius', borderRadius)
  add('shadow', shadows)
  return vars.join('\n')
}
