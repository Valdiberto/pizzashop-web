import { db } from '@/db/connection'
import { products } from '@/db/schema'
import { getManagedRestaurantId } from '@/lib/auth'
import { eq, and, ilike, count } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import z from 'zod'

const querySchema = z.object({
  name: z.string().optional(),
  productId: z.string().optional(),
  priceInCents: z.number().optional(),
  description: z.string().optional(),
  pageIndex: z.coerce.number().min(0).default(0),
})

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priceInCents: z.number().int().positive(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const restaurantId = await getManagedRestaurantId()

    // Query base

    const filters = [eq(products.restaurantId, restaurantId)]

    if (query.productId) {
      filters.push(ilike(products.id, `%${query.productId}%`))
    }

    if (query.name) {
      filters.push(ilike(products.name, `%${query.name}%`))
    }

    const baseQuery = db
      .select({
        productId: products.id,
        name: products.name,
        createdAt: products.createdAt,
        description: products.description,
        priceInCents: products.priceInCents,
      })
      .from(products)
      .where(and(...filters))

    // Contagem total
    const [productsCount] = await db
      .select({ count: count() })
      .from(baseQuery.as('baseQuery'))

    // Paginação e ordenação
    const allProducts = await baseQuery.offset(query.pageIndex * 10).limit(10)

    return NextResponse.json({
      products: allProducts,
      meta: {
        pageIndex: query.pageIndex,
        perPage: 10,
        totalCount: productsCount.count,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, description, priceInCents } = createProductSchema.parse(body)

    const restaurantId = await getManagedRestaurantId()
    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Unauthorized: no restaurant associated' },
        { status: 401 },
      )
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        name,
        description,
        priceInCents,
        restaurantId,
      })
      .returning()
    console.log('Produto criado:', newProduct)
    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 },
    )
  }
}
