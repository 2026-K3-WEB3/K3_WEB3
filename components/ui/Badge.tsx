import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

const variantStyles: Record<string, React.CSSProperties> = {
  default: { background: 'rgba(161,161,192,0.15)', color: 'var(--text-secondary)' },
  success: { background: 'rgba(34,197,94,0.15)',   color: '#4ade80' },
  warning: { background: 'rgba(234,179,8,0.15)',   color: '#facc15' },
  danger:  { background: 'rgba(239,68,68,0.15)',   color: '#f87171' },
  info:    { background: 'rgba(99,102,241,0.15)',   color: '#a5b4fc' },
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        ...variantStyles[variant],
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.65rem',
        borderRadius: '99px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        border: `1px solid ${variantStyles[variant].color}30`,
      }}
    >
      {children}
    </span>
  )
}