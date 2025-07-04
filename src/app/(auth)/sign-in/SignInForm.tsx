'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { signIn } from '@/services/sign-in'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

const signInFormSchema = z.object({
  email: z.string().email(),
})

type SignInForm = z.infer<typeof signInFormSchema>

export function SignInForm() {
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn(data: SignInForm) {
    try {
      const response = await authenticate({ email: data.email })
      // await authenticate({ email: data.email }) //toast sem link para modo padrao com envio de email
      // toast.success('Enviamos um link de autenticação para seu e-mail.', {
      toast.success(
        <a className="underline" href={response.devAuthLink}>
          Clique aqui para acessar
        </a>,
        {
          action: {
            label: 'Reenviar',
            onClick: () => handleSignIn(data),
          },
        },
      )
    } catch {
      toast.error('Credenciais inválidas.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
      <div className="space-y-2">
        <Label htmlFor="email">Seu e-mail</Label>
        <Input id="email" type="email" {...register('email')} />
      </div>
      <Button disabled={isSubmitting} type="submit" className="w-full">
        Acessar painel
      </Button>
    </form>
  )
}
