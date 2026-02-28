/**
 * Exporta un speech a documento PDF
 * @module utils/exportToPdf
 */

import { jsPDF } from 'jspdf'

/**
 * Construye el HTML del speech para renderizar en PDF
 * @param {import('../types').Speech} speech
 * @returns {string}
 */
function buildSpeechHtml(speech) {
  let html = `
    <div style="font-family: system-ui, sans-serif; font-size: 11px; color: #333; padding: 16px;">
      <h1 style="font-size: 18px; margin: 0 0 8px;">${escapeHtml(speech.titulo)}</h1>
      <p style="font-weight: bold; margin: 0 0 16px;">${escapeHtml(speech.organismo)} — ${escapeHtml(speech.servicio)}</p>
  `
  speech.fases?.forEach((fase, i) => {
    html += `<h2 style="font-size: 14px; margin: 20px 0 8px;">Fase ${i + 1}: ${escapeHtml(fase.titulo)}</h2>`
    fase.dialogos?.forEach((d) => {
      html += `<p style="margin: 4px 0;"><strong>[${escapeHtml(d.speaker)}]:</strong> ${escapeHtml(d.texto)}</p>`
    })
    if (fase.nota) {
      html += `<p style="margin: 8px 0; font-style: italic;">NOTA: ${escapeHtml(fase.nota)}</p>`
    }
    if (fase.alerta) {
      html += `<p style="margin: 8px 0; font-weight: bold;">ALERTA: ${escapeHtml(fase.alerta)}</p>`
    }
  })
  if (speech.resumen?.length) {
    html += `<h2 style="font-size: 14px; margin: 20px 0 8px;">Resumen del Caso</h2>`
    speech.resumen.forEach((r) => {
      html += `<p style="margin: 4px 0;"><strong>${escapeHtml(r.campo)}:</strong> ${escapeHtml(r.valor)}</p>`
    })
  }
  html += '</div>'
  return html
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Genera un PDF del speech y lo descarga
 * @param {import('../types').Speech} speech - Speech a exportar
 * @param {string} filename - Nombre del archivo
 * @returns {Promise<void>}
 */
export async function exportSpeechToPdf(speech, filename = 'speech.pdf') {
  const container = document.createElement('div')
  container.innerHTML = buildSpeechHtml(speech)
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.width = '700px'
  document.body.appendChild(container)

  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  await doc.html(container, {
    callback: (d) => d.save(filename),
    margin: [12, 12, 12, 12],
    windowWidth: 700,
    x: 10,
    y: 10,
  })
  document.body.removeChild(container)
}
