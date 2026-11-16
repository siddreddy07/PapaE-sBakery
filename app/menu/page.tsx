import type { Metadata } from "next"

import { Cursor } from "@/components/cursor"
import { FullMenu } from "@/components/menu-page"
import { SiteHeader } from "@/components/site-header"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Footer } from "@/components/story"

const desc =
  "Every cakepop flavor, seasonal special and cookie from Papa E's Bakery in Atlanta, GA, with prices and how to order."

export const metadata: Metadata = {
  title: "Menu",
  description: desc,
  alternates: { canonical: "/menu" },
  openGraph: {
    url: "/menu",
    title: "Menu | Papa E's Bakery",
    description: desc,
  },
  twitter: { title: "Menu | Papa E's Bakery", description: desc },
}

export default function MenuPage() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <SiteHeader />
      <main>
        <FullMenu />
      </main>
      <Footer />
    </>
  )
}
