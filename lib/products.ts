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
  // Names referencing TOPPINGS below — shown first in the "Make it yours" menu.
  recommendedToppings: string[]
  cookingMethods: CookingMethod[]
  isSignature?: boolean
  videoPlaceholder: boolean
  // Active launch lineup vs. hidden (Phase 2) flavors. Inactive flavors keep
  // their data but are filtered out of every public surface and 404 on route.
  active: boolean
  // New-lineup fields. Optional so the preserved Phase-2 flavors stay valid.
  tagline?: string
  description?: string
  ingredients?: {
    mix: string
    toppings: string
    contains: string
  }
}

// The three cooking methods are uniform across flavors. The method names map to
// recipe slug suffixes (mug / air-fryer / waffle-maker) in ThreeWays.
const STANDARD_METHODS: CookingMethod[] = [
  { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
  { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
  { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
]

export const flavors: Flavor[] = [
  // ---- Active launch lineup (homepage order) ----
  {
    slug: "peanut-butter-brownie-cookie",
    active: true,
    name: "Peanut Butter Brownie Cookie",
    hook: "Fudgy. Dense. Hits different.",
    tagline: "Fudgy. Dense. Hits different.",
    description: "A rich, fudgy chocolate brownie cookie with deep peanut butter flavor. Just add liquid.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "#1C0A00",
    text: "#FFFFFF",
    accent: "#C8860A",
    mylarColor: "Deep cocoa",
    includedTopping: "Peanut butter packet + honey stick",
    recommendedToppings: ["Protein Peanut Butter Drizzle", "Honey Drizzle", "Chocolate Chips"],
    cookingMethods: STANDARD_METHODS,
    videoPlaceholder: true,
    ingredients: {
      mix: "Unbleached flour, peanut butter powder, cacao powder, organic agave powder, organic grass fed butter powder, egg replacer, baking powder, sea salt.",
      toppings: "Peanut butter packet: Peanuts, palm oil, salt. Honey stick: 100% pure clover blossom honey.",
      contains: "Peanuts, dairy. May contain tree nuts."
    }
  },
  {
    slug: "cardamom-coffee-cake",
    active: true,
    name: "Cardamom Coffee Cake",
    hook: "The coffee shop. In a mug.",
    tagline: "The coffee shop. In a mug.",
    description: "A warm spiced coffee cake with cardamom, cinnamon, and a buttery stroopwafel crumble. Just add liquid.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "#D4A056",
    text: "#2C1A0E",
    accent: "#2C1A0E",
    mylarColor: "Spiced amber",
    includedTopping: "Stroopwafel crumble packet",
    recommendedToppings: ["Honey Drizzle", "Stroopwafel Crumble"],
    cookingMethods: STANDARD_METHODS,
    videoPlaceholder: true,
    ingredients: {
      mix: "Unbleached flour, organic agave powder, organic grass fed butter powder, coffee-cardamom blend, cinnamon, nutmeg, egg replacer, baking powder, sea salt.",
      toppings: "Crumble packet: Organic rice flour, palm oil, sugar, eggs, organic potato starch, organic tapioca starch, organic brown rice syrup, organic soy flour, baking soda, xanthan gum, cinnamon.",
      contains: "Eggs, soy, dairy."
    }
  },
  {
    slug: "volcano-cake",
    active: true,
    name: "Volcano Cake",
    hook: "Pull it apart. You'll see why.",
    tagline: "Pull it apart. You'll see why.",
    description: "Rich cacao cake with a molten chocolate center. Drop the chips in. Don't mix. Trust the process.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "#FF4500",
    text: "#1A0000",
    accent: "#5C0000",
    mylarColor: "Molten red",
    includedTopping: "Dark chocolate chip packet",
    recommendedToppings: ["Chocolate Chips", "Vanilla Glaze"],
    cookingMethods: STANDARD_METHODS,
    videoPlaceholder: true,
    ingredients: {
      mix: "Unbleached flour, cacao powder, organic agave powder, organic grass fed butter powder, egg replacer, baking powder, sea salt.",
      toppings: "Chocolate chip packet: Dark chocolate couverture (cacao, cocoa butter, organic cane sugar, vanilla).",
      contains: "Dairy. May contain soy."
    }
  },
  {
    slug: "strawberry-swirl",
    active: true,
    name: "Strawberry Swirl",
    hook: "Swirl it in. That's the move.",
    tagline: "Swirl it in. That's the move.",
    description: "A soft vanilla cake with a strawberry jam swirl baked right in, finished with a sweet glaze. Just add liquid.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "#3D0018",
    text: "#FFFFFF",
    accent: "#FF6B8A",
    mylarColor: "Berry pink",
    includedTopping: "Strawberry jam + glaze packet",
    recommendedToppings: ["Vanilla Glaze", "Strawberry Jam Reserve"],
    cookingMethods: STANDARD_METHODS,
    videoPlaceholder: true,
    ingredients: {
      mix: "Unbleached flour, organic agave powder, organic grass fed butter powder, vanilla bean powder, egg replacer, baking powder, sea salt.",
      toppings: "Jam packet: Strawberries, sugar, fruit pectin, citric acid. Glaze packet: Powdered sugar (sugar, cornstarch).",
      contains: "Dairy."
    }
  },
  {
    slug: "honey-cinnamon-crumble",
    active: true,
    name: "Honey Cinnamon Crumble",
    hook: "Warm. Sweet. Gone in two minutes.",
    tagline: "Warm. Sweet. Gone in two minutes.",
    description: "A warm cinnamon cake topped with honey and a buttery stroopwafel crumble. Just add liquid.",
    price: 8.99,
    sevenPackPrice: 29.99,
    mixMatchPrice: 31.99,
    bg: "#E8A020",
    text: "#2D1500",
    accent: "#3C2000",
    mylarColor: "Honey gold",
    includedTopping: "Honey stick + crumble packet",
    recommendedToppings: ["Honey Drizzle", "Stroopwafel Crumble"],
    cookingMethods: STANDARD_METHODS,
    videoPlaceholder: true,
    ingredients: {
      mix: "Unbleached flour, organic agave powder, organic grass fed butter powder, vanilla bean powder, cinnamon, egg replacer, baking powder, sea salt.",
      toppings: "Honey stick: 100% pure clover blossom honey. Crumble packet: Organic rice flour, palm oil, sugar, eggs, organic potato starch, organic tapioca starch, organic brown rice syrup, organic soy flour, baking soda, xanthan gum, cinnamon.",
      contains: "Eggs, soy, dairy."
    }
  },

  // ---- Hidden (Phase 2) — original lineup, data preserved ----
  {
    slug: "vanilla-honey-crumble",
    active: false,
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
    recommendedToppings: ["Honey Drizzle", "Stroopwafel Crumble"],
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  },
  {
    slug: "apple-fritter",
    active: false,
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
    recommendedToppings: ["Honey Drizzle", "Stroopwafel Crumble"],
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  },
  {
    slug: "strawberry-shortcake",
    active: false,
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
    recommendedToppings: ["Strawberry Jam Reserve", "Vanilla Glaze"],
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  },
  {
    slug: "blueberry-cake-donut",
    active: false,
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
    recommendedToppings: ["Vanilla Glaze", "Chocolate Chips"],
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  },
  {
    slug: "monster-cookie",
    active: false,
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
    recommendedToppings: ["Honey Drizzle", "Chocolate Chips"],
    cookingMethods: [
      { method: "12oz Mug + Microwave", time: "90 sec",   result: "Soft, moist, classic" },
      { method: "Air Fryer",            time: "8–10 min", result: "Crispy edges, soft center" },
      { method: "Waffle Maker",         time: "3–5 min",  result: "Flat, golden, crispy" }
    ],
    videoPlaceholder: true
  }
]

// Only the active launch lineup is shown publicly (homepage, footer, routes).
export const activeFlavors = flavors.filter((f) => f.active)

// Flat add-on menu — no categories. Shown in the "Make it yours" popup, the
// flavor-page toppings section, and the homepage add-ons grid.
export const TOPPINGS: Topping[] = [
  { name: "Honey Drizzle", price: 0.89 },
  { name: "Vanilla Glaze", price: 0.79 },
  { name: "Stroopwafel Crumble", price: 0.99 },
  { name: "Chocolate Chips", price: 0.99 },
  { name: "Protein Peanut Butter Drizzle", price: 2.49 },
  { name: "Strawberry Jam Reserve", price: 1.29 },
]

// Resolve a flavor's recommended topping names to full Topping objects.
export function recommendedFor(flavor: Flavor): Topping[] {
  return flavor.recommendedToppings
    .map((name) => TOPPINGS.find((t) => t.name === name))
    .filter((t): t is Topping => Boolean(t))
}

// Subscription product — modeled as a one-time charge for launch (no recurring
// billing wired yet). Surfaced on /subscribe and added to cart as 'weekly-sub'.
export const WEEKLY_SUB_PRICE = 27.99

export function getFlavor(slug: string): Flavor | undefined {
  return flavors.find((f) => f.slug === slug)
}

// All active flavors use white text on dark backgrounds, which reads cleanly —
// so the light scrim is no longer needed anywhere.
export function needsTextScrim(_slug: string): boolean {
  return false
}
