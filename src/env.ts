import { z } from 'zod'

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_ENABLE_API_DELAY: z.string().transform((value) => value === 'true'),
})

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_ENABLE_API_DELAY: process.env.NEXT_ENABLE_API_DELAY,
})
