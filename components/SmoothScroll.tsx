"use client"
import { useRef, useEffect, useState } from "react"

// Lerp scroll estilo Garofoli — SOLO desktop con puntero fino.
// En mobile/touch renderiza el contenido normal (scroll nativo, todo clickeable).
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const cur       = useRef(0)
  const tgt       = useRef(0)
  const raf       = useRef(0)
  const [enabled, setEnabled] = useState(false)

  // Decide en el cliente si activar el smooth scroll (nunca en touch ni mobile)
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches
    const small  = window.matchMedia("(max-width: 768px)").matches
    if (!coarse && !small) setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const wrap   = wrapRef.current
    const spacer = spacerRef.current
    if (!wrap || !spacer) return

    // Sync spacer height = content height (para que el scrollbar nativo funcione)
    const ro = new ResizeObserver(() => {
      spacer.style.height = wrap.scrollHeight + "px"
    })
    ro.observe(wrap)

    const onScroll = () => { tgt.current = window.scrollY }
    window.addEventListener("scroll", onScroll, { passive: true })

    const tick = () => {
      cur.current += (tgt.current - cur.current) * 0.08
      if (Math.abs(tgt.current - cur.current) < 0.05) cur.current = tgt.current

      wrap.style.transform = `translateY(${-cur.current}px)`

      const parallaxEls = document.querySelectorAll<HTMLElement>("[data-parallax]")
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax ?? "0.5")
        el.style.transform = `translateY(${cur.current * speed}px) scale(1.08)`
      })

      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf.current)
    }
  }, [enabled])

  // Mobile / touch / SSR: render normal, scroll nativo, todo clickeable
  if (!enabled) return <>{children}</>

  // Desktop fino: smooth scroll con wrapper fijo
  return (
    <>
      <div ref={spacerRef} aria-hidden style={{ pointerEvents: "none", visibility: "hidden", width: "100%" }} />
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 1 }}>
        <div ref={wrapRef} style={{ willChange: "transform" }}>
          {children}
        </div>
      </div>
    </>
  )
}
