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
  const nodeIds = nodes.map(n => n.id)
  let order: string[]

  it('sorts without throwing (no cycles)', () => {
    order = topoSort(nodeIds, edges)
    expect(order).toHaveLength(nodeIds.length)
  })

  it('edu comes before its children', () => {
    order = topoSort(nodeIds, edges)
    expect(assertPrecedence(order, 'edu', ['coursework-systems', 'coursework-data'])).toBe(true)
  })

  it('coursework-systems comes before wiscracing and hg', () => {
    order = topoSort(nodeIds, edges)
    expect(assertPrecedence(order, 'coursework-systems', ['wiscracing', 'hg'])).toBe(true)
  })

  it('coursework-data comes before hg and ppt', () => {
    order = topoSort(nodeIds, edges)
    expect(assertPrecedence(order, 'coursework-data', ['hg', 'ppt'])).toBe(true)
  })

  it('aeries comes before hg', () => {
    order = topoSort(nodeIds, edges)
    expect(order.indexOf('aeries')).toBeLessThan(order.indexOf('hg'))
  })

  it('aeries comes before mockinterview', () => {
    order = topoSort(nodeIds, edges)
    expect(order.indexOf('aeries')).toBeLessThan(order.indexOf('mockinterview'))
  })

  it('mockinterview comes before hg', () => {
    order = topoSort(nodeIds, edges)
    expect(order.indexOf('mockinterview')).toBeLessThan(order.indexOf('hg'))
  })

  it('hg comes before research', () => {
    order = topoSort(nodeIds, edges)
    expect(assertPrecedence(order, 'hg', ['research'])).toBe(true)
  })
})
