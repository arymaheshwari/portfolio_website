import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { CareerNode, NodeKind } from '../data/career'
import type { NodeExecState } from '../lib/executionEngine'
import { TelemetryTrace } from './TelemetryTrace'

const kindLabel: Record<NodeKind, string> = {
  edu:        'EDU',
  coursework: 'COURSE',
  research:   'RESEARCH',
  industry:   'INDUSTRY',
  project:    'PROJECT',
}

export const kindColor: Record<NodeKind, string> = {
  edu:        '#FF8700',
  coursework: '#60A5FA',
  research:   '#A78BFA',
  industry:   '#34D399',
  project:    '#22D3EE',
}

export type CareerNodeData = CareerNode & {
  isSelected:    boolean
  isConvergence: boolean
  execState:     NodeExecState
  onActivate:    () => void
}

export type CareerNodeType = Node<CareerNodeData, 'career'>

const stateLabel: Record<NodeExecState, string> = {
  idle:     '● IDLE',
  active:   '▶ EXECUTING',
  complete: '✓ DONE',
}

export function CareerNodeCard({ data }: NodeProps<CareerNodeType>) {
  const color     = kindColor[data.kind]
  const execState = data.execState ?? 'idle'
  const isActive  = execState === 'active'
  const isDone    = execState === 'complete'
  const width     = data.isConvergence ? 244 : 220
  const traceW    = width - 28

  const statusColor = isActive ? color : isDone ? '#34D399' : 'var(--color-text-dim)'

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

      {/* tabIndex={0} since we set nodesFocusable={false} on <ReactFlow> */}
      <div
        tabIndex={0}
        role="button"
        className={`career-node-inner${isActive ? ' node-executing' : ''}`}
        aria-label={[
          data.title,
          data.org,
          `${data.start.slice(0, 7)} to ${data.end ? data.end.slice(0, 7) : 'present'}`,
          `status: ${execState}`,
          'activate to view full readout',
        ].filter(Boolean).join(', ')}
        aria-expanded={data.isSelected}
        aria-pressed={data.isSelected}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            data.onActivate()
          }
        }}
        style={{
          background:    isActive ? '#161b28' : isDone ? '#13181f' : 'var(--color-surface)',
          border:        `1px solid ${data.isSelected ? color + 'CC' : isActive ? color + '60' : 'var(--color-border)'}`,
          borderLeft:    `3px solid ${color}`,
          borderRadius:  '4px',
          padding:       '12px 14px',
          width:         `${width}px`,
          cursor:        'pointer',
          transition:    'background 0.3s, border-color 0.3s, box-shadow 0.3s',
          boxShadow:     data.isSelected
            ? `0 0 20px ${color}30`
            : isDone
            ? `0 0 10px ${color}12`
            : 'none',
          fontFamily:    'var(--font-mono)',
          ['--glow-dim' as string]:    `${color}20`,
          ['--glow-bright' as string]: `${color}55`,
        }}
      >
        {/* Kind badge + convergence tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.14em', color, opacity: 0.85 }}>
            {kindLabel[data.kind]}
          </span>
          {data.isConvergence && (
            <span aria-label="convergence node" style={{
              fontSize: '8px', letterSpacing: '0.1em', color, opacity: 0.65,
              border: `1px solid ${color}45`, borderRadius: '2px', padding: '1px 5px',
            }}>
              CONVERGENCE
            </span>
          )}
        </div>

        {/* Title */}
        <div style={{
          fontSize:     data.isConvergence ? '14px' : '13px',
          fontWeight:   600,
          color:        isDone || isActive ? 'var(--color-heading)' : '#B0B8C8',
          lineHeight:   1.3,
          marginBottom: '4px',
          transition:   'color 0.3s',
        }}>
          {data.title}
        </div>

        {data.org && (
          <div style={{ fontSize: '11px', color: 'var(--color-text)', marginBottom: '6px', opacity: 0.65, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data.org}
          </div>
        )}

        <div style={{ fontSize: '10px', color: 'var(--color-text-dim)', marginBottom: '9px', letterSpacing: '0.05em' }}>
          {data.start.slice(0, 7)} – {data.end ? data.end.slice(0, 7) : 'PRESENT'}
        </div>

        {/* Stack chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '10px' }} aria-label={`Stack: ${data.stack.join(', ')}`}>
          {data.stack.slice(0, 4).map(s => (
            <span key={s} style={{
              fontSize:   '9px',
              background: isActive ? `${color}18` : 'var(--color-chrome)',
              color:      isActive ? color : 'var(--color-text)',
              border:     `1px solid ${isActive ? color + '40' : 'var(--color-border)'}`,
              borderRadius:'2px', padding: '2px 5px',
              transition: 'all 0.3s',
            }}>
              {s}
            </span>
          ))}
          {data.stack.length > 4 && (
            <span style={{ fontSize: '9px', color: 'var(--color-text-dim)', padding: '2px 4px' }}>
              +{data.stack.length - 4}
            </span>
          )}
        </div>

        <TelemetryTrace node={data} width={traceW} isActive={isActive} isDone={isDone} />

        {/* Status */}
        <div style={{ marginTop: '8px', fontSize: '8px', letterSpacing: '0.14em', color: statusColor, transition: 'color 0.3s' }}>
          <span className={isActive ? 'status-blink' : ''}>{stateLabel[execState]}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </>
  )
}
