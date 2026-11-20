import {
  createGuest,
  DEFAULT_TRIP,
  nextJoinName,
  parsePrompt,
  seedFriends,
  type Friend,
  type FriendId,
  type TripDraft,
} from './data/mock'

export type Screen =
  | 'landing'
  | 'create'
  | 'invite'
  | 'join'
  | 'prefs'
  | 'recs'
  | 'vote'

export type RecsPhase = 'idle' | 'availability' | 'budgets' | 'matches' | 'ready'

export type ConflictMode = 'open' | 'cheaper' | 'asking' | 'resolved'

export interface PrototypeState {
  screen: Screen
  trip: TripDraft
  parsing: boolean
  parsed: boolean
  friends: Friend[]
  viewingId: FriendId
  recsPhase: RecsPhase
  conflictMode: ConflictMode
  toast: string | null
  celebrated: boolean
}

export type Action =
  | { type: 'reset' }
  | { type: 'go'; screen: Screen }
  | { type: 'setPrompt'; prompt: string }
  | { type: 'startParse' }
  | { type: 'finishParse' }
  | { type: 'patchTrip'; patch: Partial<TripDraft> }
  | { type: 'joinNext' }
  | { type: 'joinAll' }
  | { type: 'view'; id: FriendId }
  | { type: 'patchFriend'; id: FriendId; patch: Partial<Friend> }
  | { type: 'submitPrefs'; id: FriendId }
  | { type: 'submitAllPrefs' }
  | { type: 'setRecsPhase'; phase: RecsPhase }
  | { type: 'setConflict'; mode: ConflictMode }
  | { type: 'vote'; id: FriendId; destinationId: string }
  | { type: 'confirm'; id: FriendId }
  | { type: 'toast'; message: string | null }
  | { type: 'celebrate' }
  | { type: 'createTrip' }
  | { type: 'openInviteLink' }
  | { type: 'joinWithName'; name: string }
  | { type: 'startFresh' }

export function createInitialState(): PrototypeState {
  return {
    screen: 'landing',
    trip: { ...DEFAULT_TRIP },
    parsing: false,
    parsed: false,
    friends: seedFriends(),
    viewingId: 'aisha',
    recsPhase: 'idle',
    conflictMode: 'open',
    toast: null,
    celebrated: false,
  }
}

function joinNext(friends: Friend[]): Friend[] {
  const index = friends.findIndex((friend) => !friend.joined)
  if (index >= 0) {
    return friends.map((friend, i) => (i === index ? { ...friend, joined: true } : friend))
  }
  const budget = friends.find((friend) => friend.role === 'organizer')?.budget ?? 10000
  return [...friends, createGuest(nextJoinName(friends), budget)]
}

export function reducer(state: PrototypeState, action: Action): PrototypeState {
  switch (action.type) {
    case 'reset':
      return createInitialState()
    case 'startFresh':
      return {
        ...createInitialState(),
        screen: 'create',
        toast: 'The previous trip was deleted. Start a new one.',
      }
    case 'go':
      return {
        ...state,
        screen: action.screen,
        recsPhase: action.screen === 'recs' ? 'availability' : state.recsPhase,
        celebrated: action.screen === 'vote' ? state.celebrated : false,
      }
    case 'setPrompt':
      return { ...state, trip: { ...state.trip, prompt: action.prompt } }
    case 'startParse':
      return { ...state, parsing: true }
    case 'finishParse':
      return {
        ...state,
        parsing: false,
        parsed: true,
        trip: parsePrompt(state.trip.prompt || 'Weekend getaway from Bangalore.'),
      }
    case 'patchTrip':
      return { ...state, trip: { ...state.trip, ...action.patch } }
    case 'joinNext': {
      const friends = joinNext(state.friends)
      const just =
        friends.find((friend, i) => friend.joined && !state.friends[i]?.joined) ??
        friends[friends.length - 1]
      return {
        ...state,
        friends,
        toast: just ? `${just.name} joined.` : state.toast,
      }
    }
    case 'joinAll':
      return {
        ...state,
        friends: state.friends.map((friend) => ({ ...friend, joined: true })),
        toast: 'Everyone is in the room.',
      }
    case 'view':
      return { ...state, viewingId: action.id }
    case 'patchFriend':
      return {
        ...state,
        friends: state.friends.map((friend) =>
          friend.id === action.id ? { ...friend, ...action.patch, confirmed: false } : friend,
        ),
        celebrated: false,
        conflictMode: state.conflictMode === 'cheaper' ? state.conflictMode : 'open',
      }
    case 'submitPrefs':
      return {
        ...state,
        friends: state.friends.map((friend) =>
          friend.id === action.id ? { ...friend, prefsSubmitted: true, joined: true } : friend,
        ),
        toast: `${state.friends.find((friend) => friend.id === action.id)?.name} shared preferences.`,
      }
    case 'submitAllPrefs':
      return {
        ...state,
        friends: state.friends.map((friend) => ({
          ...friend,
          joined: true,
          prefsSubmitted: true,
        })),
      }
    case 'setRecsPhase':
      return { ...state, recsPhase: action.phase }
    case 'setConflict':
      return {
        ...state,
        conflictMode: action.mode,
        viewingId: action.mode === 'asking' ? 'aisha' : state.viewingId,
      }
    case 'vote':
      return {
        ...state,
        friends: state.friends.map((friend) =>
          friend.id === action.id
            ? { ...friend, vote: action.destinationId, confirmed: false }
            : friend,
        ),
        celebrated: false,
      }
    case 'confirm':
      return {
        ...state,
        friends: state.friends.map((friend) =>
          friend.id === action.id ? { ...friend, confirmed: true } : friend,
        ),
      }
    case 'toast':
      return { ...state, toast: action.message }
    case 'celebrate':
      return { ...state, celebrated: true }
    case 'createTrip': {
      const trip = parsePrompt(state.trip.prompt || 'Weekend getaway from Bangalore.')
      return {
        ...state,
        parsing: false,
        parsed: true,
        trip,
        screen: 'invite',
        friends: state.friends.map((friend) =>
          friend.role === 'organizer' ? { ...friend, joined: true } : friend,
        ),
        viewingId: state.friends.find((friend) => friend.role === 'organizer')?.id ?? 'aisha',
        toast: 'Trip room is ready. Send the link so friends can add dates.',
      }
    }
    case 'openInviteLink': {
      const trip = state.parsed
        ? state.trip
        : parsePrompt('Weekend getaway from Bangalore.')
      return {
        ...state,
        parsed: true,
        trip,
        screen: 'join',
        friends: state.friends.map((friend) =>
          friend.role === 'organizer' ? { ...friend, joined: true } : friend,
        ),
        toast: null,
      }
    }
    case 'joinWithName': {
      const name = action.name.trim()
      if (!name) return state
      const guest = createGuest(name, state.trip.budget || 10000)
      return {
        ...state,
        friends: [...state.friends, guest],
        viewingId: guest.id,
        screen: 'prefs',
        toast: `${guest.name} is in the room.`,
      }
    }
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}
