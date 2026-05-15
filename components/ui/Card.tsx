import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    onClick?: () => void
}
//
export function Card({ children, className = '', onClick }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </div>
    )
}

export function CardHeader({ children, className = '' }: CardProps) {
    return <div className={`p-4 border-b ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }: CardProps) {
    return <div className={`p-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: CardProps) {
    return <div className={`p-4 border-t ${className}`}>{children}</div>
}