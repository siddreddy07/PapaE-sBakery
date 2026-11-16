/** Brand text, nav and links. Edit here; the whole site follows. */
export const site = {
  // Set NEXT_PUBLIC_SITE_URL to the real domain at launch so share links resolve.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  ),
  name: "Papa E's",
  full: "Papa E's Bakery",
  description:
    "Papa E's Bakery in Atlanta, GA: cakepops, cookies and cinnamon-style rolls baked with love. See the full menu and order by DM.",
  nav: [
    { label: "Menu", href: "/menu" },
    { label: "Our story", href: "/#story" },
    { label: "Visit", href: "/#visit" },
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/papa_e_bakery/" },
  ],
  contact: {
    email: "", // hidden for now. Set papa.e.bakery@gmail.com to show it again.
    place: "Atlanta, GA",
    mapHref: "https://www.google.com/maps/search/?api=1&query=Atlanta%2C+GA",
  },
  bio: "Atlanta, GA | 16 year old baker",
  /** "Before you order" notes, straight from the menu */
  orderSteps: [
    {
      title: "Order a few days ahead",
      body: "Larger orders need extra prep time.",
    },
    {
      title: "DM us to order",
      body: "Send your order request as a message on Instagram.",
    },
    {
      title: "Planning an event?",
      body: "Parties, events and big quantities are welcome. Reach out and we'll be happy to help.",
    },
  ],
  thanks: "Thank you for understanding and for supporting our small business!",
}
