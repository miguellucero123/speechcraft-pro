/**
 * Constantes del sistema SpeechCraft
 * Sincronizadas con las categorías de reclamos.txt
 */

export const TONES = [
  { v: 'molesto', e: '😠', l: 'Molesto' },
  { v: 'furioso', e: '🤬', l: 'Furioso' },
  { v: 'calmado', e: '😐', l: 'Calmado' },
  { v: 'confundido', e: '😕', l: 'Confundido' },
  { v: 'angustiado', e: '😢', l: 'Angustiado' },
  { v: 'amenazante', e: '⚡', l: 'Amenazante' },
]

export const EXTRAS = [
  { v: 'tabla_resumen', l: '📋 Tabla de resumen final' },
  { v: 'condicion', l: '⚠️ Condición normativa' },
  { v: 'tips', l: '💡 Tips para ejecutivo' },
  { v: 'frases_prohibidas', l: '🚫 Frases a evitar' },
  { v: 'compensacion', l: '💰 Gestión de compensación' },
  { v: 'escalamiento', l: '🔁 Protocolo de escalamiento' },
]

export const SVC_LABELS = {
  // 📱 Móvil — Equipos (17 speeches en reclamos.txt)
  MOVIL_EQUIPO: 'Móvil — Equipos y Garantía',
  MOVIL_EQUIPO_SSTT: 'Móvil — Equipos SSTT (retención, pérdida, daño)',
  MOVIL_CONTRATO: 'Móvil — Contratos y Planes',
  MOVIL_COBRO: 'Móvil — Cobros y Pagos',
  MOVIL_COBRO_DEVOLUCION: 'Móvil — Cobros Devoluciones y Reversas',
  MOVIL_LINEA: 'Móvil — Línea y Conectividad',
  MOVIL_LINEA_CORTES: 'Móvil — Línea Cortes y Reactivación',
  MOVIL_LINEA_DATOS: 'Móvil — Línea Datos y Velocidad',
  PORTABILIDAD: 'Portabilidad',
  // 🔋 Prepago (9 speeches)
  PREPAGO_SALDO: 'Prepago — Saldo y Recargas',
  PREPAGO_PACKS: 'Prepago — Packs y Bonos',
  PREPAGO_CHIP: 'Prepago — Chip Bloqueado y Migración',
  // 🏠 Hogar
  HOGAR_INTERNET: 'Hogar — Internet',
  HOGAR_TV: 'Hogar — Televisión y Paquetes',
  HOGAR_TECNICO: 'Hogar — Instalación y Visitas Técnicas',
  // 📄 Contratos (9.x en reclamos.txt)
  CONTRATOS: 'Contratos y Condiciones Generales',
  // ⚠️ Especiales
  FRAUDE: 'Seguridad y Fraude (SIM Swapping)',
  ESPECIAL: 'Caso Especial (fallecido, DICOM)',
  // 🌐 Digital (12.x en reclamos.txt)
  DIGITAL: 'Servicios Digitales y App',
}

/** Categorías de reclamos.txt — 12 dominios con alta cantidad de speeches */
export const CATEGORIAS_RECLAMOS = [
  { id: 'MOVIL_EQUIPO', label: '📱 Móvil — Equipos', casos: 17 },
  { id: 'MOVIL_EQUIPO_SSTT', label: '📱 Móvil — SSTT', casos: 6 },
  { id: 'MOVIL_CONTRATO', label: '🛒 Compras y Contratos', casos: 12 },
  { id: 'MOVIL_COBRO', label: '💰 Cobros y Pagos', casos: 15 },
  { id: 'MOVIL_LINEA', label: '📶 Línea y Conectividad', casos: 10 },
  { id: 'PREPAGO_SALDO', label: '📲 Prepago', casos: 9 },
  { id: 'HOGAR_INTERNET', label: '🏠 Internet Hogar', casos: 2 },
  { id: 'HOGAR_TV', label: '📺 Televisión', casos: 5 },
  { id: 'HOGAR_TECNICO', label: '🔧 Técnicos Hogar', casos: 7 },
  { id: 'CONTRATOS', label: '📄 Contratos Generales', casos: 3 },
  { id: 'FRAUDE', label: '🔒 Seguridad y Fraude', casos: 1 },
  { id: 'ESPECIAL', label: '👴 Casos Especiales', casos: 2 },
  { id: 'PORTABILIDAD', label: '📞 Portabilidad', casos: 5 },
  { id: 'DIGITAL', label: '🌐 Servicios Digitales', casos: 3 },
]

/** Default frases prohibidas (de reclamos.txt) */
export const FRASES_PROHIBIDAS_DEFAULT = [
  'deuda castigada',
  'no puedo hacer nada',
  'no es nuestro problema',
]
