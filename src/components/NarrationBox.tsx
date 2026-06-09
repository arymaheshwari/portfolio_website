import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CareerNode } from '../data/career'
import { narratedSteps, TYPE_SPEED_MS } from '../lib/executionEngine'
import { kindColor } from './CareerNodeCard'

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Reveals `text` character-by-character; restarts whenever the text changes.
function useTypewriter(text: string, speed = 26) {
  const [out, setOut] = useState('')
  useEffect(() => {
    if (!text || prefersReducedMotion) { setOut(text); return }
    setOut('')
    let i = 0
    const id = setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return out
}

export function NarrationBox({ node }: { node: CareerNode | null }) {
  const text  = node?.narration ?? node?.summary ?? ''
  const typed = useTypewriter(text, TYPE_SPEED_MS)
  const color = node ? kindColor[node.kind] : '#FF8700'
  const step  = node ? narratedSteps.indexOf(node.id) + 1 : 0

  return (
    <div
      style={{
        position: 'fixed', bottom: '24px', left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(580px, 92vw)', zIndex: 60, pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {node && (
          <motion.div
            key={node.id}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            style={{
              background: 'linear-gradient(160deg, rgba(24,28,38,0.96) 0%, rgba(14,17,24,0.96) 100%)',
              border: '1px solid var(--color-border)',
              borderTop: `2px solid ${color}`,
              borderRadius: '12px',
              padding: '14px 18px',
              fontFamily: 'var(--font-mono)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: `0 18px 50px rgba(0,0,0,0.6), 0 0 28px ${color}22`,
            }}
          >
            {/* label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
              <span aria-hidden="true" style={{
                width: '8px', height: '8px', borderRadius: '50%', background: color,
                boxShadow: `0 0 8px ${color}`, flexShrink: 0,
              }} />
              <span style={{ fontSize: '9px', letterSpacing: '0.16em', color, fontWeight: 600 }}>
                {node.kind.toUpperCase()}
              </span>
              <span style={{ fontSize: '9px', letterSpacing: '0.1em', color: 'var(--color-text-dim)' }}>
                · {node.title}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '9px', color: 'var(--color-text-dim)', fontVariantNumeric: 'tabular-nums' }}>
                {step.toString().padStart(2, '0')}/{narratedSteps.length}
              </span>
            </div>

            {/* typed narration */}
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, color: 'var(--color-heading)' }}>
              {typed}
              <span className="status-blink" style={{ color, marginLeft: '1px' }}>▋</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
