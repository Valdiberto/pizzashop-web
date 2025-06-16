'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import z from 'zod'

const productFiltersSchema = z.object({
  productId: z.string().optional(),
  name: z.string().optional(),
})

type ProductFiltersSchema = z.infer<typeof productFiltersSchema>

export function ProductTableFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const productId = searchParams.get('productId')
  const name = searchParams.get('name')

  const { register, handleSubmit, reset } = useForm<ProductFiltersSchema>({
    resolver: zodResolver(productFiltersSchema),
    defaultValues: {
      productId: productId ?? '',
      name: name ?? '',
    },
  })

  function handleFilter({ productId, name }: ProductFiltersSchema) {
    const params = new URLSearchParams(searchParams.toString())

    // Atualiza ou remove os parâmetros
    if (productId) {
      params.set('productId', productId)
    } else {
      params.delete('productId')
    }

    if (name) {
      params.set('name', name)
    } else {
      params.delete('name')
    }

    // Resetar para a primeira página
    params.set('page', '1')

    // Atualiza a URL
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleClearFilters() {
    const params = new URLSearchParams()
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
    reset({
      productId: '',
      name: '',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-col gap-2 lg:flex-row lg:items-center"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="Id do pedido"
        className="h-8 w-auto"
        {...register('productId')}
      />
      <Input
        placeholder="Nome do cliente"
        className="h-8 w-[320px]"
        {...register('name')}
      />
      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>
      <Button
        onClick={handleSubmit(handleClearFilters)}
        type="button"
        variant="outline"
        size="xs"
      >
        <X className="mr-2 h-4 w-4" />
        Remover resultados
      </Button>
    </form>
  )
}
