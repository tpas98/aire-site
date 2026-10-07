/**
 * Copy for /discover, the education-first landing page for cold (TikTok) traffic.
 *
 * The argument, in consulting order:
 *   1. The pouch aisle has lanes and they all move you: nicotine, energy and focus
 *      pouches push you up, sleep pouches push you down.
 *   2. Up has a cost: nicotine fades in ~2 h (so the next pouch comes fast) and
 *      caffeine lingers ~5 h (so an afternoon pouch is still there at night).
 *   3. Aire is built for the middle: no nicotine, no caffeine, no stimulants.
 *
 * Compliance rules this file is written against (see CLAUDE.md):
 * - No competitor brand names. Categories only: nicotine / energy / focus / sleep pouches.
 * - No disease, cure or drug claims; no "quit", "cure", "withdrawal", "craving".
 * - Benefit lines are structure/function claims and carry the dagger.
 * - No per-active milligrams: the label declares only the 185 mg AireComplex Blend.
 * - No "first", "only" or "missing middle": other nicotine-free calm pouches may exist.
 * - No "lip pouch" (Aire's call, 2026-10-06): say "pouch" and "pop one in".
 * - Category facts (caffeine strengths, half-lives) are sourced in `sources`.
 */

export const DISCLAIMER =
  '† These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.'

export const hero = {
  eyebrow: 'The balance pouch',
  titleLine1: 'Calm focus,',
  titleLine2: 'in a pouch.',
  sub: 'Aire is a mint pouch made with L-Theanine, Rhodiola Rosea, L-Tyrosine and Saffron for calm, clear focus.†',
  chips: ['No nicotine', 'No caffeine', 'No stimulants'],
  ctaPrimary: 'Try Aire',
  ctaSecondary: 'Why it’s different',
}

/**
 * Pinned scene: the can turns while three lines resolve. `tone` picks the
 * gradient: warm = stimulation, deep = sedation, cool = calm.
 */
export const spinLines = [
  { text: 'Most pouches are built to wind you up.', tone: 'warm' },
  { text: 'Some are built to knock you out.', tone: 'deep' },
  { text: 'Aire is built to level you out.', tone: 'cool' },
] as const

/**
 * The pouch-aisle story: each kind of pouch takes the stage with an unbranded
 * can (AI-generated, no marks), then Aire arrives. `pos` places it on the
 * Wired (0) to Out (1) gauge.
 */
export const aisleStory = {
  eyebrow: 'The pouch aisle',
  steps: [
    {
      key: 'energy',
      img: '/images/discover/other-energy.webp',
      label: 'Energy & focus pouches',
      title: 'Energy pouches wind you up.',
      sub: '100\u2013200 mg of caffeine a pouch. Most focus pouches run on caffeine or a caffeine metabolite.',
      chip: 'Wired',
      tone: 'warm',
      pos: 0.1,
    },
    {
      key: 'nicotine',
      img: '/images/discover/other-nicotine.webp',
      label: 'Nicotine pouches',
      title: 'Nicotine pouches wear off fast.',
      sub: 'About two hours, so the next one comes sooner.',
      chip: 'Up, then down',
      tone: 'grey',
      pos: 0.24,
    },
    {
      key: 'sleep',
      img: '/images/discover/other-sleep.webp',
      label: 'Sleep pouches',
      title: 'Sleep pouches knock you out.',
      sub: 'Melatonin. Great at 11 p.m. Not at 2 p.m.',
      chip: 'Out',
      tone: 'deep',
      pos: 0.9,
    },
  ],
  aire: {
    img: '/images/discover/open-can.webp',
    label: 'Aire',
    title: 'Aire levels you out.',
    sub: 'No nicotine. No caffeine. No stimulants. Four ingredients for calm, clear focus.\u2020',
    chip: 'Level',
    cta: 'Try Aire',
  },
  gauge: { left: 'Wired', mid: 'Level', right: 'Out' },
}

/** The aisle mapped on one axis, wired to out. `pos` is 0 (wired) to 1 (out). */
export const spectrum = {
  eyebrow: 'The pouch aisle, mapped',
  title: 'Every other pouch moves you. Aire is built for the middle.',
  ends: { top: 'Wired', mid: 'Level', bottom: 'Out' },
  items: [
    { name: 'Energy pouches', note: '100–200 mg caffeine', pos: 0.06 },
    { name: 'Nicotine pouches', note: 'A nicotine buzz', pos: 0.19 },
    { name: 'Focus pouches', note: 'Caffeine or its metabolites', pos: 0.32 },
    { name: 'Sleep pouches', note: 'Melatonin, for bedtime', pos: 0.94 },
  ],
  aire: { name: 'Aire', note: 'No nicotine. No caffeine. No stimulants.' },
}

