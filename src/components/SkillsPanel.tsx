import { skills } from '../data/skills'

type Props = {
  onHover: (ids: string[] | null) => void
}

export function SkillsPanel({ onHover }: Props) {
  return (
    <div style={{
      width:         '224px',
      maxHeight:     '78vh',
      display:       'flex',
      flexDirection: 'column',
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
        flexShrink:   0,
        display:      'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '10.5px', letterSpacing: '0.18em', color: 'var(--color-heading)', fontWeight: 600 }}>
          SKILLS
        </span>
        <span style={{ fontSize: '8px', letterSpacing: '0.14em', color: 'var(--color-accent)', textShadow: '0 0 10px rgba(255,135,0,0.55)' }}>
          HOVER TO TRACE
        </span>
      </div>

      <div
        style={{ overflowY: 'auto', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}
        onMouseLeave={() => onHover(null)}
      >
        {skills.map(s => (
          <button
            key={s.label}
            className="skill-row"
            onMouseEnter={() => onHover(s.nodeIds)}
            onFocus={() => onHover(s.nodeIds)}
            onBlur={() => onHover(null)}
            aria-label={`Highlight nodes using ${s.label}`}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
            <span className="skill-count">{s.nodeIds.length}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
