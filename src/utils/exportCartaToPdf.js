/**
 * Exporta la carta SERNAC a PDF
 * @module utils/exportCartaToPdf
 */

import { jsPDF } from 'jspdf'

function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Convierte el HTML de la carta a HTML seguro para PDF
 * @param {string} html
 * @returns {string}
 */
function cartaHtmlToPdfReady(html) {
  const div = document.createElement('div')
  div.innerHTML = html
  let out = ''
  div.querySelectorAll('p').forEach((p) => {
    let text = p.innerText || p.textContent || ''
    text = escapeHtml(text)
    out += `<p style="margin: 0 0 8px; font-size: 10px; line-height: 1.4; text-align: justify;">${text}</p>`
  })
  return out || `<p style="font-size: 10px;">${escapeHtml(div.innerText || html)}</p>`
}

/**
 * Genera y descarga el PDF de la carta SERNAC
 * @param {object} form - Datos del formulario
 * @param {string} htmlContent - Contenido HTML de la carta
 * @param {string} filename - Nombre del archivo
 */
export async function exportCartaToPdf(form, htmlContent, filename = 'carta-sernac.pdf') {
  const bodyHtml = cartaHtmlToPdfReady(htmlContent)

  const fullHtml = `
    <div style="font-family: Georgia, serif; font-size: 11px; color: #333; padding: 20px; max-width: 600px;">
      <p style="margin-bottom: 12px;"><strong>REF.:</strong> Reclamo Sernac Nro.: ${escapeHtml(form.nroReclamo || '_______________')}<br>
      <strong>Fecha:</strong> ${escapeHtml(form.fecha || '_______________')}<br>
      <strong>Resolución:</strong> ${escapeHtml(form.resolucion || '_______________')}</p>
      ${bodyHtml}
    </div>
  `

  const container = document.createElement('div')
  container.innerHTML = fullHtml
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.width = '600px'
  document.body.appendChild(container)

  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  await doc.html(container, {
    callback: (d) => d.save(filename),
    margin: [15, 15, 15, 15],
    windowWidth: 600,
    x: 10,
    y: 10,
  })
  document.body.removeChild(container)
}
