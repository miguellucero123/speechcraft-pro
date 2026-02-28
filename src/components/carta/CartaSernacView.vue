<!--
  Carta de respuesta a reclamo SERNAC — Plantilla editable para cobro VAS
  Los datos del formulario se aplican al documento; el texto es editable para ajustar cada caso.
-->
<script setup>
import { ref, watch } from 'vue'
import { downloadFile } from '@/utils/downloadFile'
import { exportCartaToWord } from '@/utils/exportCartaToWord'
import { exportCartaToPdf } from '@/utils/exportCartaToPdf'
import { inject } from 'vue'

const showToast = inject('showToast')

// Datos del formulario
const form = ref({
  nroReclamo: '',
  fecha: '',
  resolucion: '',
  nombreReclamante: '',
  tratamiento: 'Sr.', // Sr. / Sra.
  rut: '',
  temaReclamo: 'cobro de suscripción de contenidos VAS',
  linea: '',
  planGigas: '',
  servicioCobros: '',
  detalleCobros: '', // Texto libre o tabla
  nombreResponsable: '',
  tratamientoCliente: 'Sr.', // Para "que la Sr. XXX no reconoce"
  nroBoleta: '',
  nroNotaCredito: '',
  vencimientoNota: '',
  montoDescuento: '',
  detalleDescuento: '',
  telefonoEmpresa: '',
  telefonoFijo: '',
})

// Contenido editable de la carta (HTML)
const cartaContenido = ref('')

function buildCartaHtml() {
  const f = form.value
  const tr = f.tratamiento
  const trCliente = f.tratamientoCliente
  return `
<p style="margin-bottom: 16px;"><strong>REF.:</strong> Reclamo Sernac Nro.: ${f.nroReclamo || '_______________'}<br>
<strong>Fecha:</strong> ${f.fecha || '_______________'}<br>
<strong>Resolución:</strong> ${f.resolucion || '_______________'}</p>

<p style="margin-bottom: 16px;"><strong>Señores</strong><br>
Servicio Nacional del Consumidor<br>
Presente</p>

<p style="margin-bottom: 16px; text-align: justify;">Junto con saludar, damos respuesta al reclamo ${f.nroReclamo || '_______________'}, presentado por el ${tr} ${f.nombreReclamante || '_______________'}, Rut ${f.rut || '_______________'}, relativo a ${f.temaReclamo || 'cobro de suscripción de contenidos VAS'}. Informamos lo siguiente:</p>

<p style="margin-bottom: 16px; text-align: justify;">Primeramente, a raíz de la problemática presentada por el ${tr} ${f.nombreReclamante || '_______________'} respecto a los cobros generados por servicios adicionales. Debido a esto, se valida en nuestro sistema que el cliente tiene asociado el servicio móvil correspondiente a la línea <strong>${f.linea || '_______________'}</strong> bajo el plan gigas <strong>${f.planGigas || '_______________'}</strong> el cual está generando cobros no reconocidos, los mismos corresponden a <strong>${f.servicioCobros || '_______________'}</strong>.</p>

<p style="margin-bottom: 8px;">El detalle de los cobros contenidos en la boleta anteriormente mencionada es el siguiente:</p>
<p style="margin-bottom: 16px; white-space: pre-wrap;">${f.detalleCobros || '(Detalle de cobros)'}</p>

<p style="margin-bottom: 16px; text-align: justify;">Respecto a los cobros asociados a <strong>${f.servicioCobros || '_______________'}</strong> podemos señalar que en la activación de este tipo de servicios no intervienen nuestros ejecutivos, siendo una operación que solo realiza el usuario directamente desde el equipo móvil, o desde la web, ingresando datos confidenciales, por lo tanto, estos cobros son de la exclusiva responsabilidad y consentimiento del ${tr} <strong>${f.nombreReclamante || '_______________'}</strong>.</p>

<p style="margin-bottom: 16px; text-align: justify;">Es importante mencionar que nuestra compañía solo opera como recaudador de cobros por servicio adicionales, por dicha razón está exenta de cualquier responsabilidad directa o indirecta respecto del contenido, término y condiciones de servicios descargados por cliente.</p>

<p style="margin-bottom: 16px; text-align: justify;">En relación a lo anterior y respecto de la contratación de estos productos que ${trCliente} <strong>${f.nombreReclamante || '_______________'}</strong> no reconoce; hay que tomar en consideración que la contratación de esos servicios se hace exclusivamente desde el teléfono móvil, así también y como se informa en la cláusula 13° del contrato de servicio sobre contrataciones a distancia "las claves o medios de identificación o autenticación que provea Entel al cliente, serán de su único, pleno y exclusivo conocimiento, uso operacional y responsabilidad".</p>

<p style="margin-bottom: 16px; text-align: justify;">Por otra parte, se informa que el servicio adicional reclamado, fue bloqueado para evitar futuras suscripciones.</p>

<p style="margin-bottom: 16px; text-align: justify;">No obstante, a lo anteriormente descrito, como atención comercial y de manera única y exclusivamente, se aplicó un descuento en la boleta de servicio móvil N° <strong>${f.nroBoleta || '_______________'}</strong>, mediante una nota de crédito n° <strong>${f.nroNotaCredito || '_______________'}</strong> y cuyo vencimiento está fijado para el <strong>${f.vencimientoNota || '_______________'}</strong>, por un monto porcentual facturado del servicio adicional correspondiente a <strong>$${f.montoDescuento || '_______________'}</strong>, detallado de la siguiente manera:</p>
<p style="margin-bottom: 16px; white-space: pre-wrap;">${f.detalleDescuento || '(Detalle del descuento)'}</p>

<p style="margin-bottom: 16px; text-align: justify;">De esta manera, Entel confirma que acoge parcialmente el reclamo presentado ante esta entidad por el motivo antes informado, quedando así aclarada la situación reclamada nuestra parte.</p>

<p style="margin-bottom: 16px; text-align: justify;">Finalmente, ante cualquier solicitud, nuestro cliente podrá llamarnos al <strong>${f.telefonoEmpresa || '_______________'}</strong> desde su número Empresa, o al <strong>${f.telefonoFijo || '_______________'}</strong> desde una red fija. También podrá realizar consultas y mucho más en nuestro portal.</p>

<p style="margin-top: 24px;">Saluda atentamente</p>
<p><strong>Entel S.A.</strong></p>
`
}

