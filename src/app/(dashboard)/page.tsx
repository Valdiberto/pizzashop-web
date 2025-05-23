import { Metadata } from 'next'
import { MonthRevenueCard } from './dashboard/month-revenue-card'
import { MonthOrdersAmountCard } from './dashboard/month-orders-amount-card'
import { DaysOrdersAmountCard } from './dashboard/days-orders-amount-card'
import { MonthCanceledOrdersAmountCard } from './dashboard/month-canceled-order-amount-card'
import { RevenueChart } from './dashboard/revenue-chart'
import { PopularProductsChart } from './dashboard/popular-products-chart'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashBoard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-3xl font-bold tracking-tight">Dashboard</div>

      <div className="grid grid-cols-4 gap-4">
        <MonthRevenueCard />
        <MonthOrdersAmountCard />
        <DaysOrdersAmountCard />
        <MonthCanceledOrdersAmountCard />
      </div>

      <div className="grid grid-cols-9 gap-4">
        <RevenueChart />
        <PopularProductsChart />
      </div>
    </div>
  )
}
