import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type BadgeTone = 'success' | 'neutral' | 'warning' | 'danger'

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return <span className={cn('ui-badge', `ui-badge--${tone}`, className)}>{children}</span>
}
