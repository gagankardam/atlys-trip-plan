import { useEffect } from 'react'
import type { Dispatch } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AppShell } from '../components/AppShell'
import { Button } from '../components/Button'
import { Chip } from '../components/Chip'
import { ScreenHeader } from '../components/ScreenHeader'
import { EXAMPLE_PROMPTS } from '../data/mock'
import { formatInr } from '../utils/recommendations'
import { clearSession } from '../utils/session'
import type { Action, PrototypeState } from '../prototypeState'

export function CreateScreen({
  state,
  dispatch,
}: {
  state: PrototypeState
  dispatch: Dispatch<Action>
}) {
  useEffect(() => {
    if (!state.parsing) return
    const timer = window.setTimeout(() => dispatch({ type: 'finishParse' }), 900)
    return () => window.clearTimeout(timer)
  }, [state.parsing, dispatch])

  function submit() {
    if (!state.trip.prompt.trim()) {
      dispatch({
        type: 'setPrompt',
        prompt: 'Weekend getaway from Bangalore.',
      })
    }
    dispatch({ type: 'startParse' })
  }

  return (
    <AppShell caption="Where to?">
      <ScreenHeader title="Rally" onBack={() => dispatch({ type: 'go', screen: 'landing' })} />
      <div className="px-6 pt-5">
        <h1 className="text-[32px] leading-[1.08] font-medium tracking-[-0.035em]">
          Tell Rally the trip you’re thinking about.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate">
          Write it the way you would in the group chat. Rally turns it into something friends can
          actually respond to.
        </p>

        <label className="mt-8 block">
          <span className="sr-only">Trip idea</span>
          <textarea
            value={state.trip.prompt}
            onChange={(event) => dispatch({ type: 'setPrompt', prompt: event.target.value })}
            placeholder="Tell Rally what kind of trip you're thinking about..."
            rows={4}
            className="field resize-none px-4 py-4 text-[16px] leading-relaxed"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <Chip
              key={prompt}
              selected={state.trip.prompt === prompt}
              onClick={() => dispatch({ type: 'setPrompt', prompt })}
            >
              {prompt}
            </Chip>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {state.parsing ? (
            <motion.p
              key="parsing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-sm text-indigo"
            >
              Rally is reading this…
            </motion.p>
          ) : null}
        </AnimatePresence>

        {state.parsed && !state.parsing ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="mt-8"
          >
            <p className="text-sm text-slate">Edit anything Rally got wrong.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="rounded-full border border-line bg-white px-3 py-2 text-sm">
                From
                <input
                  value={state.trip.origin}
                  onChange={(event) =>
                    dispatch({ type: 'patchTrip', patch: { origin: event.target.value } })
                  }
                  className="ml-2 w-28 bg-transparent font-medium outline-none"
                />
              </label>
              <label className="rounded-full border border-line bg-white px-3 py-2 text-sm">
                Dates
                <input
                  value={state.trip.dates}
                  onChange={(event) =>
                    dispatch({ type: 'patchTrip', patch: { dates: event.target.value } })
                  }
                  className="ml-2 w-36 bg-transparent font-medium outline-none"
                />
              </label>
              <label className="rounded-full border border-line bg-white px-3 py-2 text-sm">
                {state.trip.duration}
              </label>
              <label className="rounded-full border border-line bg-white px-3 py-2 text-sm">
                About
                <input
                  type="number"
                  value={state.trip.budget}
                  onChange={(event) =>
                    dispatch({
                      type: 'patchTrip',
                      patch: { budget: Number(event.target.value) || 0 },
                    })
                  }
                  className="ml-2 w-20 bg-transparent font-medium outline-none"
                />
              </label>
              <span className="rounded-full border border-line bg-white px-3 py-2 text-sm font-medium">
                {state.trip.vibe}
              </span>
            </div>
            <p className="mt-3 text-xs text-slate">
              Starting point {formatInr(state.trip.budget)} per person — friends will set their own
              limits next.
            </p>
          </motion.div>
        ) : null}

        <Button
          className="mt-10 w-full"
          onClick={() => (state.parsed ? dispatch({ type: 'createTrip' }) : submit())}
          disabled={state.parsing}
        >
          {state.parsed ? 'Create trip and get a link' : 'Continue'}
        </Button>
        <Button
          tone="secondary"
          className="mt-3 w-full"
          disabled={state.parsing}
          onClick={() => {
            clearSession()
            dispatch({ type: 'startFresh' })
          }}
        >
          Plan a trip from scratch
        </Button>
      </div>
    </AppShell>
  )
}
