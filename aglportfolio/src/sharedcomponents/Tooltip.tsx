import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type TooltipProps = {
  content: ReactNode
  children: ReactNode
  className?: string
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn('ui-tooltip-wrapper', className)}>
      {children}
      <span role="tooltip" className="ui-tooltip">
        {content}
      </span>
    </span>
  )
}
