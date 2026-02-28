# Base de Conocimiento — reclamos.txt

## Ubicación

El archivo `reclamos.txt` se encuentra en el directorio raíz del repositorio:

```
Proyecto/
├── reclamos.txt      # Base de conocimiento original
└── speechcraft/      # App SpeechCraft PRO
```

## Contenido

Documento de referencia con 60+ speeches normativos, organizados por categorías (equipos, cobros, línea, prepago, hogar, fraude, etc.) con diálogos reales entre ejecutivos y clientes.

## Relación con el código

| Archivo | Relación |
|---------|----------|
| `src/utils/speechGenerator.js` | `RESPUESTAS_POR_SERVICIO` y `OBJECIONES_POR_TONO` extraídos de la normativa y casos de reclamos.txt |
| `src/data/constants.js` | `SVC_LABELS`, `TONES`, `EXTRAS` — categorías alineadas con la estructura del documento |
| `src/data/reclamosKnowledge.js` | `CASOS_POR_CATEGORIA` — lista de casos documentados por tipo de servicio |

## Categorías mapeadas

- **MOVIL_EQUIPO** — Equipos y garantía (17 casos)
- **MOVIL_EQUIPO_SSTT** — SSTT, retención, pérdida (6 casos)
- **MOVIL_CONTRATO** — Contratos y planes (12 casos)
- **MOVIL_COBRO** — Cobros y pagos (15 casos)
- **MOVIL_LINEA** — Línea y conectividad (10 casos)
- **PREPAGO_*** — Saldo, packs, chip (9 casos)
- **HOGAR_***** — Internet, TV, técnicos
- **FRAUDE**, **ESPECIAL**, **DIGITAL**, **PORTABILIDAD**, **CONTRATOS**

## Marco legal referenciado

- **Ley N° 19.496** — Protección al Consumidor
- **SUBTEL** — Normativa de telecomunicaciones
- Plazos estándar: diagnóstico 15 días, devoluciones 15 días, reactivación 2 horas, etc.

## Sincronización

Si se actualiza `reclamos.txt` con nuevos casos o normativa:

1. Revisar `speechGenerator.js` — agregar respuestas en `RESPUESTAS_POR_SERVICIO` si hay nuevos tipos de servicio
2. Revisar `reclamosKnowledge.js` — actualizar `CASOS_POR_CATEGORIA` con casos documentados
3. Revisar `constants.js` — agregar etiquetas en `SVC_LABELS` si aplica
