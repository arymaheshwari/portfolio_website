import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  type Node as RFNode,
  type Edge as RFEdge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { nodes as careerNodes, edges as careerEdges, type CareerNode } from '../data/career'
import { useExecution, topoOrder } from '../lib/executionEngine'
import { CareerNodeCard, type CareerNodeData } from './CareerNodeCard'
import { ReadoutPanel } from './ReadoutPanel'
import { SectorTiming } from './SectorTiming'
import { StintTimeline } from './StintTimeline'

const POSITIONS: Record<string, { x: number; y: number }> = {
  'edu':                { x: 0,    y: 250 },
  'coursework-systems': { x: 300,  y: 60  },
  'coursework-data':    { x: 300,  y: 400 },
  'wiscracing':         { x: 600,  y: 0   },
  'aeries':             { x: 600,  y: 280 },
  'ppt':                { x: 600,  y: 540 },
  'mockinterview':      { x: 900,  y: 100 },
  'hg':                 { x: 1180, y: 240 },
  'research':           { x: 1480, y: 200 },
}

const nodeTypes = { career: CareerNodeCard }

const inDegree = new Map<string, number>()
for (const e of careerEdges) inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1)
const convergenceIds = new Set([...inDegree.entries()].filter(([, d]) => d >= 3).map(([id]) => id))

type HoverState = { node: CareerNode; x: number; y: number }

// ── hooks ─────────────────────────────────────────────────────────────────────

function useClock() {
  const [tick, setTick] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 100)
    return () => clearInterval(id)
  }, [])
  const h  = tick.getHours().toString().padStart(2, '0')
  const m  = tick.getMinutes().toString().padStart(2, '0')
  const s  = tick.getSeconds().toString().padStart(2, '0')
  const ds = Math.floor(tick.getMilliseconds() / 100)
  return `${h}:${m}:${s}.${ds}`
}

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => window.innerWidth < bp)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${bp - 1}px)`)
    const fn  = (e: MediaQueryListEvent) => setMobile(e.matches)
    setMobile(mql.matches)
    mql.addEventListener('change', fn)
    return () => mql.removeEventListener('change', fn)
  }, [bp])
  return mobile
}

function formatElapsed(ms: number) {
  const s = ms / 1000
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`
}

// ── component ─────────────────────────────────────────────────────────────────

