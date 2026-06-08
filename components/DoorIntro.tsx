"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export default function DoorIntro() {
  const [visible,  setVisible]  = useState(false)
  const [opening,  setOpening]  = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    if (sessionStorage.getItem("jk_intro_seen")) return

    setVisible(true)
    document.body.style.overflow = "hidden"

    const t1 = setTimeout(() => setOpening(true), 900)
    const t2 = setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ""
      sessionStorage.setItem("jk_intro_seen", "1")
    }, 2100)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const transition = { duration: 1.1, ease: [0.77, 0, 0.175, 1] as [number, number, number, number] }

  return (
    <AnimatePresence>
      {visible && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", pointerEvents: "all" }}>

          {/* ── Panel izquierdo ── */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: opening ? "-100%" : 0 }}
            transition={transition}
            style={{
              flex: 1,
              background: "#0a0a0a",
              position: "relative",
              overflow: "hidden",
              borderRight: "1px solid #1e1e1e",
            }}
          >
            {/* Mitad izquierda de la puerta — slow zoom */}
            <motion.div
              initial={{ scale: 1.08 }}
              animate={{ scale: opening ? 1.12 : 1.08 }}
              transition={{ duration: 2.5, ease: "easeIn" }}
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "url(/puerta-granero.webp)",
                backgroundSize: "200% 100%",
                backgroundPosition: "left center",
                opacity: 0.28,
                filter: "grayscale(0.4) brightness(0.9)",
              }}
            />

            {/* Vignette lateral derecha — fade hacia el centro */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, rgba(10,10,10,0.6) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />

            {/* Texto */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: "52px",
            }}>
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: opening ? 0 : 1, x: opening ? -8 : 0 }}
                transition={{ duration: 0.4, delay: opening ? 0 : 0.25 }}
                style={{ textAlign: "right" }}
              >
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
                  color: "#f5f4f0",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  fontWeight: 300,
                }}>
                  Diseños <span style={{ color: "#666" }}>JK</span>
                </p>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#555",
                  marginTop: "10px",
                }}>
                  Fabricantes directos · CABA y GBA
                </p>
              </motion.div>
            </div>

            {/* Handle izquierdo */}
            <div style={{
              position: "absolute", right: "16px", top: "50%",
              transform: "translateY(-50%)",
              width: "3px", height: "48px",
              background: "#2a2a2a", borderRadius: "2px",
            }} />
          </motion.div>

          {/* ── Panel derecho ── */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: opening ? "100%" : 0 }}
            transition={transition}
            style={{
              flex: 1,
              background: "#0a0a0a",
              position: "relative",
              overflow: "hidden",
              borderLeft: "1px solid #1e1e1e",
            }}
          >
            {/* Mitad derecha de la puerta */}
            <motion.div
              initial={{ scale: 1.08 }}
              animate={{ scale: opening ? 1.12 : 1.08 }}
              transition={{ duration: 2.5, ease: "easeIn" }}
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "url(/puerta-granero.webp)",
                backgroundSize: "200% 100%",
                backgroundPosition: "right center",
                opacity: 0.28,
                filter: "grayscale(0.4) brightness(0.9)",
              }}
            />

            {/* Vignette lateral izquierda */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to left, rgba(10,10,10,0.6) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />

            {/* Handle derecho */}
            <div style={{
              position: "absolute", left: "16px", top: "50%",
              transform: "translateY(-50%)",
              width: "3px", height: "48px",
              background: "#2a2a2a", borderRadius: "2px",
            }} />
          </motion.div>

          {/* ── Línea central — junta las dos hojas ── */}
          <div style={{
            position: "absolute",
            left: "50%", top: 0, bottom: 0,
            width: "1px",
            background: "linear-gradient(to bottom, transparent 0%, #333 20%, #333 80%, transparent 100%)",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }} />

        </div>
      )}
    </AnimatePresence>
  )
}
