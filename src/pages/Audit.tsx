import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";

type AuditEntry = {
  id: string;
  time: string;
  user: string;
  module: string;
  action: string;
  target: string;
  detail: string;
  changes?: { field: string; before: string; after: string }[];
};

const auditData: AuditEntry[] = [
  {
    id: "AUD-001", time: "2024-01-20 14:32", user: "小王", module: "出库管理",
    action: "新建", target: "发货批次 FBA001234",
    detail: "新建发货批次，包含3个款式共5000件",
    changes: [
      { field: "FBA编号", before: "-", after: "FBA001234" },
      { field: "总数量", before: "-", after: "5,000件" },
      { field: "物流商", before: "-", after: "顺丰" },
    ],
  },
  {
    id: "AUD-002", time: "2024-01-20 11:15", user: "小李", module: "采购管理",
    action: "修改", target: "采购订单 HT240115",
    detail: "修改交货日期",
    changes: [
      { field: "交货日期", before: "2024-02-10", after: "2024-02-15" },
      { field: "备注", before: "无", after: "工厂产能不足延期" },
    ],
  },
  {
    id: "AUD-003", time: "2024-01-20 09:30", user: "系统", module: "数据导入",
    action: "导入", target: "FBA库存数据",
    detail: "自动导入FBA库存 1,234条SKU记录",
  },
  {
    id: "AUD-004", time: "2024-01-19 16:45", user: "小王", module: "商品管理",
    action: "修改", target: "SKU ABC001-白色-M",
    detail: "禁用SKU",
    changes: [{ field: "状态", before: "✅ 启用", after: "⛔ 禁用" }],
  },
  {
    id: "AUD-005", time: "2024-01-19 15:20", user: "小李", module: "采购管理",
    action: "新建", target: "采购订单 HT240119",
    detail: "新建采购订单，东莞A厂，ABC005，3000件",
  },
  {
    id: "AUD-006", time: "2024-01-19 10:00", user: "管理员", module: "系统设置",
    action: "修改", target: "物流方式管理",
    detail: "新增铁路运输方式",
    changes: [{ field: "物流方式", before: "-", after: "铁路（中欧班列）" }],
  },
  {
    id: "AUD-007", time: "2024-01-18 14:00", user: "小王", module: "出库管理",
    action: "修改", target: "发货批次 FBA001230",
    detail: "修改运费",
    changes: [{ field: "运费", before: "¥14,200", after: "¥15,600" }],
  },
  {
    id: "AUD-008", time: "2024-01-18 09:00", user: "系统", module: "数据导入",
    action: "导入", target: "日均销量数据",
    detail: "自动导入日均销量 1,234条SKU记录",
  },
];

const actionColors: Record<string, string> = {
  新建: "alert-badge-success",
  修改: "alert-badge-warning",
  删除: "alert-badge-danger",
  导入: "bg-accent text-accent-foreground inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
};

export default function Audit() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState("全部");
  const [actionFilter, setActionFilter] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");

  const modules = ["全部", ...Array.from(new Set(auditData.map((a) => a.module)))];
  const actions = ["全部", ...Array.from(new Set(auditData.map((a) => a.action)))];

  const filtered = auditData.filter((a) => {
    if (moduleFilter !== "全部" && a.module !== moduleFilter) return false;
    if (actionFilter !== "全部" && a.action !== actionFilter) return false;
    if (searchTerm && !a.target.includes(searchTerm) && !a.detail.includes(searchTerm) && !a.user.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Filters */}
      <div className="stat-card">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">搜索</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="搜索操作对象、详情、用户..."
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">模块</label>
            <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              {modules.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">操作类型</label>
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm">
              {actions.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "今日操作", value: "24", sub: "最近7天 156" },
          { label: "新建操作", value: "8" },
          { label: "修改操作", value: "12" },
          { label: "导入操作", value: "4" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            {s.sub && <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="stat-card">
        <h2 className="section-title"><Filter className="w-4 h-4" /> 变更记录 <span className="text-muted-foreground font-normal text-xs ml-2">共{filtered.length}条</span></h2>
        <table className="data-table">
          <thead>
            <tr><th>时间</th><th>操作人</th><th>模块</th><th>操作</th><th>操作对象</th><th>详情</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <>
                <tr key={a.id}>
                  <td className="text-muted-foreground whitespace-nowrap text-xs">{a.time}</td>
                  <td><span className="alert-badge-success">{a.user}</span></td>
                  <td className="text-xs">{a.module}</td>
                  <td><span className={actionColors[a.action] || ""}>{a.action}</span></td>
                  <td className="font-medium text-sm">{a.target}</td>
                  <td className="text-xs text-muted-foreground max-w-[200px] truncate">{a.detail}</td>
                  <td>
                    {a.changes && (
                      <button
                        onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                        className="text-primary text-xs hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> 变更
                      </button>
                    )}
                  </td>
                </tr>
                {expanded === a.id && a.changes && (
                  <tr key={a.id + "-changes"}>
                    <td colSpan={7} className="bg-accent/30 p-4">
                      <div className="text-xs font-medium mb-2">字段变更明细</div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-muted-foreground">
                            <th className="text-left py-1 px-2">字段</th>
                            <th className="text-left py-1 px-2">变更前</th>
                            <th className="text-left py-1 px-2">变更后</th>
                          </tr>
                        </thead>
                        <tbody>
                          {a.changes.map((c, i) => (
                            <tr key={i}>
                              <td className="py-1 px-2 font-medium">{c.field}</td>
                              <td className="py-1 px-2 text-danger line-through">{c.before}</td>
                              <td className="py-1 px-2 text-success font-medium">{c.after}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
