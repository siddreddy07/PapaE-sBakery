/**
 * THE menu file. Add a category or an item here and the switcher, lists, counts and hero cards update.
 *
 * Two layouts:
 *  - "rows"  : a hover list (used for cakepops; items share one price)
 *  - "cards" : photo cards with their own detail + price (used for seasonal specials)
 *
 * `coat` / `drip` / `bits` only style the drawn cakepop. For specials, set `image`
 * (a path in /public) to replace the placeholder with a real photo.
 */
export type Flavor = {
  id: string
  name: string
  coat: string
  drip?: string
  bits?: string[]
  bitShape?: "dots" | "crumbs" | "sprinkles"
}

export type Special = {
  id: string
  name: string
  detail: string
  /** omit to show "DM for price" */
  price?: number
  tone: "mint" | "butter" | "blush" | "clay"
  image?: string
  /** optional second photo, fades in on hover */
  hover?: string
}

type Base = {
  id: string
  title: string
  /** the little sticker next to the category title */
  tag: { big: string; small: string }
  count: string
  /** how many items the homepage shows before "Show all" (omit to show everything) */
  preview?: number
}

export type RowCategory = Base & {
  layout: "rows"
  price: number
  unit: string
  note?: string
  items: Flavor[]
}

export type CardCategory = Base & {
  layout: "cards"
  items: Special[]
}

export type Category = RowCategory | CardCategory

const cakepopItems: Flavor[] = [
  {
    id: "cookies-and-cream",
    name: "Cookies & Cream",
    coat: "#F4EAE4",
    drip: "#3B2623",
    bits: ["#2B1D1B", "#4a3430"],
    bitShape: "crumbs",
  },
  {
    id: "cosmic-brownie",
    name: "Cosmic Brownie",
    coat: "#4A2722",
    bits: ["#FF6FB1", "#6EC6FF", "#FFD95A", "#9B6BFF"],
    bitShape: "sprinkles",
  },
  {
    id: "cookie-dough",
    name: "Cookie Dough",
    coat: "#E8B97F",
    drip: "#F4D9AE",
    bits: ["#4A2722"],
    bitShape: "dots",
  },
  {
    id: "biscoff-cookie",
    name: "Biscoff Cookie",
    coat: "#C98A4B",
    drip: "#F0C38C",
    bits: ["#8A5A2B", "#E3B27A"],
    bitShape: "crumbs",
  },
  {
    id: "fruity-pebbles",
    name: "Fruity Pebbles",
    coat: "#FFF3F6",
    bits: ["#FF6F91", "#FFD95A", "#6EC6FF", "#8DE0B1", "#FF9F45"],
    bitShape: "dots",
  },
  {
    id: "lemon-bar",
    name: "Lemon Bar",
    coat: "#FFE45E",
    drip: "#FFF6C9",
    bits: ["#FFFBE0"],
    bitShape: "crumbs",
  },
  {
    id: "strawberry-crunch",
    name: "Strawberry Crunch",
    coat: "#FF8FA9",
    bits: ["#FFD1DC", "#FF5C86"],
    bitShape: "crumbs",
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    coat: "#B4233B",
    drip: "#FFF6F1",
    bits: ["#8F1A2E", "#D44A60"],
    bitShape: "crumbs",
  },
  { id: "chocolate", name: "Chocolate", coat: "#5A3028", drip: "#3B1E1A" },
  {
    id: "vanilla",
    name: "Vanilla",
    coat: "#FFEFC4",
    bits: ["#FFD9A0", "#FFFFFF"],
    bitShape: "sprinkles",
  },
]

// PRICES + NAMES for these are guesses from the photos: confirm with the owner.
const cookieItems: Special[] = [
  {
    id: "chocolate-chip-cookies",
    name: "Chocolate Chip Cookies",
    detail: "sea salt, gooey center",
    tone: "butter",
    image: "/menu/choc-chip-cookies.jpg",
  },
  {
    id: "biscoff-cookies",
    name: "Biscoff Cookies",
    detail: "white chocolate, biscoff drizzle",
    tone: "blush",
    image: "/menu/biscoff-cookies.jpg",
  },
]

const seasonalItems: Special[] = [
  {
    id: "pumpkin-oatmeal-cream-pies",
    name: "Pumpkin Oatmeal Cream Pies",
    detail: "6 cookies",
    price: 24,
    tone: "butter",
  },
  {
    id: "maple-harvest-rolls",
    name: "Maple Harvest Rolls",
    detail: "4 rolls",
    price: 30,
    tone: "blush",
    image: "/menu/maple-harvest-rolls.jpg",
    hover: "/menu/maple-harvest-rolls-inside.jpg",
  },
  {
    id: "pumpkin-spice-cakepops",
    name: "Pumpkin Spice Cakepops",
    detail: "12 pops",
    price: 36,
    tone: "mint",
  },
  {
    id: "pumpkin-spice-rolls",
    name: "Pumpkin Spice Rolls",
    detail: "4 rolls",
    price: 30,
    tone: "clay",
    image: "/menu/pumpkin-spice-rolls-frosting.jpg",
  },
]

export const cakepops: RowCategory = {
  id: "cakepops",
  title: "Cakepops",
  layout: "rows",
  preview: 6,
  price: 36,
  unit: "dozen",
  note: "Follow for new flavors!",
  tag: { big: "$36", small: "per dozen, any flavor" },
  count: `${cakepopItems.length} flavors`,
  items: cakepopItems,
}

export const seasonal: CardCategory = {
  id: "seasonal",
  title: "Seasonal",
  layout: "cards",
  preview: 4,
  tag: { big: String(seasonalItems.length), small: "seasonal treats" },
  count: `${seasonalItems.length} specials`,
  items: seasonalItems,
}

export const cookies: CardCategory = {
  id: "cookies",
  title: "Cookies",
  layout: "cards",
  preview: 2,
  tag: { big: String(cookieItems.length), small: "cookie flavors" },
  count: `${cookieItems.length} flavors`,
  items: cookieItems,
}

export const categories: Category[] = [cakepops, seasonal, cookies]

export const allFlavors = cakepops.items

export function getFlavor(id: string): Flavor {
  return allFlavors.find((f) => f.id === id) ?? allFlavors[0]
}

const allSpecials = [...seasonal.items, ...cookies.items]

export function getSpecial(id: string): Special {
  return allSpecials.find((x) => x.id === id) ?? allSpecials[0]
}

/** every item that has a real photo, for decorative use around the site */
export const photos = allSpecials.filter(
  (x): x is Special & { image: string } => !!x.image
)

/** What the cart needs to know about any orderable item (cakepop flavor or special). */
export type Orderable = {
  id: string
  name: string
  detail: string
  /** undefined = "DM for price" */
  price?: number
  flavor?: Flavor
  image?: string
}

export function findOrderable(id: string): Orderable | undefined {
  const f = cakepops.items.find((x) => x.id === id)
  if (f)
    return {
      id: f.id,
      name: f.name,
      detail: `1 ${cakepops.unit} cakepops`,
      price: cakepops.price,
      flavor: f,
    }
  const s = allSpecials.find((x) => x.id === id)
  if (s)
    return {
      id: s.id,
      name: s.name,
      detail: s.detail,
      price: s.price,
      image: s.image,
    }
}
