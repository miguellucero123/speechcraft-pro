<script setup>
defineProps({
  view: { type: String, default: 'builder' },
})
defineEmits(['update:view'])
</script>

<template>
  <div class="topbar">
    <div class="brand">
      <div class="brand-mark"><span class="brand-mark-inner">🎙</span></div>
      <span class="brand-name">SpeechCraft<sup>PRO</sup></span>
    </div>
    <div class="topbar-right">
      <button
        type="button"
        class="nav-btn nav-carta"
        :class="{ active: view === 'carta' }"
        :aria-label="view === 'carta' ? 'Vista Carta SERNAC (actual)' : 'Ver Carta SERNAC'"
        :aria-current="view === 'carta' ? 'page' : undefined"
        @click="$emit('update:view', 'carta')"
      >
        📄 Carta SERNAC
      </button>
      <button
        type="button"
        class="nav-btn"
        :class="{ active: view === 'builder' }"
        :aria-label="view === 'builder' ? 'Vista Builder (actual)' : 'Ver vista Builder'"
        :aria-current="view === 'builder' ? 'page' : undefined"
        @click="$emit('update:view', 'builder')"
      >
        ⚙ Builder
      </button>
      <button
        type="button"
        class="nav-btn"
        :class="{ active: view === 'prompt' }"
        :aria-label="view === 'prompt' ? 'Vista Prompt (actual)' : 'Ver vista Prompt'"
        :aria-current="view === 'prompt' ? 'page' : undefined"
        @click="$emit('update:view', 'prompt')"
      >
        📝 Prompt
      </button>
      <span class="pill pill-amber">SERNAC · SUBTEL</span>
      <span class="pill pill-green">v2.0</span>
    </div>
  </div>
</template>
