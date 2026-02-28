/**
 * Persistencia de estado en localStorage
 * @module composables/usePersistedState
 */

import { watch } from 'vue'

const STORAGE_KEY_CFG = 'speechcraft-config'
const STORAGE_KEY_HISTORY = 'speechcraft-history'
const MAX_HISTORY = 50
const DEBOUNCE_MS = 500

/**
 * Serializa config para almacenamiento (excluye campos muy grandes si aplica)
 */
function serializeCfg(cfg) {
  return JSON.stringify({
    organismo: cfg.organismo,
    servicio: cfg.servicio,
    caso: cfg.caso,
    ejecutivo: cfg.ejecutivo,
    area: cfg.area,
    cliente: cfg.cliente,
    rut: cfg.rut,
    perfil: cfg.perfil,
    nReq: cfg.nReq,
    tono: cfg.tono,
    complejidad: cfg.complejidad,
    fases: cfg.fases,
    extras: cfg.extras,
    registro: cfg.registro,
    region: cfg.region,
    keywords: cfg.keywords,
    frasesPro: cfg.frasesPro,
    antecedentes: cfg.antecedentes,
    systemAdd: cfg.systemAdd,
    restricciones: cfg.restricciones,
    temperature: cfg.temperature,
    maxTokens: cfg.maxTokens,
  })
}

/**
 * Carga config desde localStorage (solo campos válidos)
 * @param {object} defaultCfg - Config por defecto
 * @returns {object|null}
 */
export function loadPersistedConfig(defaultCfg) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CFG)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    Object.keys(parsed).forEach((k) => {
      if (k in defaultCfg && parsed[k] !== undefined) {
        defaultCfg[k] = parsed[k]
      }
    })
    return defaultCfg
  } catch {
    return null
  }
}

/**
 * Carga historial desde localStorage
 * @returns {Array}
 */
export function loadPersistedHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : []
  } catch {
    return []
  }
}

/**
 * Persiste config y historial en localStorage con debounce
 * @param {object} cfg - Config reactiva
 * @param {import('vue').Ref} historyRef - Ref del historial
 */
export function usePersistedState(cfg, historyRef) {
  let cfgTimeout
  let historyTimeout

  watch(
    () => serializeCfg(cfg),
    () => {
      clearTimeout(cfgTimeout)
      cfgTimeout = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY_CFG, serializeCfg(cfg))
        } catch (e) {
          console.warn('[SpeechCraft] No se pudo guardar config:', e)
        }
      }, DEBOUNCE_MS)
    },
    { deep: true }
  )

  watch(
    historyRef,
    (val) => {
      clearTimeout(historyTimeout)
      historyTimeout = setTimeout(() => {
        try {
          const toSave = (val || []).slice(0, MAX_HISTORY)
          localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(toSave))
        } catch (e) {
          console.warn('[SpeechCraft] No se pudo guardar historial:', e)
        }
      }, DEBOUNCE_MS)
    },
    { deep: true }
  )
}
