'use client'

import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontFamily: 'inherit',
  fontWeight: 600,
  letterSpacing: '0.01em',
  borderRadius: 'var(--radius-md)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all var(--transition-base)',
  position: 'relative',
  overflow: 'hidden',
  WebkitUserSelect: 'none',
  userSelect: 'none',
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
    color: '#ffffff',
    boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
  },
  secondary: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-mid)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--accent-from)',
    border: '1.5px solid var(--accent-from)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
  },
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '0.4rem 0.9rem', fontSize: '0.8125rem' },
  md: { padding: '0.6rem 1.25rem', fontSize: '0.9375rem' },
  lg: { padding: '0.8rem 1.75rem', fontSize: '1.0625rem' },
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={(e) => {
        if (disabled) return
        const el = e.currentTarget
        if (variant === 'primary') {
          el.style.transform = 'translateY(-1px)'
          el.style.boxShadow = '0 6px 24px rgba(99,102,241,0.55)'
        } else if (variant === 'outline') {
          el.style.background = 'rgba(99,102,241,0.1)'
        } else if (variant === 'ghost') {
          el.style.background = 'var(--bg-overlay)'
          el.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.transform = ''
        el.style.background = variantStyles[variant].background as string ?? ''
        el.style.boxShadow = variantStyles[variant].boxShadow as string ?? ''
        el.style.color = variantStyles[variant].color as string ?? ''
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = ''
      }}
    >
      {children}
    </button>
  )
}