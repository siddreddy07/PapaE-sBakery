"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react"
import { ArrowUpRight, Camera } from "lucide-react"

import { AddButton } from "@/components/add-button"
import { Cakepop } from "@/components/cakepop"
import { scrollToTarget } from "@/components/smooth-scroll"
import { prefersReducedMotion } from "@/lib/intro"
import {
  allFlavors,
  categories,
  photos,
  type CardCategory,
  type RowCategory,
  type Special,
} from "@/lib/menu"
import { site } from "@/lib/site"
import { cn, readableOn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/** Flavor ribbon. Drifts on its own, speeds up and flips direction with your scroll. */
export function Marquee() {
  let idx = 0
  const track = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const el = track.current!
    let x = 0
    let dir = -1
    let boost = 0
    let lastY = window.scrollY
    const tick = (_: number, dt: number) => {
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      if (dy !== 0) dir = dy > 0 ? -1 : 1
      boost += (Math.min(Math.abs(dy), 90) * 22 - boost) * 0.1
      x += dir * (70 + boost) * (dt / 1000)
      const half = el.scrollWidth / 2
      if (x <= -half) x += half
      if (x > 0) x -= half
      gsap.set(el, { x })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  })

  return (
    <div className="overflow-hidden bg-milk py-10 md:py-14">
      <div className="-rotate-[1.6deg] bg-clay py-4 text-milk md:py-6">
        <div
          ref={track}
          className="flex w-max items-center will-change-transform"
        >
          {[0, 1].map((k) => (
            <div
              key={k}
              aria-hidden={k === 1}
              className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12"
            >
              {allFlavors.map((f) => (
                <div key={f.id} className="flex items-center gap-8 md:gap-12">
                  <span className="text-[clamp(2.25rem,5.5vw,4.5rem)] wordmark whitespace-nowrap">
                    {f.name}
                  </span>
                  <span className="relative block size-14 shrink-0 rotate-[-8deg] overflow-hidden rounded-full border-2 border-milk md:size-[4.5rem]">
                    <Image
                      src={photos[idx++ % photos.length].image}
                      alt=""
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Homepage shows a short preview; the /menu page passes `full`. */
function useShown<T>(items: T[], preview: number | undefined, full?: boolean) {
  return full ? items : items.slice(0, preview ?? items.length)
}

/* ---------------------------------------------------------------- rows */

export function RowsView({ cat, full }: { cat: RowCategory; full?: boolean }) {
  const shown = useShown(cat.items, cat.preview, full)
  const root = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<(typeof cat.items)[number] | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 })

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from(".row-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.08,
        scrollTrigger: { trigger: list.current, start: "top 85%", once: true },
      })
    },
    { scope: root }
  )

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !list.current) return
    const r = list.current.getBoundingClientRect()
    x.set(e.clientX - r.left + 70)
    y.set(e.clientY - r.top - 30)
  }

  return (
    <div ref={root}>
      <ul
        ref={list}
        onPointerMove={move}
        onPointerLeave={() => setActive(null)}
        className="relative"
      >
        <li aria-hidden className="row-line h-px bg-cocoa/20" />
        {shown.map((f) => (
          <li
            key={f.id}
            style={{ "--on": readableOn(f.coat) } as CSSProperties}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(f)}
            className="group relative"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-studio group-hover:scale-y-100"
              style={{ background: f.coat }}
            />
            <div className="relative flex items-center justify-between gap-3 px-2 py-3.5 transition-[padding,color] duration-500 ease-studio group-hover:pl-6 group-hover:text-[var(--on)] md:py-7 md:pr-4">
              <h3 className="text-[clamp(1.85rem,6.4vw,5.75rem)] wordmark leading-[0.95]!">
                {f.name}
              </h3>
              <div className="flex items-center gap-3 md:gap-6">
                <Cakepop
                  flavor={f}
                  className="h-11 w-auto rotate-[18deg] transition-transform duration-500 ease-studio group-hover:scale-110 group-hover:-rotate-6 md:h-16 [@media(hover:hover)_and_(pointer:fine)]:hidden"
                />
                <AddButton
                  id={f.id}
                  name={f.name}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-current md:size-14"
                  iconClassName="size-5 md:size-6"
                />
              </div>
            </div>
            <span
              aria-hidden
              className="row-line absolute inset-x-0 bottom-0 h-px bg-cocoa/20"
            />
          </li>
        ))}

        <AnimatePresence>
          {active && (
            <motion.div
              key={active.id}
              aria-hidden
              style={{ x: sx, y: sy }}
              initial={{ scale: 0.3, rotate: -24, opacity: 0 }}
              animate={{ scale: 1, rotate: 10, opacity: 1 }}
              exit={{ scale: 0.3, rotate: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.35, duration: 0.5 }}
              className="pointer-events-none absolute top-0 left-0 z-20 hidden -translate-y-1/2 lg:block"
            >
              <Cakepop
                flavor={active}
                className="h-56 w-auto drop-shadow-[0_18px_22px_rgba(59,30,26,0.35)]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ul>

      {cat.note && (
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <p className="font-script text-[clamp(2rem,4vw,3.5rem)] leading-none text-clay">
            {cat.note}
          </p>
          <a
            href={site.socials[0].href}
            className="group relative inline-flex h-12 items-center overflow-hidden rounded-full bg-cocoa px-7 text-[15px] font-semibold text-milk"
          >
            <span className="absolute inset-0 translate-y-full rounded-[50%_50%_0_0/100%_100%_0_0] bg-clay transition-transform duration-500 ease-studio group-hover:translate-y-0" />
            <span className="relative">Follow for new flavors</span>
          </a>
        </div>
      )}
    </div>
  )
}

/* --------------------------------------------------------------- cards */

const TONE: Record<Special["tone"], { bg: string; mark: string }> = {
  mint: { bg: "bg-mint", mark: "/mark-clay.png" },
  butter: { bg: "bg-butter", mark: "/mark-clay.png" },
  blush: { bg: "bg-blush", mark: "/mark-clay.png" },
  clay: { bg: "bg-clay", mark: "/mark-cream.png" },
}

/** Real photo when `image` is set, otherwise a branded placeholder. */
function Photo({ item }: { item: Special }) {
  if (item.image)
    return (
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 ease-studio group-hover:scale-105"
        />
        {item.hover && (
          <Image
            src={item.hover}
            alt=""
            fill
            sizes="(min-width: 640px) 45vw, 90vw"
            className="object-cover opacity-0 transition-opacity duration-700 ease-studio group-hover:opacity-100"
          />
        )}
      </div>
    )
  const t = TONE[item.tone]
  return (
    <div
      className={cn(
        "relative grid aspect-square place-items-center overflow-hidden",
        t.bg
      )}
    >
      <div
        aria-hidden
        className="absolute -inset-[20%] -rotate-12 opacity-[0.2] transition-[background-position] duration-[1400ms] ease-studio group-hover:[background-position:48px_48px]"
        style={{
          backgroundImage: `url(${t.mark})`,
          backgroundSize: "76px",
        }}
      />
      <span className="relative grid place-items-center gap-1.5 rounded-[1.4rem] bg-milk/90 px-3 py-2 text-center text-cocoa shadow-lg backdrop-blur-sm sm:px-6 sm:py-4">
        <Camera className="size-6" />
        <span className="text-xs font-semibold sm:text-sm">
          Photo coming soon
        </span>
      </span>
    </div>
  )
}

const TILT = [-1.6, 1.3, 1.1, -1.3]

export function CardsView({
  cat,
  full,
}: {
  cat: CardCategory
  full?: boolean
}) {
  const shown = useShown(cat.items, cat.preview, full)
  return (
    <>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-8 md:gap-y-16">
        {shown.map((s, i) => {
          const tilt = TILT[i % TILT.length]
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 70, rotate: tilt + 9 }}
              animate={{ opacity: 1, y: 0, rotate: tilt }}
              whileHover={{ rotate: 0, y: -10 }}
              transition={{
                type: "spring",
                bounce: 0.3,
                duration: 0.9,
                delay: i * 0.09,
              }}
              className="group"
            >
              <article className="rounded-[0.5rem] bg-white p-1.5 pb-0 shadow-[0_24px_50px_-22px_rgba(59,30,26,0.5)] sm:p-3 sm:pb-0">
                <div className="relative">
                  <Photo item={s} />
                  <span className="absolute top-2 right-2 -rotate-6 rounded-xl bg-cocoa px-2.5 py-1 text-milk shadow-md sm:top-3 sm:right-3 sm:rounded-2xl sm:px-4 sm:py-1.5">
                    {s.price != null ? (
                      <span className="text-xl wordmark sm:text-3xl md:text-4xl">
                        ${s.price}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold sm:text-sm md:text-base">
                        DM for price
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-1.5 py-3 sm:gap-4 sm:px-2 sm:py-5">
                  <div className="min-w-0">
                    <h3 className="text-[clamp(1.1rem,3.2vw,2.8rem)] wordmark leading-[0.95]! sm:text-[clamp(1.9rem,3.2vw,2.8rem)]">
                      {s.name}
                    </h3>
                    <p className="mt-1 font-script text-base leading-tight text-clay sm:mt-2 sm:text-2xl">
                      {s.detail}
                    </p>
                  </div>
                  <AddButton
                    id={s.id}
                    name={s.name}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-clay text-milk transition-colors duration-300 hover:bg-cocoa sm:size-12"
                    iconClassName="size-5"
                  />
                </div>
              </article>
            </motion.li>
          )
        })}
      </ul>
    </>
  )
}

/* -------------------------------------------------------- order notes */

export function OrderInfo() {
  return (
    <div className="mt-14 rounded-[2rem] bg-cocoa p-5 text-milk md:mt-36 md:rounded-[2.5rem] md:p-14">
      <h3 className="text-[clamp(2.5rem,8vw,7.5rem)] wordmark leading-[1]!">
        Before you order
      </h3>
      <ol className="mt-6 grid gap-3 md:mt-14 md:grid-cols-3 md:gap-5">
        {site.orderSteps.map((s, i) => (
          <li
            key={s.title}
            className="flex items-start gap-4 rounded-[1.4rem] bg-milk/10 p-4 transition-[transform,background-color] duration-500 ease-studio hover:-translate-y-2 hover:bg-milk/15 md:block md:rounded-[1.8rem] md:p-8"
          >
            <span className="text-5xl wordmark text-butter md:text-7xl">
              {i + 1}
            </span>
            <div>
              <h4 className="text-xl font-bold md:mt-4 md:text-2xl">
                {s.title}
              </h4>
              <p className="mt-1 text-base text-milk/80 md:mt-2 md:text-lg">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-5 border-t border-milk/15 pt-6 md:mt-14 md:gap-6 md:pt-8">
        <a
          href={site.socials[0].href}
          className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-butter px-8 text-base font-semibold text-cocoa"
        >
          <span className="absolute inset-0 translate-y-full rounded-[50%_50%_0_0/100%_100%_0_0] bg-milk transition-transform duration-500 ease-studio group-hover:translate-y-0" />
          <span className="relative">Message on Instagram</span>
          <ArrowUpRight className="relative size-5 transition-transform duration-500 ease-studio group-hover:rotate-45" />
        </a>
        <p className="max-w-[30ch] font-script text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight text-butter">
          {site.thanks}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- section */

export function MenuSection() {
  const root = useRef<HTMLElement>(null)
  const [id, setId] = useState(categories[0].id)
  const cat = categories.find((c) => c.id === id)!
  const [dock, setDock] = useState(false)

  // floating category switcher while the menu section fills the screen
  useEffect(() => {
    const onScroll = () => {
      const r = root.current?.getBoundingClientRect()
      if (!r) return
      const h = window.innerHeight
      const phone = window.innerWidth < 768
      setDock(r.top < h * (phone ? 0.7 : 0.15) && r.bottom > h * 0.95)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const pick = (next: string) => {
    if (next === id) return scrollToTarget("#menu")
    setId(next)
    scrollToTarget("#menu")
  }

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const split = SplitText.create(".menu-title", {
        type: "chars",
        mask: "chars",
      })
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.04,
        scrollTrigger: { trigger: ".menu-title", start: "top 88%", once: true },
      })
    },
    { scope: root }
  )

  return (
    <section
      id="menu"
      ref={root}
      className="relative bg-milk px-5 pt-6 pb-28 md:px-10 md:pb-40"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <h2 className="menu-title text-[clamp(3.25rem,13vw,12rem)] wordmark leading-[1]! text-clay">
              Papa E&rsquo;s Menu
            </h2>
            <div
              role="tablist"
              aria-label="Menu categories"
              className="mt-4 flex flex-wrap gap-2 md:mt-6"
            >
              {categories.map((c) => {
                const on = c.id === id
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="menu-panel"
                    onClick={() => setId(c.id)}
                    className={cn(
                      "rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors duration-500 ease-studio",
                      on
                        ? "bg-cocoa text-milk"
                        : "bg-clay/10 text-clay hover:bg-clay/20",
                      // phones: the floating dock switches categories, so just name the current one
                      "max-md:pointer-events-none max-md:px-4 max-md:py-2",
                      !on && "max-md:hidden"
                    )}
                  >
                    {c.title}
                    <span className="ml-2 opacity-60">{c.count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id}
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 6 }}
              exit={{ scale: 0, rotate: 30 }}
              transition={{ type: "spring", bounce: 0.45, duration: 0.5 }}
              className="relative mb-4 hidden rounded-[1.6rem] bg-butter py-4 pr-7 pl-9 text-cocoa shadow-[0_14px_30px_-14px_rgba(59,30,26,0.5)] md:block"
            >
              <span className="absolute top-4 left-3.5 size-3 rounded-full bg-milk" />
              <p className="text-[clamp(3rem,6vw,5.5rem)] wordmark">
                {cat.tag.big}
              </p>
              <p className="-mt-1 text-sm font-bold md:text-base">
                {cat.tag.small}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div id="menu-panel" role="tabpanel" className="mt-10 md:mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.7, 0, 0.2, 1] }}
            >
              {cat.layout === "rows" ? (
                <RowsView cat={cat} />
              ) : (
                <CardsView cat={cat} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/menu"
            className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-cocoa px-8 text-base font-semibold text-milk"
          >
            <span className="absolute inset-0 translate-y-full rounded-[50%_50%_0_0/100%_100%_0_0] bg-clay transition-transform duration-500 ease-studio group-hover:translate-y-0" />
            <span className="relative">See the full menu</span>
            <ArrowUpRight className="relative size-5 transition-transform duration-500 ease-studio group-hover:rotate-45" />
          </Link>
        </div>
      </div>
      <nav
        aria-label="Switch category"
        className={cn(
          "fixed bottom-4 left-1/2 z-50 grid -translate-x-1/2 auto-cols-fr grid-flow-col gap-1 rounded-full bg-cocoa/90 p-1.5 shadow-[0_18px_40px_-14px_rgba(59,30,26,0.7)] backdrop-blur-md transition-[transform,opacity] duration-500 ease-studio max-md:w-[calc(100vw-1.5rem)]",
          dock
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-24 opacity-0"
        )}
      >
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => pick(c.id)}
            aria-current={c.id === id}
            className={cn(
              "rounded-full px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors duration-300 md:px-5 md:text-[15px]",
              c.id === id
                ? "bg-milk text-cocoa"
                : "text-milk/80 hover:text-milk"
            )}
          >
            {c.title}
          </button>
        ))}
      </nav>
    </section>
  )
}
