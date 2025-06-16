import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import {
  getManagedRestaurantId,
  NotAManagerError,
  UnauthorizedError,
} from '@/lib/auth'
import { sum, eq } from 'drizzle-orm'
import { orderItems } from '@/db/schema'

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
