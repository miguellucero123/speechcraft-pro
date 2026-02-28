/**
 * Base de conocimiento extraída de reclamos.txt
 * Categorías y casos documentados para SpeechCraft (60+ speeches)
 * @see ../reclamos.txt (archivo original)
 */

export const RECLAMOS_META = {
  titulo: 'Reclamos | Todos los Servicios | SERNAC — SUBTEL',
  ejecutivo: 'Juan',
  contexto: 'Clientes Ofuscados',
}

/** Casos por categoría — alta cantidad de speeches en reclamos.txt */
export const CASOS_POR_CATEGORIA = {
  // 📱 1. SERVICIO MÓVIL — EQUIPOS (17 casos)
  MOVIL_EQUIPO: [
    'Equipo Nuevo con Falla desde el Primer Día',
    'Equipo con Falla dentro de Garantía Legal',
    'Equipo con Falla fuera de Garantía Legal',
    'Equipo Retenido en SSTT más de 15 Días Hábiles',
    'SSTT Determina Daño del Usuario — Cliente No Acepta',
    'Segundo Rechazo de Garantía Consecutivo',
    'Equipo Reparado y Vuelve con la Misma Falla',
    'Equipo Reparado con Daño Nuevo al Retirarlo',
    'Equipo Perdido o Extraviado en SSTT',
    'Pantalla Trizada — Discusión Origen Falla',
    'Equipo con Daño por Líquido — Cliente Niega',
    'Equipo Bloqueado por IMEI',
    'Equipo Comprado con Accesorios Faltantes',
    'Equipo Entregado sin Cargador Original',
    'Cambio de Color — Disconformidad Compra Presencial',
    'Equipo de Préstamo con Falla durante Reparación',
    'Cliente Exige Cambio por Modelo Superior',
  ],
  MOVIL_EQUIPO_SSTT: [
    'Equipo Retenido en SSTT más de 15 Días Hábiles',
    'SSTT Determina Daño del Usuario — Cliente No Acepta',
    'Segundo Rechazo de Garantía Consecutivo',
    'Equipo Reparado con Daño Nuevo al Retirarlo',
    'Equipo Perdido o Extraviado en SSTT',
    'Cargo por Diagnóstico SSTT Siendo Equipo en Garantía',
  ],
  // 🛒 2. COMPRAS Y CONTRATOS (12 casos)
  MOVIL_CONTRATO: [
    'Compra Presencial — Disconformidad Producto',
    'Compra Online — Retracto dentro del Plazo',
    'Compra Online — Retracto fuera del Plazo',
    'Plan Contratado No Corresponde al Ofrecido en Venta',
    'Vendedor Ofreció Condiciones Distintas al Contrato',
    'Contrato Firmado sin Conocimiento del Cliente',
    'Contrato Renovado Automáticamente sin Autorización',
    'Cliente Exige Término Anticipado de Contrato',
    'Término de Contrato con Cobro de Multa No Informada',
    'Contrato Vinculado — Separar Equipo y Servicio',
    'Permanencia Mínima No Informada',
    'Portabilidad Ejecutada sin Autorización',
    'Número Portado a Operador Equivocado',
  ],
  // 💰 3. COBROS Y PAGOS (15 casos)
  MOVIL_COBRO: [
    'Cobro Indebido — Servicio No Contratado',
    'Doble Cobro en Cuenta Mensual',
    'Cobro Total de Equipo en Cuotas en Una Sola Cuenta',
    'Pago Realizado y Línea Cortada',
    'Pago No Imputado — Aplicado a Cuenta Equivocada',
    'Pago Presencial sin Comprobante — No Registrado',
    'Convenio de Pago Activo — Línea Cortada',
    'Cargo por Diagnóstico SSTT Siendo Equipo en Garantía',
    'Cobro de Servicios Adicionales No Autorizados',
    'Cobro de Arriendo de Equipo No Reconocido',
    'Factura con Montos Distintos a lo Contratado',
    'Devolución de Dinero No Realizada en Plazo Comprometido',
    'Reversa Completada pero Cliente No la Reconoce en Banco',
    'Cobro de Multa por Término Anticipado No Informada',
    'Cobro por Itinerancia Internacional No Autorizada',
  ],
  MOVIL_COBRO_DEVOLUCION: [
    'Devolución de Dinero No Realizada en Plazo Comprometido',
    'Reversa Completada pero Cliente No la Reconoce en Banco',
    'Doble Cobro en Cuenta Mensual',
    'Cobro Indebido — Servicio No Contratado',
  ],
  // 📶 4. LÍNEA Y CONECTIVIDAD (10 casos)
  MOVIL_LINEA: [
    'Línea Cortada sin Previo Aviso',
    'Velocidad de Datos Muy por Debajo de lo Contratado',
    'Datos Consumidos sin Uso del Cliente',
    'Roaming Activado sin Autorización',
    'Línea Suspendida por Supuesta Deuda Ya Pagada',
    'Número Asignado Ya Pertenecía a Otro Cliente',
    'Línea Adicional Activada sin Autorización',
  ],
  MOVIL_LINEA_CORTES: [
    'Línea Cortada sin Previo Aviso',
    'Pago Realizado y Línea Cortada',
    'Convenio de Pago Activo — Línea Cortada',
    'Línea Suspendida por Supuesta Deuda Ya Pagada',
  ],
  MOVIL_LINEA_DATOS: [
    'Velocidad de Datos Muy por Debajo de lo Contratado',
    'Datos Consumidos sin Uso del Cliente',
    'Roaming Activado sin Autorización',
  ],
  // 📞 Portabilidad (5 casos)
  PORTABILIDAD: [
    'Portabilidad Bloqueada por Saldo Pendiente',
    'Portabilidad Fallida — Número No Migrado',
    'Portabilidad Ejecutada sin Autorización',
    'Número Portado a Operador Equivocado',
  ],
  // 📲 5. SERVICIO PREPAGO (9 casos)
  PREPAGO_SALDO: [
    'Saldo Descontado sin Uso',
    'Pack o Bono No Activado tras la Compra',
    'Recarga Realizada y Saldo No Acreditado',
    'Recarga Acreditada en Número Equivocado',
  ],
  PREPAGO_PACKS: ['Pack o Bono No Activado tras la Compra', 'Saldo Descontado sin Uso'],
  PREPAGO_CHIP: [
    'Migración de Prepago a Contrato sin Autorización',
    'Chip Prepago Bloqueado sin Explicación',
  ],
  // 🏠 6. HOGAR — INTERNET (2 casos)
  HOGAR_INTERNET: [
    'Internet sin Servicio más de 24 Horas',
    'Cliente Exige Término de Contrato por Mal Servicio Reiterado',
  ],
  // 🏠 7. HOGAR — TELEVISIÓN (5 casos)
  HOGAR_TV: [
    'Canales Contratados No Disponibles',
    'Canales Eliminados del Paquete sin Aviso',
    'Decodificador con Falla — No Reemplazado',
    'Paquete Combo — Solo Llega Parte del Servicio',
  ],
  // 🔧 8. HOGAR — TÉCNICOS (7 casos)
  HOGAR_TECNICO: [
    'Técnico No Asiste a Visita Programada',
    'Daños en el Domicilio Causados por Técnico',
    'Múltiples Visitas Técnicas sin Solución Definitiva',
    'Técnico Cobra por Servicio que Debía ser Gratuito',
  ],
  // 📄 9. CONTRATOS Y CONDICIONES (3 casos)
  CONTRATOS: [
    'Alza de Tarifas sin Previo Aviso',
    'Contrato Firmado Digitalmente sin Consentimiento Real',
    'Cliente Solicita Copia de Contrato y No se Entrega',
  ],
  // 🔒 10. SEGURIDAD Y FRAUDE (1 caso)
  FRAUDE: ['SIM Swapping — Chip Duplicado sin Autorización'],
  // 👴 11. CASOS ESPECIALES (2 casos)
  ESPECIAL: [
    'Cliente Fallecido — Familia Solicita Término de Contrato',
    'Cliente en DICOM por Deuda que No Reconoce',
  ],
  // 🌐 12. SERVICIOS DIGITALES (3 casos)
  DIGITAL: [
    'App No Funciona — Cliente No Puede Ver su Cuenta',
    'Recarga por App Fallida y Dinero Descontado',
    'Compra de Pack por App Cobrada Dos Veces',
  ],
}
