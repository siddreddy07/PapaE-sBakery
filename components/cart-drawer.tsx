"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "motion/react"
import { Check, Minus, Plus, Trash2 } from "lucide-react"

import { Cakepop } from "@/components/cakepop"
import { RollNumber } from "@/components/roll-number"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  cart,
  orderMessage,
  summarize,
  useCartLines,
  type DetailedLine,
} from "@/lib/cart"
import { photos } from "@/lib/menu"
import { site } from "@/lib/site"

/** Cart count for the header badge. */
export function useCartCount() {
  return summarize(useCartLines()).count
}

const ease = [0.25, 1, 0.5, 1] as const

const listV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
}

const rowV: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
  // fades while the gap closes in the same beat, so nothing jumps
  exit: {
    opacity: 0,
    x: 24,
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
}

function Thumb({ line }: { line: DetailedLine }) {
  const { item } = line
  return (
    <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-md bg-blush">
      {item.flavor ? (
        <Cakepop flavor={item.flavor} className="h-12 w-auto rotate-[14deg]" />
      ) : item.image ? (
        <Image
          src={item.image}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <Image
          src="/mark-clay.png"
          alt=""
          width={433}
          height={477}
          className="h-10 w-auto opacity-70"
        />
      )}
    </span>
  )
}

export function CartDrawer() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const lines = useCartLines()
  const { detailed, count, total, hasQuote } = summarize(lines)

  useEffect(() => cart.onOpenChange(setOpen), [])
  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(t)
  }, [copied])

  const sendOrder = async () => {
    const text = orderMessage(lines, site.full)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // clipboard blocked: still open Instagram
    }
    window.open(site.socials[0].href, "_blank", "noopener,noreferrer")
  }

  const stepBtn =
    "grid size-8 place-items-center rounded-full ring-1 ring-cocoa/20 transition-colors hover:bg-cocoa hover:text-milk"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="bg-milk">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-2xl font-extrabold">Your box</SheetTitle>
          <SheetDescription>
            {count === 0
              ? "Nothing in here yet."
              : `${count} ${count === 1 ? "item" : "items"}`}
          </SheetDescription>
        </SheetHeader>

        <MotionConfig reducedMotion="user">
          <AnimatePresence mode="wait" initial={false}>
            {count === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease } }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-16 text-center"
              >
                <div className="relative h-44 w-52">
                  {photos.slice(0, 3).map((p, k) => (
                    <motion.span
                      key={p.id}
                      initial={{ y: -16, opacity: 0, rotate: (k - 1) * 9 }}
                      animate={{ y: 0, opacity: 1, rotate: (k - 1) * 9 }}
                      transition={{ duration: 0.35, ease, delay: 0.05 + k * 0.05 }}
                      className="absolute top-0 size-32 overflow-hidden rounded-md border-4 border-white shadow-lg"
                      style={{
                        left: `${k * 32}px`,
                        top: `${k % 2 ? 24 : 0}px`,
                      }}
                    >
                      <Image
                        src={p.image}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </motion.span>
                  ))}
                </div>
                <p className="max-w-[24ch] text-lg text-cocoa/70">
                  Pick a dozen from the menu and it will land here.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    window.setTimeout(() => router.push("/menu"), 380)
                  }}
                  className="h-12 rounded-full bg-clay px-7 font-semibold text-milk transition-colors hover:bg-cocoa"
                >
                  See the flavors
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="full"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="flex min-h-0 flex-1 flex-col"
              >
                <motion.ul
                  data-lenis-prevent
                  variants={listV}
                  initial="hidden"
                  animate="show"
                  className="mt-4 flex-1 divide-y divide-cocoa/10 overflow-x-hidden overflow-y-auto px-6"
                >
                  <AnimatePresence initial={false}>
                    {detailed.map((l) => (
                      <motion.li
                        key={l.id}
                        variants={rowV}
                        exit="exit"
                        className="flex items-center gap-4 overflow-hidden py-4"
                      >
                        <Thumb line={l} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-cocoa">
                            {l.item.name}
                          </p>
                          <p className="text-sm text-cocoa/60">
                            {l.item.detail}
                          </p>
                          <div className="mt-2 flex items-center gap-1">
                            <motion.button
                              type="button"
                              aria-label={`One less ${l.item.name}`}
                              onClick={() => cart.setQty(l.id, l.qty - 1)}
                              whileTap={{ scale: 0.85 }}
                              transition={{ duration: 0.15, ease }}
                              className={stepBtn}
                            >
                              <Minus className="size-4" />
                            </motion.button>
                            <span
                              aria-live="polite"
                              className="w-8 text-center font-semibold"
                            >
                              <RollNumber value={l.qty} />
                            </span>
                            <motion.button
                              type="button"
                              aria-label={`One more ${l.item.name}`}
                              onClick={() => cart.setQty(l.id, l.qty + 1)}
                              whileTap={{ scale: 0.85 }}
                              transition={{ duration: 0.15, ease }}
                              className={stepBtn}
                            >
                              <Plus className="size-4" />
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-bold text-cocoa">
                            {l.item.price != null ? (
                              <RollNumber
                                prefix="$"
                                value={l.item.price * l.qty}
                              />
                            ) : (
                              "DM"
                            )}
                          </span>
                          <motion.button
                            type="button"
                            aria-label={`Remove ${l.item.name}`}
                            onClick={() => cart.remove(l.id)}
                            whileTap={{ scale: 0.85 }}
                            transition={{ duration: 0.15, ease }}
                            className="grid size-8 place-items-center rounded-full text-cocoa/50 transition-colors hover:bg-clay/10 hover:text-clay"
                          >
                            <Trash2 className="size-4" />
                          </motion.button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>

                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.3, ease, delay: 0.15 },
                  }}
                  className="border-t border-cocoa/10 p-6"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-extrabold">
                      <RollNumber prefix="$" value={total} />
                      {hasQuote && (
                        <span className="ml-1 text-base font-semibold text-cocoa/60">
                          + DM items
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-cocoa/60">
                    Orders are placed by DM. We copy your box, you paste it into
                    Instagram. Order a few days ahead.
                  </p>
                  <motion.button
                    type="button"
                    onClick={sendOrder}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15, ease }}
                    className="mt-4 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-clay font-semibold text-milk transition-colors hover:bg-cocoa"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={copied ? "copied" : "copy"}
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="size-5" /> Copied. Paste it in the
                            DM
                          </>
                        ) : (
                          "Copy order & open Instagram"
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => cart.clear()}
                    className="mt-3 w-full text-sm font-semibold text-cocoa/60 underline-offset-4 hover:text-clay hover:underline"
                  >
                    Empty box
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </MotionConfig>
      </SheetContent>
    </Sheet>
  )
}
