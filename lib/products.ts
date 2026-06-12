export type Format = 'stick' | 'rtd'
export type StickSize = 'single' | '7pack'
export type RTDSize = 'single' | '4pack' | '12pack'
export type AnySize = StickSize | RTDSize

export interface Active {
  name: string
  amount: string
}

export interface Flavor {
  name: string
  pairings: string[]
}

export interface ModeProduct {
  name: string
  slug: string
  tagline: string
  accent: string
  flavors: Flavor[]
  formats: {
    stick: Record<StickSize, number>
    rtd: Record<RTDSize, number>
  }
  actives: Active[]
}

export const STICK_SIZE_LABELS: Record<StickSize, string> = {
  single: 'Single Stick',
  '7pack': '7-Pack',
}

export const RTD_SIZE_LABELS: Record<RTDSize, string> = {
  single: 'Single Can',
  '4pack': '4-Pack',
  '12pack': '12-Pack',
}

export const MODES: ModeProduct[] = [
  {
    name: 'LIFT',
    slug: 'lift',
    tagline: 'For when the day begins.',
    accent: '#D4A853',
    flavors: [
      { name: 'Strawberry Lemonade', pairings: ['Sparkling water', 'Coconut water', 'Basil + soda', 'Fresh lemonade'] },
      { name: 'Mango Sunrise',       pairings: ['Coconut water', 'Sparkling water', 'Tajín rim + soda', 'Orange juice'] },
      { name: 'Pineapple Passionfruit', pairings: ['Coconut water', 'Ginger beer', 'Sparkling water', 'Lime soda'] },
    ],
    formats: {
      stick: { single: 2.85, '7pack': 19.99 },
      rtd: { single: 7.99, '4pack': 34.99, '12pack': 79.99 },
    },
    actives: [
      { name: 'L-Tyrosine', amount: '500 mg' },
      { name: 'Panax Ginseng Extract', amount: '200 mg' },
      { name: 'Rhodiola Extract', amount: '150 mg' },
      { name: 'L-Theanine', amount: '100 mg' },
      { name: 'Vitamin B6', amount: '5 mg' },
      { name: 'Vitamin B12', amount: '250 mcg' },
    ],
  },
  {
    name: 'SOCIAL',
    slug: 'social',
    tagline: 'For conversations and nights out.',
    accent: '#C4788A',
    flavors: [
      { name: 'Rose Hibiscus Lemonade', pairings: ['Sparkling water', 'Prosecco-style N/A bubbly', 'Grapefruit soda', 'Tonic'] },
      { name: 'Berry Mojito',           pairings: ['Sparkling water + fresh mint', 'Lime soda', 'Cucumber water', 'Club soda'] },
      { name: 'Citrus Spritz',          pairings: ['Tonic water', 'Grapefruit soda', 'Sparkling water', 'Elderflower soda'] },
    ],
    formats: {
      stick: { single: 2.85, '7pack': 19.99 },
      rtd: { single: 7.99, '4pack': 34.99, '12pack': 79.99 },
    },
    actives: [
      { name: 'L-Theanine', amount: '200 mg' },
      { name: 'Rhodiola Extract', amount: '150 mg' },
      { name: 'Magnesium Glycinate', amount: '200 mg' },
      { name: 'Lemon Balm Extract', amount: '200 mg' },
    ],
  },
  {
    name: 'EASE',
    slug: 'ease',
    tagline: 'For winding down.',
    accent: '#8A9BB5',
    flavors: [
      { name: 'Blackberry Lavender', pairings: ['Warm water', 'Chamomile tea', 'Still water', 'Honey + hot water'] },
      { name: 'Peach Chamomile',     pairings: ['Hot water', 'Chamomile tea', 'Warm oat milk', 'Still water'] },
      { name: 'Tart Cherry',         pairings: ['Still water', 'Warm water', 'Hibiscus tea', 'Sparkling water'] },
    ],
    formats: {
      stick: { single: 2.85, '7pack': 19.99 },
      rtd: { single: 7.99, '4pack': 34.99, '12pack': 79.99 },
    },
    actives: [
      { name: 'Magnesium Glycinate', amount: '300 mg' },
      { name: 'Ashwagandha Extract', amount: '300 mg' },
      { name: 'L-Theanine', amount: '200 mg' },
      { name: 'Lemon Balm Extract', amount: '200 mg' },
    ],
  },
  {
    name: 'FOCUS',
    slug: 'focus',
    tagline: 'For locking in.',
    accent: '#7BAF8E',
    flavors: [
      { name: 'Green Apple Yuzu', pairings: ['Cold green tea', 'Sparkling water', 'Still water', 'Matcha + cold water'] },
      { name: 'White Peach',      pairings: ['Cold white tea', 'Still water', 'Green tea', 'Sparkling water'] },
      { name: 'Cucumber Melon',   pairings: ['Cold water', 'Cucumber water', 'Sparkling water', 'Coconut water'] },
    ],
    formats: {
      stick: { single: 2.85, '7pack': 19.99 },
      rtd: { single: 7.99, '4pack': 34.99, '12pack': 79.99 },
    },
    actives: [
      { name: 'Citicoline (CDP-Choline)', amount: '250 mg' },
      { name: 'L-Tyrosine', amount: '500 mg' },
      { name: 'L-Theanine', amount: '200 mg' },
      { name: 'Rhodiola Extract', amount: '100 mg' },
    ],
  },
  {
    name: 'DRIVE',
    slug: 'drive',
    tagline: 'For whatever comes next.',
    accent: '#A03040',
    flavors: [
      { name: 'Blood Orange', pairings: ['Sparkling water', 'Ginger beer', 'Tonic', 'Grapefruit soda'] },
      { name: 'Cherry Lime',  pairings: ['Lime soda', 'Sparkling water', 'Cola-style soda', 'Club soda'] },
      { name: 'Dragonfruit',  pairings: ['Coconut water', 'Lychee soda', 'Sparkling water', 'Lime soda'] },
    ],
    formats: {
      stick: { single: 2.85, '7pack': 19.99 },
      rtd: { single: 7.99, '4pack': 34.99, '12pack': 79.99 },
    },
    actives: [
      { name: 'L-Tyrosine', amount: '500 mg' },
      { name: 'Rhodiola Extract', amount: '250 mg' },
      { name: 'Panax Ginseng Extract', amount: '200 mg' },
      { name: 'Vitamin B12', amount: '250 mcg' },
    ],
  },
]

export function getModeBySlug(slug: string): ModeProduct | undefined {
  return MODES.find((m) => m.slug === slug)
}

export function getPrice(
  mode: ModeProduct,
  format: Format,
  size: AnySize
): number {
  if (format === 'stick') {
    return mode.formats.stick[size as StickSize] ?? 0
  }
  return mode.formats.rtd[size as RTDSize] ?? 0
}

export function getSizeLabel(format: Format, size: AnySize): string {
  if (format === 'stick') return STICK_SIZE_LABELS[size as StickSize] ?? size
  return RTD_SIZE_LABELS[size as RTDSize] ?? size
}

export function getDefaultSize(format: Format): AnySize {
  return format === 'stick' ? 'single' : 'single'
}
