import { useState, useCallback, useRef, useEffect } from 'react'
import { nodes as careerNodes, edges as careerEdges } from '../data/career'
import { topoSort } from './topoSort'

export type NodeExecState = 'idle' | 'active' | 'complete'
export type SessionState  = 'idle' | 'running' | 'complete'

const NODE_ACTIVE_MS = 800   // how long a node stays "active"
const EDGE_TRAVEL_MS = 500   // time for the edge-flow animation before activating next
const CONV_PAUSE_MS  = 800   // extra beat before a convergence node activates
const CONVERGENCE_IDS = new Set<string>()  // symmetric layers — no special pause

export const topoOrder = topoSort(careerNodes.map(n => n.id), careerEdges)

// parent map: nodeId → [parentId, …]
const parentOf = new Map<string, string[]>()
for (const n of careerNodes) parentOf.set(n.id, [])
for (const e of careerEdges)  parentOf.get(e.to)!.push(e.from)

// Critical-path start time for each node
function computeStartTimes(): Map<string, number> {
  const doneAt  = new Map<string, number>()
  const startsAt = new Map<string, number>()

  for (const id of topoOrder) {
    const parents = parentOf.get(id)!
    const ready = parents.length === 0
      ? 0
      : Math.max(...parents.map(p => doneAt.get(p)!)) + EDGE_TRAVEL_MS

    const start = ready + (CONVERGENCE_IDS.has(id) ? CONV_PAUSE_MS : 0)
    startsAt.set(id, start)
    doneAt.set(id, start + NODE_ACTIVE_MS)
  }

  return startsAt
}

export const nodeStartAt = computeStartTimes()

export const totalRunMs = Math.max(...[...nodeStartAt.values()].map(t => t + NODE_ACTIVE_MS)) + 400

export function useExecution() {
  const [session,    setSession]    = useState<SessionState>('idle')
  const [nodeStates, setNodeStates] = useState<Map<string, NodeExecState>>(new Map())
  const [flowing,    setFlowing]    = useState<Set<string>>(new Set())
  const [done,       setDone]       = useState<Set<string>>(new Set())
  const [elapsedMs,  setElapsed]    = useState(0)
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([])
  const startedAt = useRef(0)

  const cancel = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const run = useCallback(() => {
    cancel()
    startedAt.current = Date.now()
    setSession('running')
    setNodeStates(new Map())
    setFlowing(new Set())
    setDone(new Set())
    setElapsed(0)

    for (const id of topoOrder) {
      const t      = nodeStartAt.get(id)!
      const outIds = careerEdges.filter(e => e.from === id).map(e => `${e.from}--${e.to}`)
      const inIds  = careerEdges.filter(e => e.to   === id).map(e => `${e.from}--${e.to}`)

      // Activate node: stop incoming edges flowing, light up outgoing edges
      timers.current.push(setTimeout(() => {
        setNodeStates(prev => new Map(prev).set(id, 'active'))
        setFlowing(prev => {
          const s = new Set(prev)
          inIds.forEach(e => s.delete(e))
          outIds.forEach(e => s.add(e))
          return s
        })
        setDone(prev => { const s = new Set(prev); inIds.forEach(e => s.add(e)); return s })
      }, t))

      // Complete node
      timers.current.push(setTimeout(() => {
        setNodeStates(prev => new Map(prev).set(id, 'complete'))
      }, t + NODE_ACTIVE_MS))
    }

    // Lap complete
    timers.current.push(setTimeout(() => {
      setSession('complete')
      setElapsed(Date.now() - startedAt.current)
    }, totalRunMs))
  }, [])

  const reset = useCallback(() => {
    cancel()
    setSession('idle')
    setNodeStates(new Map())
    setFlowing(new Set())
    setDone(new Set())
    setElapsed(0)
  }, [])

  const skip = useCallback(() => {
    cancel()
    setSession('complete')
    setNodeStates(new Map(topoOrder.map(id => [id, 'complete' as NodeExecState])))
    setFlowing(new Set())
    setDone(new Set(careerEdges.map(e => `${e.from}--${e.to}`)))
    setElapsed(0)
  }, [])

  useEffect(() => () => cancel(), [])

  const activeSectorId = [...nodeStates.entries()].find(([, s]) => s === 'active')?.[0] ?? null
  const completedIds   = new Set(
    [...nodeStates.entries()].filter(([, s]) => s === 'complete').map(([id]) => id),
  )

  return { session, nodeStates, flowing, done, activeSectorId, completedIds, elapsedMs, run, reset, skip }
}
