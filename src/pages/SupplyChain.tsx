import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, ArrowLeft, Truck, Factory, FileText, Eye } from "lucide-react";

type Tab = "shipments" | "orders" | "factory";

const shipments = [
  { id: "FBA001234", styles: 3, carrier: "顺丰", dest: "美西ONT8", qty: 5000, cost: "¥21,000", date: "01-20", status: "🚚 运输中",
    details: [
      { style: "ABC001 运动T恤", qty: 2000 },
      { style: "ABC002 运动短裤", qty: 1500 },
      { style: "ABC003 运动外套", qty: 1500 },
    ]
  },
  { id: "FBA001230", styles: 2, carrier: "德邦", dest: "美东JFK1", qty: 3200, cost: "¥15,600", date: "01-18", status: "🚚 运输中",
    details: [
      { style: "ABC001 运动T恤", qty: 1800 },
      { style: "ABC004 运动背心", qty: 1400 },
    ]
  },
  { id: "FBA001225", styles: 1, carrier: "顺丰", dest: "美西ONT8", qty: 2000, cost: "¥9,200", date: "01-15", status: "✅ 已签收",
    details: [{ style: "ABC002 运动短裤", qty: 2000 }]
  },
];

const purchaseOrders = [
  { contract: "HT240115", factory: "东莞A厂", style: "ABC001", date: "01-15", total: 2000, shipped: 1200, remain: 800, progress: 60, status: "🟡 进行中", delivery: "02-15" },
  { contract: "HT240110", factory: "深圳B厂", style: "ABC002", date: "01-10", total: 1500, shipped: 1500, remain: 0, progress: 100, status: "✅ 已完成", delivery: "01-30" },
  { contract: "HT240118", factory: "广州C厂", style: "ABC003", date: "01-18", total: 3000, shipped: 800, remain: 2200, progress: 27, status: "🟡 进行中", delivery: "02-28" },
  { contract: "HT240120", factory: "东莞A厂", style: "ABC005", date: "01-20", total: 3000, shipped: 0, remain: 3000, progress: 0, status: "⏳ 待生产", delivery: "03-01" },
];

const factoryDetail = {
  name: "东莞A厂",
  stats: { orders: 32, styles: 25, total: 58000, shipped: 42000, inProduction: 16000 },
  contact: "张三",
  phone: "13800138000",
  address: "广东省东莞市xxx工业区",
  styleBreakdown: [
    { style: "ABC001", name: "运动T恤", orders: 3, total: 6000, shipped: 5200, remain: 800, progress: 87 },
    { style: "ABC002", name: "运动短裤", orders: 2, total: 3000, shipped: 2500, remain: 500, progress: 83 },
    { style: "ABC003", name: "运动外套", orders: 2, total: 4000, shipped: 2800, remain: 1200, progress: 70 },
  ],
};

