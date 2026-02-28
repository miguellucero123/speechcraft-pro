import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/index.css'
import { i18n } from './i18n'
import App from './App.vue'

// Desregistrar Service Workers legacy para que los usuarios vean siempre la versión actual
if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister())
  })
}

createApp(App).use(i18n).mount('#app')
