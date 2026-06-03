"use client"
import { useRef, useEffect } from "react"

// Cada línea de texto sube desde translateY(108%) → 0, stagger de 0.12s
// Pasar el texto con \n para separar líneas manualmente
export default function SplitLines({
  children,
  style,
  className,
  baseDelay = 0,
}: {
  children: string
  style?: React.CSSProperties
  className?: string
  baseDelay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const inners = el.querySelectorAll<HTMLElement>(".sl-i")

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inners.forEach((s, i) => {
            s.style.transform = "translateY(0)"
            s.style.opacity   = "1"
            s.style.transitionDelay = `${baseDelay + i * 0.12}s`
          })
          obs.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [baseDelay])

  const lines = children.split("\n").filter(l => l.trim() !== "")

  return (
    <div ref={ref} className={className} style={{ ...style }}>
      {lines.map((line, i) => (
        <span
          key={i}
          style={{ display: "block", overflow: "hidden", lineHeight: "inherit" }}
        >
          <span
            className="sl-i"
            style={{
              display:    "block",
              transform:  "translateY(108%)",
              opacity:    0,
              transition: "transform 0.95s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.5s ease",
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </div>
  )
}
