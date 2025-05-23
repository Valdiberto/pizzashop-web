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

export function OrdersTable() {
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
            {Array.from({ length: 10 }).map((_, i) => {
              return <OrderTableRow key={i} />
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination pageIndex={0} totalCount={105} perPage={10} />
    </div>
  )
}
