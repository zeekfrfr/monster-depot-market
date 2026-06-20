export type CookingMethod = {
  method: string
  time: string
  result: string
}

export type Topping = {
  name: string
  price: number
  category?: string
}

export type FlavorToppings = {
  drizzle: Topping
  crunch: Topping
  elevate: Topping
  extraIncluded: Topping[]
}

export type Flavor = {
  slug: string
  name: string
  hook: string
  price: number
  sevenPackPrice: number
  mixMatchPrice: number
  bg: string
  text: string
  accent: string
  mylarColor: string
  includedTopping: string | null
  toppings: FlavorToppings
  cookingMethods: CookingMethod[]
  isSignature?: boolean
  videoPlaceholder: boolean
}

export const flavors: Flavor[] = [
  {
    slug: "vanilla-honey-crumble",
    name: "Vanilla Honey Crumble",
    hook: "Simple. But not.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "var(--vanilla-bg)",
    text: "var(--vanilla-text)",
    accent: "var(--vanilla-accent)",
    mylarColor: "Warm gold",
    includedTopping: "Honey packet + crumble packet",
    toppings: {
      drizzle:      { name: "Caramel drizzle", price: 0.89 },
      crunch:       { name: "Pecan crumble", price: 0.99 },
      elevate:      { name: "Cinnamon sugar packet", price: 0.79 },
      extraIncluded: [
        { name: "Extra honey packet", price: 0.89 },
        { name: "Extra crumble packet", price: 0.79 }
      ]
    },
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  },
  {
    slug: "apple-fritter",
    name: "Apple Fritter",
    hook: "The internet already loves this one.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "var(--fritter-bg)",
    text: "var(--fritter-text)",
    accent: "var(--fritter-accent)",
    mylarColor: "Caramel brown",
    includedTopping: "Cinnamon sugar packet",
    toppings: {
      drizzle:      { name: "Caramel drizzle", price: 0.89 },
      crunch:       { name: "Walnut crumble", price: 0.99 },
      elevate:      { name: "Honey drizzle", price: 0.89 },
      extraIncluded: [
        { name: "Extra cinnamon sugar", price: 0.79 }
      ]
    },
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  },
  {
    slug: "strawberry-shortcake",
    name: "Strawberry Shortcake",
    hook: "The one you grew up on. Better.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "var(--strawberry-bg)",
    text: "var(--strawberry-text)",
    accent: "var(--strawberry-accent)",
    mylarColor: "Strawberry red",
    includedTopping: "Freeze dried strawberries",
    toppings: {
      drizzle:      { name: "Strawberry jam reserve", price: 1.29 },
      crunch:       { name: "Vanilla crumble", price: 0.79 },
      elevate:      { name: "Freeze dried blueberries", price: 0.99 },
      extraIncluded: [
        { name: "Extra freeze dried strawberries", price: 0.99 }
      ]
    },
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  },
  {
    slug: "blueberry-cake-donut",
    name: "Blueberry Cake Donut",
    hook: "You already know.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "var(--blueberry-bg)",
    text: "var(--blueberry-text)",
    accent: "var(--blueberry-accent)",
    mylarColor: "Deep purple",
    includedTopping: "Freeze dried blueberries",
    toppings: {
      drizzle:      { name: "Vanilla cream drizzle", price: 0.99 },
      crunch:       { name: "Almond crumble", price: 0.99 },
      elevate:      { name: "Blueberry jam reserve", price: 1.29 },
      extraIncluded: [
        { name: "Extra freeze dried blueberries", price: 0.99 }
      ]
    },
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  },
  {
    slug: "monster-cookie",
    name: "Monster Cookie",
    hook: "Watch what happens.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "var(--monster-bg)",
    text: "var(--monster-text)",
    accent: "var(--monster-accent)",
    mylarColor: "Cobalt blue",
    includedTopping: null,
    isSignature: true,
    toppings: {
      drizzle:      { name: "Honey drizzle", price: 0.89 },
      crunch:       { name: "Vanilla crumble", price: 0.79 },
      elevate:      { name: "Freeze dried blueberries", price: 0.99 },
      extraIncluded: []
    },
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  }
]

export const allToppings: Topping[] = [
  { name: "Vanilla cream drizzle",    category: "Drizzle", price: 0.99 },
  { name: "Caramel drizzle",          category: "Drizzle", price: 0.89 },
  { name: "Honey drizzle",            category: "Drizzle", price: 0.89 },
  { name: "Strawberry jam reserve",   category: "Drizzle", price: 1.29 },
  { name: "Blueberry jam reserve",    category: "Drizzle", price: 1.29 },
  { name: "Almond crumble",           category: "Crunch",  price: 0.99 },
  { name: "Walnut crumble",           category: "Crunch",  price: 0.99 },
  { name: "Pecan crumble",            category: "Crunch",  price: 0.99 },
  { name: "Vanilla crumble",          category: "Crunch",  price: 0.79 },
  { name: "Cinnamon sugar packet",    category: "Crunch",  price: 0.79 },
  { name: "Freeze dried blueberries", category: "Elevate", price: 0.99 },
  { name: "Freeze dried strawberries",category: "Elevate", price: 0.99 },
]

// Subscription product — modeled as a one-time charge for launch (no recurring
// billing wired yet). Surfaced on /subscribe and added to cart as 'weekly-sub'.
export const WEEKLY_SUB_PRICE = 27.99

export function getFlavor(slug: string): Flavor | undefined {
  return flavors.find((f) => f.slug === slug)
}

// monster-cookie / vanilla-honey-crumble / apple-fritter now use white text
// (--*-text = #FFFFFF), which reads cleanly on their dark backgrounds — so the
// light scrim is no longer needed anywhere.
export function needsTextScrim(_slug: string): boolean {
  return false
}
