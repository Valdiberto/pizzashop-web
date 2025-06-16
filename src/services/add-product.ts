import { api } from '@/lib/axios'

export interface NewProductBody {
  name: string
  priceInCents: number
  description?: string | null
}

export async function newProduct({
  name,
  description,
  priceInCents,
}: NewProductBody) {
  await api.post('/products', {
    name,
    description,
    priceInCents,
  })
}
