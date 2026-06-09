import type { NodeKind } from '../data/career'
import { kindColor } from './CareerNodeCard'

// Each career "kind" is framed as a tyre compound — gives the node colours meaning.
const COMPOUNDS: { kind: NodeKind; code: string; label: string }[] = [
  { kind: 'edu',        code: 'C1', label: 'EDUCATION' },
  { kind: 'coursework', code: 'C2', label: 'COURSEWORK' },
  { kind: 'research',   code: 'C3', label: 'RESEARCH' },
  { kind: 'industry',   code: 'C4', label: 'INDUSTRY' },
  { kind: 'project',    code: 'C5', label: 'PROJECT' },
]

export function CompoundLegend() {
  return (
    <div style={{
      background:    'linear-gradient(160deg, rgba(22,26,35,0.93) 0%, rgba(14,17,24,0.93) 100%)',
      border:        '1px solid var(--color-border)',
      borderRadius:  '10px',
      overflow:      'hidden',
      fontFamily:    'var(--font-mono)',
      backdropFilter:'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow:     '0 12px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      <div style={{
        padding:      '8px 12px',
        borderBottom: '1px solid var(--color-border)',
        background:   'rgba(255,255,255,0.02)',
        fontSize:     '9px', letterSpacing: '0.18em', color: 'var(--color-heading)', fontWeight: 600,
      }}>
        COMPOUNDS
      </div>

      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {COMPOUNDS.map(c => {
          const color = kindColor[c.kind]
          return (
            <div key={c.kind} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* compound ring */}
              <span aria-hidden="true" style={{
                width: '13px', height: '13px', borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${color}`,
                boxShadow: `0 0 6px ${color}70, inset 0 0 4px ${color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '6px', fontWeight: 700, color,
              }}>
                {c.code}
              </span>
              <span style={{ fontSize: '9px', letterSpacing: '0.1em', color: 'var(--color-text)' }}>
                {c.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
