<script setup>
import { ref, computed, watch, inject } from 'vue'
import { sanitizeHtml } from '@/utils/sanitize'
import { downloadFile } from '@/utils/downloadFile'

const emit = defineEmits(['generate'])
const cfg = inject('cfg')
const canGenerate = inject('canGenerate', ref(false))
const builtPrompt = inject('builtPrompt')
const promptVars = inject('promptVars')
const highlightPrompt = inject('highlightPrompt')
const showToast = inject('showToast')

const promptMode = ref('preview') // preview | edit | vars
const editablePrompt = ref('')
const promptCopied = ref(false)
const lastInserted = ref(null)

const activePrompt = computed(() =>
  promptMode.value === 'edit' ? editablePrompt.value : builtPrompt.value
)

const safeRenderedPrompt = computed(() => sanitizeHtml(highlightPrompt(builtPrompt.value)))

watch(
  builtPrompt,
  (val) => {
    if (promptMode.value !== 'edit') editablePrompt.value = val
  },
  { immediate: true }
)
watch(promptMode, (m) => {
  if (m !== 'edit') editablePrompt.value = builtPrompt.value
})

function insertVar(key) {
  const val = `{${key}}`
  navigator.clipboard.writeText(val).catch(() => {})
  lastInserted.value = key
  setTimeout(() => {
    lastInserted.value = null
  }, 1200)
  showToast(`Variable ${val} copiada`, 'ok', '⎘')
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(activePrompt.value)
    promptCopied.value = true
    setTimeout(() => {
      promptCopied.value = false
    }, 2500)
    showToast('Prompt copiado al portapapeles', 'ok', '⎘')
  } catch (e) {
    showToast('Error al copiar', 'err', '❌')
  }
}

function exportPrompt() {
  downloadFile(activePrompt.value, `speechcraft-prompt-${Date.now()}.txt`)
  showToast('Prompt exportado como .txt', 'ok', '📄')
}
</script>

<template>
  <div>
    <div class="prompt-header">
      <div>
        <div class="prompt-title-row">
          <div class="prompt-title">Prompt Engine</div>
          <span class="pill pill-amber">Live Preview</span>
        </div>
        <div class="prompt-sub" style="margin-top: 4px">Edita y exporta el prompt del speech</div>
      </div>
      <div class="action-bar">
        <button
          type="button"
          class="btn-sm"
          :class="{ active: promptCopied }"
          :aria-label="promptCopied ? 'Copiado' : 'Copiar prompt al portapapeles'"
          @click="copyPrompt"
        >
          {{ promptCopied ? '✓ Copiado' : '⎘ Copiar' }}
        </button>
        <button
          type="button"
          class="btn-sm green"
          aria-label="Exportar prompt como archivo de texto"
          @click="exportPrompt"
        >
          ↓ Exportar
        </button>
      </div>
    </div>

    <div class="prompt-body">
      <!-- Mode toggle: Vista Previa | Editor | Variables -->
      <div class="mode-tab" role="tablist" aria-label="Modo de visualización del prompt">
        <button
          type="button"
          class="mode-opt"
          role="tab"
          :aria-selected="promptMode === 'preview'"
          :tabindex="promptMode === 'preview' ? 0 : -1"
          :class="{ active: promptMode === 'preview' }"
          @click="promptMode = 'preview'"
          @keydown="
            (e) => {
              if (e.key === 'ArrowRight') promptMode = 'edit'
              else if (e.key === 'ArrowLeft') promptMode = 'vars'
            }
          "
        >
          👁 Vista Previa
        </button>
        <button
          type="button"
          class="mode-opt"
          role="tab"
          :aria-selected="promptMode === 'edit'"
          :tabindex="promptMode === 'edit' ? 0 : -1"
          :class="{ active: promptMode === 'edit' }"
          @click="promptMode = 'edit'"
          @keydown="
            (e) => {
              if (e.key === 'ArrowRight') promptMode = 'vars'
              else if (e.key === 'ArrowLeft') promptMode = 'preview'
            }
          "
        >
          ✏️ Editor
        </button>
        <button
          type="button"
          class="mode-opt"
          role="tab"
          :aria-selected="promptMode === 'vars'"
          :tabindex="promptMode === 'vars' ? 0 : -1"
          :class="{ active: promptMode === 'vars' }"
          @click="promptMode = 'vars'"
          @keydown="
            (e) => {
              if (e.key === 'ArrowRight') promptMode = 'preview'
              else if (e.key === 'ArrowLeft') promptMode = 'edit'
            }
          "
        >
          ⚙ Variables
        </button>
      </div>

      <!-- Preview: syntax highlighting (headers ámbar, JSON verde, plazos violeta, vars cyan) -->
      <div v-if="promptMode === 'preview'" class="prompt-preview-box">
        <div class="preview-header">
          <span class="preview-title">Prompt Generado</span>
          <span class="char-count">
            <span>{{ builtPrompt.length }}</span> caracteres ·
            <span>{{ Math.ceil(builtPrompt.length / 4) }}</span> tokens
          </span>
        </div>
        <div class="prompt-rendered" v-html="safeRenderedPrompt"></div>
      </div>

      <!-- Editor: terminal editable tipo VSCode -->
      <div v-if="promptMode === 'edit'" class="prompt-editor-area">
        <div class="editor-topbar">
          <div class="editor-dots">
            <div class="dot dot-r"></div>
            <div class="dot dot-y"></div>
            <div class="dot dot-g"></div>
          </div>
          <span class="editor-label">prompt.txt — editable</span>
          <span class="editor-label">{{ editablePrompt.length }} chars</span>
        </div>
        <textarea
          v-model="editablePrompt"
          class="prompt-textarea"
          spellcheck="false"
          autocomplete="off"
          placeholder="El prompt se genera automáticamente al configurar el caso..."
        ></textarea>
      </div>

      <!-- Variables: panel con clic para copiar -->
      <div v-if="promptMode === 'vars'">
        <div class="section-label" style="margin-bottom: 14px">Variables Disponibles</div>
        <div class="var-grid">
          <div
            v-for="(val, key) in promptVars"
            :key="key"
            role="button"
            tabindex="0"
            class="var-chip"
            :class="{ inserted: lastInserted === key }"
            :aria-label="`Copiar variable {${key}}`"
            @click="insertVar(key)"
            @keydown="
              (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  insertVar(key)
                }
              }
            "
          >
            <div class="var-name">{{ '{' + key + '}' }}</div>
            <div class="var-val">{{ val || '—' }}</div>
          </div>
        </div>
        <div class="info-box">
          💡 Haz clic en una variable para copiarla. Úsala en el Editor para personalizar el prompt.
        </div>
      </div>

      <div class="divider"></div>
      <button
        type="button"
        class="btn-gen"
        :disabled="!canGenerate"
        aria-label="Generar speech con este prompt"
        @click="emit('generate')"
      >
        ✦ Generar con este Prompt
      </button>
    </div>
  </div>
</template>
