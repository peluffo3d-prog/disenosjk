export type Ambiente = "baño" | "dormitorio" | "living" | "otro"
export type TipoPuerta = "corredera_simple" | "plegable_doble" | "otro"
export type Material = "blanco" | "madera" | "negro" | "otro"

export interface ConfiguradorState {
  ambiente: Ambiente | null
  tipo: TipoPuerta | null
  material: Material | null
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

export interface Lead {
  id: string
  created_at: string
  nombre: string
  email: string
  telefono: string
  ambiente: Ambiente
  tipo: TipoPuerta
  material: Material
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
