import type { ReactNode } from 'react'
import { HERO_IMAGE } from '../data/mock'

interface AppShellProps {
  children: ReactNode
  photo?: string
  caption?: string
}

export function AppShell({ children, photo = HERO_IMAGE, caption }: AppShellProps) {
  return (
    <div className="relative min-h-svh bg-paper">
      <div className="relative h-[30vh] overflow-hidden lg:fixed lg:inset-y-0 lg:left-0 lg:h-svh lg:w-[calc(100%-30rem)]">
        <img src={photo} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-paper from-5% via-transparent to-black/20 lg:from-ink/55 lg:via-ink/15 lg:to-ink/25" />
        {caption ? (
          <p className="absolute bottom-10 left-10 hidden max-w-[16ch] text-[40px] leading-[1.05] font-medium tracking-[-0.035em] text-white lg:block">
            {caption}
          </p>
        ) : null}
      </div>
      <div className="relative -mt-8 min-h-[70vh] rounded-t-[28px] bg-paper pb-24 shadow-[0_-18px_40px_-16px_rgb(26_25_22/0.35)] lg:mt-0 lg:ml-auto lg:min-h-svh lg:w-[30rem] lg:rounded-none lg:shadow-none">
        {children}
      </div>
    </div>
  )
}
