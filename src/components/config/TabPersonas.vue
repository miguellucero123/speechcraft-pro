<script setup>
import { computed, inject } from 'vue'
import TagInput from './TagInput.vue'
import { validateRutChile } from '@/utils/validation'

const cfg = inject('cfg')
const rutError = computed(() => {
  if (!cfg.rut?.trim()) return null
  const r = validateRutChile(cfg.rut)
  return r.valid ? null : r.message
})
</script>

<template>
  <div>
    <div class="section-label">Ejecutivo</div>
    <div class="two-col">
      <div class="form-block">
        <div class="field-label">Nombre</div>
        <input v-model="cfg.ejecutivo" class="f-input" placeholder="Juan" />
      </div>
      <div class="form-block">
        <div class="field-label">Área</div>
        <div class="select-wrap">
          <select v-model="cfg.area" class="f-select">
            <option value="Normativa">Normativa</option>
            <option value="Postventa">Postventa</option>
            <option value="SSTT">Servicio Técnico</option>
            <option value="Retención">Retención</option>
          </select>
        </div>
      </div>
    </div>

    <div class="divider"></div>
    <div class="section-label">Cliente</div>
    <div class="two-col">
      <div class="form-block">
        <div class="field-label">Nombre</div>
        <input v-model="cfg.cliente" class="f-input" placeholder="María" />
      </div>
      <div class="form-block">
        <div class="field-label">RUT</div>
        <input
          v-model="cfg.rut"
          class="f-input"
          :class="{ 'input-invalid': rutError }"
          placeholder="12.345.678-5"
        />
        <span v-if="rutError" class="field-error">{{ rutError }}</span>
      </div>
    </div>

    <div class="form-block">
      <div class="field-label">Perfil del Cliente</div>
      <div class="select-wrap">
        <select v-model="cfg.perfil" class="f-select">
          <option value="general">Cliente General</option>
          <option value="adulto_mayor">Adulto Mayor</option>
          <option value="empresa">Cliente Empresa</option>
          <option value="reincidente">Cliente Reincidente</option>
          <option value="vip">Cliente VIP</option>
        </select>
      </div>
    </div>

    <div class="divider"></div>
    <div class="section-label">Contexto Adicional</div>
    <div class="form-block">
      <div class="field-label">Palabras Clave</div>
      <TagInput v-model="cfg.keywords" placeholder="Enter para agregar..." />
    </div>

    <div class="form-block">
      <div class="field-label">Antecedentes Relevantes</div>
      <textarea
        v-model="cfg.antecedentes"
        class="f-textarea"
        rows="3"
        placeholder="Ej: Cliente ya fue al servicio técnico 2 veces, tiene seguro Mi Equipo Protegido..."
      ></textarea>
    </div>
  </div>
</template>
