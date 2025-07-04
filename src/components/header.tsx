import { BoxesIcon, Home, Pizza, UtensilsCrossed } from 'lucide-react'
import { Separator } from './ui/separator'

import { NavLink } from './nav-link'
import { ThemeToggle } from './theme/theme-toggle'
import { AccountMenu } from './account-menu'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-2 px-3 lg:gap-6 lg:px-6">
        <Pizza className="h-6 w-6" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink href="/">
            <Home className="h-4 w-4" />
            Inínio
          </NavLink>
          <NavLink href="/orders">
            <UtensilsCrossed className="h-4 w-4" />
            Pedidos
          </NavLink>
          <NavLink href="/products">
            <BoxesIcon className="h-4 w-4" />
            Produtos
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 lg:ml-auto">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
