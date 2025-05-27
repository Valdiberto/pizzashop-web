import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
}

export interface SignInResponse {
  success: boolean
  message: string
  devAuthLink?: string
}

export async function signIn({ email }: SignInBody): Promise<SignInResponse> {
  const response = await api.post('/auth-links', { email })
  return response.data as SignInResponse
}
