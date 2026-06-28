import type { Modelo } from "@/types"

// Fotos de respaldo: las imágenes que ya viven en /public.
// Se usan si la tabla `modelos` de Supabase todavía no existe o no responde,
// así la galería nunca queda vacía. Los `id` acá son provisorios (la DB usa uuid).
// Catálogo real de Diseños JK en MercadoLibre. Las fotos por ahora son las de
// respaldo en /public; el dueño sube las reales desde el panel (pestaña Productos).
// Solo el modelo de aluminio anti-humedad es "premium" (+30%); el resto es estándar.
export const STATIC_MODELOS: Modelo[] = [
  { id: "m1", slug: "corrediza-mas-vendida", titulo: "Corrediza colgante",      tag: "Más vendida · Baño, cocina, living",   tipo: "corredera_simple", premium: false, imagen_url: "/puerta-blanca.webp",   alt: "Puerta corrediza colgante blanca",       orden: 1, activo: true, updated_at: "" },
  { id: "m2", slug: "corrediza-a-color",     titulo: "Corrediza a color",       tag: "8 colores · Baño, cocina, living",     tipo: "corredera_simple", premium: false, imagen_url: "/puerta-blanca.webp",   alt: "Puerta corrediza colgante a color",      orden: 2, activo: true, updated_at: "" },
  { id: "m3", slug: "corrediza-madera",      titulo: "Corrediza símil madera",  tag: "Madera · 9 colores · Living",          tipo: "corredera_simple", premium: false, imagen_url: "/puerta-granero.webp",  alt: "Puerta corrediza símil madera",          orden: 3, activo: true, updated_at: "" },
  { id: "m4", slug: "corrediza-cedro",       titulo: "Corrediza símil cedro",   tag: "Cedro · 7 colores · Dormitorio",       tipo: "corredera_simple", premium: false, imagen_url: "/puerta-granero.webp",  alt: "Puerta corrediza símil cedro",           orden: 4, activo: true, updated_at: "" },
  { id: "m5", slug: "corrediza-60x210",      titulo: "Corrediza 60×210",        tag: "Medida fija · Espacios chicos",        tipo: "corredera_simple", premium: false, imagen_url: "/puerta-blanca.webp",   alt: "Puerta corrediza 60x210",                orden: 5, activo: true, updated_at: "" },
  { id: "m6", slug: "corrediza-a-medida",    titulo: "Corrediza a medida",      tag: "Apta Durlock · Incluye kit",           tipo: "corredera_simple", premium: false, imagen_url: "/puerta-blanca.webp",   alt: "Puerta corrediza a medida con kit",      orden: 6, activo: true, updated_at: "" },
  { id: "m7", slug: "corrediza-aluminio",    titulo: "Premium aluminio 2.0",    tag: "Aluminio anti-humedad · Rodamiento 2.0", tipo: "corredera_simple", premium: true, imagen_url: "/puerta-blanca.webp",   alt: "Puerta corrediza premium aluminio",      orden: 7, activo: true, updated_at: "" },
  { id: "m8", slug: "plegable-a-medida",     titulo: "Plegable a medida",       tag: "Apta Durlock · Baño y cocina",         tipo: "plegable_doble",   premium: false, imagen_url: "/puerta-producto.webp", alt: "Puerta plegable a medida",               orden: 8, activo: true, updated_at: "" },
]
