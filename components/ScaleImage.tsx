"use client"
import { useRef, useEffect } from "react"

// Imagen escala de 1.07 → 1 al entrar en viewport
export default function ScaleImage({
  children,
  style,
  className,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inner.style.transform = "scale(1)"
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(outer)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={outerRef} className={className} style={{ overflow: "hidden", ...style }}>
      <div
        ref={innerRef}
        style={{
          transform:    "scale(1.07)",
          transition:   "transform 1.4s cubic-bezier(0.76, 0, 0.24, 1)",
          willChange:   "transform",
          height:       "100%",
          width:        "100%",
        }}
      >
        {children}
      </div>
    </div>
  )
}
