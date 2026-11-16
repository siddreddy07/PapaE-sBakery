"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "motion/react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ShoppingBag, X } from "lucide-react"

import { NavLink } from "@/components/nav-link"
import { Roll } from "@/components/roll"
import { lockScroll, scrollToTarget } from "@/components/smooth-scroll"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { prefersReducedMotion, whenReady } from "@/lib/intro"
import { photos } from "@/lib/menu"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP)

const LINKS = [{ label: "Home", href: "/" }, ...site.nav]

function Bars({ className }: { className?: string }) {
  return (
    <span className={cn("grid gap-[5px]", className)}>
      <span className="block h-0.5 w-5 rounded-full bg-current transition-transform duration-500 ease-studio group-hover:translate-x-0.5" />
      <span className="block h-0.5 w-3.5 rounded-full bg-current transition-transform duration-500 ease-studio group-hover:translate-x-2" />
    </span>
  )
}

export function SiteHeader() {
  const scope = useRef<HTMLElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const [hot, setHot] = useState<string | null>(null)
  const [stuck, setStuck] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [peek, setPeek] = useState(0)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const panel = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const after = useRef<(() => void) | null>(null)

  // frosted bar once scrolled, tucks away on scroll down, returns on scroll up
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setStuck(y > 24)
      if (y > last + 2 && y > 320) setHidden(true)
      else if (y < last - 2 || y <= 320) setHidden(false)
      last = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.set(".hd-in", { yPercent: -120, opacity: 0 })
      return whenReady(() =>
        gsap.to(".hd-in", {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "back.out(1.5)",
          stagger: 0.08,
          delay: 0.35,
        })
      )
    },
    { scope }
  )

  const openMenu = (from: HTMLElement) => {
    const el = panel.current
    if (!el) return
    const r = from.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const W = window.innerWidth
    const H = window.innerHeight
    const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 20
    setPeek(0)
    setMenuOpen(true)
    lockScroll(true)
    tl.current?.kill()
    const t = gsap.timeline({
      onReverseComplete: () => {
        gsap.set(el, { visibility: "hidden" })
        lockScroll(false)
        setMenuOpen(false)
        const go = after.current
        after.current = null
        go?.()
      },
    })
    t.set(el, { visibility: "visible" }, 0)
      .fromTo(
        el,
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        {
          clipPath: `circle(${R}px at ${x}px ${y}px)`,
          duration: 1,
          ease: "power3.inOut",
        },
        0
      )
      .from(
        ".mm-close",
        { scale: 0, rotation: -120, duration: 0.7, ease: "back.out(1.8)" },
        0.35
      )
      .from(
        ".mm-item",
        { yPercent: 115, duration: 0.95, ease: "power4.out", stagger: 0.08 },
        0.4
      )
      .from(
        ".mm-fade",
        { opacity: 0, y: 24, duration: 0.7, ease: "power3.out", stagger: 0.07 },
        0.55
      )
      .from(
        ".mm-photo",
        {
          scale: 0.85,
          opacity: 0,
          rotation: 6,
          duration: 1,
          ease: "power3.out",
        },
        0.5
      )
    tl.current = t
  }

  const closeMenu = (then?: () => void) => {
    after.current = then ?? null
    tl.current?.timeScale(1.25).reverse()
  }

  // Esc closes the menu
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])

  const goTo = (href: string) =>
    closeMenu(() => {
      if (href.startsWith("#")) scrollToTarget(href)
      else if (href.startsWith("/#") && window.location.pathname === "/")
        scrollToTarget(href.slice(1))
      else router.push(href)
    })

  const floating = hidden && !menuOpen

  return (
    <header
      ref={scope}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[transform,background-color,backdrop-filter,box-shadow] duration-[700ms] ease-studio",
        stuck &&
          "bg-milk/80 shadow-[0_10px_30px_-18px_rgba(59,30,26,0.35)] backdrop-blur-md",
        floating && "-translate-y-full"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1800px] items-center justify-between px-5 transition-[height] duration-[700ms] ease-studio md:px-10",
          stuck ? "h-16" : "h-20"
        )}
      >
        <NavLink
          href="/"
          aria-label={`${site.full}, back to top`}
          className="group flex items-center gap-2.5"
        >
          <Image
            src="/mark-clay.png"
            alt=""
            width={433}
            height={477}
            priority
            className="hd-mark h-11 w-auto transition-transform duration-500 ease-studio group-hover:scale-110 group-hover:-rotate-6"
          />
          <span className="hd-in text-[2.1rem] wordmark leading-[1]! text-clay">
            {site.name}
          </span>
        </NavLink>

        <nav
          aria-label="Main"
          onPointerLeave={() => setHot(null)}
          className="hidden items-center gap-1 md:flex"
        >
          {site.nav.map((l) => {
            const here = l.href === pathname
            return (
              <NavLink
                key={l.href}
                href={l.href}
                onPointerEnter={() => setHot(l.href)}
                onFocus={() => setHot(l.href)}
                onBlur={() => setHot(null)}
                className="hd-in group relative rounded-full px-5 py-2.5 text-[15px] font-semibold text-cocoa"
              >
                {(hot === l.href || (hot === null && here)) && (
                  <motion.span
                    layoutId="nav-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-butter"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                  />
                )}
                <Roll className="relative">{l.label}</Roll>
              </NavLink>
            )
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label="Open your box (0 items)"
            className="hd-in group relative grid size-12 place-items-center rounded-full bg-milk text-cocoa ring-1 ring-cocoa/10 transition-colors duration-300 hover:bg-cocoa hover:text-milk"
          >
            <ShoppingBag className="size-5 group-hover:animate-wiggle" />
            <span className="absolute -top-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-clay text-[11px] font-bold text-milk">
              0
            </span>
          </button>

          <NavLink
            href="/menu"
            className="hd-in group relative hidden h-12 items-center overflow-hidden rounded-full bg-clay px-6 text-[15px] font-semibold text-milk sm:inline-flex"
          >
            <span className="absolute inset-0 translate-y-full rounded-[50%_50%_0_0/100%_100%_0_0] bg-cocoa transition-transform duration-500 ease-studio group-hover:translate-y-0" />
            <Roll className="relative">Order now</Roll>
          </NavLink>

          <button
            type="button"
            onClick={(e) => openMenu(e.currentTarget)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="hd-in group grid size-12 place-items-center rounded-full bg-cocoa text-milk md:hidden"
          >
            <Bars />
          </button>
        </div>
      </div>

      {mounted &&
        createPortal(
          <>
            {/* when the bar tucks away, the menu stays one tap away */}
            <button
              type="button"
              onClick={(e) => openMenu(e.currentTarget)}
              aria-label="Open menu"
              tabIndex={floating ? 0 : -1}
              className={cn(
                "group fixed top-4 right-5 z-[60] grid size-14 place-items-center rounded-full bg-cocoa text-milk shadow-[0_12px_30px_-10px_rgba(59,30,26,0.6)] transition-[transform,opacity] duration-500 ease-studio md:right-10",
                floating
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-0 opacity-0"
              )}
            >
              <Bars />
            </button>

            <div
              ref={panel}
              data-lenis-prevent
              aria-hidden={!menuOpen}
              role="dialog"
              aria-label="Menu"
              className="invisible fixed inset-0 z-[70] overflow-hidden bg-clay text-milk"
            >
              <Image
                src="/mark-cream.png"
                alt=""
                width={433}
                height={477}
                aria-hidden
                className="mm-fade pointer-events-none absolute -right-16 bottom-24 h-[55svh] w-auto rotate-12 opacity-[0.08] md:hidden"
              />

              <div className="flex h-20 items-center justify-between px-5 md:px-10">
                <span className="mm-fade flex items-center gap-2.5">
                  <Image
                    src="/mark-cream.png"
                    alt=""
                    width={433}
                    height={477}
                    className="h-11 w-auto"
                  />
                  <span className="text-[2.1rem] wordmark leading-[1]!">
                    {site.name}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => closeMenu()}
                  aria-label="Close menu"
                  className="mm-close group grid size-12 place-items-center rounded-full bg-milk text-clay"
                >
                  <X className="size-5 transition-transform duration-500 ease-studio group-hover:rotate-90" />
                </button>
              </div>

              <div className="grid h-[calc(100svh-5rem)] md:grid-cols-[1.1fr_0.9fr]">
                <nav className="flex flex-col justify-center gap-1 px-5 pb-40 md:px-10 md:pb-24">
                  {LINKS.map((l, i) => (
                    <span key={l.href} className="block overflow-hidden py-1">
                      <a
                        href={l.href}
                        onPointerEnter={() => setPeek(i)}
                        onFocus={() => setPeek(i)}
                        onClick={(e) => {
                          e.preventDefault()
                          goTo(l.href)
                        }}
                        className={cn(
                          "mm-item block text-[clamp(3.75rem,19vw,7rem)] wordmark leading-[1]! md:text-[clamp(4.5rem,9vw,9rem)]",
                          "md:transition-opacity md:duration-500 md:[nav:hover_&]:opacity-35 md:[nav:hover_&:hover]:opacity-100"
                        )}
                      >
                        {l.label}
                      </a>
                    </span>
                  ))}
                </nav>

                <div className="relative hidden items-center justify-center pr-10 pb-24 md:flex">
                  <div className="mm-photo relative aspect-[4/5] h-[min(58svh,34rem)] rotate-3 rounded-[0.4rem] bg-white p-3 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.5)]">
                    <div className="relative h-full w-full overflow-hidden">
                      {LINKS.map((l, i) => (
                        <Image
                          key={l.href}
                          src={photos[i % photos.length].image}
                          alt=""
                          fill
                          sizes="30vw"
                          className={cn(
                            "object-cover transition-[opacity,transform] duration-700 ease-studio",
                            peek === i
                              ? "scale-100 opacity-100"
                              : "scale-110 opacity-0"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-5 bottom-6 flex flex-col gap-4 md:inset-x-10 md:flex-row md:items-center md:justify-between">
                <a
                  href="/menu"
                  onClick={(e) => {
                    e.preventDefault()
                    goTo("/menu")
                  }}
                  className="mm-fade grid h-14 place-items-center rounded-full bg-butter px-10 text-base font-semibold text-cocoa"
                >
                  Order now
                </a>
                <div className="mm-fade flex items-center justify-between gap-8 text-sm text-milk/80">
                  <a href={site.socials[0].href}>Instagram</a>
                  <span>{site.contact.place}</span>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}

      {/* cart: empty state only for now */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="bg-milk">
          <SheetHeader className="p-6 pb-0">
            <SheetTitle className="text-2xl font-extrabold">
              Your box
            </SheetTitle>
            <SheetDescription>Nothing in here yet.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-16 text-center">
            <div className="relative h-44 w-52">
              {photos.slice(0, 3).map((p, k) => (
                <span
                  key={p.id}
                  className="absolute top-0 size-32 overflow-hidden rounded-md border-4 border-white shadow-lg"
                  style={{
                    left: `${k * 32}px`,
                    top: `${k % 2 ? 24 : 0}px`,
                    rotate: `${(k - 1) * 9}deg`,
                  }}
                >
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </span>
              ))}
            </div>
            <p className="max-w-[24ch] text-lg text-cocoa/70">
              Pick a dozen from the menu and it will land here.
            </p>
            <button
              type="button"
              onClick={() => {
                setCartOpen(false)
                window.setTimeout(() => router.push("/menu"), 380)
              }}
              className="h-12 rounded-full bg-clay px-7 font-semibold text-milk transition-colors hover:bg-cocoa"
            >
              See the flavors
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
