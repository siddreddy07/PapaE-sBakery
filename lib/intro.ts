/** Tiny handshake between the preloader and everything that animates in after it. */
const EVENT = "pe:ready"

export function markReady() {
  // Deferred on purpose: called from inside a GSAP timeline, whose scoped context would
  // otherwise leak into every listener and make their string selectors miss.
  window.setTimeout(() => {
    document.documentElement.dataset.ready = "true"
    window.dispatchEvent(new Event(EVENT))
  }, 0)
}

/** Runs `cb` once the preloader is gone (immediately if it already is). */
export function whenReady(cb: () => void) {
  if (document.documentElement.dataset.ready) {
    cb()
    return () => {}
  }
  const handler = () => cb()
  window.addEventListener(EVENT, handler, { once: true })
  return () => window.removeEventListener(EVENT, handler)
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export const hasFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches
