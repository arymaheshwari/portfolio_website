import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

type DataEdgeData = { flowing?: boolean; done?: boolean }

/**
 * Custom edge for the career DAG. Renders the bezier wire and, while a segment
 * is "flowing" (its source has just executed), sends a glowing data packet
 * travelling along the path — the visual signature of the DAG actually running.
 */
export function DataFlowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props
  const data = props.data as DataEdgeData | undefined
  const flowing = !!data?.flowing
  const done = !!data?.done

  const [edgePath] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  })

  const stroke = flowing ? '#FF8700' : done ? '#46607F' : '#2E3446'

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke,
          strokeWidth: flowing || done ? 2 : 1.5,
          transition: 'stroke 0.4s, stroke-width 0.4s',
        }}
      />

      {flowing && (
        <>
          {/* soft halo */}
          <circle r="7" fill="rgba(255,135,0,0.16)">
            <animateMotion dur="0.95s" repeatCount="indefinite" path={edgePath} rotate="auto" />
          </circle>
          {/* bright core packet */}
          <circle r="2.6" fill="#FFE0B0" style={{ filter: 'drop-shadow(0 0 5px #FF8700)' }}>
            <animateMotion dur="0.95s" repeatCount="indefinite" path={edgePath} rotate="auto" />
          </circle>
          {/* trailing packet, offset in time */}
          <circle r="1.8" fill="#FFB454" opacity="0.7">
            <animateMotion dur="0.95s" begin="0.32s" repeatCount="indefinite" path={edgePath} rotate="auto" />
          </circle>
        </>
      )}
    </>
  )
}