/** Consultant-style "by the numbers". Each stat cites `sources`. */
export const caseForCalm = {
  eyebrow: 'The case for calm',
  title: 'Why the middle matters.',
  stats: [
    {
      n: '01',
      value: 2,
      prefix: '~',
      unit: 'hrs',
      label: 'Nicotine’s average half-life.',
      body: 'It fades fast, which is why one pouch so often turns into the next.',
      src: 1,
      from: 0,
      to: 120,
      countUnit: 'min',
      sub: '≈ 2 hours',
      subEnd: '',
    },
    {
      n: '02',
      value: 5,
      prefix: '~',
      unit: 'hrs',
      label: 'Caffeine’s average half-life.',
      body: 'A 3 p.m. energy pouch is still about half there at 8 p.m.',
      src: 2,
      from: 0,
      to: 300,
      countUnit: 'min',
      sub: '≈ 5 hours',
      subEnd: '',
    },
    {
      n: '03',
      value: 0,
      prefix: '',
      unit: 'mg',
      label: 'Nicotine, caffeine or stimulants in Aire.',
      body: 'Nothing to wear off, nothing keeping you up. Just four ingredients for calm focus.†',
      src: 0,
      from: 200,
      to: 0,
      countUnit: 'mg',
      sub: '200 mg = a strong energy pouch',
      subEnd: 'Per pouch. Every pouch.',
    },
  ],
  chart: {
    title: 'A day of pouches',
    caption: 'Illustration of the pattern, not clinical data.',
    lines: [
      { key: 'nic', label: 'Nicotine: up, down, again' },
      { key: 'caf', label: 'Caffeine: spike, then the slide' },
      { key: 'aire', label: 'Aire: built to keep you level†' },
    ],
    hours: ['8a', '11a', '2p', '5p', '8p'],
  },
}

export const inside = {
  images: ['/images/discover/ing-theanine.webp', '/images/discover/ing-rhodiola.webp', '/images/discover/ing-tyrosine.webp', '/images/discover/ing-saffron.webp'],
  eyebrow: 'What’s inside',
  title: 'Four ingredients. Zero stimulants.',
  note: 'AireComplex Blend: 185 mg per pouch.',
  items: [
    { name: 'L-Theanine', from: 'From green tea', known: 'Supports a relaxed but alert state, without drowsiness.†' },
    { name: 'Rhodiola Rosea', from: 'Arctic adaptogen root', known: 'Supports resilience to everyday stress and mental fatigue.†' },
    { name: 'L-Tyrosine', from: 'Amino acid', known: 'Supports focus and mental performance under pressure.†' },
    { name: 'Saffron', from: 'Crocus flower extract', known: 'Supports a positive mood and emotional balance.†' },
  ],
}

/** Factual category rows. Short values so four columns fit a phone. */
export const aisle = {
  eyebrow: 'Side by side',
  title: 'Same format. Different job.',
  cols: ['Nicotine', 'Energy', 'Focus', 'Aire'],
  rows: [
    { label: 'Nicotine', vals: ['Yes', 'No', 'No', 'No'] },
    { label: 'Caffeine', vals: ['Rarely', '100–200 mg', 'Some', 'None'] },
    { label: 'Main active', vals: ['Nicotine', 'Caffeine', 'Stimulant blend', '4 calm actives'] },
    { label: 'Addiction warning', vals: ['Required', '–', '–', '–'] },
    { label: 'Built for', vals: ['A buzz', 'Energy', 'A lift', 'Calm focus†'] },
  ],
  footnote: 'Typical products in each category of pouch; individual products vary.',
}

export const howItWorks = {
  eyebrow: 'How it works',
  title: 'Pop one in. Settle in.',
  steps: [
    { n: '01', title: 'Pop one in', body: 'Tuck a pouch under your top lip. Nothing to chew, nothing to light, nothing to spit.' },
    { n: '02', title: 'Give it a few minutes', body: 'A light mint tingle and no buzz. Most people notice a calmer, steadier headspace within about ten minutes.†' },
    { n: '03', title: 'Keep it in up to an hour', body: 'Then toss it. Most people use 4 to 6 a day, morning or night. No caffeine to keep you up.' },
  ],
}

