import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import { getManagedRestaurantId, UnauthorizedError } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { orders } from '@/db/schema'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id: orderId } = await params
    const restaurantId = await getManagedRestaurantId()

    // Verifica se o pedido existe e pertence ao restaurante
    const order = await db.query.orders.findFirst({
      where(fields, { eq, and }) {
        return and(
          eq(fields.id, orderId),
          eq(fields.restaurantId, restaurantId),
        )
      },
    })

    if (!order) {
      throw new UnauthorizedError()
    }

    // Validação do status
    if (order.status !== 'delivering') {
      return NextResponse.json(
        { message: 'O pedido já foi entregue.' },
        { status: 400 },
      )
    }

    // Atualiza o status do pedido
    await db
      .update(orders)
      .set({
        status: 'delivered',
      })
      .where(eq(orders.id, orderId))

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    }

    console.error(error)
    return NextResponse.json(
      { message: 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}
