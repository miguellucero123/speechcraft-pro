<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Enter para agregar...' },
})

const emit = defineEmits(['update:modelValue'])

const inputVal = ref('')
const inputRef = ref(null)

function focusInput() {
  inputRef.value?.focus()
}

function addItem() {
  const t = inputVal.value.trim().replace(',', '')
  if (!t || props.modelValue.includes(t)) return
  emit('update:modelValue', [...props.modelValue, t])
  inputVal.value = ''
}

function removeItem(item) {
  emit(
    'update:modelValue',
    props.modelValue.filter((x) => x !== item)
  )
}
</script>

<template>
  <div class="tag-wrap" @click="focusInput">
    <span
      v-for="t in modelValue"
      :key="t"
      role="button"
      tabindex="0"
      class="tag-chip"
      :aria-label="`Eliminar ${t}`"
      @click.stop="removeItem(t)"
      @keydown="
        (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            removeItem(t)
          }
        }
      "
    >
      {{ t }} ×
    </span>
    <input
      ref="inputRef"
      v-model="inputVal"
      class="tag-input-field"
      :placeholder="placeholder"
      @keydown="
        (e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addItem()
          }
        }
      "
    />
  </div>
</template>
