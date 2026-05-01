'use client'

import { ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode
    onClick?: () => void
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    className?: string
    type?: 'button' | 'submit'
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
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {children}
        </button>
    )
}