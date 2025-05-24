import { NextResponse } from 'next/server'
import { and, eq, gte, sql, sum } from 'drizzle-orm'
import dayjs from 'dayjs'
import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import { getManagedRestaurantId } from '@/lib/auth'

export interface GetMonthReceiptResponse {
  receipt: number
  diffFromLastMonth: number
}

export async function GET() {
  try {
    const restaurantId = await getManagedRestaurantId()

    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfLastMonth = lastMonth.startOf('month')

    const lastMonthWithYear = lastMonth.format('YYYY-MM')
    const currentMonthWithYear = today.format('YYYY-MM')

    const monthsReceipts = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
      .having(({ receipt }) => gte(receipt, 1))

    const currentMonthReceipt = monthsReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === currentMonthWithYear
    })

    const lastMonthReceipt = monthsReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === lastMonthWithYear
    })

    const diffFromLastMonth =
      lastMonthReceipt && currentMonthReceipt
        ? (currentMonthReceipt.receipt * 100) / lastMonthReceipt.receipt
        : null

    const response: GetMonthReceiptResponse = {
      receipt: currentMonthReceipt?.receipt ?? 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching month receipt:', error)
    return NextResponse.json(
      { message: 'Failed to fetch month receipt data' },
      { status: 500 },
    )
  }
}
