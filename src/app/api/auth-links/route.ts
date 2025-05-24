import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/db/connection' // ajuste conforme sua conexão Drizzle
import { authLinks, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { resend } from '@/lib/resend' // configure o Resend conforme sua necessidade

const bodySchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = bodySchema.parse(body)

    // Verifica se o usuário já existe
    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 },
      )
    }

    // Cria um código único para o link mágico
    const code = createId()

    // Salva o código no banco de dados
    await db.insert(authLinks).values({
      code,
      userId: user.id,
    })

    // Monta a URL de autenticação
    const authLink = new URL(
      '/api/auth-links/authenticate',
      process.env.NEXT_PUBLIC_API_URL || req.nextUrl.origin,
    )
    authLink.searchParams.set('code', code)
    authLink.searchParams.set('redirect', process.env.AUTH_REDIRECT_URL || '/')

    // Envia o email com o link mágico
    if (process.env.NODE_ENV === 'production') {
      await resend.emails.send({
        from: 'Pizza Shop <noreply@pizzashop.com>',
        to: email,
        subject: 'Seu link mágico de acesso',
        html: `<p>Clique no link abaixo para acessar:</p><a href="${authLink.toString()}">Acessar minha conta</a>`,
      })
    }

    // 6. Log para desenvolvimento
    console.log(`🔑 Link mágico (dev only): ${authLink.toString()}`)

    return NextResponse.json({
      success: true,
      message: 'Link mágico enviado com sucesso.',
    })
  } catch (error) {
    console.error('Erro no endpoint /api/auth-links:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email inválido', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 },
    )
  }
}
