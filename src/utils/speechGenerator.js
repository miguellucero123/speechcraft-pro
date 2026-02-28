/**
 * Generador de speeches por plantillas — sin IA, 100% local
 * Basado en la estructura y normativa de reclamos.txt
 * @module utils/speechGenerator
 * @see ../../docs/KNOWLEDGE_BASE.md
 */

/** Respuestas normativas por tipo de servicio (plazos Ley 19.496, SUBTEL) */
const RESPUESTAS_POR_SERVICIO = {
  MOVIL_EQUIPO:
    'Tu equipo está dentro de la garantía legal de 6 meses. Tienes derecho a reparación, cambio o devolución sin costo. El diagnóstico tiene un plazo máximo de 15 días hábiles y es gratuito. Mientras tanto puedes solicitar equipo de préstamo.',
  MOVIL_EQUIPO_SSTT:
    'El plazo de 15 días hábiles fue superado. Tienes dos opciones: exigir la devolución inmediata de tu equipo o solicitar que el diagnóstico se entregue en 48 horas hábiles. Adicionalmente se evaluará una compensación por los días excedidos.',
  MOVIL_CONTRATO:
    'Cuando existe incumplimiento reiterado del servicio tienes derecho a solicitar el término anticipado sin multa. Vamos a revisar el historial de fallas reportadas. Si está documentado el incumplimiento, procedemos sin cargo. Plazo de revisión 5 días hábiles.',
  MOVIL_COBRO:
    'Revisando tu cuenta confirmo el cargo que no corresponde. Vamos a gestionar la devolución en un plazo de 15 días hábiles al medio de pago registrado. El error fue nuestro y el reintegro será total.',
  MOVIL_COBRO_DEVOLUCION:
    'El plazo de devolución fue incumplido. Reactivamos el proceso de forma prioritaria. El reintegro llegará en un plazo máximo de 5 días hábiles adicionales a tu medio de pago. Lamentamos el retraso.',
  MOVIL_LINEA:
    'Revisando tu cuenta confirmo que estás al día. El corte fue un error. Reactivo tu línea ahora mismo, plazo máximo 2 horas. Los inconvenientes quedarán registrados para compensación.',
  MOVIL_LINEA_CORTES:
    'Veo el pago registrado y la línea cortada. Eso no debió ocurrir. Gestiono la reactivación ahora mismo, plazo máximo 2 horas. Queda marcado como urgente.',
  MOVIL_LINEA_DATOS:
    'Las mediciones que realizaste son un antecedente válido. Vamos a escalar una revisión técnica de la cobertura en tu zona. Si se confirma la deficiencia, corresponde una compensación proporcional. Plazo de revisión 48 horas hábiles.',
  PORTABILIDAD:
    'Una portabilidad sin autorización es una falta grave. Gestionamos la reversión para devolverte tu número. Plazo 24 a 48 horas hábiles. Los días sin servicio serán compensados.',
  PREPAGO_SALDO:
    'Con el comprobante del cargo bancario acreditamos el saldo de forma manual. En un plazo de 2 horas debería reflejarse en tu línea. Si el pack no se activó, lo activamos ahora y extendemos la vigencia sin costo.',
  PREPAGO_PACKS:
    'El dinero fue descontado y el pack no se activó, eso no está bien. Activamos el pack ahora mismo y si ya venció el período por el error, lo extendemos sin costo.',
  PREPAGO_CHIP:
    'El bloqueo por inactividad se puede revertir. Puedes acercarte a cualquier tienda con tu cédula y te reactivan o asignan un chip nuevo manteniendo tu número. Una migración sin autorización se revierte y eliminamos todos los cargos.',
  HOGAR_INTERNET:
    'Dos días sin servicio es inaceptable. Genero una orden técnica prioritaria. Un técnico se comunicará contigo en las próximas 24 horas hábiles. Los días sin servicio serán descontados de tu próxima cuenta.',
  HOGAR_TV:
    'Verificamos que tu paquete esté correctamente activado y generamos una orden técnica para restablecer los canales. Plazo máximo 24 horas hábiles. Los días sin acceso serán descontados.',
  HOGAR_TECNICO:
    'Cualquier daño causado por nuestro personal en tu domicilio es responsabilidad nuestra. Coordinamos la reparación de los daños sin costo. Plazo de respuesta 5 días hábiles. Documenta los daños con fotografías si es posible.',
  CONTRATOS:
    'Un alza de tarifa debe ser notificada con al menos 30 días de anticipación. Si no fuiste notificado tienes derecho a mantener el precio original o a terminar el contrato sin multa. Es tu derecho recibir una copia de tu contrato.',
  FRAUDE:
    'Bloqueamos el chip duplicado de inmediato y generamos un nuevo SIM a tu nombre. Escalamos el caso al área de seguridad para investigar. Puedes acercarte a cualquier tienda con tu cédula para el nuevo chip. Te recomiendo denunciar en tu banco y en la PDI.',
  ESPECIAL:
    'Para el término por fallecimiento necesitamos el certificado de defunción y tu documento como familiar directo. Una vez recibidos, el contrato se termina sin multa y los cobros se detienen desde la fecha de fallecimiento. Un reporte injustificado en DICOM genera derecho a compensación.',
  DIGITAL:
    'Revisamos el estado de tu cuenta digital y escalamos el problema técnico. Mientras tanto puedes acceder desde la página web con las mismas credenciales. Con el comprobante del cargo acreditamos el saldo manualmente en 2 horas.',
}

