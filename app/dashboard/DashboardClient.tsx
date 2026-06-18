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

const MES_RAW = new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })
const MES = MES_RAW.charAt(0).toUpperCase() + MES_RAW.slice(1) // "Junio de 2026"

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  canvas: "#f4f2ee",
  card:   "#ffffff",
  border: "#e7e4dd",
  ink:    "#0a0a0a",
  muted:  "#8a8578",
  faint:  "#b5afa3",
  green:  "#0a8f4f",
  amber:  "#c4870c",
  red:    "#d33a2c",
}

const STATUS: Record<Lead["status"], { label: string; color: string; bg: string }> = {
  pendiente: { label: "Pendiente", color: C.amber, bg: "rgba(196,135,12,0.1)" },
  pagado:    { label: "Pagado",    color: C.green, bg: "rgba(10,143,79,0.1)" },
  cancelado: { label: "Cancelado", color: C.red,   bg: "rgba(211,58,44,0.1)" },
}

// ─── Íconos (line, currentColor, sin emojis) ──────────────────────────────────
type IconProps = { size?: number }
const IcoLeads = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IcoVenta = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
  </svg>
)
const IcoMoney = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" />
  </svg>
)
const IcoConv = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" />
  </svg>
)
const IcoInbox = ({ size = 40 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
)

// ─── Tarjeta KPI ──────────────────────────────────────────────────────────────
function KPI({ icon, value, label, hint, accent = C.ink, progress }: {
  icon: React.ReactNode; value: string; label: string; hint: string
  accent?: string; progress?: number
}) {
  return (
    <div
      style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px",
        padding: "22px 22px 20px", display: "flex", flexDirection: "column", gap: "14px",
        transition: "box-shadow 0.2s, transform 0.2s", cursor: "default",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)" }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center",
          background: `${accent}14`, color: accent,
        }}>{icon}</div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Este mes</span>
      </div>

      <div>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "2.6rem", fontWeight: 400, lineHeight: 1, color: C.ink, letterSpacing: "-0.02em" }}>{value}</p>
        <p style={{ fontSize: "13px", fontWeight: 600, color: C.ink, marginTop: "10px" }}>{label}</p>
        <p style={{ fontSize: "12px", color: C.muted, marginTop: "2px", lineHeight: 1.4 }}>{hint}</p>
      </div>

      {progress != null && (
        <div style={{ height: "5px", borderRadius: "100px", background: "#efece6", overflow: "hidden", marginTop: "2px" }}>
          <div style={{ width: `${Math.min(100, progress)}%`, height: "100%", background: accent, borderRadius: "100px", transition: "width 0.6s cubic-bezier(0.76,0,0.24,1)" }} />
        </div>
      )}
    </div>
  )
}

