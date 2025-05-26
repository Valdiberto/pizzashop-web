import { Metadata } from 'next'
import { SignInForm } from './SignInForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense } from 'react'
import { OrdersTableSkeleton } from '@/app/(dashboard)/orders/_components/orders-table-skeleton'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function SignIn() {
  return (
    <div className="p-8">
      <Button variant={'ghost'} asChild className="absolute top-8 right-8">
        <Link href="/sign-up"> Novo estabelecimento</Link>
      </Button>
      <div className="flex w-[350px] flex-col justify-center gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Acessar painel
          </h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe suas vendas pelo painel do parceiro!
          </p>
        </div>
        <Suspense fallback={<OrdersTableSkeleton />}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
