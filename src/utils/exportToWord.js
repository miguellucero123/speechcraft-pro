/**
 * Exporta un speech a documento Word (.docx)
 * @module utils/exportToWord
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'

/**
 * Genera un Blob con el documento Word del speech
 * @param {import('../types').Speech} speech - Speech a exportar
 * @returns {Promise<Blob>}
 */
export async function exportSpeechToWord(speech) {
  const children = []

  children.push(
    new Paragraph({
      children: [new TextRun({ text: speech.titulo, bold: true, size: 32 })],
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
    })
  )

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${speech.organismo} — ${speech.servicio}`,
          bold: true,
        }),
      ],
      spacing: { after: 300 },
    })
  )

  speech.fases?.forEach((fase, i) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Fase ${i + 1}: ${fase.titulo}`,
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 400, after: 200 },
      })
    )

    fase.dialogos?.forEach((d) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `[${d.speaker}]: `, bold: true }),
            new TextRun({ text: d.texto }),
          ],
          spacing: { after: 120 },
        })
      )
    })

    if (fase.nota) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `NOTA: ${fase.nota}`, italics: true }),
          ],
          spacing: { after: 120 },
        })
      )
    }
    if (fase.alerta) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `ALERTA: ${fase.alerta}`, bold: true }),
          ],
          spacing: { after: 200 },
        })
      )
    }
  })

  if (speech.resumen?.length) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Resumen del Caso',
            bold: true,
            size: 24,
          }),
        ],
        spacing: { before: 400, after: 200 },
      })
    )
    speech.resumen.forEach((r) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${r.campo}: `, bold: true }),
            new TextRun(r.valor),
          ],
          spacing: { after: 80 },
        })
      )
    })
  }

  const doc = new Document({
    sections: [{ children }],
  })

  return Packer.toBlob(doc)
}
