import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CHANNELS = ['ENGINE', 'TELEMETRY', 'BRAKE TEMP', 'DAG CORE', 'TYRE PRESS']

/**
 * Telemetry "systems online" boot overlay shown once on load.
 * Self-dismisses after the sequence; click or any key skips it.
 */
export function BootSequence({ onDone }: { onDone: () => void }) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const close = () => setClosing(true)
    const auto = setTimeout(close, 2350)
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
        background: 'radial-gradient(circle at 50% 38%, #0e131c 0%, #070809 70%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '30px', fontFamily: 'var(--font-mono)',
        pointerEvents: closing ? 'none' : 'auto',
      }}
    >
      {/* Wordmark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        style={{ textAlign: 'center' }}
      >
        <div className="wordmark-grad boot-flicker" style={{ fontSize: 'clamp(24px, 6.2vw, 44px)', fontWeight: 700, letterSpacing: '0.16em', padding: '0 16px' }}>
          ARYAN MAHESHWARI
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ fontSize: '10px', letterSpacing: '0.42em', color: 'var(--color-text-dim)', marginTop: '10px' }}
        >
          TELEMETRY SYSTEMS INITIALISING
        </motion.div>
      </motion.div>

      {/* RPM sweep bar */}
      <div style={{ width: 'min(420px, 76vw)' }}>
        <div style={{
          position: 'relative', height: '6px', borderRadius: '999px',
          background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #FF8700, #FFC766, #00FF87)',
              boxShadow: '0 0 14px rgba(255,135,0,0.6)',
            }}
          />
        </div>
      </div>

      {/* Channels connecting */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', maxWidth: 'min(520px, 88vw)' }}>
        {CHANNELS.map((ch, i) => (
          <motion.div
            key={ch}
            initial={{ opacity: 0.15, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.26, duration: 0.4 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '9px', letterSpacing: '0.14em', color: 'var(--color-text)',
              border: '1px solid var(--color-border)', borderRadius: '6px',
              padding: '5px 10px', background: 'rgba(255,255,255,0.02)',
            }}
          >
            <motion.span
              initial={{ color: '#6B7A8F' }}
              animate={{ color: '#00FF87' }}
              transition={{ delay: 0.5 + i * 0.26 + 0.15 }}
              style={{ fontSize: '8px' }}
            >
              ●
            </motion.span>
            {ch}
          </motion.div>
        ))}
      </div>

      {/* Skip hint */}
      <div className="status-blink" style={{ position: 'absolute', bottom: '40px', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--color-text-dim)' }}>
        PRESS ANY KEY TO SKIP
      </div>
    </motion.div>
  )
}
