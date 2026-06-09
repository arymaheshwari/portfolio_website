import { useState, useCallback, useRef, useEffect } from 'react'
import { nodes as careerNodes, edges as careerEdges } from '../data/career'
import { topoSort } from './topoSort'

export type NodeExecState = 'idle' | 'active' | 'complete'
export type SessionState  = 'idle' | 'running' | 'complete'

export const TYPE_SPEED_MS = 26   // ms per character — shared with NarrationBox
const READ_BUFFER_MS = 2000       // pause to read after the line finishes typing
const STEP_GAP_MS    = 300        // gap between nodes

export const topoOrder = topoSort(careerNodes.map(n => n.id), careerEdges)

const nodeById = new Map(careerNodes.map(n => [n.id, n]))

// The narrated run sequence. Coursework is collapsed into the education step —
// the courses light up together and are mentioned in the education narration,
// rather than being narrated one node at a time.
type Step = { id: string; activate: string[] }

const STEPS: Step[] = (() => {
  const courseIds = careerNodes.filter(n => n.kind === 'coursework').map(n => n.id)
  const courseSet = new Set(courseIds)
  const rank = (id: string) => {
    const k = nodeById.get(id)?.kind
    if (k === 'industry' || k === 'research') return 0
    if (k === 'project') return 1
    if (k === 'resume')  return 3
    return 2
  }
  const rest = topoOrder
    .filter(id => id !== 'edu' && !courseSet.has(id))
    .sort((a, b) => rank(a) - rank(b)) // stable: preserves topo order within a rank
  return [
    { id: 'edu', activate: ['edu', ...courseIds] },
    ...rest.map(id => ({ id, activate: [id] })),
  ]
})()

// Ids that actually get a narration step (coursework is folded into 'edu').
export const narratedSteps = STEPS.map(s => s.id)

// Active duration scales with the narration length: time to type + time to read.
function activeDuration(id: string): number {
  const text = nodeById.get(id)?.narration ?? nodeById.get(id)?.summary ?? ''
  return text.length * TYPE_SPEED_MS + READ_BUFFER_MS
}

export function useExecution() {
  const [session,    setSession]    = useState<SessionState>('idle')
  const [nodeStates, setNodeStates] = useState<Map<string, NodeExecState>>(new Map())
  const [narratedId, setNarratedId] = useState<string | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const cancel = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const run = useCallback(() => {
    cancel()
    setSession('running')
    setNodeStates(new Map())
    setNarratedId(null)

    let t = 0
    for (const step of STEPS) {
      const at  = t
      const dur = activeDuration(step.id)
      timers.current.push(setTimeout(() => {
        setNarratedId(step.id)
        setNodeStates(prev => {
          const m = new Map(prev)
          for (const id of step.activate) m.set(id, 'active')
          return m
        })
      }, at))
      timers.current.push(setTimeout(() => {
        setNodeStates(prev => {
          const m = new Map(prev)
          for (const id of step.activate) m.set(id, 'complete')
          return m
        })
      }, at + dur))
      t += dur + STEP_GAP_MS
    }

    timers.current.push(setTimeout(() => setSession('complete'), t))
  }, [])

  const reset = useCallback(() => {
    cancel()
    setSession('idle')
    setNodeStates(new Map())
    setNarratedId(null)
  }, [])

  const skip = useCallback(() => {
    cancel()
    setSession('complete')
    setNodeStates(new Map(topoOrder.map(id => [id, 'complete' as NodeExecState])))
    setNarratedId('resume')
  }, [])

  useEffect(() => () => cancel(), [])

  // Edge states derive from node states: an edge flows while its target is active
  // and is done once the target completes.
  const flowing = new Set<string>()
  const done    = new Set<string>()
  for (const e of careerEdges) {
    const id = `${e.from}--${e.to}`
    const targetState = nodeStates.get(e.to)
    if (targetState === 'complete')    done.add(id)
    else if (targetState === 'active') flowing.add(id)
  }

  const activeSectorId = [...nodeStates.entries()].find(([, s]) => s === 'active')?.[0] ?? null
  const completedIds   = new Set(
    [...nodeStates.entries()].filter(([, s]) => s === 'complete').map(([id]) => id),
  )

  return { session, nodeStates, flowing, done, activeSectorId, narratedId, completedIds, run, reset, skip }
}
