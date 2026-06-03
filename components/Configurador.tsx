"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react"
import type { ConfiguradorState, Ambiente, TipoPuerta, Material } from "@/types"
import { calcularPrecio, fmtARS } from "@/lib/precios"

const WA = "5491100000000" // TODO: reemplazar con número real

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

function Chip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
      style={{
        background: active ? "#0a0a0a" : "transparent",
        borderColor: active ? "#0a0a0a" : "#d4d4d4",
        color: active ? "#f5f4f0" : "#444",
      }}
    >
      {label}
    </button>
  )
}

function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold">
        {n}
      </span>
      <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
        {label}
      </span>
    </div>
  )
}

const AMBIENTES: { value: Ambiente; label: string }[] = [
  { value: "baño",       label: "Baño" },
  { value: "dormitorio", label: "Dormitorio" },
  { value: "living",     label: "Living / Comedor" },
  { value: "otro",       label: "Otro" },
]

const TIPOS: { value: TipoPuerta; label: string; desc: string }[] = [
  { value: "corredera_simple", label: "Corrediza simple",  desc: "Una hoja que desliza" },
  { value: "plegable_doble",   label: "Plegable doble",    desc: "Dos hojas que se pliegan" },
  { value: "otro",             label: "Otro modelo",       desc: "Cotización personalizada" },
]

const MATERIALES: { value: Material; label: string }[] = [
  { value: "blanco",   label: "Blanco" },
  { value: "madera",   label: "Madera" },
  { value: "vidriado", label: "Vidriado" },
  { value: "negro",    label: "Negro" },
  { value: "otro",     label: "Otro" },
]

const INITIAL: ConfiguradorState = {
  ambiente: null, tipo: null, material: null,
  ancho: null, alto: null, instalacion: false, localidad: "",
}

