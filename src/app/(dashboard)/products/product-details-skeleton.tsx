import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function ProductDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Preço</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Skeleton className="h-5 w-[140px]" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-5 w-12" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Descrição</TableHead>
          </TableRow>

          <TableRow>
            <TableCell>
              <Skeleton className="h-5 w-3xs" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead>Total de Pedidos</TableHead>
            <TableCell className="text-right">
              <Skeleton className="ml-auto h-5 w-4" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
