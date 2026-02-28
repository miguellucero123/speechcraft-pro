<!--
  BuilderView — Muestra el resultado del speech generado, historial y acciones (copiar, imprimir, JSON)
-->
<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { downloadFile } from '@/utils/downloadFile'
import { exportSpeechToWord } from '@/utils/exportToWord'
import { exportSpeechToPdf } from '@/utils/exportToPdf'

const { t } = useI18n()
const loading = inject('loading')
const current = inject('current')
const history = inject('history')
const simulacroActivo = ref(false)
const simulacroFaseIndex = ref(0)
const autoAdvanceActivo = ref(false)
let autoAdvanceTimer = null

const simulacroFase = computed(() => {
  const fases = current?.value?.fases ?? []
  return fases[simulacroFaseIndex.value] ?? null
})

const simulacroTotal = computed(() => current?.value?.fases?.length ?? 0)

const puedeAnterior = computed(() => simulacroFaseIndex.value > 0)
const puedeSiguiente = computed(
  () => simulacroFaseIndex.value < simulacroTotal.value - 1
)

watch(current, () => {
  simulacroFaseIndex.value = 0
  if (simulacroActivo.value) clearAutoAdvance()
})

function iniciarSimulacro() {
  simulacroActivo.value = true
  simulacroFaseIndex.value = 0
}

function salirSimulacro() {
  simulacroActivo.value = false
  clearAutoAdvance()
}

function faseAnterior() {
  if (puedeAnterior.value) simulacroFaseIndex.value--
}

function faseSiguiente() {
  if (puedeSiguiente.value) simulacroFaseIndex.value++
}

function toggleAutoAdvance() {
  if (autoAdvanceTimer) {
    clearAutoAdvance()
    return
  }
  autoAdvanceActivo.value = true
  const delay = 6000
  function next() {
    if (simulacroFaseIndex.value < (current?.value?.fases?.length ?? 1) - 1) {
      simulacroFaseIndex.value++
      autoAdvanceTimer = setTimeout(next, delay)
    } else {
      clearAutoAdvance()
    }
  }
  autoAdvanceTimer = setTimeout(next, delay)
}

function clearAutoAdvance() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer)
    autoAdvanceTimer = null
  }
  autoAdvanceActivo.value = false
}

onUnmounted(clearAutoAdvance)
const steps = inject('steps')
const cfg = inject('cfg')
const totalFases = inject('totalFases')
const topOrg = inject('topOrg')
const lastTime = inject('lastTime')
const orgPill = inject('orgPill')
const spkClass = inject('spkClass')
const fmt = inject('fmt')
const showToast = inject('showToast')

function selectHistoryItem(item) {
  current.value = item
}

async function copySpeech() {
  if (!current.value) return
  let t = `${current.value.titulo}\n${cfg.organismo} — ${cfg.nReq}\n\n`
  current.value.fases?.forEach((f, i) => {
    t += `== FASE ${i + 1}: ${f.titulo} ==\n`
    f.dialogos?.forEach((d) => {
      t += `[${d.speaker}]: ${d.texto}\n\n`
    })
    if (f.nota) t += `NOTA: ${f.nota}\n\n`
  })
  try {
    await navigator.clipboard.writeText(t)
    showToast(t('builder.toast.speechCopiado'), 'ok', '⎘')
  } catch (e) {
    showToast(t('builder.toast.error'), 'err', '❌')
  }
}

function saveSpeech() {
  if (!current.value) return
  downloadFile(current.value, `speech-${cfg.organismo}-${Date.now()}.json`, 'application/json')
  showToast(t('builder.toast.guardadoJson'), 'ok', '💾')
}

function printNow() {
  window.print()
}

async function exportWord() {
  if (!current.value) return
  try {
    const blob = await exportSpeechToWord(current.value)
    const filename = `speech-${cfg.organismo}-${Date.now()}.docx`
    downloadFile(blob, filename, blob.type)
    showToast(t('builder.toast.exportadoWord'), 'ok', '📄')
  } catch (e) {
    showToast(t('builder.toast.errorExportar'), 'err', '❌')
  }
}

