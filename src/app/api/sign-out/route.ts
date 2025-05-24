import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Remove o cookie de sessão
    const cookieStore = await cookies()
    cookieStore.delete('session')

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Falha ao fazer logout' },
      { status: 500 },
    )
  }
}
