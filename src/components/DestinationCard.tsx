import { motion } from 'motion/react'
import { INTEREST_LABELS } from '../data/mock'
import { cn } from '../utils/cn'
import { formatInr, type RankedDestination } from '../utils/recommendations'
import { Button } from './Button'

interface DestinationCardProps {
  destination: RankedDestination
  emphasized?: boolean
  selected?: boolean
  onSelect?: () => void
  actionLabel?: string
}

export function DestinationCard({
  destination,
  emphasized,
  selected,
  onSelect,
  actionLabel = 'Select',
}: DestinationCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: destination.inBudget ? 1 : 0.62,
        y: 0,
      }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div
        className={cn(
          'relative aspect-[4/3] overflow-hidden rounded-[16px]',
          emphasized && 'ring-2 ring-indigo ring-offset-2 ring-offset-paper',
          selected && 'ring-2 ring-coral ring-offset-2 ring-offset-paper',
        )}
      >
        <img
          src={destination.image}
          alt={destination.alt}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span
          className={cn(
            'absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-lift',
            destination.inBudget ? 'bg-white text-ink' : 'bg-coral-soft text-coral-ink',
          )}
        >
          {destination.inBudget ? 'Fits hard limits' : 'Outside budget'}
        </span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-medium tracking-tight">{destination.name}</h3>
          <p className="mt-0.5 text-sm text-slate">
            {destination.region} · {destination.dates}
          </p>
        </div>
        <p className="text-[15px] font-medium tabular-nums">{formatInr(destination.cost)}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink">{destination.why}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate">{destination.tradeoff}</p>
      <p className="mt-2 text-[12px] text-slate">
        {destination.tags.map((tag) => INTEREST_LABELS[tag]).join(' · ')}
      </p>
      {onSelect ? (
        <Button
          tone={selected ? 'coral' : 'primary'}
          className="mt-4 w-full"
          onClick={onSelect}
        >
          {selected ? 'Your vote' : actionLabel}
        </Button>
      ) : null}
    </motion.article>
  )
}
