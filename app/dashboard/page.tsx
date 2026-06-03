export const dynamic = "force-dynamic"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"
import type { Lead } from "@/types"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Verificar que sea admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect("/")

  // Datos del mes actual
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [{ data: leadsAll }, { data: leadsMes }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("leads").select("*").gte("created_at", startOfMonth.toISOString()),
  ])

  const pagadosMes = (leadsMes ?? []).filter(l => l.status === "pagado")
  const revenueMes = pagadosMes.reduce(
    (sum, l) => sum + (l.precio_puerta ?? 0) + (l.precio_instalacion ?? 0), 0
  )

  return (
    <DashboardClient
      leads={leadsAll as Lead[] ?? []}
      stats={{
        leadsMes: leadsMes?.length ?? 0,
        ventasMes: pagadosMes.length,
        revenueMes,
        conversionRate: leadsMes?.length
          ? Math.round((pagadosMes.length / leadsMes.length) * 100)
          : 0,
      }}
    />
  )
}
