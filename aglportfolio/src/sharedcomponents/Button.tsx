import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const variantClass: Record<ButtonVariant, string> = {
    primary: 'bg-emerald-600 text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-700',
    secondary: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200',
    ghost: 'border border-emerald-300 bg-transparent text-emerald-900 hover:bg-emerald-50',
    outline: 'border border-emerald-400 bg-white text-emerald-900 hover:bg-emerald-50',
    danger: 'bg-rose-700 text-white hover:bg-rose-800',
  }

  const sizeClass: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        sizeClass[size],
        variantClass[variant],
        className,
      )}
      {...props}
    />
  )
}
