<script setup>
import { inject } from 'vue'
import TagInput from './TagInput.vue'

const cfg = inject('cfg')
const tempLabel = inject('tempLabel')
</script>

<template>
  <div>
    <div class="section-label">Personalización del Prompt</div>
    <div class="form-block">
      <div class="field-label">Instrucción de Sistema Adicional</div>
      <textarea
        v-model="cfg.systemAdd"
        class="f-textarea"
        rows="4"
        placeholder="Ej: El ejecutivo debe mencionar siempre el código de anulación Transbank..."
      ></textarea>
    </div>

    <div class="form-block">
      <div class="field-label">Restricciones Específicas</div>
      <textarea
        v-model="cfg.restricciones"
        class="f-textarea"
        rows="3"
        placeholder="Ej: No mencionar devoluciones. El caso ya tiene resolución técnica firme..."
      ></textarea>
    </div>

    <div class="form-block">
      <div class="field-label">Frases Prohibidas para el Ejecutivo</div>
      <TagInput v-model="cfg.frasesPro" placeholder="Enter para agregar..." />
    </div>

    <div class="divider"></div>
    <div class="section-label">Temperatura del Modelo</div>
    <div class="form-block">
      <div class="field-label">
        Creatividad <span style="color: var(--amber)">{{ tempLabel }}</span>
      </div>
      <div class="slider-wrap">
        <input v-model.number="cfg.temperature" type="range" class="f-range" min="0" max="10" />
        <span class="slider-val">{{ (cfg.temperature / 10).toFixed(1) }}</span>
      </div>
    </div>

    <div class="form-block">
      <div class="field-label">Max Tokens</div>
      <div class="slider-wrap">
        <input
          v-model.number="cfg.maxTokens"
          type="range"
          class="f-range"
          min="500"
          max="4000"
          step="100"
        />
        <span class="slider-val">{{ cfg.maxTokens }}</span>
      </div>
    </div>
  </div>
</template>
