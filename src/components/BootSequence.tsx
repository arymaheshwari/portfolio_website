import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Minimal boot overlay shown once on load — just the name.
 * Self-dismisses after a beat; click or any key skips it.
 */
export function BootSequence({ onDone }: { onDone: () => void }) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const close = () => setClosing(true)
    const auto = setTimeout(close, 1900)
    const onKey = () => close()
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onKey)
    return () => {
      clearTimeout(auto)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onKey)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      onAnimationComplete={() => { if (closing) onDone() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'radial-gradient(circle at 50% 42%, #0e131c 0%, #070809 70%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '28px',
        fontFamily: 'var(--font-mono)',
        pointerEvents: closing ? 'none' : 'auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="wordmark-grad boot-flicker"
        style={{ fontSize: 'clamp(26px, 6.6vw, 48px)', fontWeight: 700, letterSpacing: '0.16em', padding: '0 16px', textAlign: 'center' }}
      >
        ARYAN MAHESHWARI
      </motion.div>

      {/* Loading bar */}
      <div style={{ width: 'min(420px, 76vw)' }}>
        <div style={{
          position: 'relative', height: '6px', borderRadius: '999px',
          background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.7, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #FF8700, #FFC766, #00FF87)',
              boxShadow: '0 0 14px rgba(255,135,0,0.6)',
            }}
          />
        </div>
      </div>

      {/* Skip hint */}
      <div className="status-blink" style={{ position: 'absolute', bottom: '40px', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--color-text-dim)' }}>
        PRESS ANY KEY TO SKIP
      </div>
    </motion.div>
  )
}
