/**
 * Utilidades de validación — RUT chileno, config, rangos
 * @module utils/validation
 */

/** Módulo 11 para dígito verificador RUT chileno */
const RUT_MOD = 11

/**
 * Valida RUT chileno (formato y dígito verificador)
 * @param {string} rut - RUT con o sin puntos/guion (ej: 16.789.012-3)
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateRutChile(rut) {
  if (!rut || typeof rut !== 'string') {
    return { valid: false, message: 'RUT requerido' }
  }
  const cleaned = rut.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase()
  if (cleaned.length < 8) {
    return { valid: false, message: 'RUT demasiado corto' }
  }
  const dv = cleaned.slice(-1)
  const body = cleaned.slice(0, -1)
  if (!/^\d+$/.test(body)) {
    return { valid: false, message: 'RUT debe contener solo números antes del dígito verificador' }
  }
  if (!/^[\dK]$/.test(dv)) {
    return { valid: false, message: 'Dígito verificador inválido (0-9 o K)' }
  }
  let sum = 0
  let mult = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * mult
    mult = mult === 7 ? 2 : mult + 1
  }
  const remainder = sum % RUT_MOD
  const expectedDv = remainder === 0 ? '0' : remainder === 1 ? 'K' : String(RUT_MOD - remainder)
  if (dv !== expectedDv) {
    return { valid: false, message: 'RUT con dígito verificador incorrecto' }
  }
  return { valid: true }
}

/**
 * Valida la configuración del caso antes de generar
 * @param {object} cfg - Configuración reactiva
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateConfig(cfg) {
  const errors = []

  if (!cfg.organismo?.trim()) {
    errors.push('Organismo regulador es obligatorio')
  }
  if (!cfg.servicio?.trim()) {
    errors.push('Tipo de servicio es obligatorio')
  }
  if (!cfg.caso?.trim()) {
    errors.push('Descripción del caso es obligatoria')
  }

  if (cfg.rut?.trim()) {
    const rutResult = validateRutChile(cfg.rut)
    if (!rutResult.valid) {
      errors.push(rutResult.message)
    }
  }

  const complejidad = Number(cfg.complejidad)
  if (complejidad < 1 || complejidad > 3) {
    errors.push('Complejidad debe estar entre 1 y 3')
  }

  const fases = Number(cfg.fases)
  if (fases < 3 || fases > 8) {
    errors.push('N° de fases debe estar entre 3 y 8')
  }

  const temperature = Number(cfg.temperature)
  if (Number.isNaN(temperature) || temperature < 0 || temperature > 10) {
    errors.push('Temperatura debe estar entre 0 y 10')
  }

  const maxTokens = Number(cfg.maxTokens)
  if (Number.isNaN(maxTokens) || maxTokens < 500 || maxTokens > 4000) {
    errors.push('Max Tokens debe estar entre 500 y 4000')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