export default function SupplyChain() {
  const [tab, setTab] = useState<Tab>("shipments");
  const [expandedShipment, setExpandedShipment] = useState<string | null>("FBA001234");
  const [showFactory, setShowFactory] = useState(false);

  if (showFactory) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <button onClick={() => setShowFactory(false)} className="flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> 返回列表
        </button>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">🏭 {factoryDetail.name}</h2>
          </div>
          <div className="grid grid-cols-5 gap-3 mb-4">
            {[
              { label: "总订单数", value: factoryDetail.stats.orders },
              { label: "总款式数", value: factoryDetail.stats.styles },
              { label: "总下单量", value: factoryDetail.stats.total.toLocaleString() },
              { label: "已发货量", value: factoryDetail.stats.shipped.toLocaleString() },
              { label: "在产量", value: factoryDetail.stats.inProduction.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                <div className="text-lg font-bold">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            联系人: {factoryDetail.contact} &nbsp;|&nbsp; 电话: {factoryDetail.phone} &nbsp;|&nbsp; 地址: {factoryDetail.address}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="section-title">👔 按款式汇总</h3>
          <table className="data-table">
            <thead><tr><th>款号</th><th>款式名</th><th>订单数</th><th>下单量</th><th>已发货</th><th>在产</th><th>进度</th></tr></thead>
            <tbody>
              {factoryDetail.styleBreakdown.map((r) => (
                <tr key={r.style}>
                  <td className="font-medium">{r.style}</td>
                  <td>{r.name}</td>
                  <td>{r.orders}</td>
                  <td>{r.total.toLocaleString()}</td>
                  <td>{r.shipped.toLocaleString()}</td>
                  <td className="text-warning font-medium">{r.remain.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${r.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{r.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {([
          { key: "shipments", label: "🚚 发货批次", icon: Truck },
          { key: "orders", label: "📋 采购订单", icon: FileText },
          { key: "factory", label: "🏭 供应商", icon: Factory },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              tab === t.key ? "bg-card shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "shipments" && (
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">🚚 出库管理</h2>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">+ 新建发货</button>
          </div>
          <table className="data-table">
            <thead><tr><th></th><th>FBA编号</th><th>款式数</th><th>物流商</th><th>目的地</th><th>总数量</th><th>运费</th><th>发货日期</th><th>状态</th></tr></thead>
            <tbody>
              {shipments.map((s) => (
                <>
                  <tr key={s.id} className="cursor-pointer" onClick={() => setExpandedShipment(expandedShipment === s.id ? null : s.id)}>
                    <td>{expandedShipment === s.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</td>
                    <td className="font-medium">{s.id}</td>
                    <td>{s.styles}款</td>
                    <td>{s.carrier}</td>
                    <td>{s.dest}</td>
                    <td>{s.qty.toLocaleString()}</td>
                    <td>{s.cost}</td>
                    <td>{s.date}</td>
                    <td>{s.status}</td>
                  </tr>
                  {expandedShipment === s.id && (
                    <tr key={s.id + "-detail"}>
                      <td colSpan={9} className="bg-accent/30 p-4">
                        <div className="text-sm font-medium mb-2">📋 发货汇总</div>
                        <div className="grid grid-cols-3 gap-2">
                          {s.details.map((d) => (
                            <div key={d.style} className="p-2 bg-card rounded-lg text-sm flex justify-between">
                              <span>{d.style}</span>
                              <span className="font-medium">{d.qty.toLocaleString()}件</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">📋 采购订单管理</h2>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">+ 新建采购单</button>
          </div>
          <table className="data-table">
            <thead><tr><th>合同编号</th><th>工厂</th><th>款号</th><th>下单日期</th><th>总数量</th><th>已发货</th><th>剩余</th><th>进度</th><th>交货日期</th><th>状态</th></tr></thead>
            <tbody>
              {purchaseOrders.map((o) => (
                <tr key={o.contract}>
                  <td className="font-medium">{o.contract}</td>
                  <td>{o.factory}</td>
                  <td>{o.style}</td>
                  <td>{o.date}</td>
                  <td>{o.total.toLocaleString()}</td>
                  <td>{o.shipped.toLocaleString()}</td>
                  <td className="text-warning font-medium">{o.remain.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${o.progress}%` }} />
                      </div>
                      <span className="text-xs">{o.progress}%</span>
                    </div>
                  </td>
                  <td>{o.delivery}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "factory" && (
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">🏭 供应商管理</h2>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">+ 新建工厂</button>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-6">
            {[
              { label: "合作工厂数", value: "12" },
              { label: "总下单量", value: "156,000" },
              { label: "总下单金额", value: "¥580万" },
              { label: "在产数量", value: "28,900" },
              { label: "本月下单", value: "¥45万" },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                <div className="text-lg font-bold">{s.value}</div>
              </div>
            ))}
          </div>

          <table className="data-table">
            <thead><tr><th>工厂名称</th><th>地址</th><th>联系人</th><th>合作款数</th><th>在产量</th><th>在产金额</th><th>操作</th></tr></thead>
            <tbody>
              {[
                { name: "东莞A厂", addr: "东莞xxx", contact: "张三", styles: 25, qty: "16,000", amount: "¥58万" },
                { name: "深圳B厂", addr: "深圳xxx", contact: "李四", styles: 18, qty: "8,500", amount: "¥32万" },
                { name: "广州C厂", addr: "广州xxx", contact: "王五", styles: 15, qty: "4,400", amount: "¥18万" },
              ].map((f) => (
                <tr key={f.name}>
                  <td className="font-medium">{f.name}</td>
                  <td>{f.addr}</td>
                  <td>{f.contact}</td>
                  <td>{f.styles}</td>
                  <td>{f.qty}</td>
                  <td>{f.amount}</td>
                  <td>
                    <button onClick={() => setShowFactory(true)} className="text-primary text-xs hover:underline flex items-center gap-1">
                      <Eye className="w-3 h-3" /> 详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
