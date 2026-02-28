import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/index.css'
import { i18n } from './i18n'
import App from './App.vue'

// Limpiar Service Workers de extensiones que interfieren con localhost (Response body already used, etc.)
if (import.meta.env.DEV && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => {
      if (reg.scope.includes('localhost') || reg.scope.includes('127.0.0.1')) {
        reg.unregister().then(() => console.log('[SpeechCraft] SW externo desregistrado'))
      }
    })
  })
}

createApp(App).use(i18n).mount('#app')
