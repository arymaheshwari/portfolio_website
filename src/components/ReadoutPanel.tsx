import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CareerNode } from '../data/career'
import { kindColor } from './CareerNodeCard'

function renderDetail(text: string) {
  return text.split('\n\n').map((para, i) => {
    const parts = para.split(/\*\*(.*?)\*\*/g)
    return (
      <p key={i} style={{ margin: '0 0 14px', lineHeight: 1.75 }}>
        {parts.map((part, j) =>
          j % 2 === 1
            ? <strong key={j} style={{ color: 'var(--color-heading)', fontWeight: 600 }}>{part}</strong>
            : part
        )}
      </p>
    )
  })
}

type Props = {
  node:    CareerNode | null
  onClose: () => void
}

export function ReadoutPanel({ node, onClose }: Props) {
  const closeRef  = useRef<HTMLButtonElement>(null)
  const panelRef  = useRef<HTMLDivElement>(null)

  // Focus the close button when panel opens
  useEffect(() => {
    if (node) {
      const t = setTimeout(() => closeRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [node?.id]) // eslint-disable-line

  // Escape key closes the panel
  useEffect(() => {
    if (!node) return
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [node, onClose])

  // Focus trap: Tab/Shift+Tab cycles within panel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const els = [...focusable]
    if (els.length === 0) return
    const first = els[0], last = els[els.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus()
    }
  }

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed', inset: 0, zIndex: 90,
              background: 'rgba(8,10,14,0.55)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          <motion.aside
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="readout-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            onKeyDown={handleKeyDown}
            style={{
              position:   'fixed',
              top: 0, right: 0,
              width:      'min(430px, 100vw)',
              height:     '100vh',
              background: 'linear-gradient(160deg, var(--color-surface-2) 0%, var(--color-surface) 55%, #0e1219 100%)',
              borderLeft: `1px solid ${kindColor[node.kind]}40`,
              boxShadow:  `-24px 0 60px rgba(0,0,0,0.55), inset 1px 0 0 ${kindColor[node.kind]}30`,
              overflowY:  'auto',
              zIndex:     100,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {/* Sticky top bar */}
            <div style={{
              position:        'sticky',
              top: 0,
              background:      'rgba(18, 21, 28, 0.82)',
              backdropFilter:  'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderBottom:    '1px solid var(--color-border)',
              padding:         '14px 20px',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'space-between',
              zIndex: 1,
            }}>
              <span style={{ fontSize: '10px', letterSpacing: '0.14em', color: kindColor[node.kind] }}>
                {node.kind.toUpperCase()} · SECTOR READOUT
              </span>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close readout panel"
                style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)',
                  color: 'var(--color-text)', borderRadius: '6px',
                  padding: '5px 13px', cursor: 'pointer',
                  fontSize: '10px', letterSpacing: '0.1em',
                  fontFamily: 'var(--font-mono)',
                  transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-heading)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text)' }}
              >
                CLOSE
              </button>
            </div>

            <div style={{ padding: '24px 24px 40px' }}>
              {/* Portrait (résumé / output node) */}
              {node.image && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <img
                    src={node.image}
                    alt={node.title}
                    onError={e => {
                      const t = e.currentTarget
                      if (!t.src.endsWith('/profile-placeholder.svg')) t.src = '/profile-placeholder.svg'
                    }}
                    style={{
                      width: '128px', height: '128px', borderRadius: '50%', objectFit: 'cover',
                      border: `2px solid ${kindColor[node.kind]}`,
                      boxShadow: `0 0 28px ${kindColor[node.kind]}55, 0 6px 20px rgba(0,0,0,0.5)`,
                    }}
                  />
                </div>
              )}

              {/* Title */}
              <h2
                id="readout-title"
                style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-heading)', margin: '0 0 6px', lineHeight: 1.25 }}
              >
                {node.title}
              </h2>

              {node.org && (
                <div style={{ fontSize: '13px', color: 'var(--color-text)', marginBottom: '6px', opacity: 0.75 }}>
                  {node.org}
                </div>
              )}

              <div style={{ fontSize: '11px', color: 'var(--color-text-dim)', letterSpacing: '0.06em', marginBottom: '28px' }}>
                {node.start.slice(0, 7)} – {node.end ? node.end.slice(0, 7) : 'PRESENT'}
              </div>

              {/* Detail */}
              <div style={{ fontSize: '13px', color: 'var(--color-text)', marginBottom: '28px' }}>
                {renderDetail(node.detail)}
              </div>

              {/* Telemetry channels */}
              <section aria-label="Technology stack" style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'var(--color-text-dim)', marginBottom: '10px' }}>
                  TELEMETRY CHANNELS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {node.stack.map(s => (
                    <span key={s} style={{
                      fontSize: '11px', background: 'var(--color-chrome)',
                      color: 'var(--color-heading)', border: '1px solid var(--color-border)',
                      borderRadius: '6px', padding: '4px 10px',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              {/* Feeds */}
              {node.feeds && (
                <section aria-label="Feeds into" style={{
                  borderLeft: `2px solid ${kindColor[node.kind]}40`,
                  paddingLeft: '14px', marginBottom: '28px',
                }}>
                  <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'var(--color-text-dim)', marginBottom: '8px' }}>
                    FEEDS →
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text)', lineHeight: 1.7, margin: 0 }}>
                    {node.feeds}
                  </p>
                </section>
              )}

              {/* Links */}
              {node.links && node.links.length > 0 && (
                <section aria-label="References">
                  <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'var(--color-text-dim)', marginBottom: '10px' }}>
                    REFERENCES
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {node.links.map(link => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: 'var(--color-accent)', textDecoration: 'none' }}
                      >
                        → {link.label}
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
