import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import {
  getManagedRestaurantId,
  NotAManagerError,
  UnauthorizedError,
} from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id: orderId } = await params
    const restaurantId = await getManagedRestaurantId()

    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        createdAt: true,
        status: true,
        totalInCents: true,
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true,
          },
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      where: (fields, { eq, and }) => {
        return and(
          eq(fields.id, orderId),
          eq(fields.restaurantId, restaurantId),
        )
      },
    })

    if (!order) {
      throw new UnauthorizedError()
    }

    return NextResponse.json(order)
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
