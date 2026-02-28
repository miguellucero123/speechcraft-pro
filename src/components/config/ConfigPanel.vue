<!--
  ConfigPanel — Panel izquierdo con tabs de configuración (Caso, Personas, Formato, Avanzado)
  y botón de generación
-->
<script setup>
import { inject, ref } from 'vue'
import TabCaso from './TabCaso.vue'
import TabPersonas from './TabPersonas.vue'
import TabFormato from './TabFormato.vue'
import TabAvanzado from './TabAvanzado.vue'

defineProps({
  tab: { type: String, default: 'caso' },
  loading: Boolean,
})
const emit = defineEmits(['update:tab', 'generate'])

const cfg = inject('cfg')
const canGenerate = inject('canGenerate', ref(false))
</script>

<template>
  <aside class="panel-left" role="complementary" aria-label="Configuración del caso">
    <div class="panel-tabs" role="tablist" aria-label="Secciones de configuración">
      <button
        v-for="t in ['caso', 'personas', 'formato', 'avanzado']"
        :id="`tab-${t}`"
        :key="t"
        type="button"
        class="ptab"
        role="tab"
        :aria-selected="tab === t"
        :tabindex="tab === t ? 0 : -1"
        :aria-controls="`panel-${t}`"
        :class="{ active: tab === t }"
        @click="$emit('update:tab', t)"
        @keydown="
          (e) => {
            const tabs = ['caso', 'personas', 'formato', 'avanzado']
            const i = tabs.indexOf(tab)
            if (e.key === 'ArrowRight' && i < 3) $emit('update:tab', tabs[i + 1])
            else if (e.key === 'ArrowLeft' && i > 0) $emit('update:tab', tabs[i - 1])
          }
        "
      >
        {{
          t === 'caso'
            ? 'Caso'
            : t === 'personas'
              ? 'Personas'
              : t === 'formato'
                ? 'Formato'
                : 'Avanzado'
        }}
      </button>
    </div>

    <div class="panel-body">
      <div
        v-show="tab === 'caso'"
        :id="`panel-caso`"
        role="tabpanel"
        :aria-labelledby="`tab-caso`"
        :aria-hidden="tab !== 'caso'"
      >
        <TabCaso />
      </div>
      <div
        v-show="tab === 'personas'"
        :id="`panel-personas`"
        role="tabpanel"
        :aria-labelledby="`tab-personas`"
        :aria-hidden="tab !== 'personas'"
      >
        <TabPersonas />
      </div>
      <div
        v-show="tab === 'formato'"
        :id="`panel-formato`"
        role="tabpanel"
        :aria-labelledby="`tab-formato`"
        :aria-hidden="tab !== 'formato'"
      >
        <TabFormato />
      </div>
      <div
        v-show="tab === 'avanzado'"
        :id="`panel-avanzado`"
        role="tabpanel"
        :aria-labelledby="`tab-avanzado`"
        :aria-hidden="tab !== 'avanzado'"
      >
        <TabAvanzado />
      </div>

      <div class="divider"></div>
      <button
        class="btn-gen"
        type="button"
        :disabled="loading || !canGenerate"
        aria-label="Generar speech normativo"
        @click="$emit('generate')"
      >
        <span v-if="!loading">✦ Generar Speech</span>
        <span v-else>⟳ Procesando...</span>
      </button>
    </div>
  </aside>
</template>
