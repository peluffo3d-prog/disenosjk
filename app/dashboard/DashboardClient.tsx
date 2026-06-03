"use client"
import { useState } from "react"
import type { Lead } from "@/types"
import { fmtARS } from "@/lib/precios"

interface Props {
  leads: Lead[]
  stats: {
    leadsMes: number
    ventasMes: number
    revenueMes: number
    conversionRate: number
  }
}

const MES = new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })

function KPI({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="border-b border-black pb-8">
      <p
        className="font-display leading-none mb-2"
        style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
      >
        {value}
      </p>
      <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">{label}</p>
      {sub && <p className="font-mono text-xs text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  )
}

const STATUS_LABEL: Record<Lead["status"], string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  cancelado: "Cancelado",
}
const STATUS_COLOR: Record<Lead["status"], string> = {
  pendiente: "#888",
  pagado: "#16a34a",
  cancelado: "#dc2626",
}

export default function DashboardClient({ leads, stats }: Props) {
  const [filtro, setFiltro] = useState<Lead["status"] | "todos">("todos")

  const leadsFiltrados = filtro === "todos"
    ? leads
    : leads.filter(l => l.status === filtro)

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-sans)" }}>

      {/* Header */}
      <header className="border-b border-black px-8 py-5 flex items-baseline justify-between">
        <div>
          <h1 className="font-display text-2xl leading-none">Diseños JK</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-500 mt-1">
            Panel de control · {MES}
          </p>
        </div>
        <a
          href="/api/auth/logout"
          className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
        >
          Salir →
        </a>
      </header>

      <main className="px-8 py-12">

        {/* KPIs — asimétrico: 4 métricas en fila sin grid igual */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 mb-16 border-t border-black pt-10">
          <KPI
            value={stats.leadsMes.toString()}
            label="Leads este mes"
            sub="Configuraciones enviadas"
          />
          <KPI
            value={stats.ventasMes.toString()}
            label="Ventas confirmadas"
            sub="Pagos aprobados por MP"
          />
          <KPI
            value={fmtARS(stats.revenueMes)}
            label="Facturación"
            sub="Puerta + instalación"
          />
          <KPI
            value={`${stats.conversionRate}%`}
            label="Conversión"
            sub="Leads → Venta"
          />
        </div>

        {/* Tabla de leads */}
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-xl">Leads recientes</h2>
            {/* Filtros */}
            <div className="flex gap-4 font-mono text-xs uppercase tracking-widest">
              {(["todos", "pendiente", "pagado", "cancelado"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className="transition-colors"
                  style={{ color: filtro === f ? "#0a0a0a" : "#aaa" }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-y border-black">
                  {["Fecha", "Cliente", "Configuración", "Precio", "Instalación", "Estado"].map(h => (
                    <th key={h} className="text-left py-3 pr-6 font-mono text-xs uppercase tracking-widest text-neutral-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leadsFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 font-mono text-xs text-neutral-400 text-center uppercase tracking-widest">
                      Sin resultados
                    </td>
                  </tr>
                )}
                {leadsFiltrados.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className="border-b transition-colors hover:bg-neutral-50"
                    style={{ borderColor: i === leadsFiltrados.length - 1 ? "#0a0a0a" : "#e5e5e5" }}
                  >
                    <td className="py-4 pr-6 font-mono text-xs text-neutral-500 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "2-digit",
                      })}
                    </td>
                    <td className="py-4 pr-6">
                      <p className="text-sm font-medium">{lead.nombre}</p>
                      <p className="font-mono text-xs text-neutral-400">{lead.email}</p>
                    </td>
                    <td className="py-4 pr-6">
                      <p className="text-sm capitalize">
                        {lead.tipo?.replace("_", " ")} · {lead.material}
                      </p>
                      <p className="font-mono text-xs text-neutral-400">
                        {lead.ambiente} · {lead.ancho}×{lead.alto}cm
                      </p>
                    </td>
                    <td className="py-4 pr-6 font-mono text-sm">
                      {lead.precio_puerta ? fmtARS(lead.precio_puerta) : "—"}
                    </td>
                    <td className="py-4 pr-6 font-mono text-sm">
                      {lead.instalacion
                        ? lead.precio_instalacion
                          ? fmtARS(lead.precio_instalacion)
                          : "Sí — WA"
                        : "No"}
                    </td>
                    <td className="py-4">
                      <span
                        className="font-mono text-xs uppercase tracking-widest"
                        style={{ color: STATUS_COLOR[lead.status] }}
                      >
                        {STATUS_LABEL[lead.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leadsFiltrados.length > 0 && (
            <p className="font-mono text-xs text-neutral-400 mt-4 uppercase tracking-widest">
              {leadsFiltrados.length} resultado{leadsFiltrados.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
