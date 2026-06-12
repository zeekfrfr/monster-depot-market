export type Format = 'stick' | 'rtd'
export type StickSize = '7pack' | '14pack' | '28pack'
export type RTDSize = '4pack' | '12pack'
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
  oneliner: string
  feeling: string
  accent: string
  why_it_works: string
  when_to_take: string
  flavors: Flavor[]
  formats: {
    stick: Record<StickSize, number>
    rtd: Record<RTDSize, number>
  }
  actives: Active[]
}

export const STICK_SIZE_LABELS: Record<StickSize, string> = {
  '7pack': '7-Pack',
  '14pack': '14-Pack',
  '28pack': '28-Pack',
}

export const RTD_SIZE_LABELS: Record<RTDSize, string> = {
  '4pack': '4-Pack',
  '12pack': '12-Pack',
}

export const MODES: ModeProduct[] = [
  {
    name: 'LIFT',
    slug: 'lift',
    oneliner: 'For creativity, curiosity, and elevated moments.',
    feeling: 'Inspired.',
    accent: '#D4A853',
    why_it_works: 'Tyrosine is what your brain uses to stay motivated — it\'s already in there, this just tops it off. Ginseng and Rhodiola keep the energy steady instead of spiked. A small amount of Theanine smooths the whole thing out so you feel sharp without feeling wired.',
    when_to_take: 'Mix one stick into 12 oz of cold water about 20 minutes before you need it. Works with coffee, works without it.',
    flavors: [
      { name: 'Strawberry Lemonade', pairings: ['Sparkling water', 'Coconut water', 'Basil + soda', 'Fresh lemonade'] },
      { name: 'Mango Sunrise',       pairings: ['Coconut water', 'Sparkling water', 'Tajín rim + soda', 'Orange juice'] },
      { name: 'Pineapple Passionfruit', pairings: ['Coconut water', 'Ginger beer', 'Sparkling water', 'Lime soda'] },
    ],
    formats: {
      stick: { '7pack': 19.99, '14pack': 34.99, '28pack': 59.99 },
      rtd: { '4pack': 34.99, '12pack': 79.99 },
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
    oneliner: 'For conversations, events, and nights out.',
    feeling: 'Connected.',
    accent: '#C4788A',
    why_it_works: 'Theanine takes the edge off without slowing you down. Rhodiola keeps you in the moment instead of in your head. Magnesium and Lemon Balm together are what make a room feel easy instead of draining.',
    when_to_take: 'Take it 20–30 minutes before you\'re in the room. Works best when you\'re not rushing.',
    flavors: [
      { name: 'Rose Hibiscus Lemonade', pairings: ['Sparkling water', 'Prosecco-style N/A bubbly', 'Grapefruit soda', 'Tonic'] },
      { name: 'Berry Mojito',           pairings: ['Sparkling water + fresh mint', 'Lime soda', 'Cucumber water', 'Club soda'] },
      { name: 'Citrus Spritz',          pairings: ['Tonic water', 'Grapefruit soda', 'Sparkling water', 'Elderflower soda'] },
    ],
    formats: {
      stick: { '7pack': 19.99, '14pack': 34.99, '28pack': 59.99 },
      rtd: { '4pack': 34.99, '12pack': 79.99 },
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
    oneliner: 'For slowing down and settling in.',
    feeling: 'Relaxed.',
    accent: '#8A9BB5',
    why_it_works: 'Magnesium is something most people are running low on — it\'s what your body uses to downshift. Ashwagandha helps your body handle stress so the night actually feels like rest. Theanine and Lemon Balm keep your head quiet without knocking you out. You wind down, you don\'t check out.',
    when_to_take: 'Mix into still or warm water about 30 minutes before you want to start slowing down. Not a sleep aid — just lets the night land softer.',
    flavors: [
      { name: 'Blackberry Lavender', pairings: ['Warm water', 'Chamomile tea', 'Still water', 'Honey + hot water'] },
      { name: 'Peach Chamomile',     pairings: ['Hot water', 'Chamomile tea', 'Warm oat milk', 'Still water'] },
      { name: 'Tart Cherry',         pairings: ['Still water', 'Warm water', 'Hibiscus tea', 'Sparkling water'] },
    ],
    formats: {
      stick: { '7pack': 19.99, '14pack': 34.99, '28pack': 59.99 },
      rtd: { '4pack': 34.99, '12pack': 79.99 },
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
    oneliner: 'For clarity, concentration, and getting in the zone.',
    feeling: 'Locked in.',
    accent: '#7BAF8E',
    why_it_works: 'Citicoline supports the kind of focus that actually sticks. Tyrosine keeps you motivated inside the work. Theanine makes sure none of it tips into restless energy. Rhodiola keeps you sharp when it\'s been a long session.',
    when_to_take: 'Mix one stick 15–20 minutes before you sit down. Best on a relatively empty stomach. Don\'t fight it — when it kicks in, use it.',
    flavors: [
      { name: 'Green Apple Yuzu', pairings: ['Cold green tea', 'Sparkling water', 'Still water', 'Matcha + cold water'] },
      { name: 'White Peach',      pairings: ['Cold white tea', 'Still water', 'Green tea', 'Sparkling water'] },
      { name: 'Cucumber Melon',   pairings: ['Cold water', 'Cucumber water', 'Sparkling water', 'Coconut water'] },
    ],
    formats: {
      stick: { '7pack': 19.99, '14pack': 34.99, '28pack': 59.99 },
      rtd: { '4pack': 34.99, '12pack': 79.99 },
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
    oneliner: 'For momentum, movement, and what\'s next.',
    feeling: 'Motivated.',
    accent: '#A03040',
    why_it_works: 'This one is built for output, not just energy. Tyrosine and Ginseng push the throttle. Rhodiola at a higher dose than LIFT means your body handles physical and mental load without burning out mid-way. B12 keeps the engine running clean. You don\'t just feel ready — you stay ready.',
    when_to_take: 'Mix one stick 20 minutes before you move. On the way to the gym, before you get in the car, before the set starts. Made for the moment right before.',
    flavors: [
      { name: 'Blood Orange', pairings: ['Sparkling water', 'Ginger beer', 'Tonic', 'Grapefruit soda'] },
      { name: 'Cherry Lime',  pairings: ['Lime soda', 'Sparkling water', 'Cola-style soda', 'Club soda'] },
      { name: 'Dragonfruit',  pairings: ['Coconut water', 'Lychee soda', 'Sparkling water', 'Lime soda'] },
    ],
    formats: {
      stick: { '7pack': 19.99, '14pack': 34.99, '28pack': 59.99 },
      rtd: { '4pack': 34.99, '12pack': 79.99 },
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
  return format === 'stick' ? '7pack' : '4pack'
}
