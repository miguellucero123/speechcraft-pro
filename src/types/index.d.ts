/**
 * Tipos compartidos — SpeechCraft PRO
 * @module types
 */

export interface Diálogo {
  speaker: string
  texto: string
}

export interface Fase {
  titulo: string
  dialogos: Diálogo[]
  nota?: string | null
  alerta?: string | null
}

export interface ResumenRow {
  campo: string
  valor: string
}

export interface Speech {
  titulo: string
  organismo: string
  servicio: string
  timestamp?: string
  fases: Fase[]
  resumen: ResumenRow[]
}

export interface Config {
  organismo: string
  servicio: string
  caso: string
  ejecutivo: string
  area: string
  cliente: string
  rut: string
  perfil: string
  nReq: string
  tono: string
  complejidad: number
  fases: number
  extras: string[]
  registro: string
  region: string
  keywords: string[]
  frasesPro: string[]
  antecedentes: string
  systemAdd: string
  restricciones: string
  temperature: number
  maxTokens: number
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
