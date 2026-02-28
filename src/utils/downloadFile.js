/**
 * Util para descargar archivos en el navegador
 * @module utils/downloadFile
 */

/**
 * Descarga contenido como archivo en el navegador
 * @param {string|object|Blob} content - Contenido texto, objeto (se serializa como JSON) o Blob
 * @param {string} filename - Nombre del archivo (sin ruta)
 * @param {string} [mimeType='text/plain;charset=utf-8'] - MIME type (ignorado si content es Blob)
 */
export function downloadFile(content, filename, mimeType = 'text/plain;charset=utf-8') {
  const blob =
    content instanceof Blob
      ? content
      : new Blob(
          [typeof content === 'object' ? JSON.stringify(content, null, 2) : content],
          { type: mimeType }
        )
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
