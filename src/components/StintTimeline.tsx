import type { CareerNode } from '../data/career'
import type { NodeExecState } from '../lib/executionEngine'
import { topoOrder } from '../lib/executionEngine'
import { nodes as careerNodes } from '../data/career'
import { kindColor } from './CareerNodeCard'
import { TelemetryTrace } from './TelemetryTrace'

type Props = {
  nodeStates:     Map<string, NodeExecState>
  activeSectorId: string | null
  selectedNode:   CareerNode | null
  onSelect:       (node: CareerNode | null) => void
}

export function StintTimeline({ nodeStates, selectedNode, onSelect }: Props) {
  return (
    <main
      id="stint-timeline"
      aria-label="Career timeline — each entry is a career sector"
      style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 48px' }}
    >
      <div style={{ position: 'relative' }}>
        {/* Vertical track spine */}
        <div aria-hidden="true" style={{
          position:   'absolute',
          left:       '14px',
          top:        '24px',
          bottom:     '24px',
          width:      '2px',
          background: 'var(--color-border)',
        }} />

        {topoOrder.map(id => {
          const node      = careerNodes.find(n => n.id === id)!
          const execState = nodeStates.get(id) ?? 'idle'
          const color     = kindColor[node.kind]
          const isActive  = execState === 'active'
          const isDone    = execState === 'complete'
          const isSelected = selectedNode?.id === id

          return (
            <div key={id} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '10px', position: 'relative' }}>

              {/* Track sector dot */}
              <div aria-hidden="true" style={{
                width: '30px', flexShrink: 0,
                display: 'flex', justifyContent: 'center',
                paddingTop: '22px', zIndex: 1,
              }}>
                <div
                  className={isActive ? 'node-executing' : ''}
                  style={{
                    width:        isActive ? '12px' : '8px',
                    height:       isActive ? '12px' : '8px',
                    borderRadius: '50%',
                    background:   isDone || isActive ? color : 'var(--color-border)',
                    boxShadow:    isActive ? `0 0 10px ${color}90` : 'none',
                    transition:   'all 0.3s',
                    ['--glow-dim' as string]:    `${color}20`,
                    ['--glow-bright' as string]: `${color}60`,
                  }}
                />
              </div>

              {/* Card */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isSelected}
                aria-label={`${node.title}${node.org ? `, ${node.org}` : ''}. ${execState}. Activate to view details.`}
                onClick={() => onSelect(isSelected ? null : node)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(isSelected ? null : node) }
                }}
                style={{
                  flex:        1,
                  background:  isSelected
                    ? 'linear-gradient(155deg, #1a2030 0%, #12161f 100%)'
                    : isActive
                    ? 'linear-gradient(155deg, #19202e 0%, #12161f 100%)'
                    : isDone
                    ? 'linear-gradient(155deg, #161b24 0%, #11151c 100%)'
                    : 'linear-gradient(155deg, var(--color-surface-2) 0%, var(--color-surface) 100%)',
                  border:      `1px solid ${isSelected ? color + 'AA' : isActive ? color + '55' : 'var(--color-border)'}`,
                  borderLeft:  `3px solid ${color}`,
                  borderRadius:'9px',
                  padding:     '12px 14px',
                  cursor:      'pointer',
                  fontFamily:  'var(--font-mono)',
                  transition:  'background 0.3s, border-color 0.3s, box-shadow 0.3s',
                  boxShadow:   isActive
                    ? `0 0 18px ${color}22, 0 3px 12px rgba(0,0,0,0.35)`
                    : isSelected
                    ? `0 0 0 1px ${color}40, 0 6px 20px ${color}1f`
                    : '0 2px 10px rgba(0,0,0,0.3)',
                  textAlign:   'left',
                }}
              >
                <div style={{ fontSize: '9px', color, letterSpacing: '0.14em', marginBottom: '5px', opacity: 0.85 }}>
                  {node.kind.toUpperCase()}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.3, marginBottom: '4px', color: isDone || isActive ? 'var(--color-heading)' : '#B0B8C8', transition: 'color 0.3s' }}>
                  {node.title}
                </div>
                {node.org && (
                  <div style={{ fontSize: '11px', color: 'var(--color-text)', opacity: 0.65, marginBottom: '4px' }}>
                    {node.org}
                  </div>
                )}
                <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginBottom: '8px' }}>
                  {node.start.slice(0, 7)} – {node.end ? node.end.slice(0, 7) : 'PRESENT'}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '8px' }}>
                  {node.stack.slice(0, 5).map(s => (
                    <span key={s} style={{
                      fontSize: '9px', background: 'var(--color-chrome)',
                      color: 'var(--color-text)', border: '1px solid var(--color-border)',
                      borderRadius: '4px', padding: '2px 6px',
                    }}>
                      {s}
                    </span>
                  ))}
                  {node.stack.length > 5 && (
                    <span style={{ fontSize: '9px', color: 'var(--color-text-dim)', padding: '2px 4px' }}>
                      +{node.stack.length - 5}
                    </span>
                  )}
                </div>

                <TelemetryTrace node={node} width={200} isActive={isActive} isDone={isDone} />

                <div style={{ marginTop: '6px', fontSize: '8px', letterSpacing: '0.14em', color: isActive ? color : isDone ? '#34D399' : 'var(--color-text-dim)' }}>
                  {isActive ? '▶ EXECUTING' : isDone ? '✓ DONE' : '● IDLE'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
