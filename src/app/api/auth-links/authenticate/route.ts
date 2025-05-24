import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/db/connection'
import { authLinks } from '@/db/schema'
import { eq } from 'drizzle-orm'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {
    // 1. Extrai os parâmetros da URL
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const redirect = searchParams.get('redirect') || '/dashboard'

    if (!code) {
      throw new NextResponse('Código não fornecido', { status: 400 })
    }

    // 2. Busca o authLink no banco de dados
    const authLinkFromCode = await db.query.authLinks.findFirst({
      where: (fields, { eq }) => eq(fields.code, code),
    })

    if (!authLinkFromCode) {
      return NextResponse.json(
        { error: 'Link de autenticação inválido' },
        { status: 401 },
      )
    }

    // 3. Verifica se o link expirou (7 dias)
    if (dayjs().diff(authLinkFromCode.createdAt, 'days') > 7) {
      return NextResponse.json(
        { error: 'Link de autenticação expirado' },
        { status: 401 },
      )
    }

    // 4. Busca o restaurante gerenciado pelo usuário
    const managedRestaurant = await db.query.restaurants.findFirst({
      where: (fields, { eq }) => eq(fields.managerId, authLinkFromCode.userId),
    })

    // 5. Gera token JWT
    const token = jwt.sign(
      {
        sub: authLinkFromCode.userId,
        restaurantId: managedRestaurant?.id,
      },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '7d' },
    )

    // 6. Define cookie (agora como JWT válido)
    const response = NextResponse.redirect(
      new URL(redirect, req.nextUrl.origin),
    )

    response.cookies.set({
      name: 'session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    })

    /// 7. Limpeza
    await db.delete(authLinks).where(eq(authLinks.code, code))

    return response
  } catch (error) {
    console.error('Erro na autenticação por link:', error)
    return NextResponse.json(
      { error: 'Falha na autenticação' },
      { status: 500 },
    )
  }
}
