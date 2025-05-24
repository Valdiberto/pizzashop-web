'use client'

export async function signOutClient(): Promise<void> {
  // Limpa o cookie
  document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'

  // Força um hard refresh para garantir que todos os estados sejam limpos
  window.location.href = '/sign-in'
}
