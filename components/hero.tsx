"use client"

import { useRef } from "react"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import { useGSAP } from "@gsap/react"

import Image from "next/image"

import { NavLink } from "@/components/nav-link"
import { Roll } from "@/components/roll"
import { Wave } from "@/components/wave"
import { hasFinePointer, prefersReducedMotion, whenReady } from "@/lib/intro"
import { allFlavors, cakepops, getSpecial } from "@/lib/menu"
import { site } from "@/lib/site"

gsap.registerPlugin(useGSAP, Draggable)

// three polaroids. depth = how far each drifts with the pointer
const CARDS = [
  {
    id: "chocolate-chip-cookies",
    tilt: -7,
    panel: "bg-mint",
    pos: "left-[calc(var(--cw)*0.12)] bottom-[27%] max-md:bottom-[31%] max-md:[@media(max-height:720px)]:bottom-[22%] md:max-lg:portrait:bottom-[19%]",
    depth: 34,
  },
  {
    id: "maple-harvest-rolls",
    tilt: 3,
    panel: "bg-butter",
    pos: "left-[calc(50%-var(--cw)/2)] bottom-[13%] max-md:bottom-[21%] max-md:[@media(max-height:720px)]:bottom-[12%] md:max-lg:portrait:bottom-[5%]",
    depth: 56,
  },
  {
    id: "biscoff-cookies",
    tilt: 8,
    panel: "bg-clay",
    pos: "right-[calc(var(--cw)*0.12)] bottom-[26%] max-md:bottom-[30%] max-md:[@media(max-height:720px)]:bottom-[21%] md:max-lg:portrait:bottom-[17%]",
    depth: 26,
  },
]

const WORDS = ["Papa", "E’s"]

