import { RotateCcw, Users } from 'lucide-react'
import { useState, type Dispatch } from 'react'
import { INTEREST_LABELS } from '../data/mock'
import type { Action, PrototypeState, Screen } from '../prototypeState'

const JUMPS: Array<{ screen: Screen; label: string }> = [
  { screen: 'landing', label: 'Landing' },
  { screen: 'create', label: 'Create' },
  { screen: 'invite', label: 'Invite' },
  { screen: 'join', label: 'Open link' },
  { screen: 'prefs', label: 'Prefs' },
  { screen: 'recs', label: 'Matches' },
  { screen: 'vote', label: 'Vote' },
]

interface DemoDockProps {
  state: PrototypeState
  dispatch: Dispatch<Action>
}

export function DemoDock({ state, dispatch }: DemoDockProps) {
  const [open, setOpen] = useState(false)

  function jump(screen: Screen) {
    if (screen === 'join') {
      dispatch({ type: 'openInviteLink' })
      return
    }
    if (screen === 'recs' || screen === 'vote' || screen === 'prefs') {
      dispatch({ type: 'joinAll' })
      dispatch({ type: 'submitAllPrefs' })
    }
    if (screen === 'invite') {
      dispatch({ type: 'patchFriend', id: 'aisha', patch: { joined: true } })
    }
    dispatch({ type: 'go', screen })
  }

  if (!open) {
    return (
      <button
        type="button"
        className="fixed top-4 right-4 z-50 min-h-9 rounded-full bg-ink px-3.5 text-xs font-medium text-white shadow-lift"
        onClick={() => setOpen(true)}
        aria-expanded={false}
      >
        Demo
      </button>
    )
  }

  return (
    <aside
      className="fixed top-4 right-4 z-50 w-[min(92vw,20rem)] rounded-2xl border border-white/15 bg-ink p-3 text-white shadow-float"
      aria-label="Demo Mode"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-white/70">Demo</p>
        <button
          type="button"
          className="text-xs text-white/70 hover:text-white"
          onClick={() => setOpen(false)}
        >
          Hide
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {JUMPS.map((item) => (
          <button
            key={item.screen}
            type="button"
            onClick={() => jump(item.screen)}
            className={`min-h-8 rounded-full px-2.5 text-xs ${
              state.screen === item.screen ? 'bg-white text-ink' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          className="inline-flex h-9 min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-white/10 text-xs text-white hover:bg-white/20"
          onClick={() => {
            dispatch({ type: 'joinAll' })
            dispatch({ type: 'toast', message: 'Everyone is in the room.' })
          }}
        >
          <Users size={14} />
          Join friends
        </button>
        <button
          type="button"
          className="inline-flex h-9 min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-white/10 text-xs text-white hover:bg-white/20"
          onClick={() => dispatch({ type: 'reset' })}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
      <label className="mt-2 block text-[11px] text-white/70">
        Viewing as
        <select
          className="mt-1 min-h-9 w-full rounded-lg border border-white/15 bg-white/10 px-2 text-sm text-white"
          value={state.viewingId}
          onChange={(event) => dispatch({ type: 'view', id: event.target.value })}
        >
          {state.friends.map((friend) => (
            <option key={friend.id} value={friend.id} className="text-ink">
              {friend.name} · {friend.interests.map((interest) => INTEREST_LABELS[interest]).join(', ') || '—'} · ₹
              {friend.budget.toLocaleString('en-IN')}
            </option>
          ))}
        </select>
      </label>
    </aside>
  )
}
