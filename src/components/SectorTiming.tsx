import { nodes as careerNodes } from '../data/career'
import { topoOrder } from '../lib/executionEngine'
import { kindColor } from './CareerNodeCard'

function durationMonths(start: string, end?: string): number {
  const s = new Date(start)
  const e = end ? new Date(end) : new Date()
  return Math.max(1, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()))
}

function sectorTime(months: number): string {
  const m = Math.floor(months / 60)
  const s = months % 60
  return `${m}:${s.toString().padStart(2, '0')}.000`
}

type Props = {
  activeId?:    string | null
  completedIds?: Set<string>
}

export function SectorTiming({ activeId, completedIds = new Set() }: Props) {
  return (
    <div style={{
      background:    'rgba(18, 21, 28, 0.92)',
      border:        '1px solid var(--color-border)',
      borderRadius:  '4px',
      overflow:      'hidden',
      minWidth:      '260px',
      fontFamily:    'var(--font-mono)',
      backdropFilter:'blur(4px)',
    }}>
      <div style={{
        padding:       '7px 12px',
        borderBottom:  '1px solid var(--color-border)',
        fontSize:      '9px',
        letterSpacing: '0.14em',
        color:         'var(--color-text-dim)',
        display:       'flex',
        justifyContent:'space-between',
      }}>
        <span>SECTOR</span>
        <span>LAP TIME</span>
      </div>

      {topoOrder.map(id => {
        const node    = careerNodes.find(n => n.id === id)!
        const months  = durationMonths(node.start, node.end)
        const time    = sectorTime(months)
        const color   = kindColor[node.kind]
        const isActive = id === activeId
        const isDone   = completedIds.has(id)

        return (
          <div key={id} style={{
            padding:        '5px 12px',
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            gap:            '12px',
            borderBottom:   '1px solid #1a1e2a',
            background:     isActive ? `${color}14` : 'transparent',
            transition:     'background 0.25s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <div style={{
                width:      '3px',
                height:     '12px',
                borderRadius:'1px',
                background: color,
                opacity:    isActive ? 1 : isDone ? 0.65 : 0.2,
                flexShrink: 0,
                transition: 'opacity 0.25s',
              }} />
              <span style={{
                fontSize:      '10px',
                color:         isActive ? 'var(--color-heading)' : isDone ? 'var(--color-text)' : 'var(--color-text-dim)',
                letterSpacing: '0.04em',
                whiteSpace:    'nowrap',
                overflow:      'hidden',
                textOverflow:  'ellipsis',
                maxWidth:      '140px',
                transition:    'color 0.25s',
              }}>
                {node.title}
              </span>
            </div>
            <span style={{
              fontSize:           '10px',
              color:              isActive ? color : isDone ? 'var(--color-text)' : 'var(--color-text-dim)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing:      '0.04em',
              flexShrink:         0,
              transition:         'color 0.25s',
            }}>
              {time}
            </span>
          </div>
        )
      })}
    </div>
  )
}
