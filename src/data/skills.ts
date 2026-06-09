// Skills → the node ids that demonstrate them. Hovering a skill traces (glows)
// the matching nodes on the graph.
export type Skill = { label: string; nodeIds: string[] }

export const skills: Skill[] = [
  { label: 'Python',                nodeIds: ['edu', 'bigdata', 'ai', 'aeries', 'hg', 'research', 'wiscracing', 'mockinterview', 'ppt'] },
  { label: 'Agentic AI',            nodeIds: ['aeries', 'hg', 'mockinterview'] },
  { label: 'Machine Learning',      nodeIds: ['ai', 'hg', 'research'] },
  { label: 'LangGraph',             nodeIds: ['hg'] },
  { label: 'PyTorch / Neural Nets', nodeIds: ['ai', 'research'] },
  { label: 'React',                 nodeIds: ['aeries', 'mockinterview'] },
  { label: 'FastAPI',               nodeIds: ['mockinterview', 'aeries', 'hg'] },
  { label: 'AWS / Cloud',           nodeIds: ['aeries', 'hg', 'bigdata', 'dbms'] },
  { label: 'Docker & CI/CD',        nodeIds: ['aeries', 'hg'] },
  { label: 'C / C++ Systems',       nodeIds: ['edu', 'os', 'wiscracing', 'ppt'] },
  { label: 'Embedded / Firmware',   nodeIds: ['wiscracing', 'os'] },
  { label: 'SQL / Databases',       nodeIds: ['edu', 'dbms', 'hg', 'ppt'] },
  { label: 'Distributed Systems',   nodeIds: ['bigdata', 'hg'] },
  { label: 'Data Structures & Algos', nodeIds: ['ds-algo', 'ppt', 'hg', 'aeries'] },
  { label: 'MCP Tooling',           nodeIds: ['research', 'hg'] },
]
