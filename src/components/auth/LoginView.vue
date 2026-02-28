<!--
  Página de inicio — Solicita credenciales sin almacenarlas.
  Indica qué credenciales se requieren para el acceso.
-->
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const usuario = ref('')
const password = ref('')
const errorMsg = ref('')

function onSubmit() {
  errorMsg.value = ''
  if (!usuario.value.trim() || !password.value) return

  const validUser = 'admin'
  const validPassword = 'En2026$$'
  if (usuario.value.trim() === validUser && password.value === validPassword) {
    emit('login')
  } else {
    errorMsg.value = 'Credenciales incorrectas. Intenta nuevamente.'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="brand-mark"><span>🎙</span></div>
        <h1>SpeechCraft<sup>PRO</sup></h1>
        <p class="subtitle">Ingresa tus credenciales para acceder</p>
      </div>

      <form class="login-form" @submit.prevent="onSubmit">
        <div class="field">
          <label for="usuario">Usuario</label>
          <input
            id="usuario"
            v-model="usuario"
            type="text"
            autocomplete="username"
            placeholder="Ingresa tu usuario"
            required
          />
        </div>
        <div class="field">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <button type="submit" class="btn-login" :disabled="!usuario.trim() || !password">
          Ingresar
        </button>
      </form>

      <aside class="credenciales-info">
        <p class="note">Las credenciales se verifican para autorizar el acceso al sistema.</p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--r-lg);
}

.login-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  box-shadow: var(--shadow);
}

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.brand-mark {
  width: 56px;
  height: 56px;
  margin: 0 auto 0.75rem;
  background: var(--amber-dim);
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.login-header h1 {
  font-family: var(--serif);
  font-size: 1.5rem;
  color: var(--t1);
  margin: 0 0 0.25rem;
}

.login-header h1 sup {
  font-size: 0.65em;
  color: var(--amber);
}

.subtitle {
  color: var(--t3);
  font-size: 0.9rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field label {
  display: block;
  font-size: 0.85rem;
  color: var(--t2);
  margin-bottom: 0.35rem;
}

.field input {
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: var(--card2);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  color: var(--t1);
  font-family: var(--sans);
  font-size: 0.95rem;
}

.field input::placeholder {
  color: var(--t4);
}

.field input:focus {
  outline: none;
  border-color: var(--amber);
  box-shadow: 0 0 0 2px var(--amber-dim);
}

.btn-login {
  margin-top: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--amber);
  color: var(--ink);
  border: none;
  border-radius: var(--r-md);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.btn-login:hover:not(:disabled) {
  background: var(--amber2);
}

.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  color: var(--red);
  font-size: 0.9rem;
  margin: 0;
}

.credenciales-info {
  margin-top: 1.75rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--line2);
}

.credenciales-info .note {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--t4);
}
</style>