export default function Configurador() {
  const [cfg, setCfg] = useState<ConfiguradorState>(INITIAL)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [loading, setLoading] = useState(false)

  const precio = calcularPrecio(cfg)
  const completo = cfg.ambiente && cfg.tipo && cfg.material && cfg.ancho && cfg.alto

  function waMsg() {
    const lineas = [
      `Hola! Quiero cotizar una puerta.`,
      cfg.ambiente  && `📍 Ambiente: ${cfg.ambiente}`,
      cfg.tipo      && `🚪 Tipo: ${cfg.tipo.replace("_", " ")}`,
      cfg.material  && `🎨 Material: ${cfg.material}`,
      cfg.ancho && cfg.alto && `📐 Medidas: ${cfg.ancho} × ${cfg.alto} cm`,
      cfg.instalacion && cfg.localidad && `🔧 Con instalación en ${cfg.localidad}`,
    ].filter(Boolean)
    return `https://wa.me/${WA}?text=${encodeURIComponent(lineas.join("\n"))}`
  }

  async function handlePagar() {
    if (!completo || !nombre || !email || !precio.estandar || !precio.puerta) return
    setLoading(true)
    try {
      const res = await fetch("/api/mp/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre, email, telefono,
          ...cfg,
          precio_puerta: precio.puerta,
          precio_instalacion: precio.instalacion,
        }),
      })
      const data = await res.json()
      if (data.init_point) window.location.href = data.init_point
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="configurador" className="py-24 px-5 sm:px-8 md:px-16 max-w-3xl mx-auto">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">
        Configurador
      </p>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-12">
        Armá tu puerta
      </h2>

      <div className="flex flex-col gap-10">

        {/* Paso 1: Ambiente */}
        <div>
          <StepLabel n={1} label="¿Para qué ambiente?" />
          <div className="flex flex-wrap gap-2">
            {AMBIENTES.map(a => (
              <Chip key={a.value} label={a.label} active={cfg.ambiente === a.value}
                onClick={() => setCfg(p => ({ ...p, ambiente: a.value }))} />
            ))}
          </div>
        </div>

        {/* Paso 2: Tipo */}
        <div>
          <StepLabel n={2} label="¿Qué tipo de puerta?" />
          <div className="flex flex-col gap-2">
            {TIPOS.map(t => (
              <button key={t.value}
                onClick={() => setCfg(p => ({ ...p, tipo: t.value }))}
                className="flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all"
                style={{
                  background: cfg.tipo === t.value ? "#0a0a0a" : "#f9f9f9",
                  borderColor: cfg.tipo === t.value ? "#0a0a0a" : "#e5e5e5",
                  color: cfg.tipo === t.value ? "#f5f4f0" : "#0a0a0a",
                }}>
                <div>
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-xs" style={{ color: cfg.tipo === t.value ? "#aaa" : "#888" }}>
                    {t.desc}
                  </p>
                </div>
                {cfg.tipo === t.value && <ArrowRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Paso 3: Material */}
        <div>
          <StepLabel n={3} label="Material / color" />
          <div className="flex flex-wrap gap-2">
            {MATERIALES.map(m => (
              <Chip key={m.value} label={m.label} active={cfg.material === m.value}
                onClick={() => setCfg(p => ({ ...p, material: m.value }))} />
            ))}
          </div>
        </div>

        {/* Paso 4: Medidas */}
        <div>
          <StepLabel n={4} label="Medidas del hueco (cm)" />
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-neutral-500">Ancho</label>
              <input type="number" placeholder="ej: 80"
                value={cfg.ancho ?? ""}
                onChange={e => setCfg(p => ({ ...p, ancho: Number(e.target.value) || null }))}
                className="border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                style={{ borderColor: "#e5e5e5" }}
              />
            </div>
            <span className="text-neutral-400 mt-4">×</span>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-neutral-500">Alto</label>
              <input type="number" placeholder="ej: 200"
                value={cfg.alto ?? ""}
                onChange={e => setCfg(p => ({ ...p, alto: Number(e.target.value) || null }))}
                className="border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                style={{ borderColor: "#e5e5e5" }}
              />
            </div>
          </div>
        </div>

        {/* Paso 5: Instalación */}
        <div>
          <StepLabel n={5} label="¿Necesitás instalación?" />
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={cfg.instalacion}
                onChange={e => setCfg(p => ({ ...p, instalacion: e.target.checked }))}
                className="w-4 h-4 accent-black" />
              <div>
                <p className="text-sm font-medium">Sí, quiero que lo instalen</p>
                <p className="text-xs text-neutral-500">Disponible en CABA y GBA · Se cobra por separado</p>
              </div>
            </label>

            <AnimatePresence>
              {cfg.instalacion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease }}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="¿En qué localidad? (ej: Palermo, Morón...)"
                    value={cfg.localidad}
                    onChange={e => setCfg(p => ({ ...p, localidad: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                    style={{ borderColor: "#e5e5e5" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Resultado de precio */}
        <AnimatePresence>
          {completo && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease }}
              className="rounded-2xl p-6 border"
              style={{ background: "#f9f9f9", borderColor: "#e5e5e5" }}
            >
              {precio.estandar ? (
                <>
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Puerta</span>
                      <span className="font-semibold">{fmtARS(precio.puerta!)}</span>
                    </div>
                    {cfg.instalacion && (
                      precio.instalacion ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Instalación en {cfg.localidad}</span>
                          <span className="font-semibold">{fmtARS(precio.instalacion)}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Instalación</span>
                          <span className="text-neutral-500 text-xs">Coordinar por WA (fuera de cobertura estándar)</span>
                        </div>
                      )
                    )}
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-lg">{fmtARS(precio.total!)}</span>
                    </div>
                  </div>

                  {/* Datos para el pago */}
                  <div className="flex flex-col gap-2 mb-5">
                    <input type="text" placeholder="Tu nombre"
                      value={nombre} onChange={e => setNombre(e.target.value)}
                      className="border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                      style={{ borderColor: "#e5e5e5" }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="email" placeholder="Email"
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                        style={{ borderColor: "#e5e5e5" }}
                      />
                      <input type="tel" placeholder="WhatsApp"
                        value={telefono} onChange={e => setTelefono(e.target.value)}
                        className="border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black transition-colors"
                        style={{ borderColor: "#e5e5e5" }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePagar}
                    disabled={loading || !nombre || !email}
                    className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-opacity disabled:opacity-40"
                    style={{ background: "#0a0a0a", color: "#f5f4f0" }}
                  >
                    <ShoppingBag size={16} />
                    {loading ? "Procesando..." : "Pagar con Mercado Pago · Hasta 6 cuotas"}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-neutral-600">
                    {precio.mensaje ?? "Esta configuración necesita una cotización personalizada."}
                  </p>
                  <a href={waMsg()} target="_blank" rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm"
                    style={{ background: "#25D366", color: "#fff" }}>
                    <MessageCircle size={16} />
                    Pedir cotización por WhatsApp
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
