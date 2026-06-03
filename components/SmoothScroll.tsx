"use client"
import { useRef, useEffect } from "react"

// Lerp scroll estilo Garofoli — deshabilitado en touch (pointer: coarse)
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const cur       = useRef(0)
  const tgt       = useRef(0)
  const raf       = useRef(0)

  useEffect(() => {
    // Solo desktop — en touch el scroll nativo es más suave
    if (window.matchMedia("(pointer: coarse)").matches) return

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
      // Garofoli usa ~0.06-0.08
      cur.current += (tgt.current - cur.current) * 0.08
      if (Math.abs(tgt.current - cur.current) < 0.05) cur.current = tgt.current

      wrap.style.transform = `translateY(${-cur.current}px)`

      // Hero parallax — el elemento con data-parallax="0.5" se mueve a 0.5x
      // Net effect: wrapper va a -cur, el elemento va a +cur*speed
      // Resultado: elemento se mueve a velocidad (speed - 1) * cur → efecto parallax
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
  }, [])

  return (
    <>
      {/* Establece la altura de scroll nativo */}
      <div ref={spacerRef} aria-hidden style={{ pointerEvents: "none", visibility: "hidden", width: "100%" }} />

      {/* Viewport fijo — contenido se traduce dentro */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 1 }}>
        <div ref={wrapRef} style={{ willChange: "transform" }}>
          {children}
        </div>
      </div>
    </>
  )
}
