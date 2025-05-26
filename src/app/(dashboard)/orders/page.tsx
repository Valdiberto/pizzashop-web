import { Metadata } from 'next'
import { OrdersTable } from './orderstable'
import { Suspense } from 'react'
import { OrdersTableSkeleton } from './_components/orders-table-skeleton'

export const metadata: Metadata = {
  title: 'Pedidos',
}

export default function Orders() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <Suspense fallback={<OrdersTableSkeleton />}>
          <OrdersTable />
        </Suspense>
      </div>
    </>
  )
}