const cartaEditableRef = ref(null)

function aplicarFormulario() {
  const html = buildCartaHtml()
  cartaContenido.value = html
  if (cartaEditableRef.value) cartaEditableRef.value.innerHTML = html
  showToast?.('Datos aplicados al documento', 'ok', '✓')
}

function getContenidoActual() {
  return cartaEditableRef.value?.innerHTML || cartaContenido.value || ''
}

async function exportWord() {
  try {
    const blob = await exportCartaToWord(form.value, getContenidoActual())
    downloadFile(blob, `carta-sernac-${form.value.nroReclamo || 'reclamo'}.docx`, blob.type)
    showToast?.('Carta exportada a Word', 'ok', '📄')
  } catch (e) {
    showToast?.('Error al exportar', 'err', '❌')
  }
}

function exportPdf() {
  try {
    exportCartaToPdf(form.value, getContenidoActual(), `carta-sernac-${form.value.nroReclamo || 'reclamo'}.pdf`)
    showToast?.('Carta exportada a PDF', 'ok', '📕')
  } catch (e) {
    showToast?.('Error al exportar PDF', 'err', '❌')
  }
}

// Fecha actual por defecto
watch(
  () => form.value.fecha,
  (v) => {
    if (!v) {
      const d = new Date()
      form.value.fecha = d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="carta-sernac">
    <div class="carta-form">
      <h3 class="form-title">📋 Datos del reclamo</h3>
      <div class="form-grid">
        <div class="field">
          <label>N° Reclamo Sernac</label>
          <input v-model="form.nroReclamo" type="text" placeholder="Ej: R1234W567890" />
        </div>
        <div class="field">
          <label>Fecha</label>
          <input v-model="form.fecha" type="text" placeholder="dd-mm-aaaa" />
        </div>
        <div class="field">
          <label>Resolución</label>
          <input v-model="form.resolucion" type="text" placeholder="Número resolución" />
        </div>
        <div class="field full">
          <label>Nombre reclamante</label>
          <div class="row">
            <select v-model="form.tratamiento" class="tratamiento">
              <option value="Sr.">Sr.</option>
              <option value="Sra.">Sra.</option>
            </select>
            <input v-model="form.nombreReclamante" type="text" placeholder="Nombre completo" class="flex" />
          </div>
        </div>
        <div class="field">
          <label>RUT</label>
          <input v-model="form.rut" type="text" placeholder="12345678-9" />
        </div>
        <div class="field full">
          <label>Tema del reclamo</label>
          <input v-model="form.temaReclamo" type="text" placeholder="cobro de suscripción de contenidos VAS" />
        </div>
        <div class="field">
          <label>Línea</label>
          <input v-model="form.linea" type="text" placeholder="Número de línea" />
        </div>
        <div class="field">
          <label>Plan gigas</label>
          <input v-model="form.planGigas" type="text" placeholder="Nombre plan" />
        </div>
        <div class="field full">
          <label>Servicio que genera cobros</label>
          <input v-model="form.servicioCobros" type="text" placeholder="Ej: suscripción VAS" />
        </div>
        <div class="field full">
          <label>Detalle de cobros (tabla o texto)</label>
          <textarea
            v-model="form.detalleCobros"
            rows="4"
            placeholder="Concepto | Monto | Fecha"
          ></textarea>
        </div>
        <div class="field full">
          <label>Tratamiento cliente (en "no reconoce")</label>
          <select v-model="form.tratamientoCliente">
            <option value="Sr.">Sr.</option>
            <option value="Sra.">Sra.</option>
          </select>
        </div>
        <div class="field">
          <label>N° Boleta</label>
          <input v-model="form.nroBoleta" type="text" placeholder="Número boleta" />
        </div>
        <div class="field">
          <label>N° Nota de crédito</label>
          <input v-model="form.nroNotaCredito" type="text" placeholder="Número NC" />
        </div>
        <div class="field">
          <label>Vencimiento nota crédito</label>
          <input v-model="form.vencimientoNota" type="text" placeholder="Ej: 15 de marzo de 2026" />
        </div>
        <div class="field">
          <label>Monto descuento ($)</label>
          <input v-model="form.montoDescuento" type="text" placeholder="Ej: 5.990" />
        </div>
        <div class="field full">
          <label>Detalle del descuento</label>
          <textarea v-model="form.detalleDescuento" rows="3" placeholder="Detalle adicional"></textarea>
        </div>
        <div class="field">
          <label>Teléfono Empresa</label>
          <input v-model="form.telefonoEmpresa" type="text" placeholder="XXX" />
        </div>
        <div class="field">
          <label>Teléfono red fija</label>
          <input v-model="form.telefonoFijo" type="text" placeholder="Ej: 600 xxx xxxx" />
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-apply" @click="aplicarFormulario">
          Aplicar datos al documento
        </button>
      </div>
    </div>

    <div class="carta-body">
      <div class="carta-actions">
        <button type="button" class="btn-sm" @click="exportWord">📄 Word</button>
        <button type="button" class="btn-sm" @click="exportPdf">📕 PDF</button>
      </div>
      <div
        ref="cartaEditableRef"
        class="carta-editable"
        contenteditable="true"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.carta-sernac {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  height: calc(100vh - 120px);
  padding: var(--r-md);
}

.carta-form {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: var(--r-lg);
  overflow-y: auto;
}

.form-title {
  font-size: 1rem;
  color: var(--t1);
  margin: 0 0 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field.full {
  grid-column: 1 / -1;
}

.field label {
  font-size: 0.8rem;
  color: var(--t2);
}

.field input,
.field select,
.field textarea {
  padding: 0.5rem 0.7rem;
  background: var(--card2);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  color: var(--t1);
  font-size: 0.9rem;
}

.field textarea {
  resize: vertical;
  min-height: 60px;
}

.row {
  display: flex;
  gap: 0.5rem;
}

.tratamiento {
  width: 70px;
  flex-shrink: 0;
}

.flex {
  flex: 1;
}

.form-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line2);
}

.btn-apply {
  width: 100%;
  padding: 0.65rem 1rem;
  background: var(--amber);
  color: var(--ink);
  border: none;
  border-radius: var(--r-md);
  font-weight: 600;
  cursor: pointer;
}

.btn-apply:hover {
  background: var(--amber2);
}

.carta-body {
  display: flex;
  flex-direction: column;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.carta-actions {
  padding: var(--r-md);
  border-bottom: 1px solid var(--line2);
  display: flex;
  gap: 0.5rem;
}

.carta-editable {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  font-family: Georgia, serif;
  font-size: 12pt;
  line-height: 1.5;
  color: var(--t1);
  outline: none;
}

.carta-editable:empty::before {
  content: 'Haz clic en "Aplicar datos al documento" para generar la carta, o edita directamente aquí.';
  color: var(--t4);
}

.carta-editable p {
  margin: 0 0 0.5em;
}

@media (max-width: 900px) {
  .carta-sernac {
    grid-template-columns: 1fr;
  }
}
</style>
