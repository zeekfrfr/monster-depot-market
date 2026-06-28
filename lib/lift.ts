// LIFT — RTD active-blend drink (16oz resealable can). Presentation + ingredients
// here; price / active / stock are DB-driven via mdm_lift_flavors (see lib/catalog).
// Food/beverage product — NO supplement language, NO claims.

export interface LiftFlavor {
  slug: string
  name: string
  bg: string
  accent: string
  ingredients: string[] // ordered by quantity, highest first
}

// Constant across the whole line — sits at the bottom of every list.
const ACTIVE_BLEND = [
  'L-tyrosine',
  'Panax ginseng extract',
  'L-theanine',
  'vitamin B6',
  'vitamin B12',
  "lion's mane extract",
  'reishi extract',
  'cordyceps extract',
]

export const LIFT_FLAVORS: LiftFlavor[] = [
  {
    slug: 'strawberry-daiquiri',
    name: 'Strawberry Daiquiri',
    bg: '#FFE3E8',
    accent: '#E63950',
    ingredients: [
      'Filtered water', 'strawberry purée (from concentrate)', 'apple juice concentrate',
      'lime juice (from concentrate)', 'natural flavor', 'citric acid', 'ascorbic acid (vitamin C)',
      ...ACTIVE_BLEND,
    ],
  },
  {
    slug: 'watermelon-margarita',
    name: 'Watermelon Margarita',
    bg: '#E6F7EC',
    accent: '#2FA85A',
    ingredients: [
      'Filtered water', 'watermelon juice (from concentrate)', 'agave',
      'lime juice (from concentrate)', 'citric acid', 'ascorbic acid (vitamin C)', 'natural flavor',
      ...ACTIVE_BLEND,
    ],
  },
  {
    slug: 'berry-mojito',
    name: 'Berry Mojito',
    bg: '#EEE9F8',
    accent: '#6B4FB5',
    ingredients: [
      'Filtered water', 'apple juice concentrate', 'blueberry juice concentrate',
      'pomegranate juice concentrate', 'strawberry juice concentrate', 'cane sugar',
      'lime juice concentrate', 'natural mint flavor', 'natural flavors', 'citric acid',
      ...ACTIVE_BLEND,
    ],
  },
  {
    slug: 'long-island',
    name: 'Long Island',
    bg: '#FBEEDC',
    accent: '#C97B30',
    ingredients: [
      'Filtered water', 'brewed black tea', 'agave', 'lemon juice (from concentrate)',
      'citric acid', 'natural flavor',
      ...ACTIVE_BLEND,
    ],
  },
  {
    slug: 'jungle-juice',
    name: 'Jungle Juice',
    bg: '#FFE9DA',
    accent: '#FF7A2F',
    ingredients: [
      'Filtered water', 'pineapple juice (from concentrate)', 'orange juice',
      'passion fruit purée (from concentrate)', 'sugar', 'citric acid', 'ascorbic acid (vitamin C)',
      'natural flavor',
      ...ACTIVE_BLEND,
    ],
  },
]

export const LIFT_PRICE = 10 // $/can, fallback if catalog is unavailable
export const LIFT_MIN_CANS = 3 // minimum order
