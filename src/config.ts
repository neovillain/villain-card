/**
 * ─── EDIT ME ────────────────────────────────────────────────
 * Вся персональная информация сайта живёт в этом файле.
 * Поменяй handle/url — кнопки обновятся автоматически.
 */

export type IconName =
  | 'instagram'
  | 'telegram'
  | 'github'
  | 'email'
  | 'discord'
  | 'x'

export interface SocialLink {
  id: string
  icon: IconName
  label: string
  /** Текст, который показывается под названием (ник, адрес и т.п.) */
  handle: string
  /** Если url не задан — клик копирует handle в буфер (например, Discord) */
  url?: string
  /** Цвет свечения при наведении */
  glow: string
}

export const profile = {
  name: 'VILLAIN',
  alias: 'злодей',
  tagline: 'every story needs a good villain.',
  est: 'EST. MMXXVI',
}

export const links: SocialLink[] = [
  {
    id: 'telegram',
    icon: 'telegram',
    label: 'Telegram',
    handle: '@neovillain',
    url: 'https://t.me/neovillain',
    glow: '#2AABEE',
  },
  {
    id: 'instagram',
    icon: 'instagram',
    label: 'Instagram',
    handle: '@neovillainn',
    url: 'https://www.instagram.com/neovillainn',
    glow: '#E1306C',
  },
  {
    id: 'github',
    icon: 'github',
    label: 'GitHub',
    handle: '@neovillain',
    url: 'https://github.com/neovillain',
    glow: '#E11D48',
  },
  {
    id: 'x',
    icon: 'x',
    label: 'X / Twitter',
    handle: '@neovillainn',
    url: 'https://x.com/neovillainn',
    glow: '#9A8F94',
  },
  {
    id: 'discord',
    icon: 'discord',
    label: 'Discord',
    handle: '.neovillain',
    // url отсутствует — кнопка копирует ник в буфер обмена
    glow: '#5865F2',
  },
  {
    id: 'email',
    icon: 'email',
    label: 'Email',
    handle: 'neovillaincommerce@gmail.com',
    url: 'mailto:neovillaincommerce@gmail.com',
    glow: '#DC2626',
  },
]

/* ─── Evil schemes — план захвата мира ─── */

export interface Scheme {
  num: string
  codename: string
  title: string
  points: string[]
  status: 'in progress' | 'coming soon'
}

export const schemes: Scheme[] = [
  {
    num: '01',
    codename: 'PHASE I · FIRST CRIME SCENE',
    title: 'BECOME THE MACHINE',
    points: [
      'Embed inside a major tech corp, learn how it breathes',
      'Decode how neural networks see the world',
      'Ship the first product nobody expected',
      'Launch a startup. Disrupt. Repeat.',
    ],
    status: 'in progress',
  },
  {
    num: '02',
    codename: 'PHASE II · THE MASTER PLAN',
    title: 'SEIZE THE FEED',
    points: [
      'Make them follow willingly — no force needed',
      'Villain becomes the brand people root for',
      'Turn content into influence, influence into power',
      '1M loyal believers. Not fans. Believers.',
    ],
    status: 'coming soon',
  },
  {
    num: '03',
    codename: 'PHASE III · WORLD DOMINATION',
    title: 'OWN THE SIGNAL',
    points: [
      'AI systems built by Villain, running everywhere',
      'The name echoes across every timezone',
      'They called it evil. History calls it vision.',
      'The villain wins. Obviously.',
    ],
    status: 'coming soon',
  },
]

/* ─── Dossier — данные из резюме ─── */

export interface DossierProject {
  title: string
  period: string
  description: string
  tags: string[]
  url?: string
}

export interface Achievement {
  title: string
  detail: string
}

export const dossier = {
  about:
    'ML engineer / Python developer. First-year Mathematics & Computer Science student at Central University. Builds Telegram bots and machine-learning side projects, applies optimization algorithms to real-world problems. Led teams, defended projects solo, mentored others. The endgame: an ML engineer the industry roots for — or fears.',
  facts: [
    { label: 'education', value: 'Central University · 2025—2029' },
    { label: 'focus', value: 'Machine Learning' },
    { label: 'languages', value: 'Russian · English (B2)' },
  ],
  achievements: [
    {
      title: 'WorldSkills Russia — champion',
      detail: '“Young Professionals” national championship winner',
    },
    {
      title: 'CU CTF 2025 — 1st place',
      detail: 'Team victory: web, pwn, reverse engineering, crypto, OSINT',
    },
    {
      title: '“Step into Business” — 1st place',
      detail: 'Business project defense; mentored a school team — all placed',
    },
  ] as Achievement[],
  projects: [
    {
      title: 'Car Setup Optimizer',
      period: '2026',
      description:
        'Drag-racing tuning optimizer: synthetic dataset, GradientBoostingRegressor, Bayesian search (TPE) — a full pipeline from data synthesis to optimal configs.',
      tags: ['Python', 'scikit-learn', 'Optuna'],
    },
    {
      title: 'Solana Wallet Tracker',
      period: '2025 — 2026',
      description:
        'Real-time wallet monitoring bot: balance charts via matplotlib, auto-rotating RPC endpoints, transaction-chain tracing to hunt meme tokens.',
      tags: ['Python', 'aiogram3', 'Solana RPC'],
    },
    {
      title: 'Tattoo Marketplace MVP',
      period: '2026',
      description:
        'Platform connecting tattoo artists and clients: requests, price bidding and meeting scheduling inside a Telegram Mini App.',
      tags: ['Python', 'aiogram3', 'Mini App'],
    },
    {
      title: 'Wikipedia Telegram Bot',
      period: '2025',
      description:
        'Keyword search with a choice between a quick summary and the full article.',
      tags: ['Python', 'aiogram3', 'Wikipedia API'],
    },
  ] as DossierProject[],
  skills: [
    'Python',
    'scikit-learn',
    'Optuna',
    'NumPy',
    'pandas',
    'scipy.stats',
    'seaborn',
    'matplotlib',
    'aiogram3',
    'Git',
    'Docker',
    'Jupyter',
    'Bash',
  ],
}
