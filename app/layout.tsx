import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Yellowtail } from "next/font/google"

import "./globals.css"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--font-sans",
})

const script = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.full} | Cakepops, cookies & rolls in Atlanta`,
    template: `%s | ${site.full}`,
  },
  description: site.description,
  applicationName: site.full,
  keywords: [
    "Papa E's Bakery",
    "cakepops",
    "cake pops",
    "cookies",
    "cinnamon rolls",
    "home bakery",
    "Atlanta bakery",
    "Atlanta GA",
    "custom orders",
  ],
  authors: [{ name: site.full }],
  creator: site.full,
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, title: site.name, statusBarStyle: "default" },
  openGraph: {
    type: "website",
    siteName: site.full,
    locale: "en_US",
    url: "/",
    title: `${site.full} | Cakepops, cookies & rolls in Atlanta`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.full} | Cakepops, cookies & rolls in Atlanta`,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#A66259",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(sans.variable, script.variable)}
    >
      <head>
        {/* Intro plays once a day. Decided before paint so a returning visitor never sees the loader. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=+localStorage.getItem("pe-intro");if(t&&Date.now()-t<864e5&&!/[?&]intro/.test(location.search))document.documentElement.dataset.skip="1"}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
