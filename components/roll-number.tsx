"use client"

import { useState } from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"

import { cn } from "@/lib/utils"

const variants: Variants = {
  enter: (dir: number) => ({ y: `${dir * 70}%`, opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (dir: number) => ({ y: `${dir * -70}%`, opacity: 0 }),
}

/** A number that slides up when it grows and down when it shrinks. */
export function RollNumber({
  value,
  prefix = "",
  className,
}: {
  value: number
  prefix?: string
  className?: string
}) {
  const [{ last, dir }, set] = useState({ last: value, dir: 1 })
  if (last !== value) set({ last: value, dir: value > last ? 1 : -1 })

  return (
    <span
      className={cn(
        "relative inline-flex overflow-hidden align-bottom tabular-nums",
        className
      )}
    >
      <AnimatePresence mode="popLayout" custom={dir} initial={false}>
        <motion.span
          key={value}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="inline-block"
        >
          {prefix}
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
