<script setup>
import { inject } from 'vue'

const cfg = inject('cfg')
const tones = inject('tones')
</script>

<template>
  <div>
    <div class="section-label">Configuración Principal</div>

    <div class="form-block">
      <div class="field-label">Organismo Regulador <span class="field-required">*</span></div>
      <div class="select-wrap">
        <select v-model="cfg.organismo" class="f-select">
          <option value="">Seleccionar organismo...</option>
          <option value="SERNAC">SERNAC — Protección al Consumidor</option>
          <option value="SUBTEL">SUBTEL — Telecomunicaciones</option>
          <option value="INTERNO">Gestión Interna</option>
        </select>
      </div>
    </div>

    <div class="form-block">
      <div class="field-label">Tipo de Servicio <span class="field-required">*</span></div>
      <div class="select-wrap">
        <select v-model="cfg.servicio" class="f-select">
          <option value="">Seleccionar servicio...</option>
          <optgroup label="📱 Móvil — Equipos (17 speeches)">
            <option value="MOVIL_EQUIPO">Equipos y Garantía</option>
            <option value="MOVIL_EQUIPO_SSTT">Equipos SSTT (retención, pérdida, daño)</option>
          </optgroup>
          <optgroup label="🛒 Móvil — Contratos y Compras">
            <option value="MOVIL_CONTRATO">Contratos y Planes</option>
            <option value="PORTABILIDAD">Portabilidad</option>
          </optgroup>
          <optgroup label="💰 Móvil — Cobros (15 speeches)">
            <option value="MOVIL_COBRO">Cobros y Pagos</option>
            <option value="MOVIL_COBRO_DEVOLUCION">Devoluciones y Reversas</option>
          </optgroup>
          <optgroup label="📶 Móvil — Línea (10 speeches)">
            <option value="MOVIL_LINEA">Línea y Conectividad</option>
            <option value="MOVIL_LINEA_CORTES">Cortes y Reactivación</option>
            <option value="MOVIL_LINEA_DATOS">Datos y Velocidad</option>
          </optgroup>
          <optgroup label="🔋 Prepago (9 speeches)">
            <option value="PREPAGO_SALDO">Saldo y Recargas</option>
            <option value="PREPAGO_PACKS">Packs y Bonos</option>
            <option value="PREPAGO_CHIP">Chip Bloqueado y Migración</option>
          </optgroup>
          <optgroup label="🏠 Hogar">
            <option value="HOGAR_INTERNET">Internet Hogar</option>
            <option value="HOGAR_TV">Televisión y Paquetes</option>
            <option value="HOGAR_TECNICO">Instalación y Visitas Técnicas</option>
          </optgroup>
          <optgroup label="📄 Contratos y Condiciones">
            <option value="CONTRATOS">Condiciones Generales (alza, firma, copia)</option>
          </optgroup>
          <optgroup label="🌐 Servicios Digitales (3 speeches)">
            <option value="DIGITAL">App y Recargas Digitales</option>
          </optgroup>
          <optgroup label="⚠️ Especiales">
            <option value="FRAUDE">Seguridad y Fraude (SIM Swapping)</option>
            <option value="ESPECIAL">Caso Especial (fallecido, DICOM)</option>
          </optgroup>
        </select>
      </div>
    </div>

    <div class="form-block">
      <div class="field-label">
        Descripción del Caso <span class="field-required">*</span>
        <span class="field-hint">sé específico</span>
      </div>
      <textarea
        v-model="cfg.caso"
        class="f-textarea"
        rows="5"
        placeholder="Ej: Cliente compró Smartwatch en tienda hace 2 días, pantalla presenta falla de touch..."
      ></textarea>
    </div>

    <div class="form-block">
      <div class="field-label">N° Requerimiento</div>
      <input v-model="cfg.nReq" class="f-input" placeholder="R2026W15860001" />
    </div>

      <div class="form-block">
      <div class="field-label">Actitud del Cliente</div>
      <div class="tone-grid" role="group" aria-label="Seleccionar actitud del cliente">
        <button
          v-for="t in tones"
          :key="t.v"
          type="button"
          class="tone-chip"
          :class="{ active: cfg.tono === t.v }"
          :aria-pressed="cfg.tono === t.v"
          :aria-label="t.l"
          @click="cfg.tono = t.v"
          @keydown="
            (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                cfg.tono = t.v
              }
            }
          "
        >
          <span class="tone-emoji">{{ t.e }}</span>
          <span>{{ t.l }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
