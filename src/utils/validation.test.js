/**
 * Tests unitarios — validation
 */

import { describe, it, expect } from 'vitest'
import { validateRutChile, validateConfig } from './validation'

describe('validateRutChile', () => {
  it('acepta RUT válido 12.345.678-5', () => {
    expect(validateRutChile('12.345.678-5')).toEqual({ valid: true })
  })

  it('acepta RUT con K como dígito verificador', () => {
    expect(validateRutChile('11111111-1')).toEqual({ valid: true })
  })

  it('rechaza RUT vacío', () => {
    const r = validateRutChile('')
    expect(r.valid).toBe(false)
    expect(r.message).toMatch(/requerido/i)
  })

  it('rechaza RUT demasiado corto', () => {
    const r = validateRutChile('1234567')
    expect(r.valid).toBe(false)
    expect(r.message).toMatch(/corto/i)
  })

  it('rechaza RUT con dígito verificador incorrecto', () => {
    const r = validateRutChile('16.789.012-9')
    expect(r.valid).toBe(false)
    expect(r.message).toMatch(/incorrecto/i)
  })
})

describe('validateConfig', () => {
  const validCfg = {
    organismo: 'SERNAC',
    servicio: 'MOVIL_EQUIPO',
    caso: 'Caso de prueba',
    rut: '12.345.678-5',
    complejidad: 2,
    fases: 5,
    temperature: 7,
    maxTokens: 1000,
  }

  it('valida config correcta', () => {
    const r = validateConfig(validCfg)
    expect(r.valid).toBe(true)
    expect(r.errors).toHaveLength(0)
  })

  it('rechaza sin organismo', () => {
    const r = validateConfig({ ...validCfg, organismo: '' })
    expect(r.valid).toBe(false)
    expect(r.errors.some((e) => e.includes('Organismo'))).toBe(true)
  })

  it('rechaza sin servicio', () => {
    const r = validateConfig({ ...validCfg, servicio: '' })
    expect(r.valid).toBe(false)
    expect(r.errors.some((e) => e.includes('servicio'))).toBe(true)
  })

  it('rechaza sin caso', () => {
    const r = validateConfig({ ...validCfg, caso: '' })
    expect(r.valid).toBe(false)
    expect(r.errors.some((e) => e.includes('caso'))).toBe(true)
  })

  it('rechaza RUT inválido si está presente', () => {
    const r = validateConfig({ ...validCfg, rut: '11111111-9' })
    expect(r.valid).toBe(false)
    expect(r.errors.some((e) => e.includes('RUT'))).toBe(true)
  })

  it('rechaza complejidad fuera de rango', () => {
    const r = validateConfig({ ...validCfg, complejidad: 5 })
    expect(r.valid).toBe(false)
    expect(r.errors.some((e) => e.includes('Complejidad'))).toBe(true)
  })

  it('rechaza fases fuera de rango', () => {
    const r = validateConfig({ ...validCfg, fases: 10 })
    expect(r.valid).toBe(false)
    expect(r.errors.some((e) => e.includes('fases'))).toBe(true)
  })
})