export function PitWall() {
  const {
    session, nodeStates, flowing, done,
    activeSectorId, completedIds,
    elapsedMs, run, reset, skip,
  } = useExecution()

  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null)
  const [hover, setHover]               = useState<HoverState | null>(null)
  const clock        = useClock()
  const isMobile     = useIsMobile()
  const hoverTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => { if (prefersReduced) skip() }, []) // eslint-disable-line

  const activeSector = activeSectorId ? careerNodes.find(n => n.id === activeSectorId) : null

  // Live-region message for screen readers
  const liveMsg = session === 'running' && activeSector
    ? `Executing: ${activeSector.title}`
    : session === 'complete'
    ? 'Lap complete. All sectors done.'
    : ''

  const handleNodeActivate = useCallback((nodeId: string) => {
    const n = careerNodes.find(c => c.id === nodeId)
    if (!n) return
    setSelectedNode(prev => (prev?.id === n.id ? null : n))
    setHover(null)
  }, [])

  const rfNodes: RFNode<CareerNodeData>[] = useMemo(() =>
    careerNodes.map(n => ({
      id:       n.id,
      type:     'career' as const,
      position: POSITIONS[n.id] ?? { x: 0, y: 0 },
      data: {
        ...n,
        isSelected:    selectedNode?.id === n.id,
        isConvergence: convergenceIds.has(n.id),
        execState:     nodeStates.get(n.id) ?? 'idle',
        onActivate:    () => handleNodeActivate(n.id),
      },
    })),
    [selectedNode, nodeStates, handleNodeActivate],
  )

  const rfEdges: RFEdge[] = useMemo(() =>
    careerEdges.map(e => {
      const id        = `${e.from}--${e.to}`
      const isFlowing = flowing.has(id)
      const isDone    = done.has(id)
      return {
        id,
        source:   e.from,
        target:   e.to,
        animated: isFlowing,
        style: {
          stroke:      isFlowing ? '#FF8700' : isDone ? '#4A6080' : '#3A4055',
          strokeWidth: isFlowing || isDone ? 2 : 1.5,
          transition:  'stroke 0.4s, stroke-width 0.4s',
        },
      }
    }),
    [flowing, done],
  )

  const handleNodeClick = useCallback((_: React.MouseEvent, node: RFNode) => {
    handleNodeActivate(node.id)
  }, [handleNodeActivate])

  const handleNodeMouseEnter = useCallback((event: React.MouseEvent, node: RFNode) => {
    if (selectedNode) return
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    const n = careerNodes.find(c => c.id === node.id)
    if (n) setHover({ node: n, x: event.clientX, y: event.clientY })
  }, [selectedNode])

  const handleNodeMouseLeave = useCallback(() => {
    hoverTimer.current = setTimeout(() => setHover(null), 80)
  }, [])

  // ── shared header ──────────────────────────────────────────────────────────
  const header = (
    <header style={{
      height:      '48px',
      background:  'var(--color-chrome)',
      borderBottom:'1px solid var(--color-border)',
      display:     'flex',
      alignItems:  'center',
      padding:     '0 16px',
      gap:         '12px',
      flexShrink:  0,
      fontFamily:  'var(--font-mono)',
      zIndex:      10,
    }}>
      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.16em', flexShrink: 0 }}>
        PIT WALL
      </span>

      <Div />

      {/* Session status — hidden label on narrow screens */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1, minWidth: 0 }}>
        {session === 'idle' && (
          <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', letterSpacing: '0.08em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isMobile ? `${topoOrder.length} SECTORS` : `${topoOrder.length} SECTORS · ${careerEdges.length} SEGMENTS`}
          </span>
        )}
        {session === 'running' && (
          <>
            <span style={{ fontSize: '11px', color: 'var(--color-live)', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
              <span className="status-blink">●</span>
              {isMobile ? 'RUNNING' : 'LAP 1 · RUNNING'}
            </span>
            {activeSector && !isMobile && (
              <>
                <Div />
                <span style={{ fontSize: '10px', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                  ▶ {activeSector.title}
                </span>
              </>
            )}
          </>
        )}
        {session === 'complete' && (
          <span style={{ fontSize: '11px', color: 'var(--color-accent)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
            ✓ LAP COMPLETE{elapsedMs ? ` · ${formatElapsed(elapsedMs)}` : ''}
          </span>
        )}
      </div>

      {/* Clock — hide on very small screens */}
      {!isMobile && (
        <>
          <Div />
          <span style={{ fontSize: '12px', color: 'var(--color-text)', letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums', opacity: 0.7, flexShrink: 0 }}>
            {clock}
          </span>
        </>
      )}

      <Div />

      {/* Controls */}
      {session === 'idle'     && <Btn primary onClick={run}>RUN</Btn>}
      {session === 'running'  && <><Btn onClick={skip}>SKIP</Btn><Btn onClick={reset}>RESET</Btn></>}
      {session === 'complete' && <><Btn primary onClick={run}>RUN AGAIN</Btn><Btn onClick={reset}>RESET</Btn></>}
    </header>
  )

  // ── mobile view ────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
        <LiveRegion message={liveMsg} />
        {header}
        <StintTimeline
          nodeStates={nodeStates}
          activeSectorId={activeSectorId}
          selectedNode={selectedNode}
          onSelect={setSelectedNode}
        />
        <ReadoutPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    )
  }

  // ── desktop view ───────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <LiveRegion message={liveMsg} />
      {header}

      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
          onPaneClick={() => setSelectedNode(null)}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.2}
          maxZoom={2.5}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}   // we handle focus ourselves via tabIndex on inner divs
          style={{ background: 'var(--color-bg)' }}
          proOptions={{ hideAttribution: true }}
          aria-label="Interactive career DAG. Tab through nodes, Enter or Space to open readout."
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#252A38" />
          <Panel position="bottom-right" style={{ marginBottom: '12px', marginRight: '12px' }}>
            <SectorTiming activeId={activeSectorId} completedIds={completedIds} />
          </Panel>
        </ReactFlow>

        {/* Hover card */}
        {hover && !selectedNode && (
          <div
            aria-hidden="true"
            style={{
              position:     'fixed',
              left:         Math.min(hover.x + 18, window.innerWidth - 310),
              top:          Math.max(56, hover.y - 96),
              zIndex:       50,
              background:   'var(--color-chrome)',
              border:       '1px solid var(--color-border)',
              borderRadius: '4px',
              padding:      '12px 16px',
              width:        '280px',
              fontFamily:   'var(--font-mono)',
              pointerEvents:'none',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '6px', lineHeight: 1.3 }}>
              {hover.node.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text)', lineHeight: 1.65, marginBottom: '10px' }}>
              {hover.node.summary}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--color-text-dim)', letterSpacing: '0.12em' }}>
              CLICK OR PRESS ENTER FOR FULL READOUT
            </div>
          </div>
        )}
      </div>

      <ReadoutPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  )
}

// ── micro-components ──────────────────────────────────────────────────────────

function Div() {
  return <div aria-hidden="true" style={{ width: '1px', height: '20px', background: 'var(--color-border)', flexShrink: 0 }} />
}

function Btn({ children, onClick, primary }: { children: React.ReactNode; onClick?: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize:     '11px',
        letterSpacing:'0.14em',
        fontWeight:   700,
        fontFamily:   'var(--font-mono)',
        background:   primary ? 'var(--color-accent)' : 'transparent',
        color:        primary ? '#0A0C10' : 'var(--color-text)',
        border:       primary ? 'none' : '1px solid var(--color-border)',
        borderRadius: '3px',
        padding:      '6px 16px',
        cursor:       'pointer',
        flexShrink:   0,
        transition:   'opacity 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </button>
  )
}

// Visually hidden aria-live region for screen-reader announcements
function LiveRegion({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute', width: '1px', height: '1px',
        padding: 0, margin: '-1px', overflow: 'hidden',
        clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
      }}
    >
      {message}
    </div>
  )
}