/** Objeciones típicas según tono del cliente */
const OBJECIONES_POR_TONO = {
  molesto: '¿Cuánto tiempo más tengo que esperar? Ya llevo mucho tiempo con este problema.',
  furioso: '¡Esto es inaceptable! ¿Qué garantía tengo de que esta vez sí van a cumplir?',
  calmado: '¿Cuál es el siguiente paso que debo seguir?',
  confundido: '¿Me podría explicar de nuevo los plazos? No quedo claro.',
  angustiado: 'Necesito que esto se solucione pronto, es urgente para mí.',
  amenazante: 'Si no me lo solucionan voy a ir a SERNAC de nuevo y esta vez más lejos.',
}

/**
 * Genera un speech normativo a partir de plantillas locales
 * @param {object} cfg - Configuración del caso (organismo, servicio, ejecutivo, cliente, tono, etc.)
 * @param {Record<string, string>} svcLabels - Mapa de códigos de servicio a etiquetas legibles
 * @returns {{ titulo: string, organismo: string, servicio: string, fases: Array, resumen: Array }}
 */
export function generateSpeechByTemplate(cfg, svcLabels) {
  const svc = svcLabels[cfg.servicio] || cfg.servicio
  const respuestaNormativa =
    RESPUESTAS_POR_SERVICIO[cfg.servicio] || RESPUESTAS_POR_SERVICIO.MOVIL_CONTRATO
  const objecion = OBJECIONES_POR_TONO[cfg.tono] || OBJECIONES_POR_TONO.molesto
  const casoCorto = cfg.caso?.length > 120 ? cfg.caso.substring(0, 120) + '...' : cfg.caso

  const fases = [
    {
      titulo: 'APERTURA Y VALIDACIÓN',
      dialogos: [
        {
          speaker: cfg.ejecutivo,
          texto: `Buenas tardes, ¿hablo con ${cfg.cliente}? Soy ${cfg.ejecutivo} del Área ${cfg.area}, te llamo por el requerimiento ${cfg.organismo} N°${cfg.nReq}. Necesito validar tu nombre completo y RUT.`,
        },
        { speaker: cfg.cliente, texto: `Sí, soy yo. ${casoCorto}` },
        {
          speaker: cfg.ejecutivo,
          texto: `${cfg.cliente}, entiendo tu situación y tienes razón en estar ${cfg.tono === 'calmado' ? 'preocupado' : 'molesto'}. Déjame revisar tu caso.`,
        },
        { speaker: 'Sistema', texto: '(Pausa de revisión en sistema)' },
      ],
      nota: 'Valida siempre nombre completo y RUT antes de continuar.',
      alerta: null,
    },
    {
      titulo: 'ANÁLISIS Y ENTREGA DE INFORMACIÓN NORMATIVA',
      dialogos: [
        {
          speaker: cfg.ejecutivo,
          texto: `${cfg.cliente}, ${respuestaNormativa} ¿Quedó clara la información de hoy?`,
        },
        { speaker: cfg.cliente, texto: objecion },
        {
          speaker: cfg.ejecutivo,
          texto: `Entiendo ${cfg.cliente}. Tu requerimiento tiene carácter prioritario por el respaldo del ${cfg.organismo} activo. No te vamos a dejar sin respuesta. Todo quedará documentado por escrito.`,
        },
      ],
      nota: 'Mantener calma y ser directo con los plazos reales.',
      alerta: cfg.frasesPro?.length ? `NUNCA decir: ${cfg.frasesPro.join(', ')}` : null,
    },
    {
      titulo: 'CIERRE Y EVALUACIÓN',
      dialogos: [
        {
          speaker: cfg.ejecutivo,
          texto: `Recibirás la documentación en tu correo en 24 a 48 horas hábiles. Al finalizar esta llamada podrás evaluar la atención recibida. ¿Quedó clara la información entregada hoy? Que tengas buenas tardes.`,
        },
        { speaker: cfg.cliente, texto: 'Sí, quedó claro. Gracias.' },
      ],
      nota: null,
      alerta: null,
    },
  ]

  // Si pide más fases, agregar fase de objeciones
  if (cfg.fases >= 5) {
    fases.splice(2, 0, {
      titulo: 'MANEJO DE OBJECIONES',
      dialogos: [
        { speaker: cfg.cliente, texto: objecion },
        {
          speaker: cfg.ejecutivo,
          texto: `${cfg.cliente}, el plazo está establecido por la normativa vigente. Si hay algún retraso adicional te contactaremos de inmediato. Tu caso queda priorizado.`,
        },
      ],
      nota: 'Ante objeciones, reafirmar empatía y plazos comprometidos.',
      alerta: null,
    })
  }

  const titulo = `Speech — ${svc} | ${cfg.organismo} ${cfg.nReq}`

  return {
    titulo: titulo.length > 60 ? titulo.substring(0, 57) + '...' : titulo,
    organismo: cfg.organismo,
    servicio: svc,
    fases,
    resumen: [
      { campo: 'Caso', valor: svc },
      { campo: 'Organismo', valor: cfg.organismo },
      { campo: 'Ejecutivo', valor: `${cfg.ejecutivo} — ${cfg.area}` },
      { campo: 'Cliente', valor: `${cfg.cliente} | ${cfg.rut}` },
      { campo: 'N° Requerimiento', valor: cfg.nReq },
      { campo: 'Plazo respuesta', valor: '5-15 días hábiles según caso' },
      { campo: 'Documentación', valor: 'Correo 24-48 horas hábiles' },
    ],
  }
}
