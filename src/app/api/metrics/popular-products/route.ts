import { NextResponse } from 'next/server'
import { and, count, eq } from 'drizzle-orm'
import { db } from '@/db/connection'
import { orderItems, orders, products } from '@/db/schema'
import { getManagedRestaurantId } from '@/lib/auth'

export interface PopularProduct {
  product: string
  amount: number
}

export async function GET() {
  try {
    const restaurantId = await getManagedRestaurantId()

    const popularProducts = await db
      .select({
        product: products.name,
        amount: count(orderItems.id),
      })
      .from(orderItems)
      .leftJoin(orders, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .where(and(eq(orders.restaurantId, restaurantId)))
      .groupBy(products.name)
      .limit(5)

    return NextResponse.json(popularProducts)
  } catch (err) {
    console.error('Error fetching popular products:', err)
    return NextResponse.json(
      { message: 'Failed to fetch popular products' },
      { status: 500 },
    )
  }
}
