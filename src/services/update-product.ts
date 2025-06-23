import { api } from '@/lib/axios'

export interface UpdateProductBody {
  productId: string
  name: string
  description: string
  priceInCents: number
}

export async function updateProduct({
  name,
  description,
  priceInCents,
  productId,
}: UpdateProductBody) {
  await api.put(`/products/${productId}`, {
    name,
    description,
    priceInCents,
  })
}
