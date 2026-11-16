"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

import { hasFinePointer, prefersReducedMotion } from "@/lib/intro"
import { cn } from "@/lib/utils"

/**
 * Follower cursor. A dot by default, grows on links/buttons,
 * and turns into a labelled butter bubble over anything with data-cursor="label".
 */
export function Cursor() {
  const outer = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("")
  const [mode, setMode] = useState<"dot" | "link" | "label">("dot")
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    const el = outer.current
    if (!el) return
    setOn(true)
    document.documentElement.dataset.hasCursor = "on"

    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" })
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" })
    gsap.set(el, { xPercent: 0, opacity: 0 })

    const move = (e: PointerEvent) => {
      x(e.clientX)
      y(e.clientY)
      gsap.to(el, { opacity: 1, duration: 0.3, overwrite: "auto" })
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      const tagged = t.closest<HTMLElement>("[data-cursor]")
      if (tagged) {
        setLabel(tagged.dataset.cursor ?? "")
        setMode("label")
      } else if (t.closest("a,button,[role=button]")) {
        setMode("link")
      } else setMode("dot")
    }
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 })

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerover", over)
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", over)
      document.documentElement.removeEventListener("pointerleave", leave)
      delete document.documentElement.dataset.hasCursor
    }
  }, [])

  return (
    <div
      ref={outer}
      hidden={!on}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[200]"
    >
      <div
        className={cn(
          "absolute top-0 left-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-[width,height,background-color] duration-500 ease-studio",
          mode === "dot" && "size-3.5 bg-white mix-blend-difference",
          mode === "link" &&
            "size-11 border-[1.5px] border-white bg-transparent mix-blend-difference",
          mode === "label" && "size-24 bg-butter text-cocoa"
        )}
      >
        <span
          className={cn(
            "text-sm font-semibold transition-opacity duration-300",
            mode === "label" ? "opacity-100 delay-100" : "opacity-0"
          )}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
