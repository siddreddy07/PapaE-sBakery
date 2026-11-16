import { cn } from "@/lib/utils"

const TILE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 24" preserveAspectRatio="none"><path d="M0 12C13 -2 27 -2 40 12S67 26 80 12V24H0Z"/></svg>`
)

/** Wavy section edge. Colour = the section BELOW it. Sits on the bottom edge of the section above. */
export function Wave({
  className,
  color = "var(--milk)",
}: {
  className?: string
  color?: string
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none h-6 w-full md:h-9", className)}
      style={{
        backgroundColor: color,
        maskImage: `url("data:image/svg+xml,${TILE}")`,
        maskSize: "80px 100%",
        maskRepeat: "repeat-x",
        WebkitMaskImage: `url("data:image/svg+xml,${TILE}")`,
        WebkitMaskSize: "80px 100%",
        WebkitMaskRepeat: "repeat-x",
      }}
    />
  )
}
