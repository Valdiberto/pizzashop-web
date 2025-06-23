'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { ProductDetails } from './product-details'
import { ProductEditDialog } from './product-edit-dialog'

export interface ProductTableRowProps {
  product: {
    productId: string
    createdAt: string
    name: string
    description: string
    priceInCents: number
  }
}

export function ProductTableRow({ product }: ProductTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do produto</span>
            </Button>
          </DialogTrigger>

          <ProductDetails productId={product.productId} open={isDetailsOpen} />
        </Dialog>
      </TableCell>
      <TableCell>{product.productId}</TableCell>
      <TableCell>
        {formatDistanceToNow(product.createdAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.description}</TableCell>
      <TableCell>
        {' '}
        R$ {(product.priceInCents / 100).toFixed(2).replace('.', ',')}
      </TableCell>
      <TableCell>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              Editar
            </Button>
          </DialogTrigger>
          <ProductEditDialog productId={product.productId} open={isEditOpen} />
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
