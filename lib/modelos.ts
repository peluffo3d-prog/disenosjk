import type { Modelo } from "@/types"

// Fotos de respaldo: las imágenes que ya viven en /public.
// Se usan si la tabla `modelos` de Supabase todavía no existe o no responde,
// así la galería nunca queda vacía. Los `id` acá son provisorios (la DB usa uuid).
export const STATIC_MODELOS: Modelo[] = [
  { id: "m1", slug: "granero-estandar",  titulo: "Estilo granero",         tag: "Corrediza simple · Living",          tipo: "corredera_simple", premium: false, imagen_url: "/puerta-granero.webp",  alt: "Puerta estilo granero",             orden: 1, activo: true, updated_at: "" },
  { id: "m2", slug: "granero-premium",   titulo: "Estilo granero Premium", tag: "Aluminio anti-humedad · Living",     tipo: "corredera_simple", premium: true,  imagen_url: "/puerta-granero.webp",  alt: "Puerta estilo granero premium",     orden: 2, activo: true, updated_at: "" },
  { id: "m3", slug: "blanca-estandar",   titulo: "Lisa blanca",            tag: "Corrediza simple · Dormitorio",      tipo: "corredera_simple", premium: false, imagen_url: "/puerta-blanca.webp",   alt: "Puerta corrediza blanca",           orden: 3, activo: true, updated_at: "" },
  { id: "m4", slug: "blanca-premium",    titulo: "Lisa blanca Premium",    tag: "Aluminio anti-humedad · Baño",       tipo: "corredera_simple", premium: true,  imagen_url: "/puerta-blanca.webp",   alt: "Puerta corrediza blanca premium",   orden: 4, activo: true, updated_at: "" },
  { id: "m5", slug: "plegable-estandar", titulo: "Plegable doble",         tag: "Plegable doble · Ambientes amplios", tipo: "plegable_doble",   premium: false, imagen_url: "/puerta-producto.webp", alt: "Modelo de puerta plegable",         orden: 5, activo: true, updated_at: "" },
  { id: "m6", slug: "plegable-premium",  titulo: "Plegable doble Premium", tag: "Aluminio anti-humedad · Amplios",    tipo: "plegable_doble",   premium: true,  imagen_url: "/puerta-producto.webp", alt: "Modelo de puerta plegable premium", orden: 6, activo: true, updated_at: "" },
]
