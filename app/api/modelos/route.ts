import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET — público. La landing usa esto para mostrar la galería de modelos con
// las fotos que el dueño cargó desde el panel.
export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("modelos")
    .select("*")
    .eq("activo", true)
    .order("orden")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  })
}
