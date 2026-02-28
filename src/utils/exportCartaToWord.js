/**
 * Exporta la carta SERNAC a documento Word (.docx)
 * @module utils/exportCartaToWord
 */

import { Document, Packer, Paragraph, TextRun } from 'docx'

function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.innerHTML = text
  return div.textContent || ''
}

/**
 * Genera un Blob con el documento Word de la carta SERNAC
 * @param {object} form - Datos del formulario
 * @param {string} htmlContent - Contenido HTML de la carta
 * @returns {Promise<Blob>}
 */
export async function exportCartaToWord(form, htmlContent) {
  const children = []

  // Encabezado REF
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `REF.: Reclamo Sernac Nro.: ${form.nroReclamo || '_______________'}`,
          bold: true,
        }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Fecha: ${form.fecha || '_______________'}`,
          bold: true,
        }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Resolución: ${form.resolucion || '_______________'}`,
          bold: true,
        }),
      ],
      spacing: { after: 300 },
    })
  )

  // Parsear HTML para el cuerpo
  const div = document.createElement('div')
  div.innerHTML = htmlContent
  const nodes = div.querySelectorAll('p')
  if (nodes.length) {
    nodes.forEach((p) => {
      const runs = []
      const extract = (n) => {
        n.childNodes.forEach((c) => {
          if (c.nodeType === Node.TEXT_NODE && c.textContent) {
            runs.push(new TextRun({ text: c.textContent }))
          } else if (c.nodeType === Node.ELEMENT_NODE) {
            if (c.tagName === 'BR') runs.push(new TextRun({ break: 1 }))
            else if (c.tagName === 'STRONG' || c.tagName === 'B') {
              runs.push(new TextRun({ text: c.textContent || '', bold: true }))
            } else {
              extract(c)
            }
          }
        })
      }
      extract(p)
      children.push(
        new Paragraph({
          children: runs.length ? runs : [new TextRun({ text: ' ' })],
          spacing: { after: 150 },
        })
      )
    })
  } else {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: escapeHtml(htmlContent) })],
        spacing: { after: 150 },
      })
    )
  }

  const doc = new Document({
    sections: [{ children }],
  })

  return await Packer.toBlob(doc)
}
