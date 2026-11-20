import { useEffect } from 'react'
import type { Dispatch } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { DestinationCard } from '../components/DestinationCard'
import { ScreenHeader } from '../components/ScreenHeader'
import { DESTINATIONS } from '../data/mock'
import {
  budgetInsight,
  formatInr,
  gokarnaGap,
  rankDestinations,
} from '../utils/recommendations'
import type { Action, PrototypeState, RecsPhase } from '../prototypeState'

const PHASE_COPY: Record<Exclude<RecsPhase, 'idle'>, string> = {
  availability: 'Looking at everyone’s availability…',
  budgets: 'Comparing budgets…',
  matches: 'Finding the best matches…',
  ready: 'Your group has options!',
}

export function RecsScreen({
  state,
  dispatch,
}: {
  state: PrototypeState
  dispatch: Dispatch<Action>
}) {
  const reduceMotion = useReducedMotion()
  const ranked = rankDestinations(state.friends)
  const insight = budgetInsight(ranked)
  const gap = gokarnaGap(state.friends)
  const aisha = state.friends.find((friend) => friend.id === 'aisha')
  const joined = state.friends.filter((friend) => friend.joined)
  const submitted = joined.filter((friend) => friend.prefsSubmitted).length
  const hero = ranked[0] ?? DESTINATIONS[0]

  useEffect(() => {
    if (reduceMotion) {
      dispatch({ type: 'setRecsPhase', phase: 'ready' })
      return
    }
    dispatch({ type: 'setRecsPhase', phase: 'availability' })
    const rest: RecsPhase[] = ['budgets', 'matches', 'ready']
    let step = 0
    const timer = window.setInterval(() => {
      dispatch({ type: 'setRecsPhase', phase: rest[step] })
      step += 1
      if (step >= rest.length) window.clearInterval(timer)
    }, 700)
    return () => window.clearInterval(timer)
  }, [reduceMotion, dispatch])

  const ready = state.recsPhase === 'ready'
  const cheaper = state.conflictMode === 'cheaper'
  const asking = state.conflictMode === 'asking'

  return (
    <AppShell photo={hero.image} caption={hero.name}>
      <ScreenHeader title="Matches" onBack={() => dispatch({ type: 'go', screen: 'prefs' })} />
      <div className="px-6 pt-5">
        <h1 className="text-[28px] leading-[1.08] font-medium tracking-[-0.035em]">
          {ready ? 'Here’s what actually works.' : 'Rally is lining up the group.'}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate">
          {submitted < joined.length
            ? `Provisional — ${joined.length - submitted} friend${joined.length - submitted === 1 ? ' has' : 's have'} not responded.`
            : 'Estimates only. Nothing here is a booked trip.'}
        </p>

        {!ready ? (
          <p className="mt-8 text-indigo">
            {PHASE_COPY[state.recsPhase === 'idle' ? 'availability' : state.recsPhase]}
          </p>
        ) : (
          <>
            {aisha ? (
              <label className="mt-5 block">
                <span className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">Aisha’s budget</span>
                  <span className="tabular-nums">
                    {formatInr(aisha.budget)} · {aisha.budgetHard ? 'hard' : 'flexible'}
                  </span>
                </span>
                <input
                  type="range"
                  min={5000}
                  max={15000}
                  step={500}
                  value={aisha.budget}
                  onChange={(event) =>
                    dispatch({
                      type: 'patchFriend',
                      id: 'aisha',
                      patch: { budget: Number(event.target.value) },
                    })
                  }
                  className="mt-4"
                />
              </label>
            ) : null}

            {insight ? (
              <motion.p
                key={insight}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-coral-ink"
              >
                {insight}
              </motion.p>
            ) : (
              <p className="mt-4 text-sm text-forest">Gokarna now fits every hard budget.</p>
            )}

            {gap && state.conflictMode !== 'resolved' ? (
              <div className="mt-4 rounded-[20px] bg-coral-soft px-4 py-3.5">
                <p className="text-[15px] leading-relaxed text-ink">
                  Almost there! Gokarna is a great match, but it’s {formatInr(gap.gap)} above{' '}
                  {gap.person.name}’s budget.
                </p>
                <div className="mt-1 flex flex-col items-start">
                  <Button
                    tone="ghost"
                    className="min-h-10 px-0"
                    onClick={() => dispatch({ type: 'setConflict', mode: 'cheaper' })}
                  >
                    Explore cheaper alternatives
                  </Button>
                  <Button
                    tone="ghost"
                    className="min-h-10 px-0"
                    onClick={() => dispatch({ type: 'setConflict', mode: 'asking' })}
                  >
                    Ask Aisha if she can be flexible
                  </Button>
                </div>
              </div>
            ) : null}

            {asking ? (
              <p className="mt-3 text-sm text-slate">
                Aisha still has to move her own slider. Rally will not change it for her.
              </p>
            ) : null}

            <div className="mt-6 space-y-8">
              <AnimatePresence>
                {ranked.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    emphasized={cheaper && destination.id !== 'gokarna' && destination.inBudget}
                    onSelect={() => {
                      dispatch({
                        type: 'vote',
                        id: state.viewingId,
                        destinationId: destination.id,
                      })
                      dispatch({ type: 'go', screen: 'vote' })
                    }}
                    actionLabel="Take this to a vote"
                  />
                ))}
              </AnimatePresence>
            </div>

            <Button className="mt-8 mb-4 w-full" onClick={() => dispatch({ type: 'go', screen: 'vote' })}>
              Go to group vote
            </Button>
          </>
        )}
      </div>
    </AppShell>
  )
}
