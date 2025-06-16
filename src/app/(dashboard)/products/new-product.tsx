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
import { Textarea } from '@/components/ui/textarea'
import { queryClient } from '@/lib/react-query'
import { newProduct } from '@/services/add-product'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const addNewProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  priceInCents: z.number().int().positive(),
})

type NewProductSchema = z.infer<typeof addNewProductSchema>

type NewProductProps = {
  onSuccess?: () => void
}

export function NewProduct({ onSuccess }: NewProductProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewProductSchema>({
    resolver: zodResolver(addNewProductSchema),
    defaultValues: {
      name: '',
      description: '',
      priceInCents: 0,
    },
  })

  const { mutateAsync: addNewProductFn } = useMutation({
    mutationFn: newProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      })
      toast.success('Produto adicionado com sucesso!')
      onSuccess?.()
      reset()
    },
    onError: (err) => {
      console.error('Erro na mutation', err)
    },
  })

  async function handleAddNewProduct(data: NewProductSchema) {
    try {
      await addNewProductFn({
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
      })
    } catch {
      toast.error('Falha ao adicionar produto, tente novamente.')
    }
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar novo produto</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleAddNewProduct)}>
        <div className="space-y-4 py-5">
          <Input
            className=""
            id="name"
            placeholder="Nome do produto"
            {...register('name')}
          />
          <Input
            id="priceInCents"
            type="number"
            className="w-auto"
            placeholder="Valor do produto"
            {...register('priceInCents', { valueAsNumber: true })}
          />
          <Textarea
            className="col-span-3"
            id="description"
            placeholder="Descrição do produto"
            {...register('description')}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            Adicionar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
