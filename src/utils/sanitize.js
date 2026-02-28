/**
 * Sanitización HTML para prevenir XSS en v-html
 * @module utils/sanitize
 */

import DOMPurify from 'dompurify'

/** Tags y atributos permitidos para highlight/fmt (span, strong, em con class) */
const ALLOWED = {
  ALLOWED_TAGS: ['span', 'strong', 'em'],
  ALLOWED_ATTR: ['class'],
}

/**
 * Sanitiza HTML para render seguro con v-html
 * @param {string} html - Contenido HTML a sanitizar
 * @returns {string} HTML seguro
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return ''
  return DOMPurify.sanitize(html, ALLOWED)
}
