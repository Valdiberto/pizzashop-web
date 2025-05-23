import { Metadata } from 'next'
import { SignUpForm } from './SignUpForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Cadastro',
}

export default function SignUp() {
  return (
    <div className="p-8">
      <Button variant={'ghost'} asChild className="absolute top-8 right-8">
        <Link href="/sign-in">Fazer login</Link>
      </Button>

      <div className="flex w-[350px] flex-col justify-center gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Criar conta grátis
          </h1>
          <p className="text-muted-foreground text-sm">
            Seja um parceiro e comece suas vendas!
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
