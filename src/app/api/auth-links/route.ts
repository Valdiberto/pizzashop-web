import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/db/connection' // ajuste conforme sua conexão Drizzle
import { authLinks, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { resend } from '@/lib/resend' // configure o Resend conforme sua necessidade
import { UnauthorizedError } from '@/services/error'

const bodySchema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email } = bodySchema.parse(body)

  // Verifica se o usuário já existe
  const [user] = await db.select().from(users).where(eq(users.email, email))

  // Se não existir, cria um novo usuário com role 'customer'
  if (!user) {
    throw new UnauthorizedError()
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
    process.env.NEXT_PUBLIC_API_URL,
  )
  authLink.searchParams.set('code', code)

  // Envia o email com o link mágico
  await resend.emails.send({
    from: 'Pizza Shop <noreply@pizzashop.com>',
    to: email,
    subject: 'Seu link mágico de acesso',
    html: `<p>Clique no link abaixo para acessar:</p><a href="${authLink.toString()}">${authLink.toString()}</a>`,
  })

  console.log(`link mágico: ${authLink}`)

  return NextResponse.json({ message: 'Link mágico enviado com sucesso.' })
}
