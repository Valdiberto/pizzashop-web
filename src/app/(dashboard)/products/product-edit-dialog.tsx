import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { ProductDetailsProps } from './product-details'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getProductDetails } from '@/services/get-product-details'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProduct } from '@/services/update-product'
import { toast } from 'sonner'
import { queryClient } from '@/lib/react-query'
import { GetProductsResponse } from '@/services/get-products'
import { useEffect } from 'react'

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  priceInCents: z.number(),
})

type ProductSchema = z.infer<typeof productSchema>

export function ProductEditDialog({ open, productId }: ProductDetailsProps) {
  const { data: product } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => getProductDetails({ productId }),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      priceInCents: 0,
    },
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description ?? '',
        priceInCents: product.priceInCents,
      })
    }
  }, [product, reset])

  function updateProductCache({
    productId,
    name,
    priceInCents,
    description,
  }: ProductSchema & { productId: string }) {
    queryClient.setQueryData<GetProductsResponse>(['products'], (prev) => {
      if (!prev) return prev

      return {
        ...prev,
        products: prev.products.map((product) =>
          product.productId === productId
            ? {
                ...product,
                productName: name,
                priceInCents,
                description, // adicione se necessário
              }
            : product,
        ),
      }
    })
  }
  const { mutateAsync: updateProductFn } = useMutation({
    mutationFn: updateProduct,
    onMutate({ productId, name, description, priceInCents }) {
      updateProductCache({ productId, name, description, priceInCents })
    },
    onSuccess(_, { productId }) {
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  async function handleUpdateProduct(data: ProductSchema) {
    try {
      await updateProductFn({
        productId,
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
      })
      toast.success('Produto atualizado com sucesso!')
    } catch {
      toast.error('Falha de atualizar o produto, tente novamente.')
    }
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto: {productId}</DialogTitle>
        <DialogDescription>Edite as informações do produto</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProduct)}>
        <div className="space-y-4 py-5">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="priceInCents">
              Valor
            </Label>
            <Input
              className="col-span-3"
              type="number"
              id="priceInCents"
              {...register('priceInCents', { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              {...register('description')}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
