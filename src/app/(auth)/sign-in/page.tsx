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
    <div className="p-4 lg:p-8">
      <Button
        variant={'ghost'}
        asChild
        className="mb-10 flex justify-center lg:absolute lg:top-8 lg:right-8"
      >
        <Link href="/sign-up"> Novo estabelecimento</Link>
      </Button>
      <div className="flex flex-col justify-center gap-6 lg:w-[350px]">
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
