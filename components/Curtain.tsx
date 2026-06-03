"use client"
import { useRef, useEffect } from "react"

// Curtain wipe — clip-path de 100%→0% al entrar en viewport
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

    // Pequeño delay antes de activar la transición
    if (delay > 0) {
      el.style.transitionDelay = `${delay}s`
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.clipPath = "inset(0 0 0% 0)"
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
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
