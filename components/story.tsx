"use client"

import { useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import { ArrowUp, ArrowUpRight, Mail, MapPin } from "lucide-react"

import { NavLink } from "@/components/nav-link"
import { Roll } from "@/components/roll"
import { scrollToTarget } from "@/components/smooth-scroll"
import { Wave } from "@/components/wave"
import { prefersReducedMotion } from "@/lib/intro"
import { allFlavors, cakepops } from "@/lib/menu"
import { site } from "@/lib/site"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/* PLACEHOLDER COPY: replace with the owner's real story. */
const STORY =
  "Papa E's is a one-baker bakery in Atlanta, run by a 16 year old with one rule: make people smile. Cakepops, cookies and rolls, all made with love. New flavors keep coming, so follow along."

export function Story() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const head = SplitText.create(".story-title", {
        type: "words",
        mask: "words",
      })
      gsap.from(head.words, {
        yPercent: 110,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.09,
        scrollTrigger: {
          trigger: ".story-title",
          start: "top 85%",
          once: true,
        },
      })
      // paragraph lights up word by word as you scroll through it
      const body = SplitText.create(".story-body", { type: "words" })
      gsap.fromTo(
        body.words,
        { opacity: 0.22 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".story-body",
            start: "top bottom",
            end: "top 35%",
            scrub: true,
          },
        }
      )
      gsap.from(".story-logo", {
        rotation: -8,
        scale: 0.85,
        duration: 1.3,
        ease: "elastic.out(1,0.55)",
        scrollTrigger: { trigger: ".story-logo", start: "top 80%", once: true },
      })
    },
    { scope: root }
  )

  return (
    <section id="story" ref={root} className="relative bg-clay text-milk">
      <Wave
        color="var(--clay)"
        className="absolute inset-x-0 top-0 -translate-y-full"
      />
      <div className="mx-auto grid max-w-[1500px] items-center gap-14 px-5 py-24 md:px-10 md:py-36 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="story-logo relative mx-auto w-[min(62vw,22rem)] lg:w-[min(30vw,26rem)]">
          <Image
            src="/logo-cream.png"
            alt="Papa E's Bakery logo"
            width={433}
            height={618}
            className="h-auto w-full"
          />
          <span className="absolute top-[6%] -right-[6%] rotate-12 rounded-full bg-mint px-4 py-2 text-sm font-bold text-cocoa shadow-lg md:text-base">
            made with love
          </span>
        </div>
        <div>
          <h2 className="story-title text-[clamp(3.5rem,9vw,8.5rem)] wordmark leading-[1]!">
            Papa E&rsquo;s story
          </h2>
          <p className="story-body mt-8 max-w-[30ch] text-[clamp(1.5rem,2.8vw,2.6rem)] leading-snug font-medium md:mt-10">
            {STORY}
          </p>
        </div>
      </div>
    </section>
  )
}

const CONTACT = [
  {
    icon: Mail,
    label: site.contact.email,
    href: `mailto:${site.contact.email}`,
  },
  { icon: MapPin, label: site.contact.place, href: site.contact.mapHref },
]

export function Visit() {
  const price = cakepops.price
  return (
    <section id="visit" className="relative bg-blush">
      <Wave
        color="var(--blush)"
        className="absolute inset-x-0 top-0 -translate-y-full"
      />
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-24 md:px-10 md:py-36 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="font-script text-[clamp(2rem,4vw,3.5rem)] leading-none text-cocoa">
            follow for new flavors
          </p>
          <h2 className="mt-3 text-[clamp(4rem,8.5vw,8.5rem)] wordmark text-clay">
            Come say hi
          </h2>
          <p className="mt-6 max-w-[32ch] text-lg text-cocoa/80 md:text-xl">
            {allFlavors.length} flavors, ${price} a dozen. Message us to plan
            your next box.
          </p>
          <a
            href={site.socials[0].href}
            className="group relative mt-8 inline-flex h-14 items-center overflow-hidden rounded-full bg-cocoa px-8 text-base font-semibold text-milk"
          >
            <span className="absolute inset-0 translate-y-full rounded-[50%_50%_0_0/100%_100%_0_0] bg-clay transition-transform duration-500 ease-studio group-hover:translate-y-0" />
            <Roll className="relative">Message on Instagram</Roll>
          </a>
        </div>

        {/* PLACEHOLDER contact details: set the real ones in lib/site.ts */}
        <ul className="flex flex-col gap-3">
          {CONTACT.filter((c) => c.label).map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="group relative flex items-center gap-4 overflow-hidden rounded-full bg-milk px-6 py-5 text-lg font-medium text-cocoa transition-colors duration-500 hover:text-milk md:text-xl"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-cocoa transition-transform duration-500 ease-studio group-hover:scale-x-100" />
                <Icon className="relative size-6 shrink-0" />
                <span className="relative flex-1 truncate">{label}</span>
                <ArrowUpRight className="relative size-6 transition-transform duration-500 ease-studio group-hover:rotate-45" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative bg-clay text-milk">
      <Wave
        color="var(--clay)"
        className="absolute inset-x-0 top-0 -translate-y-full"
      />
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-6 px-5 pt-16 md:px-10 md:pt-24">
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-8 gap-y-3 text-lg font-medium"
        >
          {site.nav.map((l) => (
            <NavLink key={l.label} href={l.href} className="group">
              <Roll>{l.label}</Roll>
            </NavLink>
          ))}
          {site.socials.map((l) => (
            <a key={l.label} href={l.href} className="group">
              <Roll>{l.label}</Roll>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <p className="text-sm text-milk/75">
            &copy; {new Date().getFullYear()} {site.full}
          </p>
          <button
            type="button"
            onClick={() => scrollToTarget("#top")}
            aria-label="Back to top"
            className="group grid size-14 place-items-center rounded-full bg-milk text-clay transition-colors duration-300 hover:bg-butter hover:text-cocoa"
          >
            <ArrowUp className="size-6 transition-transform duration-500 ease-studio group-hover:-translate-y-1" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <p
          aria-label={site.name}
          className="mt-10 flex justify-center text-[36vw] wordmark leading-[0.74]! whitespace-nowrap select-none md:mt-14"
        >
          {site.name.split("").map((c, i) => (
            <span
              key={i}
              aria-hidden
              className="inline-block transition-transform duration-500 ease-studio hover:-translate-y-[7%]"
            >
              {c === " " ? " " : c}
            </span>
          ))}
        </p>
      </div>
    </footer>
  )
}
