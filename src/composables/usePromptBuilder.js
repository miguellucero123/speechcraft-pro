/**
 * Composable para construcción y formateo del prompt del speech
 * @module composables/usePromptBuilder
 */

import { computed } from 'vue'
import { EXTRAS, SVC_LABELS } from '../data/constants'

/**
 * Construye el prompt del sistema, variables y función de syntax highlighting
 * @param {object} cfg - Configuración reactiva del caso (organismo, servicio, caso, etc.)
 * @returns {{ builtPrompt: import('vue').ComputedRef<string>, promptVars: import('vue').ComputedRef<object>, highlightPrompt: (text: string) => string }}
 */
export function usePromptBuilder(cfg) {
  const builtPrompt = computed(() => {
    const extrasText = cfg.extras.map((e) => EXTRAS.find((x) => x.v === e)?.l || e).join('\n   · ')
    const kwText = cfg.keywords?.length ? cfg.keywords.join(', ') : 'ninguna'
    const frasesText = cfg.frasesPro?.length
      ? cfg.frasesPro.map((f) => `"${f}"`).join(', ')
      : 'ninguna'

    return `# SYSTEM PROMPT — SpeechCraft Normativo
══════════════════════════════════════════════════

Eres un experto senior en atención normativa de telecomunicaciones en Chile,
especializado en resolución de casos SERNAC y SUBTEL.
Tu objetivo es generar speeches de entrenamiento profesionales,
empáticos, simples y resolutivos para el equipo normativo.

## CONFIGURACIÓN DEL CASO
──────────────────────────
Organismo          : ${cfg.organismo || '[pendiente]'}
Servicio           : ${SVC_LABELS[cfg.servicio] || cfg.servicio || '[pendiente]'}
N° Requerimiento   : ${cfg.nReq}
Región             : ${cfg.region}
Registro idiomático: ${cfg.registro}
Perfil cliente     : ${cfg.perfil}

## DESCRIPCIÓN DEL CASO
──────────────────────────
${cfg.caso || '[Sin descripción. Configura el caso en el panel izquierdo]'}

${cfg.antecedentes ? `## ANTECEDENTES PREVIOS\n──────────────────────────\n${cfg.antecedentes}\n` : ''}

## PERSONAS
──────────────────────────
Ejecutivo : ${cfg.ejecutivo} (Área: ${cfg.area})
Cliente   : ${cfg.cliente} | RUT: ${cfg.rut}
Actitud del cliente: ${cfg.tono} — usa lenguaje coloquial chileno realista

## ESTRUCTURA REQUERIDA
──────────────────────────
Número de fases    : ${cfg.fases}
Nivel complejidad  : ${['básico', 'intermedio', 'avanzado con múltiples objeciones'][cfg.complejidad - 1] || 'intermedio'}
Elementos incluidos:
   · ${extrasText || 'speech básico'}
Palabras clave     : ${kwText}

## REGLAS OBLIGATORIAS DEL EJECUTIVO
──────────────────────────────────────
✦ SIEMPRE validar nombre completo y RUT al inicio
✦ SIEMPRE ser empático, simple y resolutivo
✦ SIEMPRE cerrar con: "¿Quedó clara la información entregada hoy?"
✦ SIEMPRE mencionar encuesta de evaluación al cierre
✦ NUNCA usar frases prohibidas: ${frasesText}
✦ Usar "saldo pendiente de regularización" en lugar de términos peyorativos

## PLAZOS NORMATIVOS ESTÁNDAR
──────────────────────────────────────
· Diagnóstico SSTT         → máx. 15 días hábiles
· Devoluciones/Reversas    → máx. 15 días hábiles
· Escalamientos normativos → máx. 5 días hábiles
· Reactivaciones urgentes  → máx. 2 horas
· Respuesta SERNAC/SUBTEL  → máx. 10 días hábiles
· Portabilidad urgente     → máx. 24-48 horas hábiles

## MARCO LEGAL APLICABLE
──────────────────────────
· Ley N° 19.496 — Protección al Consumidor
· Garantía legal: 6 meses desde la compra
· Garantía voluntaria: 6 meses adicionales (solo reparación/cambio)
· Derecho a retracto: 10 días corridos (solo compras remotas)
· Normativa SUBTEL para telecomunicaciones

${cfg.systemAdd ? `## INSTRUCCIONES ADICIONALES\n──────────────────────────\n${cfg.systemAdd}\n` : ''}
${cfg.restricciones ? `## RESTRICCIONES ESPECÍFICAS\n──────────────────────────\n${cfg.restricciones}\n` : ''}

## FORMATO DE RESPUESTA (JSON ESTRICTO)
──────────────────────────────────────────
Responde ÚNICAMENTE con JSON válido, sin markdown ni texto adicional:

{
  "titulo": "Título descriptivo del caso en 60 chars máx",
  "organismo": "${cfg.organismo}",
  "servicio": "${SVC_LABELS[cfg.servicio] || ''}",
  "fases": [
    {
      "titulo": "NOMBRE DE LA FASE EN MAYÚSCULAS",
      "dialogos": [
        { "speaker": "${cfg.ejecutivo}", "texto": "..." },
        { "speaker": "${cfg.cliente}", "texto": "..." }
      ],
      "nota": "Nota para el ejecutivo (string o null)",
      "alerta": "Alerta normativa crítica (string o null)"
    }
  ],
  "resumen": [
    { "campo": "Nombre del campo", "valor": "Valor del campo" }
  ]
}

IMPORTANTE: Mínimo ${cfg.fases} fases bien desarrolladas.
Las fases obligatorias son:
  1. Apertura y saludo
  2. Validación de identidad (nombre + RUT)
  3. Relato del cliente (con actitud: ${cfg.tono})
  4. Análisis y entrega de información normativa
  5. Resolución y compromisos concretos
  ${cfg.fases > 5 ? `  6-${cfg.fases}. Manejo de objeciones + cierre empático` : ''}`
  })

  const promptVars = computed(() => ({
    ORGANISMO: cfg.organismo,
    SERVICIO: SVC_LABELS[cfg.servicio] || cfg.servicio,
    CASO: cfg.caso?.substring(0, 50) + '...',
    EJECUTIVO: cfg.ejecutivo,
    AREA: cfg.area,
    CLIENTE: cfg.cliente,
    RUT: cfg.rut,
    N_REQ: cfg.nReq,
    TONO: cfg.tono,
    FASES: String(cfg.fases),
    REGION: cfg.region,
    REGISTRO: cfg.registro,
  }))

  /**
   * Aplica syntax highlighting al prompt (headers, JSON keys, plazos)
   * @param {string} text - Texto del prompt
   * @returns {string} HTML con spans para estilos
   */
  function highlightPrompt(text) {
    if (!text) return ''
    return text
      .replace(/^(#{1,2} .+)$/gm, '<span class="hl-header">$1</span>')
      .replace(/^(══+|──+)$/gm, '<span class="hl-comment">$1</span>')
      .replace(
        /("(?:titulo|organismo|servicio|fases|dialogos|speaker|texto|nota|alerta|resumen|campo|valor)")/g,
        '<span class="hl-key">$1</span>'
      )
      .replace(/: ?"([^"]*)"(?=[,\n}])/g, ': <span class="hl-str">"$1"</span>')
      .replace(/✦|·/g, '<span class="hl-val">$&</span>')
      .replace(/(\d+ días hábiles|\d+ horas)/g, '<span class="hl-num">$1</span>')
  }

  return { builtPrompt, promptVars, highlightPrompt }
}
