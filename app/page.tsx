import { Cursor } from "@/components/cursor"
import { Hero } from "@/components/hero"
import { Marquee, MenuSection } from "@/components/menu-list"
import { Preloader } from "@/components/preloader"
import { SiteHeader } from "@/components/site-header"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Footer, Story, Visit } from "@/components/story"
import { site } from "@/lib/site"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: site.full,
  description: site.description,
  url: site.url,
  image: `${site.url}/opengraph-image.jpg`,
  logo: `${site.url}/icon-512.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    addressCountry: "US",
  },
  sameAs: site.socials.map((x) => x.href),
  hasMenu: `${site.url}/menu`,
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SmoothScroll />
      <Cursor />
      <Preloader />
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <MenuSection />
        <Story />
        <Visit />
      </main>
      <Footer />
    </>
  )
}
