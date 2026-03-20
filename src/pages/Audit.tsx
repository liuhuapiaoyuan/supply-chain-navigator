import React, { useState } from "react";
import { Search, Filter, Eye, TrendingUp, Calculator, AlertTriangle, Target, Factory } from "lucide-react";
import PageIntro from "@/components/PageIntro";

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
    id: "AUD-001", time: "2026-03-20 14:32", user: "小王", module: "出库管理",
    action: "新建", target: "发货批次 FBA001234",
    detail: "新建发货批次，包含3个款式共5000件",
    changes: [
      { field: "FBA编号", before: "-", after: "FBA001234" },
      { field: "总数量", before: "-", after: "5,000件" },
      { field: "物流商", before: "-", after: "顺丰" },
    ],
  },
  {
    id: "AUD-002", time: "2026-03-20 11:15", user: "小李", module: "采购管理",
    action: "修改", target: "采购订单 HT260315",
    detail: "修改交货日期",
    changes: [
      { field: "交货日期", before: "2026-04-10", after: "2026-04-15" },
      { field: "备注", before: "无", after: "工厂产能不足延期" },
    ],
  },
  {
    id: "AUD-003", time: "2026-03-20 09:30", user: "系统", module: "数据导入",
    action: "导入", target: "FBA库存数据",
    detail: "自动导入FBA库存 1,234条SKU记录",
  },
  {
    id: "AUD-004", time: "2026-03-19 16:45", user: "小王", module: "商品管理",
    action: "修改", target: "SKU ABC001-白色-M",
    detail: "禁用SKU",
    changes: [{ field: "状态", before: "✅ 启用", after: "⛔ 禁用" }],
  },
  {
    id: "AUD-005", time: "2026-03-19 15:20", user: "小李", module: "采购管理",
    action: "新建", target: "采购订单 HT260319",
    detail: "新建采购订单，东莞A厂，ABC005，3000件",
  },
  {
    id: "AUD-006", time: "2026-03-19 10:00", user: "管理员", module: "系统设置",
    action: "修改", target: "物流方式管理",
    detail: "新增铁路运输方式",
    changes: [{ field: "物流方式", before: "-", after: "铁路（中欧班列）" }],
  },
  {
    id: "AUD-007", time: "2026-03-18 14:00", user: "小王", module: "出库管理",
    action: "修改", target: "发货批次 FBA001230",
    detail: "修改运费",
    changes: [{ field: "运费", before: "¥14,200", after: "¥15,600" }],
  },
  {
    id: "AUD-008", time: "2026-03-18 09:00", user: "系统", module: "数据导入",
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
      <PageIntro
        title="本页说明：操作追溯与 Diff"
        lines={[
          "记录谁在何时对出库、采购、导入、主数据等做了什么，支持按模块与动作类型筛选。",
          "对关键字段展示变更前/后对照，满足内控与复盘「数字从哪来、谁改过」的诉求。",
        ]}
        flowHint="主线位置：治理层 — 与数据权限、备份恢复共同构成可信运营底座"
      />
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

      {/* 核心协同溯源大盘: 预期/计划/在产关键变更 */}
      <h2 className="section-title mb-4 flex items-center gap-2"><Target className="w-5 h-5" /> 核心业务流高影响变更监控雷达</h2>
      <div className="grid grid-cols-3 gap-6 mb-2">
        {/* 近期预期变更 */}
        <div className="stat-card border-t-4 border-t-blue-500 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500"><TrendingUp className="w-32 h-32" /></div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-500" /></div>
            <h3 className="font-bold text-sm text-foreground mb-0">近期「预期目标」关键调校</h3>
          </div>
          <div className="space-y-3 relative z-10">
            <div className="p-3 bg-muted/40 rounded-lg text-sm border-l-2 border-blue-500 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex justify-between mb-1"><span className="font-medium text-blue-600 dark:text-blue-400">ABC001 年度预期上调</span> <span className="text-[10px] text-muted-foreground">今天 10:30</span></div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                平台大促流量预热爆发，操作人将其预期总需求从 15,000 大幅上调至 <span className="text-blue-500 font-bold bg-blue-500/10 px-1 rounded">18,500</span> 件。
              </div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg text-sm border-l-2 border-muted-foreground hover:bg-muted transition-colors cursor-pointer">
              <div className="flex justify-between mb-1"><span className="font-medium">ABC005 转化模型异动</span> <span className="text-[10px] text-muted-foreground">昨天 16:45</span></div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                自然流量转化率模型由 3.2% 修正为 <span className="text-danger font-bold">2.8%</span>，自动触发底层库存与备货重算机制。
              </div>
            </div>
          </div>
        </div>

        {/* 补货计划变更 */}
        <div className="stat-card border-t-4 border-t-emerald-500 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500"><Calculator className="w-32 h-32" /></div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><Calculator className="w-5 h-5 text-emerald-500" /></div>
            <h3 className="font-bold text-sm text-foreground mb-0">智能「补货计划」策略异动</h3>
          </div>
          <div className="space-y-3 relative z-10">
            <div className="p-3 bg-muted/40 rounded-lg text-sm border-l-2 border-emerald-500 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex justify-between mb-1"><span className="font-medium text-emerald-600 dark:text-emerald-400">一键生成紧急采购矩阵</span> <span className="text-[10px] text-muted-foreground">今天 14:12</span></div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                响应前端缺口，结合智能预案一次性拍板合并追加 <span className="font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">6,400</span> 件。
              </div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg text-sm border-l-2 border-emerald-500 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex justify-between mb-1"><span className="font-medium">全局防线外扩(60→90)</span> <span className="text-[10px] text-muted-foreground">今天 09:15</span></div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                操作人由于海运预警，将全盘安全备货天数基准由 60天 临时延长至 <span className="font-bold">90天(远期保障型)</span>。
              </div>
            </div>
          </div>
        </div>

        {/* 在产/交期记录 */}
        <div className="stat-card border-t-4 border-t-orange-500 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500"><Factory className="w-32 h-32" /></div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-orange-500" /></div>
            <h3 className="font-bold text-sm text-foreground mb-0">执行端「在产/交付」风险变更</h3>
          </div>
          <div className="space-y-3 relative z-10">
            <div className="p-3 bg-danger/5 rounded-lg text-sm border-l-2 border-danger hover:bg-danger/10 transition-colors cursor-pointer">
              <div className="flex justify-between mb-1"><span className="font-bold text-danger">HT260315 交期违约延误</span> <span className="text-[10px] text-muted-foreground">今天 11:15</span></div>
              <div className="text-xs text-danger/80 line-clamp-2 mt-1">
                东莞A厂产能异常导致原定交期被强行延后 <span className="font-bold underline">5 天</span>，严峻影响前端可售天数防线！
              </div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg text-sm border-l-2 border-orange-500 hover:bg-muted transition-colors cursor-pointer">
              <div className="flex justify-between mb-1"><span className="font-medium text-success">HT260310 提前完工入仓</span> <span className="text-[10px] text-muted-foreground">昨天 18:30</span></div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                深圳B厂全量短裤按质顺利核销入库，直接解除该 SKU 后续长达两个月的供应链警报。
              </div>
            </div>
          </div>
        </div>
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
              <React.Fragment key={a.id}>
                <tr>
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
                        <Eye className="w-3 h-3" /> 变更明细
                      </button>
                    )}
                  </td>
                </tr>
                {expanded === a.id && a.changes && (
                  <tr key={a.id + "-changes"}>
                    <td colSpan={7} className="bg-accent/30 p-4 border-y border-border">
                      <div className="text-xs font-bold mb-3 flex items-center gap-2"><Filter className="w-3 h-3" />系统级字段快照溯源</div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-muted-foreground border-b border-border/50">
                            <th className="text-left pb-2 px-2">业务数据字段</th>
                            <th className="text-left pb-2 px-2">操作前旧值</th>
                            <th className="text-left pb-2 px-2">覆写后新值</th>
                          </tr>
                        </thead>
                        <tbody>
                          {a.changes.map((c, i) => (
                            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                              <td className="py-2 px-2 font-medium">{c.field}</td>
                              <td className="py-2 px-2 text-danger line-through decoration-danger/50">{c.before}</td>
                              <td className="py-2 px-2 text-primary font-bold bg-primary/5 rounded">{c.after}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
