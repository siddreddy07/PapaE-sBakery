"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"

import { scrollToTarget } from "@/components/smooth-scroll"

/** Internal link. "/#story" glides when already on the home page, otherwise navigates. */
export function NavLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname()
  const h = String(href)
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (h.startsWith("/#") && pathname === "/") {
          e.preventDefault()
          scrollToTarget(h.slice(1))
        }
        onClick?.(e)
      }}
      {...props}
    />
  )
}
