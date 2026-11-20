import { useState, type Dispatch, type FormEvent } from 'react'
import { AppShell } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
import type { Action, PrototypeState } from '../prototypeState'

export function JoinScreen({
  state,
  dispatch,
}: {
  state: PrototypeState
  dispatch: Dispatch<Action>
}) {
  const [name, setName] = useState('')
  const organizer =
    state.friends.find((friend) => friend.role === 'organizer') ?? state.friends[0]
  const inRoom = state.friends.filter((friend) => friend.joined)
  const ready = name.trim().length > 1

  function enterRoom(event: FormEvent) {
    event.preventDefault()
    if (!ready) return
    dispatch({ type: 'joinWithName', name })
  }

  return (
    <AppShell caption={state.trip.dates}>
      <ScreenHeader
        title="You're invited"
        onBack={() => dispatch({ type: 'go', screen: 'invite' })}
      />
      <form className="px-6 pt-5" onSubmit={enterRoom}>
        <h1 className="text-[32px] leading-[1.08] font-medium tracking-[-0.035em]">
          {organizer?.name ?? 'A friend'} wants to go somewhere this {state.trip.dates}.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate">
          {state.trip.duration} {state.trip.vibe.toLowerCase()} from {state.trip.origin}. Add your
          name to enter the room, then share dates and a budget.
        </p>

        {inRoom.length > 0 ? (
          <div className="mt-8">
            <div className="flex items-center">
              {inRoom.map((friend) => (
                <span key={friend.id} className="-ml-1.5 first:ml-0">
                  <Avatar friend={friend} />
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate">
              {inRoom.length === 1 ? '1 joined' : `${inRoom.length} joined`}
            </p>
          </div>
        ) : null}

        <label className="mt-8 block">
          <span className="text-sm font-medium">Your name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            autoFocus
            placeholder="e.g. Priya"
            className="field mt-2 min-h-14 px-4 text-[18px]"
          />
        </label>

        <Button type="submit" className="mt-6 w-full" disabled={!ready}>
          Enter the room
        </Button>
      </form>
    </AppShell>
  )
}
