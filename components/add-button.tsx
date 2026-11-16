"use client"

import { MotionConfig, motion } from "motion/react"
import { Minus, Plus } from "lucide-react"

import { RollNumber } from "@/components/roll-number"
import { cart, useCartLines } from "@/lib/cart"
import { cn } from "@/lib/utils"

const ease = [0.25, 1, 0.5, 1] as const

/**
 * "+" that adds to the box. Once the item is in the box the same pill grows
 * into a [-] qty [+] stepper, so the quantity can be set right from the menu.
 */
export function AddButton({
  id,
  name,
  className,
  iconClassName,
}: {
  id: string
  name: string
  className?: string
  iconClassName?: string
}) {
  const qty = useCartLines().find((l) => l.id === id)?.qty ?? 0
  const filled = !!className?.includes("bg-clay")

  if (qty === 0)
    return (
      <MotionConfig reducedMotion="user">
        <motion.button
          type="button"
          aria-label={`Add ${name} to your box`}
          onClick={() => cart.add(id)}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.15, ease }}
          className={className}
        >
          <Plus className={iconClassName} />
        </motion.button>
      </MotionConfig>
    )

  const step =
    "grid size-7 place-items-center rounded-full hover:bg-current/15 md:size-9"

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        role="group"
        aria-label={`${name} quantity`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease }}
        className={cn(
          "flex shrink-0 items-center rounded-full border border-current p-0.5",
          filled && "border-clay bg-clay text-milk"
        )}
      >
        <motion.button
          type="button"
          aria-label={`One less ${name}`}
          onClick={() => cart.setQty(id, qty - 1)}
          whileTap={{ scale: 0.85 }}
          transition={{ duration: 0.15, ease }}
          className={step}
        >
          <Minus className="size-4" />
        </motion.button>
        <span
          aria-live="polite"
          className="min-w-6 text-center text-sm font-bold md:text-base"
        >
          <RollNumber value={qty} />
        </span>
        <motion.button
          type="button"
          aria-label={`One more ${name}`}
          onClick={() => cart.add(id)}
          whileTap={{ scale: 0.85 }}
          transition={{ duration: 0.15, ease }}
          className={step}
        >
          <Plus className="size-4" />
        </motion.button>
      </motion.div>
    </MotionConfig>
  )
}
