export type Ambiente = "baño" | "dormitorio" | "living" | "otro"
export type TipoPuerta = "corredera_simple" | "plegable_doble" | "otro"
export type Material = "blanco" | "madera" | "negro" | "otro"
// Revestimiento: estándar (melamina) o premium (chapa de aluminio anti-humedad)
export type Revestimiento = "estandar" | "premium"

export interface ConfiguradorState {
  ambiente: Ambiente | null
  tipo: TipoPuerta | null
  material: Material | null
  revestimiento: Revestimiento
  ancho: number | null   // cm
  alto: number | null    // cm
  instalacion: boolean
  localidad: string
}

export interface PrecioResult {
  puerta: number | null       // ARS
  instalacion: number | null  // ARS — null si no aplica o fuera de rango
  total: number | null
  estandar: boolean           // false = fuera de rango → WA
  mensaje?: string            // si estandar=false
}

export interface PrecioDB {
  id: string
  tipo: "corredera_simple" | "plegable_doble"
  ancho_max: number
  alto: number
  precio: number
  activo: boolean
  updated_at: string
}

export interface Modelo {
  id: string
  slug: string
  titulo: string
  tag: string
  tipo: "corredera_simple" | "plegable_doble"
  premium: boolean
  imagen_url: string | null   // null → usa la foto de respaldo estática
  alt: string
  orden: number
  activo: boolean
  updated_at: string
}

export interface Lead {
  id: string
  created_at: string
  nombre: string
  email: string
  telefono: string
  ambiente: Ambiente
  tipo: TipoPuerta
  material: Material
  revestimiento: Revestimiento
  ancho: number
  alto: number
  instalacion: boolean
  localidad: string
  precio_puerta: number | null
  precio_instalacion: number | null
  mp_preference_id: string | null
  mp_payment_id: string | null
  status: "pendiente" | "pagado" | "cancelado"
}
