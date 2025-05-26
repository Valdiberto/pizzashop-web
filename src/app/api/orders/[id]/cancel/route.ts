import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import { getManagedRestaurantId, UnauthorizedError } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { orders } from '@/db/schema'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const [restaurantId, { id: orderId }] = await Promise.all([
      getManagedRestaurantId(),
      context.params,
    ])

    if (!restaurantId) {
      return NextResponse.json(
        { message: 'O usuário não é um gerente de restaurante.' },
        { status: 401 },
      )
    }

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
      return NextResponse.json(
        { message: 'Order not found under the user managed restaurant.' },
        { status: 401 },
      )
    }

    // Validação do status
    if (!['pending', 'processing'].includes(order.status)) {
      return NextResponse.json(
        {
          code: 'STATUS_NOT_VALID',
          message: 'O pedido não pode ser cancelado depois de ser enviado.',
        },
        { status: 400 },
      )
    }

    // Atualiza o status do pedido
    await db
      .update(orders)
      .set({
        status: 'canceled',
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
