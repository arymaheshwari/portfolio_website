import { motion } from 'framer-motion'
import type { CareerNode } from '../data/career'
import { kindColor } from './CareerNodeCard'

function hashFloat(seed: string): number {
  let h = 5381
  for (const c of seed) h = ((h << 5) + h + c.charCodeAt(0)) & 0x7fffffff
  return h / 0x7fffffff
}

function tracePath(seed: string, w: number, h: number): string {
  const f1 = 0.6 + hashFloat(seed + 'f1') * 1.4
  const f2 = 0.3 + hashFloat(seed + 'f2') * 0.9
  const p1 = hashFloat(seed + 'p1') * Math.PI * 2
  const p2 = hashFloat(seed + 'p2') * Math.PI * 2
  const amp = h * 0.36
  const mid = h * 0.5
  const pts: string[] = []
  for (let i = 0; i < 36; i++) {
    const t = i / 35
    const x = t * w
    const y = mid + amp * (
      0.65 * Math.sin(f1 * t * Math.PI * 4 + p1) +
      0.35 * Math.sin(f2 * t * Math.PI * 7 + p2)
    )
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

type Props = {
  node: Pick<CareerNode, 'id' | 'kind' | 'stack'>
  width?: number
  isActive?: boolean
  isDone?: boolean
}

export function TelemetryTrace({ node, width = 192, isActive = false, isDone = false }: Props) {
  const color = kindColor[node.kind]
  const channels = node.stack.slice(0, 3)
  const h = 22

  return (
    <svg
      width={width}
      height={h}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      {channels.map((ch, i) => {
        const baseOpacity = 0.28 - i * 0.07
        const doneOpacity = 0.48 - i * 0.07

        return (
          <motion.path
            key={ch}
            d={tracePath(node.id + ch, width, h)}
            fill="none"
            stroke={color}
            strokeWidth={0.9 - i * 0.2}
            strokeLinejoin="round"
            strokeLinecap="round"
            animate={{
              opacity: isActive
                ? [baseOpacity, baseOpacity * 3, baseOpacity]
                : isDone
                ? doneOpacity
                : baseOpacity,
              strokeWidth: isActive ? [0.9 - i * 0.2, 1.4 - i * 0.2, 0.9 - i * 0.2] : 0.9 - i * 0.2,
            }}
            transition={
              isActive
                ? { duration: 0.75, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }
                : { duration: 0.4 }
            }
          />
        )
      })}
    </svg>
  )
}
