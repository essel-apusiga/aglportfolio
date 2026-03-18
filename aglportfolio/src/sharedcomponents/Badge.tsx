import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type BadgeTone = 'success' | 'neutral' | 'warning' | 'danger'

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  const toneClass: Record<BadgeTone, string> = {
    success: 'bg-emerald-100 text-emerald-800',
    neutral: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
