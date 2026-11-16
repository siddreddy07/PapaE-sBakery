import { useId } from "react"

import type { Flavor } from "@/lib/menu"
import { cn } from "@/lib/utils"

// x, y, rotation: hand-placed so every pop looks the same on server and client
const BITS: [number, number, number][] = [
  [30, 30, 20],
  [52, 22, -35],
  [70, 34, 60],
  [40, 48, -10],
  [62, 52, 40],
  [24, 58, 70],
  [78, 58, -50],
  [50, 70, 15],
  [34, 76, -60],
  [68, 76, 30],
  [46, 36, 80],
  [58, 40, -20],
  [22, 42, 0],
  [80, 44, 25],
  [56, 84, 50],
]

const DRIP =
  "M0 0H100V30C92 30 90 44 83 44C76 44 77 28 69 28C61 28 62 54 54 54C46 54 47 32 39 32C31 32 32 46 23 46C14 46 15 30 0 30Z"

/** A flat, drawn cakepop. One component = one source of truth for every flavor. */
export function Cakepop({
  flavor,
  className,
}: {
  flavor: Flavor
  className?: string
}) {
  const uid = useId().replace(/:/g, "")
  const { coat, drip, bits = [], bitShape = "dots" } = flavor

  return (
    <svg
      viewBox="0 0 100 172"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label={`${flavor.name} cakepop`}
    >
      <defs>
        <clipPath id={`ball-${uid}`}>
          <circle cx="50" cy="52" r="38" />
        </clipPath>
        <radialGradient id={`shade-${uid}`} cx="34%" cy="30%" r="80%">
          <stop offset="55%" stopColor="#3B1E1A" stopOpacity="0" />
          <stop offset="100%" stopColor="#3B1E1A" stopOpacity="0.24" />
        </radialGradient>
      </defs>

      {/* stick */}
      <rect x="46" y="84" width="8" height="86" rx="4" fill="#EBD5C8" />
      <rect
        x="48.5"
        y="84"
        width="2"
        height="86"
        rx="1"
        fill="#FFF6F1"
        opacity="0.7"
      />
      <ellipse cx="50" cy="93" rx="11" ry="4" fill="#3B1E1A" opacity="0.2" />

      {/* ball */}
      <circle cx="50" cy="52" r="38" fill={coat} />
      <g clipPath={`url(#ball-${uid})`}>
        {drip && <path d={DRIP} fill={drip} transform="translate(0 14)" />}
        {bits.length > 0 &&
          BITS.map(([x, y, r], i) => {
            const c = bits[i % bits.length]
            if (bitShape === "dots")
              return <circle key={i} cx={x} cy={y} r="2.6" fill={c} />
            const w = bitShape === "sprinkles" ? 8 : 6
            const h = bitShape === "sprinkles" ? 2.6 : 4
            return (
              <rect
                key={i}
                x={x - w / 2}
                y={y - h / 2}
                width={w}
                height={h}
                rx={h / 2.2}
                fill={c}
                transform={`rotate(${r} ${x} ${y})`}
              />
            )
          })}
        <circle cx="50" cy="52" r="38" fill={`url(#shade-${uid})`} />
      </g>
      <ellipse
        cx="35"
        cy="33"
        rx="10"
        ry="5.5"
        fill="#fff"
        opacity="0.42"
        transform="rotate(-32 35 33)"
      />
    </svg>
  )
}
