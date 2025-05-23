'use client'

import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export type NavLinkProps = LinkProps & {
  children: ReactNode
  className?: string
}

export function NavLink({ href, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-1.5 text-sm font-medium',
        isActive
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
