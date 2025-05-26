'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OrderTableRow } from './order-table-row'
import { OrderTableFilters } from './order-table-filter'
import { Pagination } from '@/components/pagination'
import { useQuery } from '@tanstack/react-query'
import { getOrders } from '@/services/get-orders'

import { z } from 'zod'
import { OrderTableSkeleton } from './order-table-skeleton'

export function OrdersTable() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', pageIndex, orderId, customerName, status],
    queryFn: () =>
      getOrders({
        pageIndex,
        orderId,
        customerName,
        status: status === 'all' ? null : status,
      }),
  })

  const handlePaginate = async (newPageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (newPageIndex + 1).toString()) // Convertendo para base 1

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-2.5">
      <OrderTableFilters />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[64px]"></TableHead>
              <TableHead className="w-[140px]">Identifcador</TableHead>
              <TableHead className="w-[180px]">Realizado há</TableHead>
              <TableHead className="w-[140px]">Status</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="w-[140px]">Total de pedido</TableHead>
              <TableHead className="w-[164px]"></TableHead>
              <TableHead className="w-[132px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingOrders && <OrderTableSkeleton />}
            {result &&
              result.orders.map((order) => {
                return <OrderTableRow key={order.orderId} order={order} />
              })}
          </TableBody>
        </Table>
      </div>

      {result && (
        <Pagination
          onPageChange={handlePaginate}
          pageIndex={result.meta.pageIndex}
          totalCount={result.meta.totalCount}
          perPage={result.meta.perPage}
        />
      )}
    </div>
  )
}
