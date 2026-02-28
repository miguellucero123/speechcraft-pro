/**
 * Composable para notificaciones toast
 * @module composables/useToast
 */

import { reactive } from 'vue'

const DEFAULT_DURATION = 3200

/**
 * @returns {{ toast: object, showToast: (msg: string, cls?: string, ico?: string) => void }}
 */
export function useToast(duration = DEFAULT_DURATION) {
  const toast = reactive({ show: false, msg: '', cls: 'ok', ico: '✅' })

  function showToast(msg, cls = 'ok', ico = '✅') {
    toast.show = true
    toast.msg = msg
    toast.cls = cls
    toast.ico = ico
    setTimeout(() => {
      toast.show = false
    }, duration)
  }

  return { toast, showToast }
}
