import { cn } from '../utils/cn'

type AvatarSize = 'sm' | 'md' | 'lg'

type AvatarProps = {
  name: string
  src?: string
  size?: AvatarSize
  className?: string
}

function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <span className={cn('ui-avatar', `ui-avatar--${size}`, className)} aria-label={name} title={name}>
      {src ? <img src={src} alt={name} /> : initialsFromName(name)}
    </span>
  )
}
