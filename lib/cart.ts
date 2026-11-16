"use client"

import { useSyncExternalStore } from "react"

import { findOrderable, type Orderable } from "@/lib/menu"

export type CartLine = { id: string; qty: number }
export type DetailedLine = CartLine & { item: Orderable }

const KEY = "pe-cart"
const MAX_QTY = 20
const EMPTY: CartLine[] = []

let lines: CartLine[] = EMPTY
let loaded = false
const listeners = new Set<() => void>()
const openListeners = new Set<(open: boolean) => void>()

function load() {
  if (loaded || typeof window === "undefined") return
  loaded = true
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]")
    if (Array.isArray(raw))
      lines = raw.filter(
        (l): l is CartLine =>
          l &&
          typeof l.id === "string" &&
          Number.isInteger(l.qty) &&
          l.qty > 0 &&
          !!findOrderable(l.id)
      )
  } catch {}
}

function commit(next: CartLine[]) {
  lines = next.length ? next : EMPTY
  try {
    localStorage.setItem(KEY, JSON.stringify(lines))
  } catch {}
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  load()
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    loaded = false
    load()
    cb()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener("storage", onStorage)
  }
}

const snapshot = () => {
  load()
  return lines
}

export const cart = {
  add(id: string, qty = 1) {
    load()
    if (!findOrderable(id)) return
    const has = lines.find((l) => l.id === id)
    commit(
      has
        ? lines.map((l) =>
            l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l
          )
        : [...lines, { id, qty: Math.min(MAX_QTY, qty) }]
    )
  },
  setQty(id: string, qty: number) {
    load()
    commit(
      qty <= 0
        ? lines.filter((l) => l.id !== id)
        : lines.map((l) =>
            l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l
          )
    )
  },
  remove(id: string) {
    load()
    commit(lines.filter((l) => l.id !== id))
  },
  clear() {
    commit([])
  },
  /** open / close the drawer from anywhere */
  setOpen(open: boolean) {
    openListeners.forEach((l) => l(open))
  },
  onOpenChange(cb: (open: boolean) => void) {
    openListeners.add(cb)
    return () => {
      openListeners.delete(cb)
    }
  },
}

export function useCartLines(): CartLine[] {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY)
}

export function summarize(lines: CartLine[]) {
  const detailed: DetailedLine[] = lines.flatMap((l) => {
    const item = findOrderable(l.id)
    return item ? [{ ...l, item }] : []
  })
  const count = detailed.reduce((n, l) => n + l.qty, 0)
  const total = detailed.reduce((n, l) => n + (l.item.price ?? 0) * l.qty, 0)
  const hasQuote = detailed.some((l) => l.item.price == null)
  return { detailed, count, total, hasQuote }
}

/** Plain-text order, ready to paste into an Instagram DM. */
export function orderMessage(lines: CartLine[], name = "Papa E's Bakery") {
  const { detailed, total, hasQuote } = summarize(lines)
  const rows = detailed.map(
    (l) =>
      `- ${l.qty} x ${l.item.name} (${l.item.detail})` +
      (l.item.price != null ? `: $${l.item.price * l.qty}` : ": price?")
  )
  return [
    `Hi ${name}! I'd like to order:`,
    ...rows,
    "",
    `Total: $${total}${hasQuote ? " + items that need a price" : ""}`,
    "Pickup/delivery date: ",
  ].join("\n")
}
