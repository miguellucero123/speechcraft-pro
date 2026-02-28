<!--
  SpeechCraft PRO — App raíz
  Estado global, provide/inject, generación de speeches (plantilla o IA opcional)
-->
<script setup>
import { ref, computed, provide, watch, defineAsyncComponent } from 'vue'
import { useConfig } from './composables/useConfig'
import { usePromptBuilder } from './composables/usePromptBuilder'
import { useToast } from './composables/useToast'
import { useSteps } from './composables/useSteps'
import { TONES, EXTRAS, SVC_LABELS } from './data/constants'
import { generateSpeech } from './services/speechService'
import { sanitizeHtml } from './utils/sanitize'
import { validateConfig } from './utils/validation'
import { loadPersistedHistory, usePersistedState } from './composables/usePersistedState'
import { useI18n } from 'vue-i18n'
import { getLocaleForRegion } from './i18n'
import Topbar from './components/layout/Topbar.vue'

const ConfigPanel = defineAsyncComponent(() =>
  import('./components/config/ConfigPanel.vue')
)
const PromptEngine = defineAsyncComponent(() =>
  import('./components/prompt/PromptEngine.vue')
)
const BuilderView = defineAsyncComponent(() =>
  import('./components/builder/BuilderView.vue')
)

// ─── Estado global ───
const view = ref('builder')
const tab = ref('caso')
const loading = ref(false)
const current = ref(null)
const history = ref(loadPersistedHistory())
const copied = ref(false)
const promptCopied = ref(false)
const { toast, showToast } = useToast()
const { steps, resetSteps, animateSteps, finishSteps } = useSteps()

// Config y prompt
const { cfg } = useConfig()
const { builtPrompt, promptVars, highlightPrompt } = usePromptBuilder(cfg)
usePersistedState(cfg, history)
const { locale } = useI18n()
watch(
  () => cfg.region,
  (r) => {
    locale.value = getLocaleForRegion(r)
  },
  { immediate: true }
)

const complexityLabel = computed(
  () =>
    ['Básico (3 fases)', 'Intermedio (5 fases)', 'Avanzado (8 fases + objeciones)'][
      cfg.complejidad - 1
    ]
)
const tempLabel = computed(() => {
  const labels = [
    'Determinista',
    'Muy baja',
    'Baja',
    'Balanceada',
    'Balanceada',
    'Creativa',
    'Creativa',
    'Creativa',
    'Alta',
    'Muy alta',
    'Máxima',
  ]
  return labels[Math.max(0, Math.min(10, cfg.temperature))] ?? 'Balanceada'
})
const totalFases = computed(() => history.value.reduce((a, s) => a + (s.fases?.length || 0), 0))
const topOrg = computed(() => {
  if (!history.value.length) return '—'
  const c = {}
  history.value.forEach((s) => {
    c[s.organismo] = (c[s.organismo] || 0) + 1
  })
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
})
const lastTime = computed(() => history.value[0]?.timestamp || '—')
const canGenerate = computed(() => validateConfig(cfg).valid)

// Provide para hijos
provide('cfg', cfg)
provide('view', view)
provide('loading', loading)
provide('current', current)
provide('history', history)
provide('toast', toast)
provide('steps', steps)
provide('builtPrompt', builtPrompt)
provide('promptVars', promptVars)
provide('highlightPrompt', highlightPrompt)
provide('complexityLabel', complexityLabel)
provide('tempLabel', tempLabel)
provide('totalFases', totalFases)
provide('topOrg', topOrg)
provide('lastTime', lastTime)
provide('canGenerate', canGenerate)
provide('tones', TONES)
provide('extras', EXTRAS)
provide('svcLabels', SVC_LABELS)

function toggleExtra(v) {
  const i = cfg.extras.indexOf(v)
  if (i >= 0) cfg.extras.splice(i, 1)
  else cfg.extras.push(v)
}

function orgPill(org) {
  return {
    'pill-amber': org === 'SERNAC',
    'pill-cyan': org === 'SUBTEL',
    'pill-green': org === 'INTERNO',
  }
}

function spkClass(spk = '') {
  const s = spk.toLowerCase()
  if (
    s === cfg.ejecutivo?.toLowerCase() ||
    s.includes('ejecutiv') ||
    s.includes(cfg.area?.toLowerCase())
  )
    return 'spk-exec'
  if (s.includes('pausa') || s.includes('sistema') || s.includes('nota')) return 'spk-sys'
  return 'spk-client'
}

function fmt(text = '') {
  const html = text
    .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
  return sanitizeHtml(html)
}

async function generate() {
  const { valid, errors } = validateConfig(cfg)
  if (!valid) {
    showToast(errors[0] || 'Revisa los campos del formulario', 'err', '❌')
    return
  }
  loading.value = true
  current.value = null
  resetSteps()
  animateSteps()

  try {
    await new Promise((r) => setTimeout(r, 1200)) // breve delay para la animación
    const useAI = import.meta.env.VITE_USE_AI === 'true'
    const parsed = await generateSpeech(
      cfg,
      builtPrompt.value,
      SVC_LABELS,
      useAI ? 'ai' : 'template'
    )
    parsed.timestamp = new Date().toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    })
    parsed.organismo = parsed.organismo || cfg.organismo
    parsed.servicio = parsed.servicio || SVC_LABELS[cfg.servicio]

    current.value = parsed
    history.value.unshift(parsed)
    view.value = 'builder'
    showToast('Speech generado exitosamente', 'ok', '🎙️')
  } catch (err) {
    console.error(err)
    showToast('Error al generar', 'err', '❌')
  } finally {
    loading.value = false
    finishSteps()
  }
}

provide('generate', generate)
provide('showToast', showToast)
provide('toggleExtra', toggleExtra)
provide('orgPill', orgPill)
provide('spkClass', spkClass)
provide('fmt', fmt)
</script>

<template>
  <div id="app">
    <Topbar :view="view" @update:view="view = $event" />

    <div class="workspace">
      <ConfigPanel v-model:tab="tab" :loading="loading" @generate="generate" />

      <main class="panel-right" role="main" aria-label="Vista principal: Builder o Prompt">
        <PromptEngine v-if="view === 'prompt'" @generate="generate" />
        <BuilderView v-else />
      </main>
    </div>

    <div v-if="toast.show" class="toast" :class="toast.cls">
      <span>{{ toast.ico }}</span>
      <span>{{ toast.msg }}</span>
    </div>
  </div>
</template>
