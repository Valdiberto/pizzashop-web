import { NextResponse } from 'next/server'
import { and, count, eq, gte, sql } from 'drizzle-orm'
import dayjs from 'dayjs'
import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import { getManagedRestaurantId } from '@/lib/auth'

export interface GetDayOrdersAmountResponse {
  amount: number
  diffFromYesterday: number
}

export async function GET() {
  try {
    const restaurantId = await getManagedRestaurantId()

    const today = dayjs()
    const yesterday = today.subtract(1, 'day')
    const startOfYesterday = yesterday.startOf('day')

    const yesterdayWithMonthAndYear = yesterday.format('YYYY-MM-DD')
    const todayWithMonthAndYear = today.format('YYYY-MM-DD')

    const ordersPerDay = await db
      .select({
        dayWithMonthAndYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
        amount: count(orders.id),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfYesterday.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)
      .having(({ amount }) => gte(amount, 1))

    const todayOrdersAmount = ordersPerDay.find((orderInDay) => {
      return orderInDay.dayWithMonthAndYear === todayWithMonthAndYear
    })

    const yesterdayOrdersAmount = ordersPerDay.find((orderInDay) => {
      return orderInDay.dayWithMonthAndYear === yesterdayWithMonthAndYear
    })

    const diffFromYesterday =
      yesterdayOrdersAmount && todayOrdersAmount
        ? (todayOrdersAmount.amount * 100) / yesterdayOrdersAmount.amount
        : null

    const response: GetDayOrdersAmountResponse = {
      amount: todayOrdersAmount?.amount ?? 0,
      diffFromYesterday: diffFromYesterday
        ? Number((diffFromYesterday - 100).toFixed(2))
        : 0,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching day orders amount:', error)
    return NextResponse.json(
      { message: 'Failed to fetch day orders amount' },
      { status: 500 },
    )
  }
}
