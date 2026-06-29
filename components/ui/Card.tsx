import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`card-hover glass ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div
      className={className}
      style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}
    >
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={className} style={{ padding: '1.25rem 1.5rem' }}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }: CardProps) {
  return (
    <div
      className={className}
      style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)' }}
    >
      {children}
    </div>
  )
}