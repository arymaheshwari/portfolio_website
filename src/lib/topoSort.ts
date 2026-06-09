export type GraphEdge = { from: string; to: string }

/**
 * Kahn's algorithm — returns node IDs in topological order.
 * Throws if the graph contains a cycle (which would mean career.ts has bad edges).
 */
export function topoSort(nodeIds: string[], edges: GraphEdge[]): string[] {
  const inDegree = new Map<string, number>()
  const adjList  = new Map<string, string[]>()

  for (const id of nodeIds) {
    inDegree.set(id, 0)
    adjList.set(id, [])
  }

  for (const { from, to } of edges) {
    adjList.get(from)!.push(to)
    inDegree.set(to, (inDegree.get(to) ?? 0) + 1)
  }

  // Queue starts with all nodes that have no incoming edges
  const queue: string[] = []
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id)
  }

  const result: string[] = []
  while (queue.length > 0) {
    const node = queue.shift()!
    result.push(node)
    for (const neighbor of adjList.get(node)!) {
      const newDeg = inDegree.get(neighbor)! - 1
      inDegree.set(neighbor, newDeg)
      if (newDeg === 0) queue.push(neighbor)
    }
  }

  if (result.length !== nodeIds.length) {
    throw new Error(
      `DAG contains a cycle — check career.ts edges. ` +
      `Processed ${result.length}/${nodeIds.length} nodes.`
    )
  }

  return result
}

/** Returns true if `id` appears strictly before all of `dependencies` in the ordering. */
export function assertPrecedence(order: string[], id: string, dependencies: string[]): boolean {
  const pos = order.indexOf(id)
  return dependencies.every(dep => order.indexOf(dep) > pos)
}
