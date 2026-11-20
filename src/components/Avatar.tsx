import { cn } from '../utils/cn'
import type { Friend } from '../data/mock'

interface AvatarProps {
  friend: Pick<Friend, 'name' | 'initial' | 'hue' | 'joined'>
  size?: 'sm' | 'md' | 'lg'
  dimmed?: boolean
}

export function Avatar({ friend, size = 'md', dimmed }: AvatarProps) {
  const px =
    size === 'sm' ? 'h-8 w-8 text-[11px]' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm'
  return (
    <span
      title={friend.name}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium text-white ring-2 ring-paper',
        px,
        dimmed && 'opacity-35',
      )}
      style={{ background: `hsl(${friend.hue} 42% 34%)` }}
    >
      {friend.initial}
    </span>
  )
}
