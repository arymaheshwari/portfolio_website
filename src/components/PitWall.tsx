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
import { SkillsPanel } from './SkillsPanel'
import { SkillsHint } from './SkillsHint'
import { BootSequence } from './BootSequence'
import { AmbientBackdrop } from './AmbientBackdrop'
import { DataFlowEdge } from './DataFlowEdge'
import { NarrationBox } from './NarrationBox'

// Five-layer left-to-right layout: edu → coursework → roles → projects → résumé
const POSITIONS: Record<string, { x: number; y: number }> = {
  'edu':           { x: 0,    y: 480 },

  // courses, top → bottom: DS&A, Big Data, DBMS, OS, AI
  'ds-algo':       { x: 400,  y: 0    },
  'bigdata':       { x: 400,  y: 240  },
  'dbms':          { x: 400,  y: 480  },
  'os':            { x: 400,  y: 720  },
  'ai':            { x: 400,  y: 960  },

  // internships, top → bottom: HG, Aeries, Research
  'hg':            { x: 880,  y: 200  },
  'aeries':        { x: 880,  y: 480  },
  'research':      { x: 880,  y: 760  },

  // projects
  'wiscracing':    { x: 1360, y: 200  },
  'mockinterview': { x: 1360, y: 480  },
  'ppt':           { x: 1360, y: 760  },

  'resume':        { x: 1840, y: 480  },
}

const nodeTypes = { career: CareerNodeCard }
const edgeTypes = { dataflow: DataFlowEdge }

type HoverState = { node: CareerNode; x: number; y: number }

// ── hooks ─────────────────────────────────────────────────────────────────────

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

// ── component ─────────────────────────────────────────────────────────────────

