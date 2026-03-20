import { useState } from "react";
import { Save, AlertCircle, History, FileSpreadsheet, Eye } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Mock forecast data for SKUs combining operational and planning goals
const initialData = [
    { id: "ABC001-B-S", spu: "ABC001", sku: "运动T恤-黑-S", m1: 450, m2: 500, m3: 480, ctr: 3.5, cvr: 12.0 },
    { id: "ABC001-B-M", spu: "ABC001", sku: "运动T恤-黑-M", m1: 850, m2: 900, m3: 880, ctr: 4.2, cvr: 14.5 },
    { id: "ABC001-B-L", spu: "ABC001", sku: "运动T恤-黑-L", m1: 1200, m2: 1350, m3: 1300, ctr: 4.5, cvr: 15.0 },
    { id: "ABC002-W-M", spu: "ABC002", sku: "运动短裤-白-M", m1: 600, m2: 800, m3: 950, ctr: 3.1, cvr: 11.2 },
    { id: "ABC002-W-L", spu: "ABC002", sku: "运动短裤-白-L", m1: 750, m2: 1000, m3: 1100, ctr: 3.6, cvr: 13.0 },
];

export default function Forecast() {
    const [data, setData] = useState(initialData);
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [auditReason, setAuditReason] = useState("");
    const [pendingChanges, setPendingChanges] = useState<{ id: string, field: string, oldVal: number, newVal: number }[]>([]);

    // History state
    const [historyList, setHistoryList] = useState<{ time: string, reason: string, changes: number }[]>([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    // Function to simulate Excel-like editing locally before saving
    const handleEdit = (id: string, field: keyof typeof initialData[0], val: string) => {
        let numVal = parseFloat(val);
        if (isNaN(numVal)) numVal = 0;

        // Check if it's a real change to track pending changes
        const row = data.find(d => d.id === id);
        if (row && row[field] !== numVal) {
            // Filter out existing pending change for same field to replace it
            const newPending = pendingChanges.filter(p => !(p.id === id && p.field === field));
            newPending.push({ id, field, oldVal: Number(row[field]), newVal: numVal });
            setPendingChanges(newPending);
        }

        const newData = data.map((d) => {
            if (d.id === id) {
                return { ...d, [field]: numVal };
            }
            return d;
        });
        setData(newData);
    };

    const attemptSave = () => {
        if (pendingChanges.length === 0) {
            toast.info("没有需要保存的变更。");
            return;
        }
        setShowAuditModal(true);
    };

    const confirmSave = () => {
        if (auditReason.trim().length < 5) {
            toast.error("必须填写修改原因（不少于5个字符），以满足审计要求。");
            return;
        }

        const now = new Date();
        const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        setHistoryList([{ time: formattedTime, reason: auditReason, changes: pendingChanges.length }, ...historyList]);

        toast.success(`预期数据已更新，并自动保存修正记录（原因：${auditReason}）`);
        setShowAuditModal(false);
        setAuditReason("");
        setPendingChanges([]);
    };

    const chartData = [
        { name: "当月预测", sales: data.reduce((sum, d) => sum + d.m1, 0) },
        { name: "下月预测", sales: data.reduce((sum, d) => sum + d.m2, 0) },
        { name: "第3月预测", sales: data.reduce((sum, d) => sum + d.m3, 0) },
    ];

    return (
        <div className="space-y-6 max-w-[1400px]">
            <PageIntro
                title="本页说明：SKU 月度目标与变更留痕"
                lines={[
                    "运营在此维护 SKU 级多月份销量/转化假设，作为计划模拟与采购节奏的对齐输入。",
                    "保存变更必须填写原因，并与系统审计中的追溯叙事一致，便于内控问询。",
                ]}
                flowHint="主线位置：洞察查询之后，进入目标预期 → 产品测算 / 计划模拟 → 供应链执行"
            />

            {/* 审计审批弹窗 */}
            {showAuditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40" onClick={() => setShowAuditModal(false)}>
                    <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-border font-bold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-warning" /> 必须填写变更原因 (系统审计约束)
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg max-h-32 overflow-auto">
                                发现 {pendingChanges.length} 处未保存的数据调整，部分摘要：
                                <ul className="list-disc pl-4 mt-1 font-medium text-foreground">
                                    {pendingChanges.slice(0, 3).map((p, i) => (
                                        <li key={i}>{p.id} 的 [{p.field}]：{p.oldVal} ➡️ {p.newVal}</li>
                                    ))}
                                    {pendingChanges.length > 3 && <li>...等更多修改</li>}
                                </ul>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">调整原因说明 *</label>
                                <textarea
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                                    placeholder="例如：主图优化后转化率上升，调高下月该款式销量预期..."
                                    value={auditReason}
                                    onChange={(e) => setAuditReason(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setShowAuditModal(false)} className="px-4 py-2 border border-input rounded-lg text-sm bg-background hover:bg-muted text-muted-foreground">取消</button>
                                <button onClick={confirmSave} className="px-5 py-2 rounded-lg text-sm bg-primary text-primary-foreground font-medium">确认提交审计</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 变更历史记录弹窗 */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40" onClick={() => setShowHistoryModal(false)}>
                    <div className="bg-card w-full max-w-lg rounded-xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-border font-bold flex items-center justify-between">
                            <span className="flex items-center gap-2"><History className="w-5 h-5 text-primary" /> 预期变更历史</span>
                            <button onClick={() => setShowHistoryModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
                        </div>
                        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                            {historyList.length === 0 ? (
                                <div className="text-center text-muted-foreground py-10 flex flex-col items-center gap-3">
                                    <History className="w-10 h-10 opacity-20" />
                                    <p>当前会话暂无变更审计记录</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {historyList.map((h, i) => (
                                        <div key={i} className="border border-border rounded-lg p-3 bg-muted/10">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-sm font-medium text-foreground/90">{h.time}</div>
                                                <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">共调整了 {h.changes} 项数据</div>
                                            </div>
                                            <div className="text-sm text-foreground/80 bg-background border border-border/50 p-2.5 rounded-md">
                                                <span className="text-muted-foreground text-xs block mb-1 font-medium">审计原因记录：</span>
                                                {h.reason}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground text-center">
                            历史记录自动加密并归档，满足二级审计合规要求
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">运营与计划预期录入</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        将业务预判的“销量”与“运营指标（点击/转化等）”写入系统，支撑供应链推演演算。
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg text-sm flex items-center gap-2 transition-colors">
                        <FileSpreadsheet className="w-4 h-4" /> 导入/导出
                    </button>
                    <button
                        onClick={() => setShowHistoryModal(true)}
                        className="px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg text-sm flex items-center gap-2 transition-colors"
                    >
                        <History className="w-4 h-4" /> 变更历史
                    </button>
                    <button
                        onClick={attemptSave}
                        className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-colors ${pendingChanges.length > 0 ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/30" : "bg-muted text-muted-foreground opacity-70 cursor-not-allowed"
                            }`}
                    >
                        <Save className="w-4 h-4" /> 提交变更 {pendingChanges.length > 0 && `(${pendingChanges.length})`}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* 左侧宏观图表 */}
                <div className="xl:col-span-1 space-y-4">
                    <div className="stat-card">
                        <h3 className="section-title text-sm mb-4">整体销量预期走势 (未来90天)</h3>
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid hsl(var(--border))" }} />
                                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-accent text-accent-foreground flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold mb-1">注意</p>
                            <p className="text-accent-foreground/80 leading-relaxed">
                                表格中的修改只储存在您的浏览器草稿库中。必须点击“提交变更”以记录到中央系统并下发至供应链系统进行备货推演。
                            </p>
                        </div>
                    </div>
                </div>

                {/* 右侧数据输入表格 (Excel样式的输入板) */}
                <div className="xl:col-span-3">
                    <div className="stat-card p-0 overflow-hidden">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                            <h3 className="section-title mb-0 flex items-center gap-2"><Eye className="w-4 h-4" /> SKU 维度数据预录表</h3>
                            <div className="flex gap-2">
                                <select className="text-xs px-2 py-1.5 rounded border border-input bg-background">
                                    <option>分类: 运动户外</option>
                                </select>
                                <select className="text-xs px-2 py-1.5 rounded border border-input bg-background">
                                    <option>负责人: 仅看自己</option>
                                    <option>负责人: 全局</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm data-table m-0">
                                <thead className="bg-muted/50 text-muted-foreground whitespace-nowrap">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-left border-r border-border">主键 / SPU</th>
                                        <th className="px-4 py-3 font-medium text-left border-r border-border min-w-[120px]">单品描述</th>
                                        <th className="px-4 py-3 font-medium text-center border-r border-border bg-primary/5 text-primary">当月销量预期</th>
                                        <th className="px-4 py-3 font-medium text-center border-r border-border bg-primary/5 text-primary">下月销量预期</th>
                                        <th className="px-4 py-3 font-medium text-center border-r border-border bg-primary/5 text-primary">未来第3月预期</th>
                                        <th className="px-4 py-3 font-medium text-center border-r border-border bg-accent/30 text-accent-foreground">预期转化率(%)</th>
                                        <th className="px-4 py-3 font-medium text-center bg-accent/30 text-accent-foreground">预期点击率(%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {data.map((row) => (
                                        <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-2 border-r border-border">
                                                <div className="font-medium">{row.id}</div>
                                                <div className="text-[10px] text-muted-foreground">{row.spu}</div>
                                            </td>
                                            <td className="px-4 py-2 border-r border-border text-xs">{row.sku}</td>

                                            {/* Editable inputs */}
                                            <td className="px-2 py-2 border-r border-border">
                                                <input type="number" value={row.m1} onChange={(e) => handleEdit(row.id, "m1", e.target.value)}
                                                    className="w-full bg-transparent border border-transparent hover:border-input focus:border-primary px-2 py-1 rounded text-center transition-all outline-none font-medium" />
                                            </td>
                                            <td className="px-2 py-2 border-r border-border">
                                                <input type="number" value={row.m2} onChange={(e) => handleEdit(row.id, "m2", e.target.value)}
                                                    className="w-full bg-transparent border border-transparent hover:border-input focus:border-primary px-2 py-1 rounded text-center transition-all outline-none font-medium text-muted-foreground" />
                                            </td>
                                            <td className="px-2 py-2 border-r border-border">
                                                <input type="number" value={row.m3} onChange={(e) => handleEdit(row.id, "m3", e.target.value)}
                                                    className="w-full bg-transparent border border-transparent hover:border-input focus:border-primary px-2 py-1 rounded text-center transition-all outline-none font-medium text-muted-foreground" />
                                            </td>

                                            {/* Operation Inputs */}
                                            <td className="px-2 py-2 border-r border-border bg-accent/5">
                                                <input type="number" step="0.1" value={row.cvr} onChange={(e) => handleEdit(row.id, "cvr", e.target.value)}
                                                    className="w-full bg-transparent border border-transparent hover:border-input focus:border-accent-foreground px-2 py-1 rounded text-center transition-all outline-none text-accent-foreground font-medium" />
                                            </td>
                                            <td className="px-2 py-2 bg-accent/5">
                                                <input type="number" step="0.1" value={row.ctr} onChange={(e) => handleEdit(row.id, "ctr", e.target.value)}
                                                    className="w-full bg-transparent border border-transparent hover:border-input focus:border-accent-foreground px-2 py-1 rounded text-center transition-all outline-none text-accent-foreground font-medium" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