export function Hero() {
  const scope = useRef<HTMLElement>(null)
  const price = cakepops.price

  useGSAP(
    () => {
      const reduce = prefersReducedMotion()
      const fine = hasFinePointer()
      const cards = gsap.utils.toArray<HTMLElement>(".pc")
      const tilt = (el: Element) => Number((el as HTMLElement).dataset.tilt)

      gsap.set(cards, { rotation: (_, el) => tilt(el) })
      if (!reduce) {
        gsap.set(".hl", {
          yPercent: -140,
          rotation: () => gsap.utils.random(-35, 35),
          opacity: 0,
        })
        gsap.set(".script", { clipPath: "inset(-30% 100% -40% -5%)" })
        gsap.set(cards, {
          yPercent: 150,
          rotation: (_, el) => tilt(el) + gsap.utils.random(14, 26),
        })
        gsap.set(".sticker", { scale: 0, rotation: -70 })
        gsap.set(".rise", { yPercent: 110 })
      }

      const cleanups: (() => void)[] = []

      // pointer-driven bits only switch on once the intro has landed,
      // otherwise Draggable's bounds would shove the still-hidden cards around
      const enable = () => {
        if (!fine || reduce) return
        const wraps = gsap.utils.toArray<HTMLElement>(".pw")
        const moves = wraps.map((w) => ({
          x: gsap.quickTo(w, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(w, "y", { duration: 0.9, ease: "power3.out" }),
          d: Number(w.dataset.depth),
        }))
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          moves.forEach((m) => {
            m.x(-nx * m.d)
            m.y(-ny * m.d * 0.7)
          })
        }
        const host = scope.current
        host?.addEventListener("pointermove", onMove)
        cleanups.push(() => host?.removeEventListener("pointermove", onMove))

        // hover straightens + lifts; press scales; drag moves the polaroid around
        cards.forEach((el) => {
          let dragging = false
          const settle = () =>
            gsap.to(el, {
              rotation: tilt(el),
              scale: 1,
              duration: 0.6,
              ease: "elastic.out(1,0.6)",
              overwrite: "auto",
            })
          const enter = () => {
            if (!dragging)
              gsap.to(el, {
                rotation: 0,
                scale: 1.06,
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto",
              })
          }
          const leave = () => {
            if (!dragging) settle()
          }
          el.addEventListener("pointerenter", enter)
          el.addEventListener("pointerleave", leave)
          const [d] = Draggable.create(el, {
            type: "x,y",
            bounds: host!,
            onPress: () => {
              dragging = true
              gsap.to(el, {
                scale: 1.1,
                rotation: tilt(el) * 0.4,
                duration: 0.3,
                overwrite: "auto",
              })
            },
            onRelease: () => {
              dragging = false
              settle()
            },
          })
          cleanups.push(() => {
            el.removeEventListener("pointerenter", enter)
            el.removeEventListener("pointerleave", leave)
            d.kill()
          })
        })
      }

      const play = () => {
        if (reduce) return enable()
        const tl = gsap.timeline({ onComplete: enable })
        tl.to(".hl", {
          yPercent: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.6,
          ease: "elastic.out(1,0.5)",
          stagger: 0.07,
        })
          .to(
            ".script",
            {
              clipPath: "inset(-30% -8% -40% -5%)",
              duration: 1.1,
              ease: "power2.inOut",
            },
            "-=1.1"
          )
          .to(
            cards,
            {
              yPercent: 0,
              rotation: (_, el) => tilt(el),
              duration: 1.3,
              ease: "back.out(1.5)",
              stagger: 0.13,
            },
            "-=1.25"
          )
          .to(
            ".sticker",
            {
              scale: 1,
              rotation: (_, el) => Number((el as HTMLElement).dataset.tilt),
              duration: 1,
              ease: "back.out(2.4)",
              stagger: 0.16,
            },
            "-=0.7"
          )
          .to(
            ".rise",
            { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.08 },
            "-=0.9"
          )
        cleanups.push(() => tl.kill())
      }
      cleanups.push(whenReady(play))

      return () => cleanups.forEach((c) => c())
    },
    { scope }
  )

  return (
    <section
      id="top"
      ref={scope}
      className="relative h-svh min-h-[660px] overflow-hidden bg-blush [--cw:clamp(8.5rem,17.5vw,17rem)] max-md:[--cw:31vw] md:max-lg:portrait:[--cw:26vw] max-md:[@media(max-height:720px)]:[--cw:27vw]"
    >
      {/* wordmark */}
      <div className="relative pt-[clamp(5rem,11vh,8rem)]">
        <span className="script absolute top-[clamp(5rem,12vh,8.5rem)] left-[3.5vw] z-20 -rotate-6 font-script text-[clamp(2rem,5.2vw,5rem)] leading-none text-cocoa">
          baked with love
        </span>
        <h1
          className="flex flex-row justify-center gap-[0.2em] pt-[1vw] text-[36.5vw] wordmark whitespace-nowrap text-clay select-none max-lg:portrait:flex-col max-lg:portrait:items-center max-lg:portrait:gap-0 max-lg:portrait:text-[56vw]"
          aria-label={site.full}
        >
          {WORDS.map((w) => (
            <span key={w} aria-hidden className="flex">
              {w.split("").map((c, i) => (
                <span key={i} className="hl inline-block origin-bottom">
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>

      {/* tilted polaroids */}
      {CARDS.map((c) => {
        const f = getSpecial(c.id)
        return (
          <div
            key={c.id}
            data-depth={c.depth}
            className={`pw absolute z-10 w-[var(--cw)] ${c.pos}`}
          >
            <div
              data-tilt={c.tilt}
              data-cursor="drag"
              className="pc group cursor-grab touch-pan-y rounded-[0.35rem] bg-milk p-[0.55rem] pb-0 shadow-[0_18px_40px_-14px_rgba(59,30,26,0.55)] will-change-transform"
            >
              <div
                className={`relative aspect-square overflow-hidden rounded-[0.2rem] ${c.panel}`}
              >
                <Image
                  src={f.image!}
                  alt={f.name}
                  fill
                  sizes="20vw"
                  priority
                  className="object-cover transition-transform duration-700 ease-studio group-hover:scale-105"
                />
              </div>
              <p className="py-2.5 text-center font-script text-[clamp(1.1rem,1.7vw,1.6rem)] leading-none text-cocoa">
                {f.name}
              </p>
            </div>
          </div>
        )
      })}

      {/* stickers */}
      <div
        data-tilt={9}
        className="sticker absolute top-[clamp(6rem,19vh,12rem)] right-[4vw] z-20 rounded-full bg-mint px-5 py-2.5 text-[clamp(0.9rem,1.3vw,1.2rem)] font-bold text-cocoa shadow-[0_8px_20px_-8px_rgba(59,30,26,0.4)] max-md:hidden"
      >
        new flavors soon
      </div>
      <div
        data-tilt={-8}
        className="sticker absolute right-[3.5vw] bottom-[8%] z-20 rounded-[1.6rem] bg-butter px-[clamp(1rem,2vw,1.8rem)] pt-2 pb-3 text-center text-cocoa shadow-[0_14px_30px_-12px_rgba(59,30,26,0.5)]"
      >
        <p className="text-[clamp(3rem,7vw,6.5rem)] wordmark">${price}</p>
        <p className="-mt-1 text-[clamp(0.8rem,1.1vw,1rem)] font-bold">
          a {cakepops.unit}
        </p>
      </div>

      {/* bottom-left: one line + one button */}
      <div className="absolute bottom-[8%] left-5 z-20 max-w-[24ch] md:left-10">
        <p className="overflow-hidden max-md:[@media(max-height:720px)]:hidden">
          <span className="rise block text-[clamp(1.05rem,1.5vw,1.4rem)] leading-snug font-medium text-cocoa">
            {allFlavors.length} cakepop flavors. One price. Made with love.
          </span>
        </p>
        <div className="mt-4 overflow-hidden pb-1">
          <NavLink
            href="/menu"
            className="rise group relative inline-flex h-13 items-center overflow-hidden rounded-full bg-cocoa px-7 text-[15px] font-semibold text-milk"
          >
            <span className="absolute inset-0 translate-y-full rounded-[50%_50%_0_0/100%_100%_0_0] bg-clay transition-transform duration-500 ease-studio group-hover:translate-y-0" />
            <Roll className="relative">See the flavors</Roll>
          </NavLink>
        </div>
      </div>

      <Wave
        className="absolute inset-x-0 -bottom-px z-30"
        color="var(--milk)"
      />
    </section>
  )
}