export function PitWall() {
  const {
    session, nodeStates, flowing, done,
    activeSectorId, narratedId, completedIds,
    run, reset, skip,
  } = useExecution()

  const prefersReduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null)
  const [hover, setHover]               = useState<HoverState | null>(null)
  const [skillNodes, setSkillNodes]     = useState<Set<string> | null>(null)
  const [skillHintDismissed, setSkillHintDismissed] = useState(false)
  const [booted, setBooted]             = useState(prefersReduced)
  const isMobile     = useIsMobile()
  const hoverTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spotlightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { if (prefersReduced) skip() }, []) // eslint-disable-line

  // The narrated node drives both the header "▶" label and the narration box.
  const narrationNode = narratedId ? (careerNodes.find(n => n.id === narratedId) ?? null) : null
  const activeSector  = narrationNode
  const progress      = completedIds.size + (activeSectorId ? 1 : 0)
  const totalNodes    = topoOrder.length

  const liveMsg = session === 'running' && activeSector
    ? `Executing: ${activeSector.title}`
    : session === 'complete'
    ? 'Execution complete. All nodes resolved.'
    : ''

  const handleNodeActivate = useCallback((nodeId: string) => {
    const n = careerNodes.find(c => c.id === nodeId)
    if (!n) return
    setSelectedNode(prev => (prev?.id === n.id ? null : n))
    setHover(null)
    setSkillHintDismissed(true)  // clicking a node dismisses the skills tip
  }, [])

  const handleSkillHover = useCallback((ids: string[] | null) => {
    setSkillNodes(ids && ids.length ? new Set(ids) : null)
    if (ids && ids.length) setSkillHintDismissed(true)  // hovering a skill dismisses the tip
  }, [])

  const rfNodes: RFNode<CareerNodeData>[] = useMemo(() =>
    careerNodes.map(n => ({
      id:       n.id,
      type:     'career' as const,
      position: POSITIONS[n.id] ?? { x: 0, y: 0 },
      data: {
        ...n,
        isSelected:    selectedNode?.id === n.id,
        isConvergence: false,
        execState:     nodeStates.get(n.id) ?? 'idle',
        isSkillHit:    skillNodes ? skillNodes.has(n.id) : false,
        isDimmed:      skillNodes ? !skillNodes.has(n.id) : false,
        onActivate:    () => handleNodeActivate(n.id),
      },
    })),
    [selectedNode, nodeStates, skillNodes, handleNodeActivate],
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
        type:     'dataflow',
        animated: isFlowing,
        data:     { flowing: isFlowing, done: isDone },
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

  // Cursor spotlight — moved imperatively to avoid re-renders
  const handlePaneMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = spotlightRef.current
    if (!el) return
    const rect = e.currentTarget.getBoundingClientRect()
    el.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`
  }, [])

  // ── shared header ──────────────────────────────────────────────────────────
  const header = (
    <header style={{
      height:      '50px',
      background:  'linear-gradient(180deg, #1f2435 0%, #161a26 100%)',
      borderBottom:'1px solid var(--color-border)',
      boxShadow:   '0 1px 0 rgba(255,135,0,0.10), 0 6px 22px rgba(0,0,0,0.45)',
      display:     'flex',
      alignItems:  'center',
      padding:     isMobile ? '0 10px' : '0 16px',
      gap:         isMobile ? '8px' : '12px',
      flexShrink:  0,
      fontFamily:  'var(--font-mono)',
      zIndex:      10,
    }}>
      <Avatar />
      <span className="wordmark-grad" style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: 700, letterSpacing: isMobile ? '0.08em' : '0.18em', flexShrink: 0, whiteSpace: 'nowrap' }}>
        ARYAN MAHESHWARI
      </span>

      {!isMobile && <Div />}

      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1, minWidth: 0 }}>
          {session === 'idle' && (
            <span style={{ fontSize: '10px', color: 'var(--color-text-dim)', letterSpacing: '0.08em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {totalNodes} NODES · {careerEdges.length} CONNECTIONS · READY
            </span>
          )}
          {session === 'running' && (
            <>
              <span aria-hidden="true" className="signal-eq"><i /><i /><i /><i /><i /></span>
              <span style={{ fontSize: '11px', color: 'var(--color-live)', whiteSpace: 'nowrap' }}>
                EXECUTING · {progress}/{totalNodes}
              </span>
              {activeSector && (
                <>
                  <Div />
                  <span style={{ fontSize: '10px', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    ▶ {activeSector.title}
                  </span>
                </>
              )}
            </>
          )}
          {session === 'complete' && (
            <span style={{ fontSize: '11px', color: 'var(--color-accent)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
              ✓ RESOLVED · {totalNodes}/{totalNodes} NODES
            </span>
          )}
        </div>
      )}

      {isMobile && <div style={{ flex: 1 }} />}

      {!isMobile && <Div />}
      <ResumeButton compact={isMobile} />
      {!isMobile && <Div />}

      {session === 'idle'     && <Btn primary onClick={run} compact={isMobile}>RUN</Btn>}
      {session === 'running'  && <><Btn onClick={skip} compact={isMobile}>SKIP</Btn><Btn onClick={reset} compact={isMobile}>RESET</Btn></>}
      {session === 'complete' && <><Btn primary onClick={run} compact={isMobile}>{isMobile ? 'RUN' : 'RUN AGAIN'}</Btn><Btn onClick={reset} compact={isMobile}>RESET</Btn></>}
    </header>
  )

  const bootOverlay = !booted ? <BootSequence onDone={() => setBooted(true)} /> : null

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
      {bootOverlay}
      <LiveRegion message={liveMsg} />
      {header}

      <div
        style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        onMouseMove={handlePaneMouseMove}
        onMouseEnter={() => spotlightRef.current?.classList.add('on')}
        onMouseLeave={() => spotlightRef.current?.classList.remove('on')}
      >
        <AmbientBackdrop />
        <div ref={spotlightRef} className="cursor-spotlight" aria-hidden="true" />

        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={handleNodeClick}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
          onPaneClick={() => setSelectedNode(null)}
          fitView={!isMobile}
          fitViewOptions={{ padding: 0.12 }}
          defaultViewport={isMobile ? { x: 36, y: -36, zoom: 0.66 } : undefined}
          minZoom={0.2}
          maxZoom={2.5}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}   // we handle focus ourselves via tabIndex on inner divs
          style={{ background: 'transparent' }}
          proOptions={{ hideAttribution: true }}
          aria-label="Interactive career DAG. Tab through nodes, Enter or Space to open readout."
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#222736" />
          {!isMobile && (
            <>
              {/* Tip box sits just left of the Skills panel (224px wide + 12px margins) */}
              <Panel position="top-right" style={{ marginTop: '12px', marginRight: '248px' }}>
                <SkillsHint
                  visible={session === 'idle' && !skillHintDismissed}
                  onDismiss={() => setSkillHintDismissed(true)}
                />
              </Panel>
              <Panel position="top-right" style={{ marginTop: '12px', marginRight: '12px' }}>
                <SkillsPanel onHover={handleSkillHover} />
              </Panel>
            </>
          )}
        </ReactFlow>

        {/* Hover card (desktop only) */}
        {!isMobile && hover && !selectedNode && (
          <div
            aria-hidden="true"
            className="rise-in"
            style={{
              position:     'fixed',
              left:         Math.min(hover.x + 18, window.innerWidth - 310),
              top:          Math.max(56, hover.y - 96),
              zIndex:       50,
              background:   'linear-gradient(160deg, rgba(28,32,48,0.96) 0%, rgba(18,21,28,0.96) 100%)',
              border:       '1px solid var(--color-border-bright)',
              borderRadius: '10px',
              padding:      '12px 16px',
              width:        '280px',
              fontFamily:   'var(--font-mono)',
              pointerEvents:'none',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow:    '0 16px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
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

      <NarrationBox node={narrationNode} />
      <ReadoutPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  )
}

// ── micro-components ──────────────────────────────────────────────────────────

function Div() {
  return <div aria-hidden="true" style={{ width: '1px', height: '20px', background: 'var(--color-border)', flexShrink: 0 }} />
}

function Avatar() {
  return (
    <img
      src="/profile.png"
      alt="Aryan Maheshwari"
      onError={e => {
        const t = e.currentTarget
        if (!t.src.endsWith('/profile-placeholder.svg')) t.src = '/profile-placeholder.svg'
      }}
      style={{
        width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover',
        border: '1px solid var(--color-border-bright)',
        boxShadow: '0 0 12px rgba(255,135,0,0.25)',
        flexShrink: 0,
      }}
    />
  )
}

function ResumeButton({ compact }: { compact?: boolean }) {
  return (
    <a
      href="/resume.pdf"
      download="Aryan-Maheshwari-Resume.pdf"
      aria-label="Download résumé (PDF)"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700,
        fontFamily: 'var(--font-mono)', textDecoration: 'none',
        background: 'linear-gradient(180deg, #FFA22E 0%, #FF8700 100%)', color: '#0A0C10',
        border: '1px solid #FF9A1E', borderRadius: '6px',
        padding: '6px 14px', flexShrink: 0, whiteSpace: 'nowrap',
        boxShadow: '0 0 16px rgba(255,135,0,0.35)',
        transition: 'transform 0.15s var(--ease-out-quart), box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 0 22px rgba(255,135,0,0.5)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 0 16px rgba(255,135,0,0.35)'
      }}
    >
      {compact ? '' : 'RÉSUMÉ'} <span aria-hidden="true">↓</span>
    </a>
  )
}

function Btn({ children, onClick, primary, compact }: { children: React.ReactNode; onClick?: () => void; primary?: boolean; compact?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize:     compact ? '10px' : '11px',
        letterSpacing: compact ? '0.08em' : '0.14em',
        fontWeight:   700,
        fontFamily:   'var(--font-mono)',
        background:   primary ? 'linear-gradient(180deg, #FFA22E 0%, #FF8700 100%)' : 'rgba(255,255,255,0.02)',
        color:        primary ? '#0A0C10' : 'var(--color-text)',
        border:       primary ? '1px solid #FF9A1E' : '1px solid var(--color-border)',
        borderRadius: '6px',
        padding:      compact ? '6px 10px' : '6px 16px',
        cursor:       'pointer',
        flexShrink:   0,
        boxShadow:    primary ? '0 0 16px rgba(255,135,0,0.35)' : 'none',
        transition:   'transform 0.15s var(--ease-out-quart), box-shadow 0.2s, border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        if (primary) e.currentTarget.style.boxShadow = '0 0 22px rgba(255,135,0,0.5)'
        else { e.currentTarget.style.borderColor = 'var(--color-border-bright)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        if (primary) e.currentTarget.style.boxShadow = '0 0 16px rgba(255,135,0,0.35)'
        else { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }
      }}
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
