import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import { getManagedRestaurantId } from '@/lib/auth'

export async function GET() {
  try {
    const restaurantId = await getManagedRestaurantId()

    const restaurant = await db.query.restaurants.findFirst({
      where: (fields, { eq }) => eq(fields.id, restaurantId),
      columns: {
        id: true,
        name: true,
        description: true,
        managerId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurante não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Error fetching managed restaurant:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar restaurante' },
      { status: 500 },
    )
  }
}
