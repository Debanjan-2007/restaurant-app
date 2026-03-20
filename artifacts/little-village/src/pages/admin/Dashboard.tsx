import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetStats } from "@workspace/api-client-react";
import { ShoppingBag, CalendarDays, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetStats({ restaurantId: "little-village" });

  if (isLoading) {
    return <AdminLayout><div className="flex h-64 items-center justify-center">Loading stats...</div></AdminLayout>;
  }

  const statCards = [
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Today's Reservations", value: stats?.todayReservations || 0, icon: CalendarDays, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Estimated Revenue", value: `₹${(stats?.revenueEstimate || 0).toLocaleString()}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border shadow-sm">
          <h2 className="text-lg font-bold mb-6">Popular Items Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.popularItems || []}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <h2 className="text-lg font-bold mb-6">Top Sellers</h2>
          <div className="space-y-4">
            {stats?.popularItems?.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary-foreground flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-primary">{item.count} orders</span>
              </div>
            ))}
            {(!stats?.popularItems || stats.popularItems.length === 0) && (
              <p className="text-muted-foreground text-center py-4">No data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
