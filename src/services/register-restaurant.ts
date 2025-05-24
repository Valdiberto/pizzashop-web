import { api } from '@/lib/axios'

export interface RegisterRestaurantBody {
  restaurantName: string
  managerName: string
  email: string
  phone: string
}

export async function registerRestaurant({
  restaurantName,
  email,
  managerName,
  phone,
}: RegisterRestaurantBody) {
  await api.post('/restaurants', { restaurantName, email, managerName, phone })
}
