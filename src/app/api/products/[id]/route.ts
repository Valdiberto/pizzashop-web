import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import {
  getManagedRestaurantId,
  NotAManagerError,
  UnauthorizedError,
} from '@/lib/auth'
import { sum, eq, and } from 'drizzle-orm'
import { orderItems, products } from '@/db/schema'
import z from 'zod'

const updateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  priceInCents: z.number().int().positive(),
})

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const [restaurantId, { id: productId }] = await Promise.all([
      getManagedRestaurantId(),
      context.params,
    ])

    const product = await db.query.products.findFirst({
      columns: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
        createdAt: true,
        priceInCents: true,
      },

      where: (fields, { eq, and }) => {
        return and(
          eq(fields.id, productId),
          eq(fields.restaurantId, restaurantId),
        )
      },
    })

    if (!product) {
      throw new UnauthorizedError()
    }

    const [orderItemStats] = await db
      .select({ totalOrders: sum(orderItems.quantity).mapWith(Number) })
      .from(orderItems)
      .where(eq(orderItems.productId, productId))

    return NextResponse.json({
      ...product,
      totalOrders: orderItemStats?.totalOrders ?? 0,
    })
  } catch (error) {
    if (error instanceof NotAManagerError) {
      return NextResponse.json(
        { error: 'Acesso restrito a gerentes' },
        { status: 401 },
      )
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 },
      )
    }

    console.error('Error fetching order details:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar detalhes do pedido' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const restaurantId = await getManagedRestaurantId()
    const { id: productId } = await context.params
    const body = await request.json()
    console.log('productid', productId)
    const { name, description, priceInCents } = updateProductSchema.parse(body)

    await db
      .update(products)
      .set({
        name,
        description,
        priceInCents,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(products.id, productId),
          eq(products.restaurantId, restaurantId),
        ),
      )

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error updating product:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Error updating product' },
      { status: 500 },
    )
  }
}
