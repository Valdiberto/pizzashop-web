import { Metadata } from 'next'
import { MyProducts } from './my-produtcs'
import { OrdersTableSkeleton } from '../orders/_components/orders-table-skeleton'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Produtos',
}

export default function Products() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
      <Suspense fallback={<OrdersTableSkeleton />}>
        <MyProducts />
      </Suspense>
    </div>
  )
}
