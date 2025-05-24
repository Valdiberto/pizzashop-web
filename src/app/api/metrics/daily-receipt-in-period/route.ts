import { NextResponse } from 'next/server'
import { and, eq, gte, lte, sql, sum } from 'drizzle-orm'
import dayjs from 'dayjs'
import { db } from '@/db/connection'
import { orders } from '@/db/schema'
import { getManagedRestaurantId } from '@/lib/auth'
import { z } from 'zod'

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const { from, to } = querySchema.parse(queryParams)
    const restaurantId = await getManagedRestaurantId()

    const startDate = from ? dayjs(from) : dayjs().subtract(7, 'd')
    const endDate = to ? dayjs(to) : from ? startDate.add(7, 'days') : dayjs()

    // Validação do período
    if (endDate.diff(startDate, 'days') > 7) {
      return NextResponse.json(
        {
          code: 'INVALID_PERIOD',
          message: 'O intervalo das datas não pode ser superior a 7 dias.',
        },
        { status: 400 },
      )
    }

    const receiptPerDay = await db
      .select({
        date: sql<string>`TO_CHAR(${orders.createdAt}, 'DD/MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(
            orders.createdAt,
            startDate
              .startOf('day')
              .add(startDate.utcOffset(), 'minutes')
              .toDate(),
          ),
          lte(
            orders.createdAt,
            endDate.endOf('day').add(endDate.utcOffset(), 'minutes').toDate(),
          ),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'DD/MM')`)
      .having(({ receipt }) => gte(receipt, 1))

    // Ordenação por data
    const orderedReceiptPerDay = receiptPerDay.sort((a, b) => {
      const [dayA, monthA] = a.date.split('/').map(Number)
      const [dayB, monthB] = b.date.split('/').map(Number)

      if (monthA === monthB) {
        return dayA - dayB
      } else {
        const dateA = new Date(2023, monthA - 1)
        const dateB = new Date(2023, monthB - 1)

        return dateA.getTime() - dateB.getTime()
      }
    })

    return NextResponse.json(orderedReceiptPerDay)
  } catch (error) {
    console.error('Error fetching daily receipt:', error)
    return NextResponse.json(
      { message: 'Failed to fetch daily receipt' },
      { status: 500 },
    )
  }
}