async function exportPdf() {
  if (!current.value) return
  try {
    const filename = `speech-${cfg.organismo}-${Date.now()}.pdf`
    await exportSpeechToPdf(current.value, filename)
    showToast(t('builder.toast.exportadoPdf'), 'ok', '📕')
  } catch (e) {
    showToast(t('builder.toast.errorExportar') + ' PDF', 'err', '❌')
  }
}
</script>

<template>
  <div class="output-section">
    <div v-if="history.length" class="stats-bar">
      <div class="stat-item">
        <span class="stat-ico">📋</span>
        <div>
          <div class="stat-n">{{ history.length }}</div>
          <div class="stat-lbl">{{ t('common.generados') }}</div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-ico">⚡</span>
        <div>
          <div class="stat-n">{{ totalFases }}</div>
          <div class="stat-lbl">{{ t('common.fases') }}</div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-ico">🏆</span>
        <div>
          <div class="stat-n">{{ topOrg }}</div>
          <div class="stat-lbl">{{ t('common.organismo') }}</div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-ico">⏱</span>
        <div>
          <div class="stat-n">{{ lastTime }}</div>
          <div class="stat-lbl">{{ t('common.ultimo') }}</div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !current" class="empty-screen">
      <div class="empty-glyph">🎙️</div>
      <div class="empty-h">{{ t('builder.empty.titulo') }}</div>
      <div class="empty-p">{{ t('builder.empty.desc') }}</div>
    </div>

    <div v-if="loading" class="loading-wrap">
      <div class="orb-ring"></div>
      <div class="loading-msg">{{ t('builder.loading') }}</div>
      <div class="load-steps">
        <div
          v-for="(s, i) in steps"
          :key="i"
          class="load-step"
          :class="{ vis: s.vis, done: s.done }"
        >
          <div class="sd"></div>
          <span>{{ s.t }}</span>
        </div>
      </div>
    </div>

    <div v-if="current && !loading" class="speech-result">
      <div class="result-card">
        <div class="result-card-head">
          <div class="result-meta">
            <span class="pill" :class="orgPill(current.organismo)">{{ current.organismo }}</span>
            <div>
              <div class="result-title">{{ current.titulo }}</div>
              <div
                style="font-family: var(--mono); font-size: 10px; color: var(--t3); margin-top: 2px"
              >
                {{ current.servicio }} · {{ current.timestamp }}
              </div>
            </div>
          </div>
          <div class="result-actions">
            <button
              type="button"
              class="btn-sm"
              :aria-label="t('builder.actions.word')"
              @click="exportWord"
            >
              📄 Word
            </button>
            <button
              type="button"
              class="btn-sm"
              :aria-label="t('builder.actions.pdf')"
              @click="exportPdf"
            >
              📕 PDF
            </button>
            <button
              type="button"
              class="btn-sm"
              :aria-label="t('builder.actions.imprimir')"
              @click="printNow"
            >
              🖨
            </button>
            <button
              type="button"
              class="btn-sm"
              :aria-label="t('builder.actions.copiar')"
              @click="copySpeech"
            >
              ⎘
            </button>
            <button
              type="button"
              class="btn-sm green"
              :aria-label="t('builder.actions.json')"
              @click="saveSpeech"
            >
              ↓ JSON
            </button>
            <button
              v-if="!simulacroActivo"
              type="button"
              class="btn-sm"
              :aria-label="t('builder.actions.simulacro')"
              @click="iniciarSimulacro"
            >
              ▶ {{ t('builder.simulacro.titulo') }}
            </button>
          </div>
        </div>

        <div v-if="simulacroActivo" class="simulacro-wrap">
          <div class="simulacro-controls">
            <button
              type="button"
              class="btn-sm"
              :disabled="!puedeAnterior"
              :aria-label="t('builder.actions.anterior')"
              @click="faseAnterior"
            >
              ◀ {{ t('common.anterior') }}
            </button>
            <span class="simulacro-progress">
              {{ t('builder.simulacro.fase') }} {{ simulacroFaseIndex + 1 }} / {{ simulacroTotal }}
            </span>
            <button
              type="button"
              class="btn-sm"
              :disabled="!puedeSiguiente"
              :aria-label="t('builder.actions.siguienteFase')"
              @click="faseSiguiente"
            >
              {{ t('common.siguiente') }} ▶
            </button>
            <button
              type="button"
              class="btn-sm"
              :class="{ active: autoAdvanceActivo }"
              :aria-label="t('builder.actions.autoAvance')"
              @click="toggleAutoAdvance"
            >
              {{ autoAdvanceActivo ? '⏸ ' + t('builder.actions.pausar') : '▶ Auto' }}
            </button>
            <button type="button" class="btn-sm" @click="salirSimulacro">
              {{ t('common.salir') }}
            </button>
          </div>
          <div v-if="simulacroFase" class="phase-item simulacro-phase">
            <div class="phase-head">
              <div class="phase-num">{{ simulacroFaseIndex + 1 }}</div>
              <div class="phase-name">{{ simulacroFase.titulo }}</div>
            </div>
            <div
              v-for="(l, li) in simulacroFase.dialogos"
              :key="li"
              class="dialogue"
            >
              <span class="spk-badge" :class="spkClass(l.speaker)">
                {{ l.speaker }}
              </span>
              <div class="dlg-text" v-html="fmt(l.texto)"></div>
            </div>
            <div v-if="simulacroFase.nota" class="info-box">
              ℹ {{ simulacroFase.nota }}
            </div>
            <div v-if="simulacroFase.alerta" class="warn-box">
              ⚠ {{ simulacroFase.alerta }}
            </div>
          </div>
        </div>

        <div v-else class="phase-wrap">
          <div
            v-for="(fase, fi) in current.fases"
            :key="fi"
            class="phase-item"
            :style="`animation-delay:${fi * 0.08}s`"
          >
            <div class="phase-head">
              <div class="phase-num">{{ fi + 1 }}</div>
              <div class="phase-name">{{ fase.titulo }}</div>
            </div>
            <div v-for="(l, li) in fase.dialogos" :key="li" class="dialogue">
              <span class="spk-badge" :class="spkClass(l.speaker)">{{ l.speaker }}</span>
              <div class="dlg-text" v-html="fmt(l.texto)"></div>
            </div>
            <div v-if="fase.nota" class="info-box">ℹ {{ fase.nota }}</div>
            <div v-if="fase.alerta" class="warn-box">⚠ {{ fase.alerta }}</div>
          </div>

          <div v-if="current.resumen?.length">
            <div class="phase-head" style="margin-top: 8px">
              <div
                class="phase-num"
                style="background: linear-gradient(135deg, var(--cyan), #0891b2)"
              >
                📋
              </div>
              <div class="phase-name">{{ t('builder.resumenCaso') }}</div>
            </div>
            <table class="ref-table">
              <tr v-for="row in current.resumen" :key="row.campo">
                <td>{{ row.campo }}</td>
                <td>{{ row.valor }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div v-if="history.length > 1" class="history-wrap">
        <div class="h-title">
          {{ t('builder.historial') }} <span style="color: var(--t3)">({{ history.length - 1 }})</span>
        </div>
        <div class="h-grid">
          <div
            v-for="(item, i) in history.slice(1)"
            :key="i"
            role="button"
            tabindex="0"
            class="h-item"
            :aria-label="`Ver speech: ${item.titulo}`"
            @click="selectHistoryItem(item)"
            @keydown="
              (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  selectHistoryItem(item)
                }
              }
            "
          >
            <div class="h-item-title">{{ item.titulo }}</div>
            <div class="h-item-meta">
              <span
                class="pill"
                :class="orgPill(item.organismo)"
                style="font-size: 8px; padding: 2px 7px"
              >
                {{ item.organismo }}
              </span>
              <span class="h-time">{{ item.timestamp }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
