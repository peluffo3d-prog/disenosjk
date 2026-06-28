import type { ConfiguradorState, PrecioResult, PrecioDB } from "@/types"

// ─── TABLA DE PRECIOS (ARS) ───────────────────────────────────────────────────
// Precio plano por tipo, alineado al catálogo real de MercadoLibre (Diseños JK).
// La venta de ML es "a medida, incluye kit" a un precio único por tipo, así que
// acá hay una sola fila por tipo válida hasta la medida máxima. Más ancho que el
// máximo → estandar=false → WhatsApp.
// Estructura: [anchoMaxCm, altoCm, precio]

const PRECIOS_CORREDERA_SIMPLE: [number, number, number][] = [
  [150, 220, 129_999],
]

const PRECIOS_PLEGABLE_DOBLE: [number, number, number][] = [
  [200, 220, 154_999],
]

// Instalación: porcentaje sobre precio de puerta (solo CABA + GBA)
const INSTALACION_PORCENTAJE = 0.50

// Premium: revestimiento de chapa de aluminio anti-humedad.
// Recargo del 30% sobre el precio estándar de la puerta.
// Premium = base × PREMIUM_UPLIFT. Se recalcula solo si cambian los precios base.
export const PREMIUM_UPLIFT = 1.30

// Aplica el recargo premium si corresponde. Redondea a miles para precios "lindos".
function aplicarRevestimiento(precioBase: number, revestimiento: ConfiguradorState["revestimiento"]): number {
  if (revestimiento !== "premium") return precioBase
  return Math.round((precioBase * PREMIUM_UPLIFT) / 1000) * 1000
}

const ZONAS_CON_INSTALACION = [
  "caba", "buenos aires", "gba", "capital federal",
  "moron", "morón", "palermo", "belgrano", "caballito",
  "la matanza", "lanus", "lanús", "quilmes", "tigre",
  "san isidro", "vicente lopez", "vicente lópez",
  "avellaneda", "lomas de zamora", "almirante brown",
]

function localidadTieneInstalacion(localidad: string): boolean {
  const l = localidad.toLowerCase().trim()
  return ZONAS_CON_INSTALACION.some(z => l.includes(z))
}

function getPrecioPuerta(
  tipo: ConfiguradorState["tipo"],
  ancho: number,
  _alto: number
): { precio: number | null; estandar: boolean } {
  const tabla =
    tipo === "corredera_simple"
      ? PRECIOS_CORREDERA_SIMPLE
      : tipo === "plegable_doble"
      ? PRECIOS_PLEGABLE_DOBLE
      : null

  if (!tabla) return { precio: null, estandar: false }

  const fila = tabla.find(([maxAncho]) => ancho <= maxAncho)
  if (!fila) return { precio: null, estandar: false }

  return { precio: fila[2], estandar: true }
}

export function calcularPrecio(config: ConfiguradorState): PrecioResult {
  const { tipo, ancho, alto, instalacion, localidad } = config

  if (!tipo || !ancho || !alto) {
    return { puerta: null, instalacion: null, total: null, estandar: false }
  }

  // Tipo "otro" → siempre WA
  if (tipo === "otro") {
    return {
      puerta: null, instalacion: null, total: null, estandar: false,
      mensaje: "Este modelo necesita una cotización personalizada.",
    }
  }

  const { precio, estandar } = getPrecioPuerta(tipo, ancho, alto)

  if (!estandar || !precio) {
    return {
      puerta: null, instalacion: null, total: null, estandar: false,
      mensaje: "Las medidas están fuera del rango estándar.",
    }
  }

  // Recargo premium (aluminio anti-humedad) si corresponde
  const precioPuerta = aplicarRevestimiento(precio, config.revestimiento)

  let precioInstalacion: number | null = null

  if (instalacion) {
    const tieneCobertura = localidadTieneInstalacion(localidad)
    if (tieneCobertura) {
      precioInstalacion = Math.round(precioPuerta * INSTALACION_PORCENTAJE)
    } else {
      // Instalación solicitada pero fuera de cobertura → igual muestra precio puerta,
      // pero avisa que instalación se coordina por WA
      precioInstalacion = null
    }
  }

  const total = precioPuerta + (precioInstalacion ?? 0)

  return { puerta: precioPuerta, instalacion: precioInstalacion, total, estandar: true }
}

export function fmtARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n)
}

// Precio de entrada (medida más chica) para mostrar en catálogo/galería.
// Si revestimiento="premium" devuelve el precio con el recargo de aluminio.
export function getPrecioDesde(
  tipo: "corredera_simple" | "plegable_doble",
  revestimiento: ConfiguradorState["revestimiento"] = "estandar"
): number {
  const tabla = tipo === "corredera_simple" ? PRECIOS_CORREDERA_SIMPLE : PRECIOS_PLEGABLE_DOBLE
  return aplicarRevestimiento(tabla[0][2], revestimiento)
}

// Valor de cada cuota sin interés (estilo MercadoLibre)
export function fmtCuota(precio: number, cuotas = 6): string {
  return fmtARS(Math.round(precio / cuotas))
}

// ─── Versión dinámica — usa filas de la DB en lugar de las constantes ─────────

// Filas estáticas como fallback (mismos valores que las constantes hardcodeadas)
export const STATIC_PRECIO_ROWS: PrecioDB[] = [
  { id: "s1", tipo: "corredera_simple", ancho_max: 150, alto: 220, precio: 129_999, activo: true, updated_at: "" },
  { id: "s2", tipo: "plegable_doble",   ancho_max: 200, alto: 220, precio: 154_999, activo: true, updated_at: "" },
]

export function getPrecioDesdeRows(
  tipo: "corredera_simple" | "plegable_doble",
  rows: PrecioDB[],
  revestimiento: ConfiguradorState["revestimiento"] = "estandar"
): number {
  const tipoRows = rows.filter(r => r.tipo === tipo && r.activo).sort((a, b) => a.ancho_max - b.ancho_max)
  const base = tipoRows[0]?.precio ?? 0
  return aplicarRevestimiento(base, revestimiento)
}

export function calcularPrecioConRows(config: ConfiguradorState, rows: PrecioDB[]): PrecioResult {
  const { tipo, ancho, alto, instalacion, localidad, revestimiento } = config

  if (!tipo || !ancho || !alto) {
    return { puerta: null, instalacion: null, total: null, estandar: false }
  }
  if (tipo === "otro") {
    return { puerta: null, instalacion: null, total: null, estandar: false,
      mensaje: "Este modelo necesita una cotización personalizada." }
  }

  const tipoRows = rows
    .filter(r => r.tipo === tipo && r.activo)
    .sort((a, b) => a.ancho_max - b.ancho_max)

  const fila = tipoRows.find(r => ancho <= r.ancho_max)
  if (!fila) {
    return { puerta: null, instalacion: null, total: null, estandar: false,
      mensaje: "Las medidas están fuera del rango estándar." }
  }

  // Precio de la puerta con el recargo premium aplicado si corresponde
  const precioPuerta = aplicarRevestimiento(fila.precio, revestimiento)

  let precioInstalacion: number | null = null
  if (instalacion && localidadTieneInstalacion(localidad)) {
    precioInstalacion = Math.round(precioPuerta * INSTALACION_PORCENTAJE)
  }

  const total = precioPuerta + (precioInstalacion ?? 0)
  return { puerta: precioPuerta, instalacion: precioInstalacion, total, estandar: true }
}
