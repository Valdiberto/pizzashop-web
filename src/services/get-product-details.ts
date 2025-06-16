import { api } from '@/lib/axios'

export interface GetProductDetailsParams {
  productId: string
}

export async function getProductDetails({
  productId,
}: GetProductDetailsParams) {
  const response = await api.get(`/products/${productId}`)

  return response.data
}
