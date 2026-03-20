import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { LayoutDashboard, Utensils, ShoppingBag, CalendarDays, LogOut, ChefHat } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: session, isLoading } = useGetAdminMe({
    query: { retry: false }
  });

  const { mutate: logout } = useAdminLogout({
    mutation: {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/admin/login");
      }
    }
  });

  useEffect(() => {
    if (!isLoading && !session?.authenticated) {
      setLocation("/admin/login");
    }
  }, [isLoading, session?.authenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2d1b19]">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session?.authenticated) {
    return null;
  }

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/menu", label: "Menu Items", icon: Utensils },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/reservations", label: "Reservations", icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2d1b19] text-white flex flex-col fixed h-full z-10 shadow-xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Little Village</p>
              <p className="text-xs text-white/50">Admin Panel</p>
            </div>
          </div>
          <p className="text-xs text-white/40 mt-3 truncate">{session?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(link => {
            const Icon = link.icon;
            const active = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-white shadow-md"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer mb-1">
              <span className="text-sm">← View Website</span>
            </div>
          </Link>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm sticky top-0 z-10">
          <h1 className="font-semibold text-gray-800">
            {links.find(l => l.href === location)?.label || "Administration"}
          </h1>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
