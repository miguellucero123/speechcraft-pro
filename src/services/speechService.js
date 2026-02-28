/**
 * Servicio unificado de generación de speeches
 * Soporta modo plantilla (local) y modo IA (opcional)
 * @module services/speechService
 */

import { generateSpeechByTemplate } from '../utils/speechGenerator'

/** Modos de generación */
export const MODE_TEMPLATE = 'template'
export const MODE_AI = 'ai'

/**
 * Genera un speech según el modo configurado
 * Por defecto usa plantillas locales. Con VITE_USE_AI=true, VITE_AI_API_URL y
 * VITE_AI_API_KEY puede llamar a OpenAI/Anthropic.
 * @param {object} cfg - Configuración del caso
 * @param {string} [prompt] - Prompt del sistema (solo para modo IA)
 * @param {Record<string, string>} svcLabels - Etiquetas de servicios
 * @param {string} [mode=MODE_TEMPLATE] - 'template' | 'ai'
 * @returns {Promise<object>} Speech con { titulo, organismo, servicio, fases, resumen }
 */
export async function generateSpeech(cfg, prompt = '', svcLabels, mode = MODE_TEMPLATE) {
  if (mode === MODE_AI && import.meta.env.VITE_AI_API_URL && prompt) {
    return generateWithAI(cfg, prompt, svcLabels)
  }
  const parsed = generateSpeechByTemplate(cfg, svcLabels)
  return Promise.resolve(parsed)
}

/**
 * Genera speech llamando a API de IA (formato OpenAI)
 * Requiere VITE_AI_API_URL y VITE_AI_API_KEY en .env
 * Para Anthropic u otros proveedores, adaptar body y parseo de respuesta
 * @private
 */
async function generateWithAI(cfg, prompt, svcLabels) {
  const apiUrl = import.meta.env.VITE_AI_API_URL
  const apiKey = import.meta.env.VITE_AI_API_KEY
  if (!apiUrl || !apiKey) {
    console.warn('[SpeechCraft] AI no configurada: faltan VITE_AI_API_URL o VITE_AI_API_KEY')
    return generateSpeechByTemplate(cfg, svcLabels)
  }

  try {
    // Formato OpenAI Chat Completions
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        temperature: cfg.temperature / 10,
        max_tokens: cfg.maxTokens,
      }),
    })
    if (!res.ok) throw new Error(`API: ${res.status}`)
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || data.content?.[0]?.text || ''
    const parsed = parseAIResponse(content, cfg, svcLabels)
    return parsed
  } catch (err) {
    console.error('[SpeechCraft] Error IA:', err)
    return generateSpeechByTemplate(cfg, svcLabels)
  }
}

/**
 * Parsea la respuesta JSON de la IA y normaliza al formato esperado
 */
function parseAIResponse(raw, cfg, svcLabels) {
  try {
    const clean = raw.replace(/```json?\s*/g, '').replace(/```\s*$/g, '').trim()
    const data = JSON.parse(clean)
    return {
      titulo: data.titulo || `Speech — ${svcLabels[cfg.servicio] || cfg.servicio}`,
      organismo: data.organismo || cfg.organismo,
      servicio: data.servicio || svcLabels[cfg.servicio],
      fases: Array.isArray(data.fases) ? data.fases : [],
      resumen: Array.isArray(data.resumen) ? data.resumen : [],
    }
  } catch {
    return generateSpeechByTemplate(cfg, svcLabels)
  }
}
