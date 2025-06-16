import { Metadata } from 'next'
import { MyProducts } from './my-produtcs'

export const metadata: Metadata = {
  title: 'Produtos',
}

export default function Products() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
      <MyProducts />
    </div>
  )
}
