import { describe, it, expect } from 'vitest'
import { topoSort, assertPrecedence } from './topoSort'
import { nodes, edges } from '../data/career'

// ── Unit tests ─────────────────────────────────────────────────────────────────

describe('topoSort — basic correctness', () => {
  it('sorts a simple linear chain A→B→C', () => {
    const order = topoSort(['A', 'B', 'C'], [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ])
    expect(order).toEqual(['A', 'B', 'C'])
  })

  it('handles a diamond: A→B, A→C, B→D, C→D', () => {
    const order = topoSort(['A', 'B', 'C', 'D'], [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
    ])
    // A must be first, D must be last
    expect(order[0]).toBe('A')
    expect(order[3]).toBe('D')
    // B and C must both appear before D
    expect(order.indexOf('B')).toBeLessThan(order.indexOf('D'))
    expect(order.indexOf('C')).toBeLessThan(order.indexOf('D'))
  })

  it('handles isolated nodes (no edges)', () => {
    const order = topoSort(['X', 'Y'], [])
    expect(order).toHaveLength(2)
    expect(order).toContain('X')
    expect(order).toContain('Y')
  })

  it('throws on a cycle', () => {
    expect(() =>
      topoSort(['A', 'B', 'C'], [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' }, // cycle
      ])
    ).toThrow('cycle')
  })

  it('returns all nodes', () => {
    const ids = ['A', 'B', 'C', 'D', 'E']
    const order = topoSort(ids, [
      { from: 'A', to: 'C' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'C', to: 'E' },
    ])
    expect(order).toHaveLength(5)
    expect(new Set(order)).toEqual(new Set(ids))
  })
})

// ── Integration: run the real career DAG ─────────────────────────────────────

describe('career DAG — topological correctness', () => {
  const nodeIds  = nodes.map(n => n.id)
  const COURSES  = ['ds-algo', 'bigdata', 'dbms', 'os', 'ai']
  const PROJECTS = ['wiscracing', 'mockinterview', 'ppt']
  let order: string[]

  it('sorts without throwing (no cycles)', () => {
    order = topoSort(nodeIds, edges)
    expect(order).toHaveLength(nodeIds.length)
  })

  it('edu is the starting node, before every course', () => {
    order = topoSort(nodeIds, edges)
    expect(order[0]).toBe('edu')
    expect(assertPrecedence(order, 'edu', COURSES)).toBe(true)
  })

  it('DS&A, Big Data and DBMS precede HG and Aeries', () => {
    order = topoSort(nodeIds, edges)
    for (const c of ['ds-algo', 'bigdata', 'dbms']) {
      expect(assertPrecedence(order, c, ['hg', 'aeries'])).toBe(true)
    }
  })

  it('AI precedes Research', () => {
    order = topoSort(nodeIds, edges)
    expect(order.indexOf('ai')).toBeLessThan(order.indexOf('research'))
  })

  it('OS precedes Wisconsin Racing, DBMS precedes the Novel Data Structure', () => {
    order = topoSort(nodeIds, edges)
    expect(order.indexOf('os')).toBeLessThan(order.indexOf('wiscracing'))
    expect(order.indexOf('dbms')).toBeLessThan(order.indexOf('ppt'))
  })

  it('Aeries and HG precede the AI Mock Interview', () => {
    order = topoSort(nodeIds, edges)
    expect(assertPrecedence(order, 'aeries', ['mockinterview'])).toBe(true)
    expect(assertPrecedence(order, 'hg', ['mockinterview'])).toBe(true)
  })

  it('research and every project precede the résumé', () => {
    order = topoSort(nodeIds, edges)
    for (const id of [...PROJECTS, 'research']) {
      expect(order.indexOf(id)).toBeLessThan(order.indexOf('resume'))
    }
  })

  it('résumé is the single terminal node', () => {
    order = topoSort(nodeIds, edges)
    expect(order[order.length - 1]).toBe('resume')
  })
})
