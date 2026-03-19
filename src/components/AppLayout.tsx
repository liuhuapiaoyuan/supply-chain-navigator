import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Package, Search, Calculator, Truck, FileText, ChevronLeft, ChevronRight, Bell } from "lucide-react";

const menuItems = [
  { icon: BarChart3, label: "数据看板", path: "/" },
  { icon: Search, label: "快速查询", path: "/query" },
  { icon: Calculator, label: "补货模拟", path: "/simulation" },
  { icon: Truck, label: "供应链过程", path: "/supply-chain" },
  { icon: FileText, label: "变更审计", path: "/audit" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
          <Package className="w-6 h-6 text-sidebar-primary shrink-0" />
          {!collapsed && <span className="font-semibold text-sm whitespace-nowrap">发货管理系统</span>}
        </div>

        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <h1 className="text-sm font-medium text-foreground">
            {menuItems.find((m) => m.path === location.pathname)?.label || "发货管理系统"}
          </h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
              管
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
