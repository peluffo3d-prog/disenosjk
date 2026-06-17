import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET — público, la landing y el configurador lo usan sin auth
export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("precios")
    .select("*")
    .eq("activo", true)
    .order("tipo")
    .order("ancho_max")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  })
}

// PATCH — solo admin, actualiza el precio de una fila
export async function PATCH(req: Request) {
  const supabase = await createSupabaseServerClient()

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

  const body = await req.json() as { id: string; precio: number }
  const { id, precio } = body

  if (!id || typeof precio !== "number" || precio < 0) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const { error } = await supabase
    .from("precios")
    .update({ precio, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
