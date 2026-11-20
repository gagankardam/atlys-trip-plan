import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

type Tone = 'primary' | 'secondary' | 'coral' | 'ghost' | 'inverse'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone
  children: ReactNode
}

export function Button({ tone = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40',
        tone === 'primary' && 'bg-indigo text-white hover:bg-indigo-hover',
        tone === 'secondary' && 'border border-line bg-white text-ink hover:bg-white/70',
        tone === 'coral' && 'bg-coral text-ink hover:brightness-95',
        tone === 'ghost' && 'text-indigo hover:bg-indigo-soft',
        tone === 'inverse' && 'bg-white text-ink hover:bg-paper',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