export const moments = {
  eyebrow: 'When people reach for it',
  items: [
    { title: 'Before the big meeting', body: 'Instead of a third coffee.' },
    { title: 'Deep work blocks', body: 'Steady, not wired.†' },
    { title: 'The drive home', body: 'A pouch with no nicotine in it.' },
    { title: 'Winding down', body: 'No caffeine, so nights stay yours.' },
  ],
}

/**
 * Lower-risk quotes from the homepage set (calm / focus / routine). No
 * "Verified" badge. Confirm these are real, consenting customers before paid traffic.
 */
export const reviews = {
  eyebrow: 'From people who use it',
  title: 'What level feels like.',
  items: [
    { text: 'I keep a can in my desk and use one before big meetings instead of reaching for caffeine. It takes the edge off without killing my energy.', author: 'Vivek', tag: 'Entrepreneur' },
    { text: 'When my mind is racing I’ll pop one in, and within about 10 minutes I feel more centered. Not sleepy, just clearer.', author: 'Mitch', tag: 'Engineering student' },
    { text: 'I can use these morning or night and not worry about my sleep. One during work, maybe another after dinner. No jitters. Just steady.', author: 'Alex', tag: 'Private equity' },
    { text: 'I work long hours and get irritable deep in problem-solving. These help me stay level. Calm, steady focus without feeling dulled out.', author: 'Anthony', tag: 'Computer scientist' },
  ],
  footnote: 'Individual experiences vary.',
}

export const faqs = [
  { q: 'Is Aire a nicotine pouch?', a: 'No. Aire comes in the pouch format you know, but it contains no nicotine and no tobacco. It’s a dietary supplement pouch made with L-Theanine, Rhodiola Rosea, L-Tyrosine and Saffron.' },
  { q: 'How is it different from energy or focus pouches?', a: 'Energy pouches are built on caffeine, often 100 to 200 mg a pouch. Many focus pouches use caffeine or a caffeine metabolite such as paraxanthine. Aire has no caffeine and no stimulants. It’s built for calm, clear focus rather than a lift.†' },
  { q: 'Is Aire a nootropic?', a: 'Aire is a dietary supplement. Its ingredients are common in focus and stress-support formulas, but we don’t promise cognitive enhancement. We built it to help you feel calm and clear.†' },
  { q: 'Will it make me drowsy?', a: 'Aire is designed for calm focus, not sedation, and contains no melatonin. L-Theanine is known for supporting a relaxed but alert state.†' },
  { q: 'Can I use it if I also use nicotine pouches?', a: 'Aire contains no nicotine, so it adds none. Plenty of people keep a can around for the moments they’d like a pouch without nicotine. Aire is not a smoking-cessation or nicotine replacement product.' },
  { q: 'How many can I use a day?', a: 'We suggest 4 to 6 pouches spread through the day, each for up to 60 minutes. If you are pregnant, nursing, taking medication or have a medical condition, check with your doctor first.' },
  { q: 'What’s in a can?', a: '15 Calm Mint pouches. Each pouch contains the AireComplex Blend (185 mg) of L-Theanine, Rhodiola Rosea, L-Tyrosine and Saffron.' },
  { q: 'Shipping and returns?', a: 'We ship within the US, free on orders over $50. Full details are on our shipping page.' },
]

export const offer = {
  stamp: 'NO NICOTINE · NO CAFFEINE',
  title: 'Find your balance.',
  sub: 'Calm Mint, 4 cans for $45.99. New customers take 30% off with code FIRST30, applied automatically.',
  cta: 'airepouches.com',
  ctaAria: 'Try Aire, 30% off your first order',
  closer: 'Save this for your next 3 p.m. Send it to the friend who needs it.',
}

/** Category facts behind the numbers. Kept generic: no brand names on the page. */
export const sources = [
  { n: 1, text: 'Nicotine average elimination half-life about 2 hours. Benowitz et al., Clin Pharmacol Ther (PMC3262366).', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3262366/' },
  { n: 2, text: 'Caffeine average half-life about 5 hours (range 1.5 to 9.5 hours). NIH StatPearls, Caffeine.', href: 'https://www.ncbi.nlm.nih.gov/books/NBK519490/' },
  { n: 3, text: 'Energy pouch strengths of 100 and 200 mg caffeine, and focus pouches built on paraxanthine: manufacturer listings, 2026.', href: '' },
]
