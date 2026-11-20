import { useState, type Dispatch } from 'react'
import { AppShell } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Chip } from '../components/Chip'
import { ScreenHeader } from '../components/ScreenHeader'
import {
  CALENDAR_DAYS,
  INTEREST_LABELS,
  INTERESTS,
  type Friend,
  type Interest,
} from '../data/mock'
import { cn } from '../utils/cn'
import { formatInr } from '../utils/recommendations'
import type { Action, PrototypeState } from '../prototypeState'

const DAYS: Array<{ iso: (typeof CALENDAR_DAYS)[number]; weekday: string; day: string }> = [
  { iso: '2026-12-11', weekday: 'Fri', day: '11' },
  { iso: '2026-12-12', weekday: 'Sat', day: '12' },
  { iso: '2026-12-13', weekday: 'Sun', day: '13' },
  { iso: '2026-12-14', weekday: 'Mon', day: '14' },
]

function datesSummary(dates: string[]): string {
  return dates
    .map((iso) => {
      const match = DAYS.find((day) => day.iso === iso)
      return match ? `${match.weekday} ${match.day}` : iso
    })
    .join(', ')
}

function FriendSummary({
  friend,
  isYou,
  onEdit,
}: {
  friend: Friend
  isYou?: boolean
  onEdit?: () => void
}) {
  return (
    <li className="flex items-start gap-3 py-4">
      <Avatar friend={friend} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 font-medium">
          {friend.name}
          {isYou ? (
            <span className="rounded-full bg-indigo-soft px-2 py-0.5 text-xs font-medium text-indigo">
              You
            </span>
          ) : null}
        </p>
        {friend.prefsSubmitted ? (
          <p className="mt-0.5 text-sm leading-relaxed text-slate">
            {datesSummary(friend.dates)} · {formatInr(friend.budget)}{' '}
            {friend.budgetHard ? 'hard limit' : 'flexible'} ·{' '}
            {friend.interests.map((interest) => INTEREST_LABELS[interest]).join(', ') || 'no vibe yet'}
            {friend.interestPriority === 'must' ? ', must-have' : ''}
          </p>
        ) : (
          <p className="mt-0.5 text-sm text-slate">Hasn’t shared dates yet</p>
        )}
      </div>
      {isYou && onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="min-h-11 shrink-0 px-2 text-sm font-medium text-indigo"
        >
          Edit
        </button>
      ) : null}
    </li>
  )
}

