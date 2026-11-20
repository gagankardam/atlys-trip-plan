import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { HERO_IMAGE } from '../data/mock'

export function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-ink text-white">
      <img
        src={HERO_IMAGE}
        alt="A small boat moving across still water toward distant hills"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/35 to-ink/20" />

      <div className="relative flex min-h-svh flex-col px-6 pt-7 pb-28 lg:mx-auto lg:max-w-5xl lg:px-12 lg:pt-10 lg:pb-16">
        <p className="text-[17px] font-medium tracking-tight">Rally</p>

        <div className="mt-auto max-w-[18ch] lg:max-w-[14ch]">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-[44px] leading-[1.02] font-medium tracking-[-0.038em] lg:text-[72px]"
          >
            The trip your group can actually agree on.
          </motion.h1>
          <p className="mt-4 max-w-[28ch] text-[17px] leading-relaxed text-white/78">
            Less planning. More going.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={onStart}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="mt-8 flex min-h-14 w-full max-w-md items-center rounded-full bg-white p-1.5 pl-6 text-left text-ink shadow-float"
        >
          <span className="flex-1 text-[15px] font-medium">Plan a trip</span>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-coral text-ink">
            <ArrowRight size={18} />
          </span>
        </motion.button>

        <p className="mt-6 text-sm text-white/65">Share a link. Match the group. Agree together.</p>
      </div>
    </main>
  )
}
