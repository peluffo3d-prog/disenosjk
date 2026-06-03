"use client"
export const dynamic = "force-dynamic"
import { useState } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("Email o contraseña incorrectos.")
      setLoading(false)
      return
    }
    router.replace("/dashboard")
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Panel izquierdo — tipografía */}
      <div
        className="hidden md:flex flex-col justify-between w-1/2 p-12"
        style={{ background: "#0a0a0a", color: "#f5f4f0" }}
      >
        <p
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: "#555" }}
        >
          Diseños JK
        </p>
        <div>
          <h1
            className="font-display leading-none mb-6"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontFamily: "var(--font-display)" }}
          >
            Panel de<br />control.
          </h1>
          <p
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: "#555" }}
          >
            Acceso restringido · Solo administradores
          </p>
        </div>
        <p
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: "#333" }}
        >
          disenosjk.com.ar
        </p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 md:px-16">
        <p
          className="font-mono text-xs uppercase tracking-widest mb-10 md:hidden"
          style={{ color: "#888" }}
        >
          Diseños JK · Panel de control
        </p>

        <h2
          className="font-display mb-8 leading-none"
          style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontFamily: "var(--font-display)" }}
        >
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="border border-black px-4 py-3 text-sm outline-none focus:bg-neutral-50 transition-colors"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="border border-black px-4 py-3 text-sm outline-none focus:bg-neutral-50 transition-colors"
              style={{ borderRadius: 0 }}
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-red-600 uppercase tracking-widest">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-3.5 font-semibold text-sm transition-opacity disabled:opacity-40"
            style={{
              background: "#0a0a0a",
              color: "#f5f4f0",
              borderRadius: 0,
            }}
          >
            {loading ? "Entrando..." : "Entrar →"}
          </button>
        </form>
      </div>
    </div>
  )
}
