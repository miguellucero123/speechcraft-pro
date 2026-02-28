/**
 * Tests unitarios — speechGenerator
 */

import { describe, it, expect } from 'vitest'
import { generateSpeechByTemplate } from './speechGenerator'
import { SVC_LABELS } from '../data/constants'

describe('generateSpeechByTemplate', () => {
  const baseCfg = {
    organismo: 'SERNAC',
    servicio: 'MOVIL_EQUIPO',
    caso: 'Cliente compró Smartwatch con falla de touch',
    ejecutivo: 'Juan',
    area: 'Normativa',
    cliente: 'María',
    rut: '16.789.012-3',
    tono: 'molesto',
    nReq: 'R2026W12345678',
    fases: 3,
    frasesPro: [],
  }

  it('retorna objeto con titulo, organismo, servicio, fases y resumen', () => {
    const result = generateSpeechByTemplate(baseCfg, SVC_LABELS)
    expect(result).toHaveProperty('titulo')
    expect(result).toHaveProperty('organismo')
    expect(result).toHaveProperty('servicio')
    expect(result).toHaveProperty('fases')
    expect(result).toHaveProperty('resumen')
    expect(Array.isArray(result.fases)).toBe(true)
    expect(Array.isArray(result.resumen)).toBe(true)
  })

  it('incluye organismo y nReq en el título', () => {
    const result = generateSpeechByTemplate(baseCfg, SVC_LABELS)
    expect(result.titulo).toContain('SERNAC')
    expect(result.titulo).toContain(baseCfg.nReq)
  })

  it('genera 3 fases por defecto', () => {
    const result = generateSpeechByTemplate(baseCfg, SVC_LABELS)
    expect(result.fases.length).toBe(3)
  })

  it('agrega fase de objeciones cuando fases >= 5', () => {
    const cfg = { ...baseCfg, fases: 5 }
    const result = generateSpeechByTemplate(cfg, SVC_LABELS)
    expect(result.fases.length).toBe(4)
    const objeciones = result.fases.find((f) => f.titulo === 'MANEJO DE OBJECIONES')
    expect(objeciones).toBeDefined()
  })

  it('incluye datos del ejecutivo y cliente en los diálogos', () => {
    const result = generateSpeechByTemplate(baseCfg, SVC_LABELS)
    const firstPhase = result.fases[0]
    const dialogo = firstPhase.dialogos.find((d) => d.speaker === baseCfg.ejecutivo)
    expect(dialogo.texto).toContain(baseCfg.ejecutivo)
    expect(dialogo.texto).toContain(baseCfg.cliente)
    expect(dialogo.texto).toContain(baseCfg.nReq)
  })

  it('usa respuesta normativa según tipo de servicio', () => {
    const result = generateSpeechByTemplate(baseCfg, SVC_LABELS)
    const faseNormativa = result.fases.find((f) =>
      f.titulo.includes('ANÁLISIS')
    )
    const texto = faseNormativa.dialogos
      .map((d) => d.texto)
      .join(' ')
    expect(texto).toMatch(/garantía|derecho|días hábiles/i)
  })

  it('incluye alerta de frases prohibidas cuando hay frasesPro', () => {
    const cfg = { ...baseCfg, frasesPro: ['deuda castigada'] }
    const result = generateSpeechByTemplate(cfg, SVC_LABELS)
    const faseConAlerta = result.fases.find((f) => f.alerta)
    expect(faseConAlerta?.alerta).toContain('deuda castigada')
  })
})
