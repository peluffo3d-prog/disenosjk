"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export default function DoorIntro() {
  const [shouldShow] = useState<boolean>(() => {
    try { return !sessionStorage.getItem("jk_intro_seen") } catch { return false }
  })
  const [visible,  setVisible]  = useState(shouldShow)
  const [opening,  setOpening]  = useState(false)

  useEffect(() => {
    if (!shouldShow) return
    document.body.style.overflow = "hidden"
    const t1 = setTimeout(() => setOpening(true), 750)
    const t2 = setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ""
      sessionStorage.setItem("jk_intro_seen", "1")
    }, 1900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [shouldShow])

  const panelVariants = {
    closed: { x: 0 },
    open:   { x: "100%" },
  }
  const panelLeft = {
    closed: { x: 0 },
    open:   { x: "-100%" },
  }
  const transition = { duration: 1.05, ease: [0.77, 0, 0.175, 1] as [number, number, number, number] }

  return (
    <AnimatePresence>
      {visible && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", pointerEvents: "all" }}>
          {/* Panel izquierdo */}
          <motion.div
            initial="closed"
            animate={opening ? "open" : "closed"}
            variants={panelLeft}
            transition={transition}
            style={{
              flex: 1,
              background: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: "40px",
              borderRight: "1px solid #1a1a1a",
              position: "relative",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                color: "#f5f4f0",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}>
                Diseños <span style={{ color: "#555" }}>JK</span>
              </p>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#444",
                marginTop: "10px",
              }}>
                Fabricantes directos · CABA y GBA
              </p>
            </div>
            {/* Handle */}
            <div style={{
              position: "absolute", right: "14px", top: "50%",
              transform: "translateY(-50%)",
              width: "4px", height: "52px",
              background: "#2a2a2a", borderRadius: "2px",
            }} />
          </motion.div>

          {/* Panel derecho */}
          <motion.div
            initial="closed"
            animate={opening ? "open" : "closed"}
            variants={panelVariants}
            transition={transition}
            style={{
              flex: 1,
              background: "#0a0a0a",
              borderLeft: "1px solid #1a1a1a",
              position: "relative",
            }}
          >
            <div style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)",
              width: "4px", height: "52px",
              background: "#2a2a2a", borderRadius: "2px",
            }} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
