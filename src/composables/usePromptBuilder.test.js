/**
 * Tests unitarios — usePromptBuilder (highlightPrompt)
 */

import { describe, it, expect } from 'vitest'
import { usePromptBuilder } from './usePromptBuilder'

describe('usePromptBuilder', () => {
  const baseCfg = {
    organismo: 'SERNAC',
    servicio: 'MOVIL_EQUIPO',
    caso: 'Caso test',
    ejecutivo: 'Juan',
    area: 'Normativa',
    cliente: 'María',
    rut: '16.789.012-3',
    tono: 'molesto',
    nReq: 'R001',
    fases: 3,
    complejidad: 2,
    extras: [],
    keywords: [],
    frasesPro: [],
    antecedentes: '',
    region: 'CL',
    registro: 'formal',
    perfil: 'general',
    systemAdd: '',
    restricciones: '',
  }

  it('builtPrompt contiene config del caso', () => {
    const { builtPrompt } = usePromptBuilder(baseCfg)
    const text = builtPrompt.value
    expect(text).toContain('SERNAC')
    expect(text).toContain('Juan')
    expect(text).toContain('María')
    expect(text).toContain('Caso test')
  })

  it('promptVars retorna objeto con variables', () => {
    const { promptVars } = usePromptBuilder(baseCfg)
    expect(promptVars.value.ORGANISMO).toBe('SERNAC')
    expect(promptVars.value.EJECUTIVO).toBe('Juan')
    expect(promptVars.value.CLIENTE).toBe('María')
  })
})

describe('highlightPrompt', () => {
  const cfg = {
    organismo: '',
    servicio: '',
    caso: '',
    ejecutivo: '',
    area: '',
    cliente: '',
    rut: '',
    tono: '',
    nReq: '',
    fases: 3,
    complejidad: 2,
    extras: [],
    keywords: [],
    frasesPro: [],
    antecedentes: '',
    region: '',
    registro: '',
    perfil: '',
    systemAdd: '',
    restricciones: '',
  }
  const { highlightPrompt } = usePromptBuilder(cfg)

  it('retorna string vacío para input vacío', () => {
    expect(highlightPrompt('')).toBe('')
    expect(highlightPrompt(null)).toBe('')
  })

  it('envuelve headers ## en span.hl-header', () => {
    const input = '## CONFIGURACIÓN DEL CASO'
    const result = highlightPrompt(input)
    expect(result).toContain('<span class="hl-header">')
    expect(result).toContain('CONFIGURACIÓN DEL CASO')
  })

  it('envuelve separadores en span.hl-comment', () => {
    const input = '──────'
    const result = highlightPrompt(input)
    expect(result).toContain('<span class="hl-comment">')
  })

  it('envuelve keys JSON en span.hl-key', () => {
    const input = '"titulo": "valor"'
    const result = highlightPrompt(input)
    expect(result).toContain('<span class="hl-key">"titulo"</span>')
  })

  it('envuelve plazos en span.hl-num', () => {
    const input = '15 días hábiles'
    const result = highlightPrompt(input)
    expect(result).toContain('<span class="hl-num">15 días hábiles</span>')
  })
})
