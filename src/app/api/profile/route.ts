import { NextResponse } from 'next/server'
import { db } from '@/db/connection'
import { restaurants } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getManagedRestaurantId } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
})

export async function PUT(request: Request) {
  try {
    // 1. Autenticação e validação
    const restaurantId = await getManagedRestaurantId()
    const body = await request.json()
    const { name, description } = updateProfileSchema.parse(body)

    // 2. Atualização no banco de dados
    await db
      .update(restaurants)
      .set({
        name,
        description,
        updatedAt: new Date(), // Adiciona timestamp de atualização
      })
      .where(eq(restaurants.id, restaurantId))

    // 3. Retorna resposta vazia (204) como na API original
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error updating profile:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Falha ao atualizar perfil' },
      { status: 500 },
    )
  }
}
