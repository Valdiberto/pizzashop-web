import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import { orders, users } from '@/db/schema'
import { eq, and, ilike, desc, count, sql } from 'drizzle-orm'
import { getManagedRestaurantId } from '@/lib/auth'
import { z } from 'zod'

const querySchema = z.object({
  customerName: z.string().optional(),
  orderId: z.string().optional(),
  status: z
    .enum(['pending', 'processing', 'delivering', 'delivered', 'canceled'])
    .optional(),
  pageIndex: z.coerce.number().min(0).default(0),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const restaurantId = await getManagedRestaurantId()

    // Query base
    const baseQuery = db
      .select({
        orderId: orders.id,
        createdAt: orders.createdAt,
        status: orders.status,
        customerName: users.name,
        total: orders.totalInCents,
      })
      .from(orders)
      .innerJoin(users, eq(users.id, orders.customerId))
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          query.orderId ? ilike(orders.id, `%${query.orderId}%`) : undefined,
          query.status ? eq(orders.status, query.status) : undefined,
          query.customerName
            ? ilike(users.name, `%${query.customerName}%`)
            : undefined,
        ),
      )

    // Contagem total
    const [ordersCount] = await db
      .select({ count: count() })
      .from(baseQuery.as('baseQuery'))

    // Paginação e ordenação
    const allOrders = await baseQuery
      .offset(query.pageIndex * 10)
      .limit(10)
      .orderBy((fields) => {
        return [
          sql`CASE ${fields.status} 
            WHEN 'pending' THEN 1
            WHEN 'processing' THEN 2
            WHEN 'delivering' THEN 3
            WHEN 'delivered' THEN 4
            WHEN 'canceled' THEN 99
          END`,
          desc(fields.createdAt),
        ]
      })

    return NextResponse.json({
      orders: allOrders,
      meta: {
        pageIndex: query.pageIndex,
        perPage: 10,
        totalCount: ordersCount.count,
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 },
    )
  }
}