export default function DashboardClient({ leads, precios: preciosIniciales, stats }: Props) {
  const [tab, setTab]       = useState<Tab>("leads")
  const [filtro, setFiltro] = useState<Lead["status"] | "todos">("todos")

  // ── Editor de precios ──
  const [precios, setPrecios]     = useState<PrecioDB[]>(preciosIniciales)
  const [guardando, setGuardando] = useState(false)
  const [feedback, setFeedback]   = useState<"ok" | "error" | null>(null)

  function updatePrecio(id: string, valor: number) {
    setPrecios(prev => prev.map(p => p.id === id ? { ...p, precio: valor } : p))
    setFeedback(null)
  }

  async function handleGuardar() {
    setGuardando(true); setFeedback(null)
    try {
      const results = await Promise.all(
        precios.map(p =>
          fetch("/api/precios", {
            method: "PATCH", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: p.id, precio: p.precio }),
          }).then(r => r.ok)
        )
      )
      setFeedback(results.every(Boolean) ? "ok" : "error")
    } catch { setFeedback("error") }
    finally { setGuardando(false); setTimeout(() => setFeedback(null), 4000) }
  }

  const leadsFiltrados = filtro === "todos" ? leads : leads.filter(l => l.status === filtro)
  const conteoPorStatus = (s: Lead["status"] | "todos") => s === "todos" ? leads.length : leads.filter(l => l.status === s).length

  // ── Mini-gráfico: leads por día (últimos 14 días) ──
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const dias = Array.from({ length: 14 }, (_, i) => { const d = new Date(hoy); d.setDate(d.getDate() - (13 - i)); return d })
  const actividad = dias.map(d => {
    const next = new Date(d); next.setDate(d.getDate() + 1)
    const n = leads.filter(l => { const c = new Date(l.created_at); return c >= d && c < next }).length
    return { d, n }
  })
  const maxAct = Math.max(1, ...actividad.map(a => a.n))
  const hayActividad = actividad.some(a => a.n > 0)

  return (
    <div style={{ minHeight: "100vh", background: C.canvas, fontFamily: "var(--font-sans)", color: C.ink }}>

      {/* ── Top bar ── */}
      <header style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: "16px clamp(20px, 4vw, 40px)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500, lineHeight: 1 }}>Diseños JK</h1>
            <p style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>Panel de control · {MES}</p>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "100px", background: "rgba(10,143,79,0.1)" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.green, boxShadow: `0 0 0 0 ${C.green}`, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: C.green }}>En vivo</span>
          </span>
        </div>
        <a href="/api/auth/logout"
          style={{ fontSize: "13px", fontWeight: 500, color: C.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: `1px solid ${C.border}`, borderRadius: "8px", transition: "color 0.15s, border-color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = C.ink; e.currentTarget.style.borderColor = C.ink }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}>
          Salir →
        </a>
      </header>

      {/* ── Tabs ── */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "0 clamp(20px, 4vw, 40px)", display: "flex", gap: "4px" }}>
        {([["leads", "Resumen y leads"], ["precios", "Precios"]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              fontSize: "13px", fontWeight: 600, padding: "14px 16px", border: "none", background: "transparent", cursor: "pointer",
              color: tab === t ? C.ink : C.faint,
              borderBottom: `2px solid ${tab === t ? C.ink : "transparent"}`,
              marginBottom: "-1px", transition: "color 0.15s",
            }}>
            {label}
          </button>
        ))}
      </div>

      <main style={{ padding: "clamp(20px, 3.5vw, 36px) clamp(20px, 4vw, 40px)", maxWidth: "1240px", margin: "0 auto" }}>

        {/* ── TAB LEADS ── */}
        {tab === "leads" && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              <KPI icon={<IcoLeads />} value={stats.leadsMes.toString()} label="Leads este mes" hint="Configuraciones enviadas" accent={C.ink} />
              <KPI icon={<IcoVenta />} value={stats.ventasMes.toString()} label="Ventas confirmadas" hint="Pagos aprobados por MP" accent={C.green} />
              <KPI icon={<IcoMoney />} value={fmtARS(stats.revenueMes)} label="Facturación" hint="Puerta + instalación" accent={C.green} />
              <KPI icon={<IcoConv />} value={`${stats.conversionRate}%`} label="Conversión" hint="De leads a venta" accent={C.amber} progress={stats.conversionRate} />
            </div>

            {/* Actividad */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px 22px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "18px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600 }}>Actividad</p>
                <p style={{ fontSize: "11px", color: C.muted }}>Últimos 14 días</p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "70px" }}>
                {actividad.map(({ d, n }, i) => (
                  <div key={i} title={`${d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })} — ${n} lead${n !== 1 ? "s" : ""}`}
                    style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", cursor: "default" }}>
                    <div style={{
                      height: `${(n / maxAct) * 100}%`, minHeight: n > 0 ? "6px" : "3px",
                      background: n > 0 ? C.ink : "#eceae4", borderRadius: "4px",
                      transition: "height 0.3s, background 0.15s",
                    }}
                    onMouseEnter={e => { if (n > 0) e.currentTarget.style.background = C.green }}
                    onMouseLeave={e => { if (n > 0) e.currentTarget.style.background = C.ink }} />
                  </div>
                ))}
              </div>
              {!hayActividad && (
                <p style={{ fontSize: "11px", color: C.faint, marginTop: "12px", textAlign: "center" }}>
                  Sin consultas todavía — las barras se llenan a medida que entran leads.
                </p>
              )}
            </div>

            {/* Tabla de leads */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>Leads recientes</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(["todos", "pendiente", "pagado", "cancelado"] as const).map(f => {
                    const active = filtro === f
                    return (
                      <button key={f} onClick={() => setFiltro(f)}
                        style={{
                          fontSize: "12px", fontWeight: 500, padding: "6px 12px", borderRadius: "100px", cursor: "pointer",
                          textTransform: "capitalize",
                          border: `1px solid ${active ? C.ink : C.border}`,
                          background: active ? C.ink : "transparent",
                          color: active ? "#fff" : C.muted,
                          transition: "all 0.15s",
                        }}>
                        {f} <span style={{ opacity: 0.6 }}>{conteoPorStatus(f)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {leadsFiltrados.length === 0 ? (
                /* Estado vacío */
                <div style={{ padding: "64px 24px", textAlign: "center", color: C.faint }}>
                  <div style={{ color: C.faint, marginBottom: "16px", display: "flex", justifyContent: "center" }}><IcoInbox /></div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400, color: C.muted, marginBottom: "8px" }}>
                    {filtro === "todos" ? "Todavía no hay consultas" : `No hay leads ${filtro === "pagado" ? "pagados" : filtro + "s"}`}
                  </p>
                  <p style={{ fontSize: "13px", color: C.faint, maxWidth: "380px", margin: "0 auto", lineHeight: 1.6 }}>
                    Cuando alguien complete el configurador en la web, su consulta aparece acá al instante con todos los datos y el precio.
                  </p>
                  {filtro !== "todos" && (
                    <button onClick={() => setFiltro("todos")}
                      style={{ marginTop: "18px", fontSize: "12px", fontWeight: 600, color: C.ink, background: "transparent", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}>
                      Ver todos
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#faf9f6" }}>
                        {["Fecha", "Cliente", "Configuración", "Precio", "Instalación", "Estado"].map(h => (
                          <th key={h} style={{ textAlign: "left", padding: "12px 22px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leadsFiltrados.map(lead => {
                        const st = STATUS[lead.status]
                        return (
                          <tr key={lead.id} style={{ borderTop: `1px solid ${C.border}`, transition: "background 0.12s" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#faf9f6")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <td style={{ padding: "14px 22px", fontSize: "12px", color: C.muted, whiteSpace: "nowrap" }}>
                              {new Date(lead.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                            </td>
                            <td style={{ padding: "14px 22px" }}>
                              <p style={{ fontSize: "13px", fontWeight: 600 }}>{lead.nombre}</p>
                              <p style={{ fontSize: "12px", color: C.faint }}>{lead.email}</p>
                            </td>
                            <td style={{ padding: "14px 22px" }}>
                              <p style={{ fontSize: "13px", textTransform: "capitalize", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                {lead.tipo?.replace("_", " ")} · {lead.material}
                                {lead.revestimiento === "premium" && (
                                  <span style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", background: "#c9ccd1", color: C.ink, padding: "1px 7px", borderRadius: "100px" }}>Premium</span>
                                )}
                              </p>
                              <p style={{ fontSize: "12px", color: C.faint }}>{lead.ambiente} · {lead.ancho}×{lead.alto}cm</p>
                            </td>
                            <td style={{ padding: "14px 22px", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap" }}>{lead.precio_puerta ? fmtARS(lead.precio_puerta) : "—"}</td>
                            <td style={{ padding: "14px 22px", fontSize: "13px", color: C.muted, whiteSpace: "nowrap" }}>
                              {lead.instalacion ? (lead.precio_instalacion ? fmtARS(lead.precio_instalacion) : "Sí · WA") : "No"}
                            </td>
                            <td style={{ padding: "14px 22px" }}>
                              <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "100px", color: st.color, background: st.bg, whiteSpace: "nowrap" }}>{st.label}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TAB PRECIOS ── */}
        {tab === "precios" && (
          <div style={{ maxWidth: "720px" }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>

              {/* Cabecera */}
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600 }}>Precios de venta</p>
                  <p style={{ fontSize: "12px", color: C.muted, marginTop: "3px" }}>Se reflejan en el configurador al instante. El premium se calcula solo (+30%).</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {feedback === "ok" && <span style={{ fontSize: "12px", fontWeight: 600, color: C.green }}>Guardado ✓</span>}
                  {feedback === "error" && <span style={{ fontSize: "12px", fontWeight: 600, color: C.red }}>Error al guardar</span>}
                  <button onClick={handleGuardar} disabled={guardando}
                    style={{
                      fontSize: "13px", fontWeight: 600, padding: "10px 20px", borderRadius: "8px", border: "none",
                      background: guardando ? "#e7e4dd" : C.ink, color: guardando ? C.muted : "#fff",
                      cursor: guardando ? "not-allowed" : "pointer", transition: "opacity 0.15s",
                    }}>
                    {guardando ? "Guardando…" : "Guardar cambios"}
                  </button>
                </div>
              </div>

              {/* Filas por tipo */}
              <div style={{ padding: "8px 24px 20px" }}>
                {(["corredera_simple", "plegable_doble"] as const).map(tipo => {
                  const filas = precios.filter(p => p.tipo === tipo).sort((a, b) => a.ancho_max - b.ancho_max)
                  return (
                    <div key={tipo} style={{ marginTop: "20px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted, marginBottom: "8px" }}>{TIPO_LABEL[tipo]}</p>
                      <div>
                        {filas.map((p, i) => (
                          <div key={p.id} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
                            padding: "14px 0", borderTop: i === 0 ? `1px solid ${C.border}` : "none",
                            borderBottom: `1px solid ${C.border}`,
                          }}>
                            <div>
                              <p style={{ fontSize: "13px", fontWeight: 600 }}>Hasta {p.ancho_max} cm de ancho</p>
                              <p style={{ fontSize: "12px", color: C.faint, marginTop: "1px" }}>Alto estándar {p.alto} cm · premium {fmtARS(Math.round(p.precio * 1.3 / 1000) * 1000)}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "8px 12px", background: "#faf9f6" }}>
                              <span style={{ fontSize: "13px", color: C.muted }}>$</span>
                              <input
                                type="number" min={0} step={1000} value={p.precio}
                                onChange={e => updatePrecio(p.id, Number(e.target.value))}
                                style={{ fontSize: "14px", fontWeight: 600, border: "none", background: "transparent", outline: "none", textAlign: "right", width: "110px", color: C.ink }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                <p style={{ fontSize: "11px", color: C.faint, marginTop: "16px", lineHeight: 1.5 }}>
                  Valores en pesos argentinos, sin decimales. Las cuotas se calculan solas: precio ÷ 6.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(10,143,79,0.5) } 70% { box-shadow: 0 0 0 6px rgba(10,143,79,0) } 100% { box-shadow: 0 0 0 0 rgba(10,143,79,0) } }`}</style>
    </div>
  )
}
