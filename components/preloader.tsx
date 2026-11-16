"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

import { markReady, prefersReducedMotion } from "@/lib/intro"

gsap.registerPlugin(useGSAP)

const WORDS = ["Preheating the oven", "Mixing with love", "Come on in"]
const SEEN = "pe-intro"

/**
 * Brand intro: the Papa E's mark pops in, a counter runs, then the logo becomes a
 * hole that opens onto the page. Plays at most once a day (add ?intro to the URL to force it).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const mark = useRef<HTMLImageElement>(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      const d = document.documentElement.dataset
      // returning visitor, or arriving from another page of the site
      if (d.skip || d.ready || prefersReducedMotion()) {
        markReady()
        setGone(true)
        return
      }

      const box = mark.current!.getBoundingClientRect()
      const cx = box.left + box.width / 2
      const cy = box.top + box.height / 2
      // the logo flies to where the navbar logo sits, and the page opens from there
      const nav = document.querySelector<HTMLElement>(".hd-mark")
      const nb = nav?.getBoundingClientRect()
      const tx = nb ? nb.left + nb.width / 2 : 44
      const ty = nb ? nb.top + nb.height / 2 : 40
      const sc = nb ? nb.width / box.width : 0.2
      d.intro = "1" // hides the navbar logo until ours lands on it

      gsap.set(".pre-word", { yPercent: 115 })
      gsap.set(".pre-pop", { scale: 0, rotation: -14, opacity: 0 })
      gsap.set(".pre-clay", { opacity: 0 })
      const n = { v: 0 }
      const STEP = 0.75
      const first = 0.5
      const end = first + WORDS.length * STEP + 0.3
      const land = end + 1.15
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          try {
            localStorage.setItem(SEEN, String(Date.now()))
          } catch {}
          setGone(true)
        },
      })

      tl.to(
        ".pre-pop",
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: "elastic.out(1,0.55)",
        },
        0.1
      ).to(
        ".pre-float",
        { y: -10, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 3 },
        0.6
      )

      WORDS.forEach((_, i) => {
        const t = first + i * STEP
        tl.to(
          `.pre-word:nth-child(${i + 1})`,
          { yPercent: 0, duration: 0.5, ease: "power4.out" },
          t
        )
        if (i < WORDS.length - 1)
          tl.to(
            `.pre-word:nth-child(${i + 1})`,
            { yPercent: -115, duration: 0.35, ease: "power3.in" },
            t + STEP - 0.2
          )
      })

      tl.to(
        n,
        {
          v: 100,
          duration: end - first,
          ease: "power1.inOut",
          onUpdate: () => {
            if (count.current)
              count.current.textContent = String(Math.round(n.v))
          },
        },
        first
      )
        .to(".pre-ui", { opacity: 0, duration: 0.3, ease: "power2.in" }, end)
        .to(
          ".pre-float",
          { y: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" },
          end
        )
        // fly to the navbar spot
        .to(
          ".pre-fly",
          {
            x: tx - cx,
            y: ty - cy,
            scale: sc,
            duration: 1.15,
            ease: "power3.inOut",
          },
          end + 0.05
        )
        // same colour as the hero: the loader simply dissolves while the page drops in
        .to(
          ".pre-panel",
          { opacity: 0, duration: 0.8, ease: "power2.out" },
          land + 0.05
        )
        .add(markReady, land + 0.05)
        // hand over to the real navbar logo
        .add(() => {
          delete document.documentElement.dataset.intro
          gsap.set(".pre-fly", { opacity: 0 })
        }, land + 0.02)

      document.fonts.ready.then(() => tl.play())
      return () => {
        tl.kill()
      }
    },
    { scope: root }
  )

  if (gone) return null

  return (
    <div
      ref={root}
      className="pre-root fixed inset-0 z-[100] overflow-hidden"
      role="status"
      aria-label="Loading Papa E's Bakery"
    >
      <div className="pre-panel absolute inset-0 bg-blush text-clay">
        <div className="pre-ui absolute bottom-3 left-5 flex items-end md:bottom-4 md:left-10">
          <span
            ref={count}
            className="text-[clamp(5.5rem,22vw,17rem)] wordmark leading-[0.92] tabular-nums"
          >
            0
          </span>
          <span className="mb-[1.4vw] text-[clamp(1.5rem,5vw,4rem)] wordmark">
            %
          </span>
        </div>

        <div className="pre-ui absolute right-5 bottom-6 h-[1.5em] w-[58vw] overflow-hidden text-right font-script text-[clamp(1.5rem,4.2vw,3.4rem)] leading-[1.5] md:right-10 md:bottom-10">
          {WORDS.map((w) => (
            <span
              key={w}
              className="pre-word absolute top-0 right-0 pr-2 whitespace-nowrap"
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <div className="pre-fly absolute top-[42%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="pre-float">
          <div className="pre-pop relative">
            <Image
              ref={mark}
              src="/mark-clay.png"
              alt=""
              width={433}
              height={477}
              priority
              className="h-[min(36svh,17rem)] w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
