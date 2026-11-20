import { useEffect, type Dispatch } from 'react'
import { motion } from 'motion/react'
import { AppShell } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
import { DESTINATIONS } from '../data/mock'
import { cn } from '../utils/cn'
import { formatInr, rankDestinations } from '../utils/recommendations'
import type { Action, PrototypeState } from '../prototypeState'

export function VoteScreen({
  state,
  dispatch,
}: {
  state: PrototypeState
  dispatch: Dispatch<Action>
}) {
  const required = state.friends.filter((friend) => friend.joined)
  const me = required.find((friend) => friend.id === state.viewingId) ?? required[0] ?? state.friends[0]
  const ranked = rankDestinations(required)
  const votes = required.filter((friend) => friend.vote)
  const uniqueVotes = new Set(votes.map((friend) => friend.vote))
  const confirmed = required.filter((friend) => friend.confirmed)
  const leadingId = [...uniqueVotes][0] ?? null
  const leading = DESTINATIONS.find((destination) => destination.id === leadingId)
  const leadingRanked = ranked.find((destination) => destination.id === leadingId)
  const allSame =
    required.length > 0 &&
    votes.length === required.length &&
    uniqueVotes.size === 1 &&
    leadingId !== null
  const allConfirmed =
    allSame &&
    confirmed.length === required.length &&
    required.every((friend) => friend.vote === leadingId && friend.confirmed)
  const feasible = Boolean(leadingRanked?.inBudget)

  useEffect(() => {
    if (allConfirmed && feasible && !state.celebrated) {
      dispatch({ type: 'celebrate' })
    }
  }, [allConfirmed, feasible, state.celebrated, dispatch])

  if (state.celebrated && leading) {
    return (
      <AppShell photo={leading.image} caption={leading.name}>
        <div className="px-6 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[36px] leading-[1.05] font-medium tracking-[-0.035em]">
              It’s happening!
            </h1>
            <p className="mt-5 text-xl font-medium">{leading.name}</p>
            <p className="mt-1 text-slate">
              {leading.dates} · about {formatInr(leading.cost)} per person
            </p>
            <div className="mt-6 flex">
              {required.map((friend) => (
                <span key={friend.id} className="-ml-1.5 first:ml-0">
                  <Avatar friend={friend} />
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-forest">Everyone required has confirmed this plan.</p>
            <Button
              className="mt-8 w-full"
              onClick={async () => {
                const text = `We're going to ${leading.name} on ${leading.dates}, around ${formatInr(leading.cost)} per person. Everyone agreed on Rally.`
                try {
                  await navigator.clipboard.writeText(text)
                  dispatch({ type: 'toast', message: 'Trip summary copied.' })
                } catch {
                  dispatch({ type: 'toast', message: text })
                }
              }}
            >
              Share trip summary
            </Button>
            <Button tone="ghost" className="mt-2 w-full" onClick={() => dispatch({ type: 'reset' })}>
              Plan another trip
            </Button>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell photo={ranked[0]?.image} caption="One trip">
      <ScreenHeader title="Agree" onBack={() => dispatch({ type: 'go', screen: 'recs' })} />
      <div className="px-6 pt-5">
        <h1 className="text-[32px] leading-[1.08] font-medium tracking-[-0.035em]">
          One trip. Everyone has to say yes.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate">
          Votes are not enough. Confirm only works when everyone in the room picks the same feasible
          option.
        </p>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {required.map((friend) => (
            <button
              key={friend.id}
              type="button"
              onClick={() => dispatch({ type: 'view', id: friend.id })}
              className={cn(
                'flex min-h-10 items-center gap-2 rounded-full px-2 pr-3 text-sm',
                friend.id === me.id ? 'bg-ink text-white' : 'bg-white ring-1 ring-line',
              )}
            >
              <Avatar friend={friend} size="sm" />
              {friend.name}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm font-medium">Voting as {me.name}</p>
        <div className="mt-3 space-y-3">
          {ranked.map((destination) => (
            <button
              key={destination.id}
              type="button"
              onClick={() =>
                dispatch({ type: 'vote', id: me.id, destinationId: destination.id })
              }
              className={cn(
                'flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white p-2 pr-4 text-left ring-1 transition-colors',
                me.vote === destination.id ? 'ring-coral' : 'ring-line hover:ring-ink/25',
              )}
            >
              <img
                src={destination.image}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{destination.name}</span>
                <span className="text-sm text-slate">
                  {formatInr(destination.cost)}
                  {destination.inBudget ? '' : ' · outside a hard budget'}
                </span>
              </span>
              <span className="text-sm text-slate tabular-nums">
                {required.filter((friend) => friend.vote === destination.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          {required.map((friend) => (
            <span key={friend.id} className="flex flex-col items-center gap-1 text-[11px] text-slate">
              <Avatar friend={friend} size="sm" dimmed={!friend.vote} />
              {friend.confirmed ? 'Yes' : friend.vote ? 'Voted' : '—'}
            </span>
          ))}
        </div>

        {votes.length > 0 && uniqueVotes.size > 1 ? (
          <p className="mt-5 text-sm text-coral-ink">
            The group is split. Someone needs to change their vote before you can confirm.
          </p>
        ) : null}

        {allSame && !feasible ? (
          <p className="mt-5 text-sm text-coral-ink">
            Everyone picked {leading?.name}, but it still breaks a hard budget. Go back and resolve
            that first.
          </p>
        ) : null}

        <Button
          tone="coral"
          className="mt-8 w-full"
          disabled={!me.vote}
          onClick={() => {
            if (!feasible && me.vote === leadingId) {
              dispatch({
                type: 'toast',
                message: 'This option is not feasible until hard budgets fit.',
              })
              return
            }
            dispatch({ type: 'confirm', id: me.id })
          }}
        >
          Confirm as {me.name}
        </Button>

        <Button
          className="mt-3 w-full"
          disabled={!allConfirmed || !feasible}
          onClick={() => dispatch({ type: 'celebrate' })}
        >
          {allConfirmed && feasible
            ? 'Lock it in'
            : `${confirmed.length} of ${required.length} confirmed`}
        </Button>
      </div>
    </AppShell>
  )
}
