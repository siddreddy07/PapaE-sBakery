"use client"

import { useEffect } from "react"
import gsap from "gsap"
import Lenis from "lenis"

import { prefersReducedMotion } from "@/lib/intro"

let lenis: Lenis | null = null

/** Glide to a #hash (or y position). Falls back to native scroll if Lenis is off. */
export function scrollToTarget(target: string | number) {
  if (lenis)
    lenis.scrollTo(target, {
      duration: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    })
  else if (typeof target === "string")
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
  else window.scrollTo({ top: target, behavior: "smooth" })
}

/** Freeze / release page scroll (used while the mobile menu is open). */
export function lockScroll(on: boolean) {
  if (on) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = on ? "hidden" : ""
}

export function SmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      )
      const hash = a?.getAttribute("href")
      if (!a || !hash || hash === "#") return
      e.preventDefault()
      scrollToTarget(hash)
    }
    document.addEventListener("click", onClick)

    if (prefersReducedMotion()) {
      return () => document.removeEventListener("click", onClick)
    }

    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    const tick = (t: number) => lenis?.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      document.removeEventListener("click", onClick)
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  return null
}
