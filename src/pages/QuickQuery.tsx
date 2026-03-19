import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const trendData = [
  { date: "12-25", qty: 60 }, { date: "01-01", qty: 75 }, { date: "01-05", qty: 90 },
  { date: "01-10", qty: 85 }, { date: "01-15", qty: 70 }, { date: "01-20", qty: 78 },
];

const skuResult = {
  sku: "ABC001-黑色-M",
  name: "运动T恤",
  summary: { fba: 78, transit: 120, production: 200, warehouse: 45, reserved: 20 },
  dailySales: 8,
  fbaDetail: [
    { code: "ONT8", name: "美西洛杉矶", qty: 50, status: "可售" },
    { code: "PHX5", name: "美西凤凰城", qty: 28, status: "可售" },
  ],
  transitDetail: [
    { batch: "FBA001234", dest: "美西ONT8", qty: 80, shipDate: "01-20", eta: "01-28", status: "🚚 运输中" },
    { batch: "FBA001238", dest: "美西PHX5", qty: 40, shipDate: "01-22", eta: "01-30", status: "🚚 运输中" },
  ],
  productionDetail: [
    { factory: "东莞A厂", contract: "HT240115", ordered: 200, shipped: 50, remain: 150, eta: "02-15" },
    { factory: "深圳B厂", contract: "HT240118", ordered: 100, shipped: 50, remain: 50, eta: "02-20" },
  ],
  warehouseDetail: [
    { name: "厦门仓", qty: 30, location: "A-01-05", date: "01-15" },
    { name: "广州仓", qty: 15, location: "B-02-03", date: "01-18" },
  ],
};

export default function QuickQuery() {
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState("ABC001-黑色-M");
  const total = skuResult.summary.fba + skuResult.summary.transit + skuResult.summary.production + skuResult.summary.warehouse;
  const days = Math.round(total / skuResult.dailySales);

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Search */}
      <div className="stat-card">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">搜索SKU</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="输入SKU编号..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              <option>款式: 全部</option><option>ABC001</option><option>ABC002</option>
            </select>
            <select className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              <option>颜色: 全部</option><option>黑色</option><option>白色</option>
            </select>
            <select className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              <option>尺码: 全部</option><option>S</option><option>M</option><option>L</option>
            </select>
          </div>
          <button onClick={() => setSearched(true)} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            🔍 查询
          </button>
        </div>
      </div>

      {searched && (
        <>
          {/* SKU Header */}
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-bold">📦 {skuResult.sku}</span>
              <span className="text-muted-foreground">{skuResult.name}</span>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              {[
                { label: "FBA库存", value: skuResult.summary.fba, color: "text-primary" },
                { label: "在途", value: skuResult.summary.transit, color: "text-accent-foreground" },
                { label: "在产", value: skuResult.summary.production, color: "text-warning" },
                { label: "仓库", value: skuResult.summary.warehouse, color: "text-success" },
                { label: "预留", value: skuResult.summary.reserved, color: "text-muted-foreground" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm">
              <span>总可用: <b>{total}件</b></span>
              <span>日均销量: <b>{skuResult.dailySales}件</b></span>
              <span>可售天数: <b className="text-success">{days}天</b></span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (days / 90) * 100)}%` }} />
            </div>
          </div>

          {/* Detail sections */}
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <h3 className="section-title">📍 FBA库存明细 <span className="text-muted-foreground font-normal ml-auto">{skuResult.summary.fba}件</span></h3>
              <table className="data-table">
                <thead><tr><th>仓库编码</th><th>仓库名称</th><th>数量</th><th>状态</th></tr></thead>
                <tbody>{skuResult.fbaDetail.map((r) => (
                  <tr key={r.code}><td className="font-medium">{r.code}</td><td>{r.name}</td><td>{r.qty}</td><td><span className="alert-badge-success">{r.status}</span></td></tr>
                ))}</tbody>
              </table>
            </div>

            <div className="stat-card">
              <h3 className="section-title">🚚 在途明细 <span className="text-muted-foreground font-normal ml-auto">{skuResult.summary.transit}件</span></h3>
              <table className="data-table">
                <thead><tr><th>发货批次</th><th>目的地</th><th>数量</th><th>预计到达</th><th>状态</th></tr></thead>
                <tbody>{skuResult.transitDetail.map((r) => (
                  <tr key={r.batch}><td className="font-medium">{r.batch}</td><td>{r.dest}</td><td>{r.qty}</td><td>{r.eta}</td><td>{r.status}</td></tr>
                ))}</tbody>
              </table>
            </div>

            <div className="stat-card">
              <h3 className="section-title">🏭 在产明细 <span className="text-muted-foreground font-normal ml-auto">{skuResult.summary.production}件</span></h3>
              <table className="data-table">
                <thead><tr><th>工厂</th><th>合同编号</th><th>下单量</th><th>已发货</th><th>剩余</th><th>预计交货</th></tr></thead>
                <tbody>{skuResult.productionDetail.map((r) => (
                  <tr key={r.contract}><td>{r.factory}</td><td className="font-medium">{r.contract}</td><td>{r.ordered}</td><td>{r.shipped}</td><td className="text-warning font-medium">{r.remain}</td><td>{r.eta}</td></tr>
                ))}</tbody>
              </table>
            </div>

            <div className="stat-card">
              <h3 className="section-title">🏠 仓库库存明细 <span className="text-muted-foreground font-normal ml-auto">{skuResult.summary.warehouse}件</span></h3>
              <table className="data-table">
                <thead><tr><th>仓库名称</th><th>数量</th><th>库位</th><th>入库时间</th></tr></thead>
                <tbody>{skuResult.warehouseDetail.map((r) => (
                  <tr key={r.name}><td>{r.name}</td><td>{r.qty}</td><td className="font-mono text-xs">{r.location}</td><td>{r.date}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </div>

          {/* Trend */}
          <div className="stat-card">
            <h3 className="section-title">📈 近30天库存变化趋势</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="qty" stroke="hsl(215, 80%, 50%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
