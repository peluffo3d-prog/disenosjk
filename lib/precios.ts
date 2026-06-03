import type { ConfiguradorState, PrecioResult } from "@/types"

// ─── TABLA DE PRECIOS (ARS) ───────────────────────────────────────────────────
// TODO: reemplazar con precios reales cuando el cliente los confirme
// Estructura: [anchoMaxCm, altoCm, precio]
// Si el ancho supera el último rango → estandar=false → WhatsApp

const PRECIOS_CORREDERA_SIMPLE: [number, number, number][] = [
  [90,  220, 150_000],
  [120, 220, 185_000],
  [150, 220, 220_000],
]

const PRECIOS_PLEGABLE_DOBLE: [number, number, number][] = [
  [150, 220, 280_000],
  [200, 220, 340_000],
]

// Instalación: porcentaje sobre precio de puerta (solo CABA + GBA)
const INSTALACION_PORCENTAJE = 0.50

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

  let precioInstalacion: number | null = null

  if (instalacion) {
    const tieneCobertura = localidadTieneInstalacion(localidad)
    if (tieneCobertura) {
      precioInstalacion = Math.round(precio * INSTALACION_PORCENTAJE)
    } else {
      // Instalación solicitada pero fuera de cobertura → igual muestra precio puerta,
      // pero avisa que instalación se coordina por WA
      precioInstalacion = null
    }
  }

  const total = precio + (precioInstalacion ?? 0)

  return { puerta: precio, instalacion: precioInstalacion, total, estandar: true }
}

export function fmtARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n)
}
