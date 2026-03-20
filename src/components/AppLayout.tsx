import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Package, Search, Calculator, Truck, FileText, ChevronLeft, ChevronRight, Bell, Target, Layers, Database, Shield } from "lucide-react";
import AIAssistant from "./AIAssistant";

const menuItems = [
  { icon: BarChart3, label: "今日关注", path: "/" },
  { icon: Search, label: "库存查询", path: "/query" },
  { icon: Calculator, label: "计划模拟", path: "/simulation" },
  { icon: Truck, label: "供应链执行", path: "/supply-chain" },
  { icon: Layers, label: "产品测算", path: "/product-setup" },
  { icon: Target, label: "目标预期", path: "/forecast" },
  { icon: FileText, label: "系统审计", path: "/audit" },
  { icon: Database, label: "备份恢复", path: "/backup" },
  { icon: Shield, label: "数据权限", path: "/permissions" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ${collapsed ? "w-16" : "w-56"
          }`}
      >
        <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border relative">
          <Package className="w-6 h-6 text-sidebar-primary shrink-0" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm whitespace-nowrap leading-tight">智能预决策数据中台</span>
              <span className="text-[10px] text-muted-foreground leading-tight">SCM Middle Platform</span>
            </div>
          )}
        </div>

        <nav className="flex-1 py-3 space-y-0.5 px-2">
          <div className="mb-2 px-3 text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            {!collapsed && "核心业务模块"}
          </div>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
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
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <h1 className="text-sm font-medium text-foreground">
            {menuItems.find((m) => m.path === location.pathname)?.label || "供应链中台BI系统"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-card" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                管
              </div>
              <div className="hidden md:block text-xs">
                <div className="font-medium text-foreground">系统管理员</div>
                <div className="text-muted-foreground text-[10px]">admin@supply.com</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
        <AIAssistant />
      </div>
    </div>
  );
}
