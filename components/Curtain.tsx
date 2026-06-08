"use client"
import { useRef, useEffect } from "react"

// Curtain wipe — clip-path de 100%→0% al entrar en viewport.
// Usa scroll + getBoundingClientRect (no IntersectionObserver) para que
// funcione dentro del wrapper transformado de SmoothScroll.
export default function Curtain({
  children,
  style,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (delay > 0) el.style.transitionDelay = `${delay}s`

    let done = false
    const reveal = () => {
      if (done) return
      done = true
      el.style.clipPath = "inset(0 0 0% 0)"
      window.removeEventListener("scroll", check)
    }
    const check = () => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) reveal()
    }

    check() // revela lo que ya está en viewport al montar
    window.addEventListener("scroll", check, { passive: true })
    // Fallback de seguridad: si algo falla, mostrar igual
    const t = setTimeout(reveal, 2500)

    return () => { window.removeEventListener("scroll", check); clearTimeout(t) }
  }, [delay])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: "inset(0 0 100% 0)",
        transition: `clip-path 1.1s cubic-bezier(0.76, 0, 0.24, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
