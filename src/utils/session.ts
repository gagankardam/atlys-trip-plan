import { INTERESTS, parsePrompt, type Friend, type Interest } from '../data/mock'
import { createInitialState, type PrototypeState, type Screen } from '../prototypeState'

const STORAGE_KEY = 'rally.prototype'

const SCREENS: Screen[] = [
  'landing',
  'create',
  'invite',
  'join',
  'prefs',
  'recs',
  'vote',
]

export function inviteUrl(): string {
  return `${window.location.origin}/#/join`
}

export function hashForScreen(screen: Screen): string {
  return screen === 'landing' ? '#/' : `#/${screen}`
}

export function screenFromHash(hash: string): Screen | null {
  const path = hash.replace(/^#\/?/, '').split('?')[0]
  if (path === '' || path === '/') return 'landing'
  return SCREENS.find((screen) => screen === path) ?? null
}

export function writeHash(screen: Screen): void {
  const next = hashForScreen(screen)
  if (window.location.hash !== next) {
    window.history.replaceState(null, '', next)
  }
}

function isInterest(value: unknown): value is Interest {
  return INTERESTS.some((item) => item === value)
}

function normalizeFriend(friend: Friend): Friend {
  const record = friend as Friend & { interest?: Interest }
  const fromArray = Array.isArray(record.interests) ? record.interests.filter(isInterest) : []
  const fromLegacy = record.interest && isInterest(record.interest) ? [record.interest] : []
  return { ...record, interests: fromArray.length > 0 ? fromArray : fromLegacy }
}

export function persistState(state: PrototypeState): void {
  const stored: PrototypeState = { ...state, toast: null }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

export function loadState(): PrototypeState {
  let state = createInitialState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PrototypeState
      state = {
        ...createInitialState(),
        ...parsed,
        friends: (parsed.friends ?? []).map(normalizeFriend),
        toast: null,
      }
    }
  } catch {
    state = createInitialState()
  }

  const fromHash = screenFromHash(window.location.hash)
  if (fromHash === 'join') {
    return {
      ...state,
      parsed: true,
      trip: state.parsed ? state.trip : parsePrompt('Weekend getaway from Bangalore.'),
      screen: 'join',
      friends: state.friends.map((friend) =>
        friend.role === 'organizer' ? { ...friend, joined: true } : friend,
      ),
    }
  }
  if (fromHash) {
    return { ...state, screen: fromHash }
  }
  return state
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
