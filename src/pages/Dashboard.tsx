import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Package, Layers, Box, Truck, Factory, AlertTriangle, ArrowRight, Clock, DollarSign, Activity, AlertOctagon, RefreshCw, AlertCircle, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// --- Old Data (Overview) ---
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
  { time: "03-20 14:30", text: "导入FBA库存 1,234条", user: "系统" },
  { time: "03-20 11:00", text: "新建出库单 FBA001234", user: "小王" },
  { time: "03-20 09:30", text: "订单 HT260318 已完成", user: "系统" },
  { time: "03-19 16:00", text: "新建采购订单 HT260319", user: "小李" },
];

// --- New Data (Focus) ---
const dailySalesMock = [
  { label: "今日预估总单量", value: "2,450", icon: ShoppingCart, change: "+12.5%", up: true },
  { label: "昨日实际总单量", value: "2,185", icon: Package, change: "-5.2%", up: false },
  { label: "核心爆款占比", value: "32%", icon: Activity, change: "+2.1%", up: true },
  { label: "今日预估GMV", value: "¥42,500", icon: DollarSign, change: "+15.0%", up: true },
];

const focusUrgentSkus = [
  { sku: "ABC001-红色-S", style: "运动T恤", days: 5, stock: 25, suggest: "空运补货100件" },
  { sku: "ABC001-灰色-S", style: "运动T恤", days: 6, stock: 30, suggest: "快速调拨90件" },
  { sku: "ABC003-黑色-M", style: "运动外套", days: 6, stock: 42, suggest: "紧急建单生产" },
];

const FOCUS_overstockSkus = [
  { sku: "ABC005-黑色-4XL", style: "运动长裤", days: 210, stock: 450, funds: "¥18,000" },
  { sku: "ABC004-白色-S", style: "运动背心", days: 185, stock: 320, funds: "¥11,200" },
  { sku: "ABC002-藏青-S", style: "运动短裤", days: 160, stock: 512, funds: "¥15,360" },
];

const anomalies = [
  { id: "HT260305", type: "在产延误", target: "东莞A厂", detail: "超交期2日，仍有500件未发", priority: "🔴 紧急" },
  { id: "FBA001228", type: "在途异常", target: "海运美东干线", detail: "报关查验，预计整体上架晚5天", priority: "🟠 警告" },
  { id: "HT260312", type: "在产异常", target: "广州C厂", detail: "面料批次瑕疵，良品率过低", priority: "🔴 紧急" },
];

export default function Dashboard() {
  const [tab, setTab] = useState<"focus" | "overview">("focus");

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setTab("focus")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${tab === "focus" ? "bg-card shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Activity className="w-4 h-4 inline-block mr-1" /> 重点预警
          </button>
          <button
            onClick={() => setTab("overview")}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${tab === "overview" ? "bg-card shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BarChart className="w-4 h-4 inline-block mr-1" /> 全局看板
          </button>
        </div>
      </div>

      {tab === "focus" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 1. 日销 (Daily Sales) */}
          <div>
            <div className="grid grid-cols-4 gap-4">
              {dailySalesMock.map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="flex items-center justify-between mb-3 text-muted-foreground">
                    <span className="text-xs font-medium">{s.label}</span>
                    <s.icon className="w-4 h-4 opacity-60" />
                  </div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${s.up ? "text-success" : "text-danger"}`}>
                    {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    环比 {s.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">

            {/* 2. 断货风险 (Stockout Risk) */}
            <div className="stat-card p-0 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border bg-danger/5 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2 text-danger">
                  <AlertTriangle className="w-4 h-4" /> 断货风险 (Top 紧急 SKU)
                </h3>
                <Link to="/query" className="text-xs text-danger hover:underline flex items-center gap-1">详细核查 <ArrowRight className="w-3 h-3" /></Link>
              </div>
              <div className="p-4 flex-1">
                <table className="w-full text-sm data-table m-0">
                  <thead><tr><th className="text-left">SKU</th><th>款号</th><th className="text-center">可售天数</th><th>当前库存</th><th>中台建议</th></tr></thead>
                  <tbody>
                    {focusUrgentSkus.map((r) => (
                      <tr key={r.sku} className="hover:bg-muted/30">
                        <td className="py-2 font-medium">{r.sku}</td>
                        <td className="text-muted-foreground">{r.style}</td>
                        <td className="text-center"><span className="alert-badge-danger">🔴 {r.days}天</span></td>
                        <td className="font-medium text-danger">{r.stock}件</td>
                        <td className="text-xs">{r.suggest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 text-center">
                  <Link to="/simulation" className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                    <RefreshCw className="w-4 h-4" /> 一键前往补货模拟
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. 积压风险 (Overstock Risk) */}
            <div className="stat-card p-0 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border bg-warning/5 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2 text-warning">
                  <AlertOctagon className="w-4 h-4" /> 积压风险 (滞销资金占用)
                </h3>
              </div>
              <div className="p-4 flex-1">
                <table className="w-full text-sm data-table m-0">
                  <thead><tr><th className="text-left">SKU</th><th>款号</th><th className="text-center">不动销超期</th><th>积压库存</th><th>占用资金</th></tr></thead>
                  <tbody>
                    {FOCUS_overstockSkus.map((r) => (
                      <tr key={r.sku} className="hover:bg-muted/30">
                        <td className="py-2 font-medium">{r.sku}</td>
                        <td className="text-muted-foreground">{r.style}</td>
                        <td className="text-center"><span className="alert-badge-warning">🟡 {r.days}天</span></td>
                        <td className="font-medium">{r.stock}件</td>
                        <td className="font-medium text-warning">{r.funds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 p-3 rounded-lg text-sm bg-muted text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  积压总量达 1,282 件，累计占用资金 ¥44,560，建议提报清仓促销策略。
                </div>
              </div>
            </div>
          </div>

          {/* 4. 关键异常 (Critical Anomalies) */}
          <div className="stat-card p-0 overflow-hidden">
            <div className="p-4 border-b border-border bg-accent/20 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" /> 关键异常 (在产/在途节点延误)
              </h3>
              <Link to="/supply-chain" className="text-xs text-primary hover:underline flex items-center gap-1">前往管控 <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="p-0">
              <table className="w-full text-sm data-table m-0">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-5">关联单号</th>
                    <th className="text-left">异常类型</th>
                    <th className="text-left">延误节点</th>
                    <th className="text-left">异常详情描述</th>
                    <th className="text-left">紧急程度</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {anomalies.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/50">
                      <td className="py-4 px-5 font-bold underline cursor-pointer hover:text-primary">{a.id}</td>
                      <td>
                        <span className="bg-background border border-border px-2 py-1 rounded text-xs font-medium">
                          {a.type}
                        </span>
                      </td>
                      <td className="font-medium">{a.target}</td>
                      <td className="text-muted-foreground">{a.detail}</td>
                      <td className="font-medium">{a.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
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
      )}
    </div>
  );
}
