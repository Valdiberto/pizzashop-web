import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const { sub: userId } = await getCurrentUser()

    const user = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro em /api/me:', error)
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
}
