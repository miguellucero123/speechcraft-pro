/**
 * Configuración de vue-i18n para SpeechCraft PRO
 * Mapeo de región (cfg.region) a locale
 * @module i18n
 */

import { createI18n } from 'vue-i18n'
import esCL from '../locales/es-CL.json'

const REGION_TO_LOCALE = {
  CL: 'es-CL',
  CO: 'es-CL',
  MX: 'es-CL',
  AR: 'es-CL',
}

export const i18n = createI18n({
  legacy: false,
  locale: 'es-CL',
  fallbackLocale: 'es-CL',
  messages: {
    'es-CL': esCL,
  },
})

/**
 * Obtiene el locale correspondiente a una región
 * @param {string} region - CL, CO, MX, AR
 * @returns {string}
 */
export function getLocaleForRegion(region) {
  return REGION_TO_LOCALE[region] ?? 'es-CL'
}
