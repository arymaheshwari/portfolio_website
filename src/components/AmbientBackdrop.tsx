import { useMemo } from 'react'

const MOTE_COLORS = ['#00FF87', '#FF8700', '#60A5FA', '#A78BFA']

type Mote = {
  left: string
  size: number
  dur: number
  delay: number
  color: string
  op: number
}

/**
 * Non-interactive animated atmosphere for the graph area:
 *  - a slow conic "radar" sweep
 *  - a vertical scan beam
 *  - drifting telemetry "data motes"
 * All pointer-events: none so the graph stays fully interactive.
 */
export function AmbientBackdrop() {
  const motes = useMemo<Mote[]>(() => {
    const seed = (n: number) => (Math.sin(n * 999.13) * 0.5 + 0.5)
    return Array.from({ length: 26 }, (_, i) => ({
      left: `${(seed(i + 1) * 100).toFixed(2)}%`,
      size: 1.5 + seed(i + 7) * 2.5,
      dur: 9 + seed(i + 3) * 12,
      delay: -seed(i + 5) * 18,
      color: MOTE_COLORS[i % MOTE_COLORS.length],
      op: 0.25 + seed(i + 11) * 0.4,
    }))
  }, [])

  return (
    <div
      aria-hidden="true"
      className="scanlines"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    >
      <div className="radar-sweep" />
      <div className="scan-beam" />

      {motes.map((m, i) => (
        <span
          key={i}
          className="data-mote"
          style={{
            left: m.left,
            bottom: '-10px',
            width: `${m.size}px`,
            height: `${m.size}px`,
            ['--mote-color' as string]: m.color,
            ['--mote-dur' as string]: `${m.dur}s`,
            ['--mote-op' as string]: m.op,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
