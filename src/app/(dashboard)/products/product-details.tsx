import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getProductDetails } from '@/services/get-product-details'
import { useQuery } from '@tanstack/react-query'
import { ProductDetailsSkeleton } from './product-details-skeleton'

export interface ProductDetailsProps {
  open: boolean
  productId: string
}

export function ProductDetails({ open, productId }: ProductDetailsProps) {
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductDetails({ productId }),
    enabled: open,
  })
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto: {productId}</DialogTitle>
        <DialogDescription>Detalhes do produto</DialogDescription>
      </DialogHeader>

      {product ? (
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
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-right">
                  {(product.priceInCents / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableHead>Descrição</TableHead>
              </TableRow>

              <TableRow>
                <TableCell className="break-words whitespace-pre-wrap">
                  {product.description}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Total de Pedidos</TableHead>
                <TableCell className="text-right">
                  {product.totalOrders}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <ProductDetailsSkeleton />
      )}
    </DialogContent>
  )
}
