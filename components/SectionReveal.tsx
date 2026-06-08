"use client"
import { useRef, useEffect } from "react"

// Wrapper que aplica fade-up a la sección cuando entra en viewport.
// Funciona con scroll nativo (mobile) y SmoothScroll (desktop).
export default function SectionReveal({ children, className, style, delay = 0 }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add("section-hidden")
    if (delay) el.style.transitionDelay = `${delay}s`

    let done = false
    const reveal = () => {
      if (done) return
      done = true
      el.classList.remove("section-hidden")
      el.classList.add("section-visible")
      window.removeEventListener("scroll", check)
    }
    const check = () => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) reveal()
    }

    check()
    window.addEventListener("scroll", check, { passive: true })
    const t = setTimeout(reveal, 2500) // fallback
    return () => { window.removeEventListener("scroll", check); clearTimeout(t) }
  }, [delay])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
