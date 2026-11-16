import { cn } from "@/lib/utils"

/** Text that rolls up to a twin on hover. Put `group` on the parent link/button. */
export function Roll({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const t =
    "block transition-transform duration-500 ease-studio group-hover:-translate-y-full group-focus-visible:-translate-y-full"
  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden align-top",
        className
      )}
    >
      <span className={t}>{children}</span>
      <span aria-hidden className={cn(t, "absolute top-full left-0")}>
        {children}
      </span>
    </span>
  )
}
