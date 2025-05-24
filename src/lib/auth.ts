import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

// Tipos (coloque em src/types/auth.d.ts se preferir)
type JwtPayload = {
  sub: string
  restaurantId?: string
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Não autorizado')
    this.name = 'UnauthorizedError'
  }
}

export class NotAManagerError extends Error {
  constructor() {
    super('Acesso restrito a gerentes')
    this.name = 'NotAManagerError'
  }
}

// Funções principais
export async function getCurrentUser(): Promise<JwtPayload> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  // Debug: verifique o token recebido
  console.log('Token recebido:', token)

  if (!token) {
    throw new UnauthorizedError()
  }

  try {
    const secret = process.env.JWT_SECRET_KEY
    if (!secret) {
      throw new Error('JWT_SECRET_KEY is not defined')
    }

    const payload = jwt.verify(token, secret) as JwtPayload
    return payload
  } catch (error) {
    console.error('Erro na verificação do token:', error)
    throw new UnauthorizedError()
  }
}

export async function signUser(payload: JwtPayload): Promise<void> {
  const secret = process.env.JWT_SECRET_KEY
  if (!secret) {
    throw new Error('JWT_SECRET_KEY is not defined')
  }

  const token = jwt.sign(payload, secret, {
    expiresIn: '7d',
  })
  // Debug: verifique o token antes de definir o cookie
  console.log('Token gerado:', token)

  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
    sameSite: 'lax',
  })
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getManagedRestaurantId(): Promise<string> {
  const { restaurantId } = await getCurrentUser()

  if (!restaurantId) {
    throw new NotAManagerError()
  }

  return restaurantId
}

// Middleware para proteção de rotas
export async function authMiddleware() {
  try {
    return await getCurrentUser()
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new Response('Não autorizado', { status: 401 })
    }
    throw error
  }
}

// Middleware para verificar se é gerente
export async function managerMiddleware() {
  try {
    return await getManagedRestaurantId()
  } catch (error) {
    if (error instanceof NotAManagerError) {
      throw new Response('Acesso restrito a gerentes', { status: 403 })
    }
    throw error
  }
}
