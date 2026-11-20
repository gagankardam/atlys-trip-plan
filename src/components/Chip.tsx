import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface ChipProps {
  selected?: boolean
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Chip({ selected, children, className, onClick }: ChipProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'min-h-9 rounded-full border px-3.5 text-[13px] transition-colors duration-200',
        selected
          ? 'border-ink bg-ink text-white'
          : 'border-line bg-white text-ink hover:border-ink/30',
        className,
      )}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}
