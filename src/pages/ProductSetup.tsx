import { useState } from "react";
import { Calculator, Save, CheckCircle2, XCircle, RefreshCw, History, Percent, DollarSign, TrendingDown, Truck } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import { toast } from "sonner";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const SPU_MODELS = ["ABC001 运动T恤", "ABC002 运动短裤", "ABC003 运动外套", "ABC004 运动背心", "ABC005 运动长裤"];

export default function ProductSetup() {
    const [selectedSpu, setSelectedSpu] = useState(SPU_MODELS[0]);
    const [exchangeRate, setExchangeRate] = useState(7.15); // 汇率
    const [retailPriceUsd, setRetailPriceUsd] = useState(25.99); // 零售价USD
    const [discountRate, setDiscountRate] = useState(15); // 折扣券扣除率 %
    const [returnRate, setReturnRate] = useState(8); // 退货率 %

    const [procurementRmb, setProcurementRmb] = useState(38.0); // 采购价 RMB
    const [internationalShippingRmb, setInternationalShippingRmb] = useState(8.5); // 头程运费 RMB

    const [fbaFeeUsd, setFbaFeeUsd] = useState(4.25); // FBA履约费 USD
    const [commissionRate, setCommissionRate] = useState(15); // 平台佣金 %
    const [storageFeeUsd, setStorageFeeUsd] = useState(0.85); // 仓储费 USD

    // Calculations
    const retailPriceRmb = retailPriceUsd * exchangeRate;
    const discountAmountRmb = retailPriceRmb * (discountRate / 100);
    const actualRevenueRmb = retailPriceRmb - discountAmountRmb; // 券后结算价

    const platformCommissionRmb = retailPriceRmb * (commissionRate / 100);
    const fbaFeeRmb = fbaFeeUsd * exchangeRate;
    const storageFeeRmb = storageFeeUsd * exchangeRate;
    const returnCostRmb = (actualRevenueRmb - platformCommissionRmb) * (returnRate / 100); // 退货摊回订单成本简析

    const totalCostRmb = procurementRmb + internationalShippingRmb + platformCommissionRmb + fbaFeeRmb + storageFeeRmb + returnCostRmb;
    const netProfitRmb = actualRevenueRmb - totalCostRmb;
    const marginPercent = actualRevenueRmb > 0 ? (netProfitRmb / actualRevenueRmb) * 100 : 0;

    const costData = [
        { name: "采购成本", value: procurementRmb, color: "#3b82f6" },
        { name: "头程物流", value: internationalShippingRmb, color: "#60a5fa" },
        { name: "平台佣金", value: platformCommissionRmb, color: "#f59e0b" },
        { name: "FBA履约费", value: fbaFeeRmb, color: "#fbbf24" },
        { name: "仓储费用", value: storageFeeRmb, color: "#10b981" },
        { name: "退货成本分摊", value: returnCostRmb, color: "#ef4444" },
    ];

    const handleSaveSnapshot = () => {
        toast.success(`测算快照已保存：${selectedSpu}`);
    };

    const handleApprove = () => {
        if (marginPercent < 15) {
            toast.warning("净利润率低于 15%，立项可能存在风险，需特别审批！");
        } else {
            toast.success("项目立项审批通过，已同步至商品主数据。");
        }
    };

    return (
        <div className="space-y-6 max-w-[1200px]">
            <PageIntro
                title="本页说明：立项前经营模型测算"
                lines={[
                    "在投产与备货决策前，按 SPU 汇总采购、头程、平台佣金、FBA、仓储与退货摊销，输出净利与毛利率。",
                    "可保存快照并模拟审批门槛（如利润率过低触发预警），与计划部门的「可卖、能赚」判断对齐。",
                ]}
                flowHint="主线位置：目标预期旁路 — 与计划模拟共用同一套经营假设语言"
            />
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">经营模型测算与立项</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        在研发/开发前演算成本结构，计算毛利率，确定是否满足立项门槛。主键拆分至 SPU。
                    </p>
                </div>
                <div className="flex bg-card border border-border rounded-lg p-1">
                    <select
                        value={selectedSpu}
                        onChange={(e) => setSelectedSpu(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium focus:ring-0 mx-2"
                    >
                        {SPU_MODELS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="px-3 py-1.5 bg-muted text-muted-foreground hover:text-foreground rounded text-xs transition-colors flex items-center gap-1">
                        <History className="w-3 h-3" /> 历史快照
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 左侧：假设与输入参数 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="stat-card">
                        <h3 className="section-title mb-4 flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> 价格与平台参数设定</h3>
                        <div className="grid grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">系统对标汇率 (USD/CNY)</label>
                                <input type="number" step="0.01" value={exchangeRate} onChange={(e) => setExchangeRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">预期零售价 (USD)</label>
                                <input type="number" step="0.01" value={retailPriceUsd} onChange={(e) => setRetailPriceUsd(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Coupon折扣占整(%)</label>
                                <input type="number" step="0.1" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">平台佣金率 (%)</label>
                                <input type="number" step="0.1" value={commissionRate} onChange={(e) => setCommissionRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">预计退货率 (%)</label>
                                <div className="relative">
                                    <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                                    {returnRate > 10 && <span className="absolute right-3 top-2.5 flex h-2 w-2 rounded-full bg-danger ring-2 ring-background"></span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3 className="section-title mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-accent-foreground" /> 采购与供应链履约成本</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">目标采购价 (RMB)</label>
                                <input type="number" step="0.5" value={procurementRmb} onChange={(e) => setProcurementRmb(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-accent-foreground font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">头程运费均摊 (RMB/件)</label>
                                <input type="number" step="0.1" value={internationalShippingRmb} onChange={(e) => setInternationalShippingRmb(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">FBA配送费预估 (USD/件)</label>
                                <input type="number" step="0.1" value={fbaFeeUsd} onChange={(e) => setFbaFeeUsd(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">月度仓储费均摊 (USD/件)</label>
                                <input type="number" step="0.01" value={storageFeeUsd} onChange={(e) => setStorageFeeUsd(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧：计算结果面板 */}
                <div className="space-y-6">
                    <div className="stat-card relative overflow-hidden h-full flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-success"></div>
                        <h3 className="section-title mb-4"><Calculator className="w-4 h-4" /> 单件盈利推演模型</h3>

                        <div className="flex-1 space-y-5">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                <span className="text-sm text-muted-foreground">券后实际回款</span>
                                <span className="text-lg font-bold text-foreground">¥{actualRevenueRmb.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 rounded-lg bg-danger/10 border border-danger/20">
                                <span className="text-sm text-danger-foreground font-medium">综合单件成本</span>
                                <span className="text-lg font-bold text-danger">¥{totalCostRmb.toFixed(2)}</span>
                            </div>

                            <div className="pt-2 border-t border-border"></div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">预期单件净利</div>
                                    <div className={`text-3xl font-black ${netProfitRmb >= 0 ? "text-success" : "text-danger"}`}>
                                        ¥{netProfitRmb.toFixed(2)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground mb-1">毛利率</div>
                                    <div className={`text-xl font-bold flex items-center gap-1 ${marginPercent >= 15 ? "text-success" : marginPercent >= 5 ? "text-warning" : "text-danger"}`}>
                                        {marginPercent.toFixed(1)}%
                                        {marginPercent < 15 && <TrendingDown className="w-4 h-4" />}
                                    </div>
                                </div>
                            </div>

                            <div className="h-[180px] w-full mt-4 flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={costData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} stroke="none" paddingAngle={2}>
                                            {costData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(val: number) => `¥${val.toFixed(2)}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs text-muted-foreground">总成本</span>
                                    <span className="font-bold text-sm">¥{totalCostRmb.toFixed(1)}</span>
                                </div>
                            </div>

                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleSaveSnapshot}
                                className="flex-1 px-4 py-2.5 bg-muted text-muted-foreground hover:bg-muted/80 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Save className="w-4 h-4" /> 保存快照
                            </button>
                            <button
                                onClick={handleApprove}
                                className={`flex-1 px-4 py-2.5 text-white flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all ${marginPercent < 15 ? 'bg-danger hover:bg-danger/90' : 'bg-primary hover:bg-primary/90'
                                    }`}
                            >
                                {marginPercent < 15 ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                {marginPercent < 15 ? '风险立项' : '确认立项'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
