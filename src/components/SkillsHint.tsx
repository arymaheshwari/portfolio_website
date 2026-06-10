import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  visible:   boolean
  onDismiss: () => void
}

/**
 * Small, dismissible nudge that points the visitor at the Skills panel.
 * Styled like the narration box; sits just left of Skills while the wall is idle.
 * Non-blocking: it's removed when a skill is hovered, a node is clicked, or × is pressed.
 */
export function SkillsHint({ visible, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          style={{
            width: '216px',
            background: 'linear-gradient(160deg, rgba(24,28,38,0.96) 0%, rgba(14,17,24,0.96) 100%)',
            border: '1px solid var(--color-border)',
            borderTop: '2px solid var(--color-accent)',
            borderRadius: '12px',
            padding: '11px 12px 10px 14px',
            fontFamily: 'var(--font-mono)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 14px 40px rgba(0,0,0,0.5), 0 0 22px rgba(255,135,0,0.14)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '11px', lineHeight: 1.55, color: 'var(--color-text)' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Tip:</span>{' '}
              hover a skill to see where I applied it.
            </span>
            <button
              onClick={onDismiss}
              aria-label="Dismiss tip"
              style={{
                marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-text-dim)', fontSize: '15px', lineHeight: 1,
                padding: '0 0 0 4px', flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-heading)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-dim)')}
            >
              ×
            </button>
          </div>
          <div style={{ marginTop: '6px', fontSize: '8px', letterSpacing: '0.2em', color: 'var(--color-text-dim)', textAlign: 'right' }}>
            SKILLS →
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
