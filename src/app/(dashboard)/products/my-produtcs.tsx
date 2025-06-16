'use client'

import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import z from 'zod'
import { NewProduct } from './new-product'
import { getProducts } from '@/services/get-products'
import { ProductTableRow } from './product-table-row'
import { ProductTableFilters } from './product-table-filter'

export function MyProducts() {
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const productId = searchParams.get('productId')
  const name = searchParams.get('name')

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const { data: result } = useQuery({
    queryKey: ['products', pageIndex, productId, name],
    queryFn: () =>
      getProducts({
        pageIndex,
        productId,
        name,
      }),
  })

  const handlePaginate = async (newPageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (newPageIndex + 1).toString())

    router.push(`${pathname}?${params.toString()}`)
  }
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between">
        <ProductTableFilters />
        <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
          <DialogTrigger asChild>
            <Button type="submit" variant="secondary" size="xs">
              Adicionar produto
            </Button>
          </DialogTrigger>

          <NewProduct onSuccess={() => setIsNewProductOpen(false)} />
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32px]"></TableHead>
              <TableHead className="w-[140px]">Identifcador</TableHead>
              <TableHead className="w-[180px]">Realizado há</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[240px]">Descrição</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result &&
              result.products.map((product) => {
                return (
                  <ProductTableRow product={product} key={product.productId} />
                )
              })}
          </TableBody>
        </Table>
      </div>

      {result && (
        <Pagination
          onPageChange={handlePaginate}
          pageIndex={result.meta.pageIndex}
          totalCount={result.meta.totalCount}
          perPage={result.meta.totalCount}
        />
      )}
    </div>
  )
}
