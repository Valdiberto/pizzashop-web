import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import { restaurants, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Schema de validação com Zod (equivalente ao do Elysia)
const registerRestaurantSchema = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  phone: z.string(),
  email: z.string().email(),
})

export async function POST(request: Request) {
  try {
    // 1. Validação do corpo da requisição
    const body = await request.json()
    const { restaurantName, managerName, email, phone } =
      registerRestaurantSchema.parse(body)

    // 2. Verifica se o gerente já existe
    const [existingManager] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingManager) {
      return NextResponse.json(
        { error: 'Já existe um gerente com este e-mail' },
        { status: 409 },
      )
    }

    // 3. Cria o usuário gerente
    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: 'manager',
      })
      .returning()

    // 4. Cria o restaurante
    await db.insert(restaurants).values({
      name: restaurantName,
      managerId: manager.id,
    })

    // 5. Retorna resposta vazia (204) como no original
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erro ao registrar restaurante:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Falha ao registrar restaurante' },
      { status: 500 },
    )
  }
}
