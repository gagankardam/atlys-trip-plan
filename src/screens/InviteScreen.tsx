import { useState } from 'react'
import type { Dispatch } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Copy, ExternalLink, MessageCircle } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { ScreenHeader } from '../components/ScreenHeader'
import { inviteUrl } from '../utils/session'
import type { Action, PrototypeState } from '../prototypeState'

export function InviteScreen({
  state,
  dispatch,
}: {
  state: PrototypeState
  dispatch: Dispatch<Action>
}) {
  const [copied, setCopied] = useState(false)
  const joined = state.friends.filter((friend) => friend.joined)
  const link = inviteUrl()
  const message = `Hey! We're finally planning that trip. Add your dates and budget on Rally so we can find somewhere that works for everyone. ${link}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      dispatch({ type: 'toast', message: 'Invite link copied. Anyone can open it and add dates.' })
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      dispatch({ type: 'toast', message: 'Copy the link from the address bar: #/join' })
    }
  }

  return (
    <AppShell caption={state.trip.origin}>
      <ScreenHeader title="Invite friends" onBack={() => dispatch({ type: 'go', screen: 'create' })} />
      <div className="px-6 pt-5">
        <h1 className="text-[32px] leading-[1.08] font-medium tracking-[-0.035em]">
          {state.trip.duration} {state.trip.vibe.toLowerCase()} from {state.trip.origin}.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate">
          Friends open this link, say who they are, and add dates plus a budget. No account.
        </p>
        <p className="mt-2 text-sm text-ink">
          {state.trip.dates} · around ₹{state.trip.budget.toLocaleString('en-IN')} per person
        </p>

        <p className="mt-8 break-all text-sm leading-relaxed text-slate">{link}</p>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={() => void copyLink()}>
            <Copy size={16} />
            {copied ? 'Copied' : 'Copy link'}
          </Button>
          <Button
            tone="secondary"
            onClick={() =>
              window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
            }
          >
            <MessageCircle size={16} />
            Share on WhatsApp
          </Button>
          <Button tone="ghost" onClick={() => dispatch({ type: 'openInviteLink' })}>
            <ExternalLink size={16} />
            Open the link as a friend
          </Button>
        </div>

        <div className="mt-10 flex items-center">
          <AnimatePresence>
            {joined.map((friend) => (
              <motion.span
                key={friend.id}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.22 }}
                className="-ml-1.5 first:ml-0"
              >
                <Avatar friend={friend} />
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <p className="mt-3 text-sm text-slate">
          {joined.length === 1 ? '1 joined' : `${joined.length} joined`}
        </p>

        <Button
          tone="secondary"
          className="mt-6 w-full"
          onClick={() => dispatch({ type: 'joinNext' })}
        >
          Simulate a friend joining
        </Button>

        <Button
          className="mt-3 w-full"
          disabled={joined.length === 0}
          onClick={() => dispatch({ type: 'go', screen: 'prefs' })}
        >
          Add dates and budget
        </Button>
      </div>
    </AppShell>
  )
}
