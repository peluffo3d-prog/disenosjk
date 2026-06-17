"use client"
import { useState } from "react"
import type { Lead, PrecioDB } from "@/types"
import { fmtARS } from "@/lib/precios"

interface Props {
  leads: Lead[]
  precios: PrecioDB[]
  stats: {
    leadsMes: number
    ventasMes: number
    revenueMes: number
    conversionRate: number
  }
}

type Tab = "leads" | "precios"

const TIPO_LABEL: Record<string, string> = {
  corredera_simple: "Corrediza simple",
  plegable_doble:   "Plegable doble",
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

export default function DashboardClient({ leads, precios: preciosIniciales, stats }: Props) {
  const [tab, setTab]       = useState<Tab>("leads")
  const [filtro, setFiltro] = useState<Lead["status"] | "todos">("todos")

  // ── Estado del editor de precios ──────────────────────────────────────────────
  const [precios, setPrecios]   = useState<PrecioDB[]>(preciosIniciales)
  const [guardando, setGuardando] = useState(false)
  const [feedback, setFeedback]   = useState<"ok" | "error" | null>(null)

  function updatePrecio(id: string, valor: number) {
    setPrecios(prev => prev.map(p => p.id === id ? { ...p, precio: valor } : p))
    setFeedback(null)
  }

  async function handleGuardar() {
    setGuardando(true)
    setFeedback(null)
    try {
      const results = await Promise.all(
        precios.map(p =>
          fetch("/api/precios", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: p.id, precio: p.precio }),
          }).then(r => r.ok)
        )
      )
      setFeedback(results.every(Boolean) ? "ok" : "error")
    } catch {
      setFeedback("error")
    } finally {
      setGuardando(false)
      setTimeout(() => setFeedback(null), 4000)
    }
  }

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

      {/* Tab nav */}
      <div className="border-b border-neutral-200 px-8 flex gap-0">
        {([["leads", "Leads"], ["precios", "Precios"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className="font-mono text-xs uppercase tracking-widest py-4 px-1 mr-8 border-b-2 transition-colors"
            style={{
              borderColor: tab === t ? "#0a0a0a" : "transparent",
              color: tab === t ? "#0a0a0a" : "#aaa",
            }}>
            {label}
          </button>
        ))}
      </div>

      <main className="px-8 py-12">

        {/* ── TAB: LEADS ── */}
        {tab === "leads" && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 mb-16 border-t border-black pt-10">
              <KPI value={stats.leadsMes.toString()} label="Leads este mes" sub="Configuraciones enviadas" />
              <KPI value={stats.ventasMes.toString()} label="Ventas confirmadas" sub="Pagos aprobados por MP" />
              <KPI value={fmtARS(stats.revenueMes)} label="Facturación" sub="Puerta + instalación" />
              <KPI value={`${stats.conversionRate}%`} label="Conversión" sub="Leads → Venta" />
            </div>

            {/* Tabla de leads */}
            <div>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-display text-xl">Leads recientes</h2>
                <div className="flex gap-4 font-mono text-xs uppercase tracking-widest">
                  {(["todos", "pendiente", "pagado", "cancelado"] as const).map(f => (
                    <button key={f} onClick={() => setFiltro(f)} className="transition-colors"
                      style={{ color: filtro === f ? "#0a0a0a" : "#aaa" }}>
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
                        <th key={h} className="text-left py-3 pr-6 font-mono text-xs uppercase tracking-widest text-neutral-500">{h}</th>
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
                      <tr key={lead.id} className="border-b transition-colors hover:bg-neutral-50"
                        style={{ borderColor: i === leadsFiltrados.length - 1 ? "#0a0a0a" : "#e5e5e5" }}>
                        <td className="py-4 pr-6 font-mono text-xs text-neutral-500 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                        </td>
                        <td className="py-4 pr-6">
                          <p className="text-sm font-medium">{lead.nombre}</p>
                          <p className="font-mono text-xs text-neutral-400">{lead.email}</p>
                        </td>
                        <td className="py-4 pr-6">
                          <p className="text-sm capitalize">
                            {lead.tipo?.replace("_", " ")} · {lead.material}
                            {lead.revestimiento === "premium" && (
                              <span className="font-mono text-[10px] uppercase tracking-wider ml-2 px-1.5 py-0.5" style={{ background: "#c9ccd1", color: "#0a0a0a", borderRadius: "100px" }}>
                                Premium
                              </span>
                            )}
                          </p>
                          <p className="font-mono text-xs text-neutral-400">{lead.ambiente} · {lead.ancho}×{lead.alto}cm</p>
                        </td>
                        <td className="py-4 pr-6 font-mono text-sm">{lead.precio_puerta ? fmtARS(lead.precio_puerta) : "—"}</td>
                        <td className="py-4 pr-6 font-mono text-sm">
                          {lead.instalacion ? (lead.precio_instalacion ? fmtARS(lead.precio_instalacion) : "Sí — WA") : "No"}
                        </td>
                        <td className="py-4">
                          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: STATUS_COLOR[lead.status] }}>
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
          </>
        )}

        {/* ── TAB: PRECIOS ── */}
        {tab === "precios" && (
          <div style={{ maxWidth: "680px" }}>

            {/* Cabecera + botón guardar */}
            <div className="flex items-baseline justify-between border-t border-black pt-10 mb-10">
              <div>
                <h2 className="font-display text-xl mb-1">Precios de venta</h2>
                <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
                  Los cambios se reflejan en el configurador al instante.
                </p>
              </div>
              <div className="flex items-center gap-4">
                {feedback === "ok" && (
                  <span className="font-mono text-xs text-green-600 uppercase tracking-widest">Guardado ✓</span>
                )}
                {feedback === "error" && (
                  <span className="font-mono text-xs text-red-500 uppercase tracking-widest">Error al guardar</span>
                )}
                <button onClick={handleGuardar} disabled={guardando}
                  className="font-mono text-xs uppercase tracking-widest px-5 py-2.5 border border-black transition-colors"
                  style={{
                    background: guardando ? "#f5f5f5" : "#0a0a0a",
                    color: guardando ? "#999" : "#fff",
                    cursor: guardando ? "not-allowed" : "pointer",
                  }}>
                  {guardando ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </div>

            {/* Tablas por tipo */}
            {(["corredera_simple", "plegable_doble"] as const).map(tipo => {
              const filas = precios.filter(p => p.tipo === tipo).sort((a, b) => a.ancho_max - b.ancho_max)
              return (
                <div key={tipo} className="mb-10">
                  <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
                    {TIPO_LABEL[tipo]}
                  </p>
                  <div className="border-t border-b border-black">
                    {filas.map((p, i) => (
                      <div key={p.id}
                        className="flex items-center justify-between py-4 gap-6"
                        style={{ borderBottom: i < filas.length - 1 ? "1px solid #e5e5e5" : "none" }}>
                        {/* Descripción del rango */}
                        <div>
                          <p className="text-sm font-medium">Hasta {p.ancho_max} cm de ancho</p>
                          <p className="font-mono text-xs text-neutral-400 mt-0.5">Alto estándar: {p.alto} cm</p>
                        </div>
                        {/* Input de precio */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-mono text-sm text-neutral-400">$</span>
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            value={p.precio}
                            onChange={e => updatePrecio(p.id, Number(e.target.value))}
                            className="font-mono text-sm border-b border-neutral-300 bg-transparent outline-none text-right w-32 py-1"
                            style={{ transition: "border-color 0.15s" }}
                            onFocus={e => (e.currentTarget.style.borderColor = "#0a0a0a")}
                            onBlur={e => (e.currentTarget.style.borderColor = "")}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            <p className="font-mono text-xs text-neutral-400 mt-2">
              Los precios son en pesos argentinos (ARS), sin decimales.
              Las cuotas se calculan automáticamente: precio ÷ 6.
            </p>
          </div>
        )}

      </main>
    </div>
  )
}