export function PrefsScreen({
  state,
  dispatch,
}: {
  state: PrototypeState
  dispatch: Dispatch<Action>
}) {
  const me = state.friends.find((friend) => friend.id === state.viewingId) ?? state.friends[0]
  const [editing, setEditing] = useState(!me.prefsSubmitted)
  const joined = state.friends.filter((friend) => friend.joined)
  const others = joined.filter((friend) => friend.id !== me.id)
  const previewing = me.prefsSubmitted && !editing

  function save() {
    dispatch({ type: 'submitPrefs', id: me.id })
    setEditing(false)
  }

  return (
    <AppShell caption="Your dates">
      <ScreenHeader title="Dates & budget" onBack={() => dispatch({ type: 'go', screen: 'invite' })} />
      <div className="px-6 pt-5">
        <h1 className="text-[32px] leading-[1.08] font-medium tracking-[-0.035em]">
          {previewing ? 'Here’s the room so far.' : `${me.name}, when can you go?`}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate">
          {previewing
            ? 'Your preferences are in the list. Edit yours anytime before you move on.'
            : 'Only you can change yours. Other people appear as they share.'}
        </p>

        {previewing ? (
          <section className="mt-8" aria-label="People in the room">
            <h2 className="text-sm font-medium">In the room</h2>
            <ul className="mt-1 divide-y divide-line">
              {joined.map((friend) => (
                <FriendSummary
                  key={friend.id}
                  friend={friend}
                  isYou={friend.id === me.id}
                  onEdit={friend.id === me.id ? () => setEditing(true) : undefined}
                />
              ))}
            </ul>
          </section>
        ) : others.length > 0 ? (
          <section className="mt-8" aria-label="Other people in the room">
            <h2 className="text-sm font-medium">Others in the room</h2>
            <ul className="mt-1 divide-y divide-line">
              {others.map((friend) => (
                <FriendSummary key={friend.id} friend={friend} />
              ))}
            </ul>
          </section>
        ) : (
          <p className="mt-8 text-sm text-slate">You’re the first in the room.</p>
        )}

        {previewing ? (
          <div className="mt-8 flex flex-col gap-3">
            <Button onClick={() => dispatch({ type: 'go', screen: 'recs' })}>
              See what the group can agree on
            </Button>
            <Button tone="secondary" onClick={() => setEditing(true)}>
              Edit my preferences
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-8 text-sm font-medium">Your available days</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {DAYS.map((day) => {
                const selected = me.dates.includes(day.iso)
                return (
                  <button
                    key={day.iso}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      const dates = selected
                        ? me.dates.filter((item) => item !== day.iso)
                        : [...me.dates, day.iso]
                      dispatch({ type: 'patchFriend', id: me.id, patch: { dates } })
                    }}
                    className={cn(
                      'flex min-h-[4.75rem] flex-col items-center justify-center rounded-2xl transition-colors duration-200',
                      selected
                        ? 'bg-ink text-white'
                        : 'bg-white text-ink ring-1 ring-line hover:ring-ink/30',
                    )}
                  >
                    <span className={cn('text-[11px]', selected ? 'text-white/70' : 'text-slate')}>
                      {day.weekday}
                    </span>
                    <span className="mt-0.5 text-lg font-medium">{day.day}</span>
                  </button>
                )
              })}
            </div>

            <label className="mt-8 block">
              <span className="flex items-baseline justify-between text-sm font-medium">
                Your budget per person
                <span className="text-base tabular-nums">{formatInr(me.budget)}</span>
              </span>
              <input
                type="range"
                min={5000}
                max={15000}
                step={500}
                value={me.budget}
                onChange={(event) =>
                  dispatch({
                    type: 'patchFriend',
                    id: me.id,
                    patch: { budget: Number(event.target.value) },
                  })
                }
                className="mt-4"
              />
            </label>
            <div className="mt-3 flex gap-2">
              <Chip
                selected={me.budgetHard}
                onClick={() =>
                  dispatch({ type: 'patchFriend', id: me.id, patch: { budgetHard: true } })
                }
              >
                Hard limit
              </Chip>
              <Chip
                selected={!me.budgetHard}
                onClick={() =>
                  dispatch({ type: 'patchFriend', id: me.id, patch: { budgetHard: false } })
                }
              >
                Flexible
              </Chip>
            </div>

            <p className="mt-8 text-sm font-medium">What sounds good to you</p>
            <p className="mt-1 text-sm text-slate">Pick as many as you like.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTERESTS.map((interest: Interest) => {
                const selected = me.interests.includes(interest)
                return (
                  <Chip
                    key={interest}
                    selected={selected}
                    onClick={() => {
                      const interests = selected
                        ? me.interests.filter((item) => item !== interest)
                        : [...me.interests, interest]
                      dispatch({ type: 'patchFriend', id: me.id, patch: { interests } })
                    }}
                  >
                    {INTEREST_LABELS[interest]}
                  </Chip>
                )
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <Chip
                selected={me.interestPriority === 'must'}
                onClick={() =>
                  dispatch({ type: 'patchFriend', id: me.id, patch: { interestPriority: 'must' } })
                }
              >
                Must-have
              </Chip>
              <Chip
                selected={me.interestPriority === 'flexible'}
                onClick={() =>
                  dispatch({
                    type: 'patchFriend',
                    id: me.id,
                    patch: { interestPriority: 'flexible' },
                  })
                }
              >
                Flexible
              </Chip>
            </div>

            <Button className="mt-8 w-full" onClick={save}>
              {me.prefsSubmitted ? 'Save and preview' : 'Share my preferences'}
            </Button>
          </>
        )}
      </div>
    </AppShell>
  )
}
