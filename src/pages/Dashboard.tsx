import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Package, Layers, Box, Truck, Factory, AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "款式总数", value: "156", icon: Package, change: "+3", up: true },
  { label: "SKU总数", value: "10,920", icon: Layers, change: "+210", up: true },
  { label: "FBA总库存", value: "234,560", icon: Box, change: "-1,230", up: false },
  { label: "在途总量", value: "45,230", icon: Truck, change: "+5,800", up: true },
  { label: "工厂在产", value: "28,900", icon: Factory, change: "+3,200", up: true },
];

const urgentSkus = [
  { sku: "ABC001-红色-S", style: "运动T恤", days: 5, stock: 25, suggest: "紧急补货100件" },
  { sku: "ABC001-灰色-S", style: "运动T恤", days: 6, stock: 30, suggest: "紧急补货90件" },
  { sku: "ABC003-黑色-M", style: "运动外套", days: 6, stock: 42, suggest: "紧急补货80件" },
  { sku: "ABC002-白色-S", style: "运动短裤", days: 3, stock: 15, suggest: "紧急补货120件" },
];

const warningSkus = [
  { sku: "ABC001-藏青-S", style: "运动T恤", days: 10, stock: 50, suggest: "建议补货70件" },
  { sku: "ABC002-白色-L", style: "运动短裤", days: 11, stock: 65, suggest: "建议补货60件" },
  { sku: "ABC003-灰色-XL", style: "运动外套", days: 13, stock: 72, suggest: "建议补货50件" },
];

const alertSummary = [
  { style: "ABC001", danger: 8, warning: 12, caution: 25 },
  { style: "ABC002", danger: 3, warning: 8, caution: 18 },
  { style: "ABC003", danger: 5, warning: 10, caution: 22 },
  { style: "ABC004", danger: 2, warning: 5, caution: 21 },
];

const monthlyShipments = [
  { name: "W1", qty: 12000 },
  { name: "W2", qty: 15000 },
  { name: "W3", qty: 18000 },
  { name: "W4", qty: 11000 },
];

const factoryDist = [
  { name: "东莞A厂", value: 35 },
  { name: "深圳B厂", value: 28 },
  { name: "广州C厂", value: 22 },
  { name: "其他", value: 15 },
];
const PIE_COLORS = ["hsl(215, 80%, 50%)", "hsl(215, 60%, 65%)", "hsl(215, 40%, 75%)", "hsl(220, 15%, 80%)"];

const activities = [
  { time: "01-20 14:30", text: "导入FBA库存 1,234条", user: "系统" },
  { time: "01-20 11:00", text: "新建出库单 FBA001234", user: "小王" },
  { time: "01-20 09:30", text: "订单 HT240118 已完成", user: "系统" },
  { time: "01-19 16:00", text: "新建采购订单 HT240119", user: "小李" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="w-4 h-4 text-muted-foreground/60" />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className={`flex items-center gap-1 mt-1 text-xs ${s.up ? "text-success" : "text-danger"}`}>
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0"><AlertTriangle className="w-4 h-4 text-warning" /> 库存预警（精确到SKU）</h2>
          <Link to="/query" className="text-xs text-primary hover:underline flex items-center gap-1">查看全部 <ArrowRight className="w-3 h-3" /></Link>
        </div>

        {/* Urgent */}
        <div className="mb-4">
          <div className="alert-badge-danger mb-3">🔴 紧急 (&lt;7天) - {urgentSkus.length + 14}个SKU</div>
          <table className="data-table">
            <thead><tr><th>SKU</th><th>款号</th><th>可售天数</th><th>当前库存</th><th>建议</th></tr></thead>
            <tbody>
              {urgentSkus.map((r) => (
                <tr key={r.sku}>
                  <td className="font-medium">{r.sku}</td>
                  <td>{r.style}</td>
                  <td><span className="alert-badge-danger">🔴 {r.days}天</span></td>
                  <td>{r.stock}件</td>
                  <td className="text-danger text-xs">{r.suggest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Warning */}
        <div>
          <div className="alert-badge-warning mb-3">🟠 警告 (7-14天) - 35个SKU</div>
          <table className="data-table">
            <thead><tr><th>SKU</th><th>款号</th><th>可售天数</th><th>当前库存</th><th>建议</th></tr></thead>
            <tbody>
              {warningSkus.map((r) => (
                <tr key={r.sku}>
                  <td className="font-medium">{r.sku}</td>
                  <td>{r.style}</td>
                  <td><span className="alert-badge-warning">🟠 {r.days}天</span></td>
                  <td>{r.stock}件</td>
                  <td className="text-warning text-xs">{r.suggest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row: Alert summary + To-do */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <h2 className="section-title">📊 预警分布（按款号汇总）</h2>
          <table className="data-table">
            <thead><tr><th>款号</th><th>🔴 紧急</th><th>🟠 警告</th><th>🟡 注意</th></tr></thead>
            <tbody>
              {alertSummary.map((r) => (
                <tr key={r.style}>
                  <td className="font-medium">{r.style}</td>
                  <td><span className="alert-badge-danger">{r.danger}</span></td>
                  <td><span className="alert-badge-warning">{r.warning}</span></td>
                  <td className="text-muted-foreground">{r.caution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="stat-card">
          <h2 className="section-title">📋 待处理事项</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-danger" /> 18个SKU紧急补货 (&lt;7天)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-warning" /> 3个订单即将到交货日期</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> 2批货物待接收确认</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-foreground" /> 今日需导入FBA库存</li>
          </ul>
          <Link to="/simulation" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            一键生成补货建议 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Row: Monthly chart + Factory pie */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <h2 className="section-title">📊 本月发货统计</h2>
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div><div className="text-lg font-bold">28</div><div className="text-xs text-muted-foreground">发货批次</div></div>
            <div><div className="text-lg font-bold">56,000</div><div className="text-xs text-muted-foreground">发货数量</div></div>
            <div><div className="text-lg font-bold">¥238K</div><div className="text-xs text-muted-foreground">物流费用</div></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyShipments}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="qty" fill="hsl(215, 80%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h2 className="section-title">🏭 工厂订单分布</h2>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={factoryDist} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {factoryDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {factoryDist.map((f, i) => (
                <div key={f.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded" style={{ background: PIE_COLORS[i] }} />
                  {f.name} <span className="text-muted-foreground">{f.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="stat-card">
        <h2 className="section-title"><Clock className="w-4 h-4" /> 最近动态</h2>
        <table className="data-table">
          <thead><tr><th>时间</th><th>事件</th><th>操作人</th></tr></thead>
          <tbody>
            {activities.map((a, i) => (
              <tr key={i}>
                <td className="text-muted-foreground whitespace-nowrap">{a.time}</td>
                <td>{a.text}</td>
                <td><span className="alert-badge-success">{a.user}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
