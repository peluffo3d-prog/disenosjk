import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const TIPOS_OK = ["image/jpeg", "image/png", "image/webp"] as const
const MAX_BYTES = 6 * 1024 * 1024 // 6 MB
const BUCKET = "productos"

// POST (multipart) — solo admin. Sube la foto de un modelo a Supabase Storage
// y guarda su URL en la fila correspondiente de `modelos`.
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()

  // ── Candado: igual que el editor de precios, solo el admin ──
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
  }

  // ── Leer el archivo ──
  const form = await req.formData()
  const id = form.get("id")
  const file = form.get("file")

  if (typeof id !== "string" || !id || !(file instanceof File)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }
  if (!TIPOS_OK.includes(file.type as typeof TIPOS_OK[number])) {
    return NextResponse.json({ error: "Formato no permitido. Usá JPG, PNG o WEBP." }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen supera los 6 MB." }, { status: 400 })
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
  const path = `modelos/${id}-${Date.now()}.${ext}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  // ── Subir + actualizar fila con el cliente de servicio puro (salta RLS) ──
  const service = createSupabaseServiceClient()

  const { error: upErr } = await service.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true })

  if (upErr) {
    console.error("[modelos/upload] storage error:", upErr)
    return NextResponse.json({ error: `Storage: ${upErr.message}` }, { status: 500 })
  }

  const { data: pub } = service.storage.from(BUCKET).getPublicUrl(path)
  const imagen_url = pub.publicUrl

  const { error: dbErr } = await service
    .from("modelos")
    .update({ imagen_url, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (dbErr) {
    console.error("[modelos/upload] db error:", dbErr)
    return NextResponse.json({ error: `DB: ${dbErr.message}` }, { status: 500 })
  }

  return NextResponse.json({ ok: true, imagen_url })
}
