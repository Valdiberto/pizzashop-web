import { api } from '@/lib/axios'

export interface GetProductsQuery {
  pageIndex?: number | null
  productId?: string | null
  name?: string | null
  priceInCents?: number | null
  description?: string | null
}

export interface GetProductsResponse {
  products: {
    productId: string
    createdAt: string
    name: string
    priceInCents: number
    description: string
  }[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getProducts({
  pageIndex,
  productId,
  name,
  priceInCents,
  description,
}: GetProductsQuery) {
  const response = await api.get<GetProductsResponse>('/products', {
    params: {
      pageIndex,
      productId,
      name,
      priceInCents,
      description,
    },
  })

  return response.data
}
