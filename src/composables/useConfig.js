/**
 * Composable de configuración del caso
 * @module composables/useConfig
 */

import { reactive } from 'vue'
import { FRASES_PROHIBIDAS_DEFAULT } from '../data/constants'
import { loadPersistedConfig } from './usePersistedState'

/** Valores por defecto de la configuración (organismo, servicio, personas, etc.) */
const defaultCfg = () => ({
  organismo: '',
  servicio: '',
  caso: '',
  ejecutivo: 'Juan',
  area: 'Normativa',
  cliente: 'María',
  rut: '12.345.678-5',
  perfil: 'general',
  nReq: 'R2026W' + (Math.floor(Math.random() * 90000000) + 10000000),
  tono: 'molesto',
  complejidad: 2,
  fases: 5,
  extras: ['tabla_resumen', 'condicion', 'tips'],
  registro: 'formal',
  region: 'CL',
  keywords: [],
  frasesPro: [...FRASES_PROHIBIDAS_DEFAULT],
  antecedentes: '',
  systemAdd: '',
  restricciones: '',
  temperature: 7,
  maxTokens: 1000,
})

/**
 * Estado global de configuración del caso con persistencia en localStorage
 * @returns {{ cfg: import('vue').Reactive<object> }} Objeto reactivo con todos los campos del formulario
 */
export function useConfig() {
  const cfg = reactive(defaultCfg())
  loadPersistedConfig(cfg)
  return { cfg }
}
