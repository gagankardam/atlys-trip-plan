export const INTERESTS = [
  'beaches',
  'adventure',
  'relaxation',
  'nature',
  'mountains',
] as const

export type Interest = (typeof INTERESTS)[number]

export const INTEREST_LABELS: Record<Interest, string> = {
  beaches: 'Beaches',
  adventure: 'Adventure',
  relaxation: 'Relaxation',
  nature: 'Nature',
  mountains: 'Mountains',
}

export type FriendId = string

export interface Friend {
  id: FriendId
  name: string
  initial: string
  hue: number
  role: 'organizer' | 'member'
  joined: boolean
  prefsSubmitted: boolean
  budget: number
  budgetHard: boolean
  interests: Interest[]
  interestPriority: 'must' | 'flexible'
  dates: string[]
  vote: string | null
  confirmed: boolean
}

export interface Destination {
  id: string
  name: string
  region: string
  cost: number
  dates: string
  image: string
  alt: string
  tags: Interest[]
  why: string
  tradeoff: string
}

export interface TripDraft {
  prompt: string
  origin: string
  dates: string
  duration: string
  budget: number
  vibe: string
}

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80'

export const DESTINATIONS: Destination[] = [
  {
    id: 'gokarna',
    name: 'Gokarna',
    region: 'Karnataka',
    cost: 8500,
    dates: 'December 12–13',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80',
    alt: 'A quiet beach cove with pale sand and green headland',
    tags: ['beaches', 'relaxation'],
    why: 'Shared dates overlap, and it is the only option that honours Aisha’s must-have beaches.',
    tradeoff: '₹500 above Aisha’s hard limit unless she chooses to flex.',
  },
  {
    id: 'coorg',
    name: 'Coorg',
    region: 'Karnataka',
    cost: 7800,
    dates: 'December 12–13',
    image:
      'https://images.unsplash.com/photo-1432405972473-a31cedba1257?auto=format&fit=crop&w=1400&q=80',
    alt: 'Mist over dark plantation hills at dawn',
    tags: ['nature', 'adventure', 'relaxation'],
    why: 'Fits every hard budget, with nature for Kabir and a slower pace for Neha.',
    tradeoff: 'Weaker on beaches — Aisha would be compromising.',
  },
  {
    id: 'chikmagalur',
    name: 'Chikmagalur',
    region: 'Karnataka',
    cost: 7000,
    dates: 'December 12–13',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
    alt: 'Layered mountain ridges under a clear sky',
    tags: ['mountains', 'adventure', 'nature'],
    why: 'Lowest estimate, closest drive, strong for Rahul and Kabir.',
    tradeoff: 'Least aligned with beaches and a restful weekend.',
  },
]

export const EXAMPLE_PROMPTS = [
  'Weekend getaway from Bangalore.',
  'Beach trip under ₹10,000.',
  'Three-day mountain escape.',
  'Surprise me.',
]

export function seedFriends(): Friend[] {
  return [
    {
      id: 'aisha',
      name: 'Aisha',
      initial: 'A',
      hue: 248,
      role: 'organizer',
      joined: false,
      prefsSubmitted: false,
      budget: 8000,
      budgetHard: true,
      interests: ['beaches'],
      interestPriority: 'must',
      dates: ['2026-12-11', '2026-12-12', '2026-12-13'],
      vote: null,
      confirmed: false,
    },
    {
      id: 'rahul',
      name: 'Rahul',
      initial: 'R',
      hue: 22,
      role: 'member',
      joined: false,
      prefsSubmitted: false,
      budget: 12000,
      budgetHard: false,
      interests: ['adventure'],
      interestPriority: 'flexible',
      dates: ['2026-12-11', '2026-12-12', '2026-12-13', '2026-12-14'],
      vote: null,
      confirmed: false,
    },
    {
      id: 'neha',
      name: 'Neha',
      initial: 'N',
      hue: 338,
      role: 'member',
      joined: false,
      prefsSubmitted: false,
      budget: 10000,
      budgetHard: true,
      interests: ['relaxation'],
      interestPriority: 'flexible',
      dates: ['2026-12-12', '2026-12-13', '2026-12-14'],
      vote: null,
      confirmed: false,
    },
    {
      id: 'kabir',
      name: 'Kabir',
      initial: 'K',
      hue: 152,
      role: 'member',
      joined: false,
      prefsSubmitted: false,
      budget: 9000,
      budgetHard: true,
      interests: ['nature'],
      interestPriority: 'flexible',
      dates: ['2026-12-12', '2026-12-13'],
      vote: null,
      confirmed: false,
    },
  ]
}

export function parsePrompt(prompt: string): TripDraft {
  const text = prompt.trim().toLowerCase()
  if (text.includes('surprise')) {
    return {
      prompt,
      origin: 'Bangalore',
      dates: 'December 12–13',
      duration: 'Weekend',
      budget: 10000,
      vibe: 'Surprise us',
    }
  }
  if (text.includes('beach')) {
    return {
      prompt,
      origin: 'Bangalore',
      dates: 'December 12–13',
      duration: 'Weekend',
      budget: 10000,
      vibe: 'Beaches',
    }
  }
  if (text.includes('mountain') || text.includes('three-day') || text.includes('3-day')) {
    return {
      prompt,
      origin: 'Bangalore',
      dates: 'December 12–13',
      duration: '3 days',
      budget: 9000,
      vibe: 'Mountains',
    }
  }
  return {
    prompt,
    origin: 'Bangalore',
    dates: 'December 12–13',
    duration: 'Weekend',
    budget: 10000,
    vibe: 'Getaway',
  }
}

export const DEFAULT_TRIP: TripDraft = {
  prompt: '',
  origin: 'Bangalore',
  dates: 'December 12–13',
  duration: 'Weekend',
  budget: 10000,
  vibe: 'Getaway',
}

export const CALENDAR_DAYS = [
  '2026-12-11',
  '2026-12-12',
  '2026-12-13',
  '2026-12-14',
] as const

export function hueFromName(name: string): number {
  let hue = 0
  for (const char of name) hue = (hue + char.charCodeAt(0) * 17) % 360
  return hue
}

const EXTRA_JOIN_NAMES = [
  'Priya',
  'Arjun',
  'Meera',
  'Dev',
  'Sana',
  'Rohan',
  'Anika',
  'Vikram',
]

export function nextJoinName(existing: Friend[]): string {
  const taken = new Set(existing.map((friend) => friend.name.toLowerCase()))
  const unused = EXTRA_JOIN_NAMES.find((name) => !taken.has(name.toLowerCase()))
  if (unused) return unused
  return `Friend ${existing.length + 1}`
}

export function createGuest(name: string, budget: number): Friend {
  const trimmed = name.trim()
  return {
    id: `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: trimmed,
    initial: trimmed.charAt(0).toUpperCase() || '?',
    hue: hueFromName(trimmed),
    role: 'member',
    joined: true,
    prefsSubmitted: false,
    budget,
    budgetHard: true,
    interests: [],
    interestPriority: 'flexible',
    dates: ['2026-12-12', '2026-12-13'],
    vote: null,
    confirmed: false,
  }
}
