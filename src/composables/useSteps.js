/**
 * Composable para steps animados de carga
 * @module composables/useSteps
 */

import { reactive } from 'vue'

const DEFAULT_STEPS = [
  { t: 'Analizando configuración del caso...', vis: false, done: false },
  { t: 'Aplicando normativa legal vigente...', vis: false, done: false },
  { t: 'Construyendo estructura de fases...', vis: false, done: false },
  { t: 'Generando diálogos con IA...', vis: false, done: false },
  { t: 'Formateando output final...', vis: false, done: false },
]

/**
 * @param {Array<{t: string, vis: boolean, done: boolean}>} [stepsConfig] - Configuración de pasos
 * @returns {{ steps: object, resetSteps: () => void, animateSteps: () => Promise<void>, finishSteps: () => void }}
 */
export function useSteps(stepsConfig = DEFAULT_STEPS) {
  const steps = reactive([...stepsConfig])

  function resetSteps() {
    steps.forEach((s) => {
      s.vis = false
      s.done = false
    })
  }

  async function animateSteps(interval = 700) {
    for (let i = 0; i < steps.length; i++) {
      steps[i].vis = true
      await new Promise((r) => setTimeout(r, interval))
      if (i > 0) steps[i - 1].done = true
    }
  }

  function finishSteps() {
    steps.forEach((s) => (s.done = true))
  }

  return { steps, resetSteps, animateSteps, finishSteps }
}
