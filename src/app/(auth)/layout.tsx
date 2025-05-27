import { Pizza } from 'lucide-react'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-2">
      <div className="border-foreground/5 bg-muted text-muted-foreground flex h-full flex-col justify-between border-r p-5 lg:p-10">
        <div className="text-foreground flex items-center gap-3 text-lg font-medium">
          <Pizza className="h-5 w-5" />
          <span className="font-semibold">pizza.shop</span>
        </div>
        <footer className="text-xs lg:text-sm">
          {' '}
          Painel do parceiro &copy: pizza.shop - {new Date().getFullYear()}
        </footer>
      </div>

      <main className="relative flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  )
}
