"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

import { CardsView, OrderInfo, RowsView } from "@/components/menu-list"
import { scrollToTarget } from "@/components/smooth-scroll"
import { markReady, prefersReducedMotion } from "@/lib/intro"
import { categories } from "@/lib/menu"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, SplitText)

const CHIPS = [
  ...categories.map((c) => ({ id: c.id, label: c.title })),
  { id: "order", label: "Order info" },
]

function Chip({
  c,
  on,
  dark,
}: {
  c: { id: string; label: string }
  on: boolean
  dark?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget(`#cat-${c.id}`)}
      aria-current={on}
      className={cn(
        "rounded-full px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors duration-300 md:px-5 md:text-[15px]",
        dark
          ? on
            ? "bg-milk text-cocoa"
            : "text-milk/80 hover:text-milk"
          : on
            ? "bg-cocoa text-milk"
            : "bg-clay/10 text-clay hover:bg-clay/20"
      )}
    >
      {c.label}
    </button>
  )
}

/** The whole menu on its own page: every category, every item, sticky category nav. */
export function FullMenu() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(categories[0].id)
  const [dock, setDock] = useState(false)

  // direct visits have no preloader, so release the page ourselves
  useEffect(() => markReady(), [])

  // scroll-spy + keep the bar clear of the header when it slides back in
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const foot = document.querySelector("footer")?.getBoundingClientRect().top
      setDock(y > 380 && (foot ?? Infinity) > window.innerHeight - 40)
      let cur = categories[0].id
      for (const c of [...categories, { id: "order" }]) {
        const el = document.getElementById(`cat-${c.id}`)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4)
          cur = c.id
      }
      setActive(cur)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const split = SplitText.create(".pg-title", {
        type: "chars",
        mask: "chars",
      })
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.05,
        delay: 0.15,
      })
      gsap.from(".pg-sub", { y: 24, opacity: 0, duration: 0.9, delay: 0.5 })
      gsap.utils.toArray<HTMLElement>(".cat-title").forEach((el) => {
        const s = SplitText.create(el, { type: "chars", mask: "chars" })
        gsap.from(s.chars, {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.04,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        })
      })
    },
    { scope: root }
  )

  return (
    <section
      id="top"
      ref={root}
      className="bg-milk px-5 pt-24 pb-20 md:px-10 md:pt-36 md:pb-40"
    >
      <div className="mx-auto max-w-[1500px]">
        <p className="pg-sub font-script text-[clamp(1.8rem,3.5vw,3rem)] leading-none text-clay">
          everything we bake
        </p>
        <h1 className="pg-title mt-2 text-[clamp(4.5rem,18vw,17rem)] wordmark leading-[1]! text-clay">
          Menu
        </h1>

        <nav
          aria-label="Menu categories"
          className="mt-4 grid auto-cols-fr grid-flow-col gap-1.5 md:mt-6 md:flex md:gap-2"
        >
          {CHIPS.map((c) => (
            <Chip key={c.id} c={c} on={active === c.id} />
          ))}
        </nav>

        {categories.map((c) => (
          <div
            key={c.id}
            id={`cat-${c.id}`}
            className="scroll-mt-32 pt-10 md:pt-24"
          >
            <div className="mb-5 flex items-end justify-between gap-4 md:mb-12">
              <h2 className="cat-title text-[clamp(2.75rem,10vw,9rem)] wordmark leading-[1]! text-cocoa">
                {c.title}
              </h2>
              <div className="mb-2 shrink-0 rotate-3 rounded-[1.2rem] bg-butter py-2 pr-4 pl-6 text-cocoa shadow-[0_14px_30px_-14px_rgba(59,30,26,0.5)] md:mb-3 md:rounded-[1.4rem] md:py-3 md:pr-6 md:pl-8">
                <p className="text-[clamp(1.9rem,5vw,4.5rem)] wordmark">
                  {c.tag.big}
                </p>
                <p className="-mt-1 text-sm font-bold md:text-base">
                  {c.tag.small}
                </p>
              </div>
            </div>
            {c.layout === "rows" ? (
              <RowsView cat={c} full />
            ) : (
              <CardsView cat={c} full />
            )}
          </div>
        ))}

        <div id="cat-order" className="scroll-mt-28">
          <OrderInfo />
        </div>
      </div>
      <nav
        aria-label="Jump to a category"
        className={cn(
          "fixed bottom-4 left-1/2 z-50 grid -translate-x-1/2 auto-cols-fr grid-flow-col gap-1 rounded-full bg-cocoa/90 p-1.5 shadow-[0_18px_40px_-14px_rgba(59,30,26,0.7)] backdrop-blur-md transition-[transform,opacity] duration-500 ease-studio max-md:w-[calc(100vw-1.5rem)]",
          dock
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-24 opacity-0"
        )}
      >
        {CHIPS.map((c) => (
          <Chip key={c.id} c={c} on={active === c.id} dark />
        ))}
      </nav>
    </section>
  )
}
