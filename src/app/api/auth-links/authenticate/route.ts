import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/db/connection'
import { authLinks, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { signJwt } from '@/lib/jwt'

const bodySchema = z.object({
  code: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { code } = bodySchema.parse(body)

  // Busca o authLink pelo código
  const [authLink] = await db
    .select()
    .from(authLinks)
    .where(eq(authLinks.code, code))

  if (!authLink) {
    return NextResponse.json(
      { message: 'Link de autenticação inválido.' },
      { status: 400 },
    )
  }

  // Busca o usuário associado
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, authLink.userId))

  if (!user) {
    return NextResponse.json(
      { message: 'Usuário não encontrado.' },
      { status: 404 },
    )
  }

  // Gera o JWT
  const token = signJwt({ sub: user.id })

  return NextResponse.json({ token })
}
