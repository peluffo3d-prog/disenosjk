"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const VIDEO_URL = "https://videos.pexels.com/video-files/10531277/10531277-hd_1080_1920_24fps.mp4"

export default function DoorIntro() {
  const [visible,   setVisible]   = useState(false)
  const [opening,   setOpening]   = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    if (sessionStorage.getItem("jk_intro_seen")) return

    setVisible(true)
    document.body.style.overflow = "hidden"

    const t1 = setTimeout(() => setOpening(true), 1000)
    const t2 = setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ""
      sessionStorage.setItem("jk_intro_seen", "1")
    }, 2200)

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
            {/* Video de fondo — misma técnica que laser cut */}
            <video
              autoPlay muted loop playsInline
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                minWidth: "200%", minHeight: "100%",
                width: "auto", height: "auto",
                mixBlendMode: "screen",
                opacity: 0.32,
                filter: "brightness(0.9) contrast(1.1)",
                pointerEvents: "none",
                objectPosition: "right center",
              }}
            >
              <source src={VIDEO_URL} type="video/mp4" />
            </video>

            {/* Texto */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: "52px",
              zIndex: 1,
            }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: opening ? 0 : 1 }}
                transition={{ duration: 0.3, delay: opening ? 0 : 0.3 }}
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
                  Diseños <span style={{ color: "#555" }}>JK</span>
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

            {/* Handle */}
            <div style={{
              position: "absolute", right: "16px", top: "50%",
              transform: "translateY(-50%)",
              width: "3px", height: "48px",
              background: "#2a2a2a", borderRadius: "2px",
              zIndex: 1,
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
            {/* Mismo video, espejado */}
            <video
              autoPlay muted loop playsInline
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%) scaleX(-1)",
                minWidth: "200%", minHeight: "100%",
                width: "auto", height: "auto",
                mixBlendMode: "screen",
                opacity: 0.32,
                filter: "brightness(0.9) contrast(1.1)",
                pointerEvents: "none",
              }}
            >
              <source src={VIDEO_URL} type="video/mp4" />
            </video>

            {/* Handle */}
            <div style={{
              position: "absolute", left: "16px", top: "50%",
              transform: "translateY(-50%)",
              width: "3px", height: "48px",
              background: "#2a2a2a", borderRadius: "2px",
              zIndex: 1,
            }} />
          </motion.div>

          {/* Línea central */}
          <div style={{
            position: "absolute",
            left: "50%", top: 0, bottom: 0,
            width: "1px",
            background: "linear-gradient(to bottom, transparent 0%, #333 20%, #333 80%, transparent 100%)",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 2,
          }} />

        </div>
      )}
    </AnimatePresence>
  )
}
