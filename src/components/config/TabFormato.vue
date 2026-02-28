<script setup>
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const cfg = inject('cfg')
const extras = inject('extras')
const toggleExtra = inject('toggleExtra')
const complexityLabel = inject('complexityLabel')
</script>

<template>
  <div>
    <div class="section-label">{{ t('config.estructuraSpeech') }}</div>
    <div class="form-block">
      <div class="field-label">
        {{ t('config.complejidad') }} <span style="color: var(--amber)">{{ complexityLabel }}</span>
      </div>
      <div class="slider-wrap">
        <input v-model.number="cfg.complejidad" type="range" class="f-range" min="1" max="3" />
        <span class="slider-val">{{ [t('config.basico'), t('config.medio'), t('config.avanzado')][cfg.complejidad - 1] }}</span>
      </div>
    </div>

    <div class="form-block">
      <div class="field-label">{{ t('config.nFases') }}</div>
      <div class="slider-wrap">
        <input v-model.number="cfg.fases" type="range" class="f-range" min="3" max="8" />
        <span class="slider-val">{{ cfg.fases }} {{ t('config.fases') }}</span>
      </div>
    </div>

    <div class="divider"></div>
    <div class="section-label">{{ t('config.elementosIncluir') }}</div>
    <div class="form-block">
      <div class="check-list" role="group" aria-label="Elementos a incluir en el speech">
        <div
          v-for="ex in extras"
          :key="ex.v"
          role="button"
          tabindex="0"
          class="check-row"
          :class="{ on: cfg.extras.includes(ex.v) }"
          :aria-pressed="cfg.extras.includes(ex.v)"
          :aria-label="`${ex.l} ${cfg.extras.includes(ex.v) ? 'activado' : 'desactivado'}`"
          @click="toggleExtra(ex.v)"
          @keydown="
            (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleExtra(ex.v)
              }
            }
          "
        >
          <div class="check-box">
            <span v-if="cfg.extras.includes(ex.v)" class="check-mark">✓</span>
          </div>
          <span class="check-label">{{ ex.l }}</span>
        </div>
      </div>
    </div>

    <div class="divider"></div>
    <div class="section-label">{{ t('config.idiomaEstilo') }}</div>
    <div class="form-block">
      <div class="field-label">{{ t('config.registroLenguaje') }}</div>
      <div class="select-wrap">
        <select v-model="cfg.registro" class="f-select">
          <option value="formal">{{ t('config.formal') }}</option>
          <option value="cordial">{{ t('config.cordial') }}</option>
          <option value="coloquial">{{ t('config.coloquial') }}</option>
        </select>
      </div>
    </div>

    <div class="form-block">
      <div class="field-label">{{ t('config.contextoRegional') }}</div>
      <div class="select-wrap">
        <select v-model="cfg.region" class="f-select">
          <option value="CL">{{ t('config.region.CL') }}</option>
          <option value="CO">{{ t('config.region.CO') }}</option>
          <option value="MX">{{ t('config.region.MX') }}</option>
          <option value="AR">{{ t('config.region.AR') }}</option>
        </select>
      </div>
    </div>
  </div>
</template>
