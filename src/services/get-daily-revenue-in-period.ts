import { api } from '@/lib/axios'
import { z } from 'zod'

const responseSchema = z.array(
  z.object({
    date: z.string(),
    receipt: z.number(),
  }),
)

export type GetDailyRevenueInPeriodResponse = z.infer<typeof responseSchema>

export async function getDailyRevenueInPeriod(params?: {
  from?: string
  to?: string
}) {
  const response = await api.get('/metrics/daily-receipt-in-period', {
    params,
  })

  return responseSchema.parse(response.data)
}
