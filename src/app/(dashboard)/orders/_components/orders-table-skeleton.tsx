export function OrdersTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted mb-4 h-10 rounded-md"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-muted h-12 rounded-md"></div>
        ))}
      </div>
    </div>
  )
}
