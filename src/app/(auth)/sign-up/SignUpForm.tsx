'use client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { registerRestaurant } from '@/services/register-restaurant'

const signUpFormSchema = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  email: z.string().email(),
  phone: z.string(),
})

type SignUpForm = z.infer<typeof signUpFormSchema>

export function SignUpForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
  })

  const { mutateAsync: registerRestaurantFn } = useMutation({
    mutationFn: registerRestaurant,
  })

  async function handleSignUp(data: SignUpForm) {
    try {
      await registerRestaurantFn({
        restaurantName: data.restaurantName,
        managerName: data.managerName,
        email: data.email,
        phone: data.phone,
      })

      toast.success('Restaurante cadastrado com sucesso.', {
        action: {
          label: 'Login',
          onClick: () => router.push(`/sign-in?email=${data.email}`),
        },
      })
    } catch {
      toast.error('Erro ao cadastrar restaurante.')
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
      <div className="space-y-2">
        <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
        <Input
          id="restaurantName"
          type="text"
          {...register('restaurantName')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="managerName">Seu nome</Label>
        <Input id="managerName" type="text" {...register('managerName')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Seu e-mail</Label>
        <Input id="email" type="email" {...register('email')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Seu celular</Label>
        <Input id="phone" type="tel" {...register('phone')} />
      </div>
      <Button disabled={isSubmitting} type="submit" className="w-full">
        Finalizar Cadastro
      </Button>

      <p className="text-muted-foreground px-6 text-center text-sm leading-relaxed">
        Ao continuar, você concorda com nossos{' '}
        <a href="" className="underline underline-offset-4">
          termos de serviço{' '}
        </a>{' '}
        e{' '}
        <a href="" className="underline underline-offset-4">
          políticas de privacidade
        </a>
        .
      </p>
    </form>
  )
}
