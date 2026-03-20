import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";
import {
    X,
    ChevronLeft,
    ChevronRight,
    PlayCircle,
    ShieldCheck,
    Database,
    LayoutDashboard,
    Calculator,
    Truck,
    Eye,
    CheckCircle2,
    CloudLightning,
    ExternalLink,
    Search,
    Target,
    FileText,
    ShoppingCart,
    Package,
    LineChart,
    Megaphone,
    Bot,
    ArrowRight,
    Layers,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const ROUTE_LABELS: Record<string, string> = {
    "/": "今日关注",
    "/sync": "领星数据同步",
    "/query": "库存查询",
    "/simulation": "计划模拟",
    "/supply-chain": "供应链执行",
    "/product-setup": "产品测算",
    "/forecast": "目标预期",
    "/audit": "系统审计",
    "/backup": "备份恢复",
    "/permissions": "数据权限",
};

const MODULE_INDEX: { path: string; hint: string }[] = [
    { path: "/", hint: "全局预警、日销与在产/在途异常一览" },
    { path: "/sync", hint: "领星域同步 + 手工补录双通道" },
    { path: "/query", hint: "单品 SKU 全链路库存穿透" },
    { path: "/simulation", hint: "色码矩阵沙盘与补货推演" },
    { path: "/supply-chain", hint: "采购、发运与工厂执行台账" },
    { path: "/product-setup", hint: "立项前经营模型与毛利率测算" },
    { path: "/forecast", hint: "SKU 月度目标与变更留痕" },
    { path: "/audit", hint: "操作追溯与关键字段 Diff" },
    { path: "/backup", hint: "快照备份与灾难恢复" },
    { path: "/permissions", hint: "RBAC 与行级数据隔离" },
];

const LINGXING_DOMAINS: { id: string; title: string; blurb: string; Icon: typeof ShoppingCart }[] = [
    { id: "sales", title: "销售/订单", blurb: "订单流水、渠道销额、履约切片", Icon: ShoppingCart },
    { id: "inventory", title: "库存结构", blurb: "FBA/在途/预留与现货率", Icon: Package },
    { id: "warehouse", title: "出入库流转", blurb: "打标、返仓与分仓轨迹", Icon: Truck },
    { id: "operations", title: "运营表现", blurb: "Listing、流量与转化维度", Icon: LineChart },
    { id: "ads", title: "广告统计", blurb: "花费、ACoS 与投放归因", Icon: Megaphone },
];

function buildAppHref(pathname: string): string {
    const rawBase = import.meta.env.BASE_URL ?? "/";
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    let basePath = rawBase.replace(/\/$/, "");
    if (basePath !== "" && !basePath.startsWith("/")) basePath = `/${basePath}`;
    return `${window.location.origin}${basePath}${path}`;
}

function isEditableKeyTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    if (target.isContentEditable) return true;
    return Boolean(target.closest('[role="textbox"]'));
}

function PresenterNotesBar({ show, text }: { show: boolean; text: string }) {
    if (!show || !text.trim()) return null;
    return (
        <div className="shrink-0 border-t border-amber-500/40 bg-amber-500/10 px-6 py-3 text-sm text-amber-950 dark:text-amber-100">
            <span className="font-bold text-amber-800 dark:text-amber-200 mr-2">讲者备注</span>
            {text}
        </div>
    );
}

function FlowRibbon() {
    const steps = [
        { label: "接入", sub: "领星+补录" },
        { label: "洞察", sub: "看板+查询" },
        { label: "计划", sub: "目标+测算+模拟" },
        { label: "执行", sub: "采购+发运" },
        { label: "治理", sub: "权限+备份+审计" },
    ];
    return (
        <div className="flex flex-wrap items-stretch justify-center gap-2 md:gap-0 md:flex-nowrap w-full max-w-4xl mx-auto py-4">
            {steps.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                    <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-center min-w-[100px]">
                        <div className="text-sm font-bold text-foreground">{s.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</div>
                    </div>
                    {i < steps.length - 1 ? (
                        <ArrowRight className="w-5 h-5 text-muted-foreground/50 hidden md:block shrink-0" aria-hidden />
                    ) : null}
                </div>
            ))}
        </div>
    );
}

type SlideDef = {
    key: string;
    presenterNotes: string;
    content: ReactNode;
};

export default function Presentation({ onClose }: { onClose: () => void }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const presenterFromUrl = searchParams.get("presenter") === "1";
    const [presenterOverride, setPresenterOverride] = useState<boolean | null>(null);
    const presenterMode = presenterOverride !== null ? presenterOverride : presenterFromUrl;
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    const handleLink = useCallback(
        (path: string) => {
            const url = buildAppHref(path);
            const label = ROUTE_LABELS[path] ?? "该模块";
            const win = window.open(url, "_blank");
            if (win) {
                win.opener = null;
                toast.success(`已在新标签页打开「${label}」，演示可继续进行`);
                return;
            }
            toast.error("浏览器拦截了新窗口，已改为当前页跳转");
            onClose();
            navigate(path);
        },
        [navigate, onClose]
    );

    const slideDefs: SlideDef[] = useMemo(() => {
        const deckDate = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });

        return [
            {
                key: "cover",
                presenterNotes: "开场对齐听众角色（业务/IT）。强调领星为底盘、中台补齐计划与供应链协同。",
                content: (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 shadow-xl shadow-primary/20">
                            <Database className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-primary via-primary/80 to-blue-600 bg-clip-text text-transparent mb-4 tracking-tight">
                                跨境电商供应链数智化中台
                            </h1>
                            <h2 className="text-xl md:text-3xl font-medium text-foreground tracking-wide">
                                基于「领星 ERP」的数据融合与智能预决策方案
                            </h2>
                        </div>
                        <FlowRibbon />
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground border border-border/60 rounded-xl px-6 py-3 bg-card/50">
                            <span>
                                <span className="font-semibold text-foreground">日期</span>：{deckDate}
                            </span>
                            <span className="hidden sm:inline text-border">|</span>
                            <span>
                                <span className="font-semibold text-foreground">版本</span>：演示稿 v1.0
                            </span>
                        </div>
                        <div className="pt-4 text-muted-foreground flex items-center gap-4">
                            <span className="w-12 h-0.5 bg-muted-foreground/30" />
                            <span className="tracking-widest uppercase text-sm font-bold">商业闭门演示课件</span>
                            <span className="w-12 h-0.5 bg-muted-foreground/30" />
                        </div>
                    </div>
                ),
            },
            {
                key: "context",
                presenterNotes: "三条痛点对应后面模块：Excel→计划模拟/目标预期；长周期→查询与看板；孤岛→数据同步与统一口径。",
                content: (
                    <div className="flex flex-col h-full max-w-5xl mx-auto px-6 md:px-12 py-8 animate-in fade-in slide-in-from-right-8 overflow-y-auto">
                        <h2 className="text-2xl md:text-3xl font-bold border-l-8 border-primary pl-6 mb-8">业务背景与核心痛点解读</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <Eye className="w-6 h-6 text-warning shrink-0" /> 当前阶段的核心困扰
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-base md:text-lg">
                                        <span className="text-danger shrink-0 font-bold">1.</span>
                                        <span>
                                            <b>计划严重依赖 Excel：</b>多维筛选低效，衍生指标重复计算，致盲率高。
                                        </span>
                                    </li>
                                    <li className="flex gap-3 text-base md:text-lg">
                                        <span className="text-danger shrink-0 font-bold">2.</span>
                                        <span>
                                            <b>跨境长周期难追溯：</b>库销比口径不一，备货节奏难对齐。
                                        </span>
                                    </li>
                                    <li className="flex gap-3 text-base md:text-lg">
                                        <span className="text-danger shrink-0 font-bold">3.</span>
                                        <span>
                                            <b>数据孤岛与协同断链：</b>财务、领星与中台业务表易「数字打架」。
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-muted/30 rounded-2xl p-6 md:p-8 border border-border/50 shadow-inner space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-success shrink-0" /> 中台建设终极目标
                                </h3>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                                    以领星 ERP 为核心底盘，自建数据中台补齐供应链与计划短板，形成更科学的库存防线，
                                    <b className="text-primary">优化库销比，降低断货与积压风险</b>。
                                </p>
                                <div className="pt-4 border-t border-border/50">
                                    <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg text-sm">输出：端到端确定性工作流闭环</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { k: "需求响应", before: "跨表手工拼接", after: "统一视图 + 预警下钻" },
                                { k: "计划协同", before: "邮件/表格传递", after: "目标—测算—模拟—执行串联" },
                                { k: "风险可控", before: "事后排查", after: "权限隔离 + 操作审计" },
                            ].map((row) => (
                                <div key={row.k} className="rounded-xl border border-border/60 bg-card/80 p-4 text-sm">
                                    <div className="font-bold text-foreground mb-2">{row.k}</div>
                                    <div className="text-muted-foreground text-xs space-y-1">
                                        <div>
                                            <span className="text-danger/90 font-medium">实施前 </span>
                                            {row.before}
                                        </div>
                                        <div>
                                            <span className="text-success font-medium">实施后 </span>
                                            {row.after}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ),
            },
            {
                key: "data",
                presenterNotes: "五域与 DataSync 页一致。强调 API 优先、CSV/表单兜底；现场可点「领星数据同步」看域切换与同步动效。",
                content: (
                    <div className="flex flex-col h-full max-w-5xl mx-auto px-6 md:px-12 py-8 animate-in fade-in slide-in-from-right-8 overflow-y-auto">
                        <h2 className="text-2xl md:text-3xl font-bold border-l-8 border-primary pl-6 mb-6">第一步：数据底座 — 领星域 + 手工补录</h2>
                        <p className="text-muted-foreground mb-6 max-w-3xl">
                            客户可见要点：订单与库存同源、广告与运营可对照；非标准数据（驻厂、研发）由标准化补录进入同一底池，避免多套口径。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
                            <div className="bg-card p-5 rounded-xl border border-border/50 shadow-lg relative overflow-hidden">
                                <CloudLightning className="absolute top-2 right-2 w-16 h-16 text-primary/10" aria-hidden />
                                <h4 className="font-bold text-lg mb-2 text-primary">领星直连（优先）</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">API / 库表对联，按域增量同步，支撑看板与计划演算。</p>
                            </div>
                            <div className="flex items-center justify-center py-2">
                                <ChevronRight className="w-10 h-10 text-muted-foreground/30 animate-pulse" aria-hidden />
                            </div>
                            <div className="bg-card p-5 rounded-xl border border-border/50 shadow-lg border-t-4 border-t-primary">
                                <h4 className="font-bold text-lg mb-2">手工过渡填补</h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">CSV / 表单接入，兜底长尾字段与外部协同数据。</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                            {LINGXING_DOMAINS.map((d) => (
                                <div key={d.id} className="rounded-lg border border-border/50 bg-muted/20 p-3 text-center">
                                    <d.Icon className="w-6 h-6 mx-auto mb-2 text-primary" aria-hidden />
                                    <div className="text-xs font-bold text-foreground">{d.title}</div>
                                    <div className="text-[10px] text-muted-foreground mt-1 leading-snug">{d.blurb}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-auto pb-2">
                            <button
                                type="button"
                                onClick={() => handleLink("/sync")}
                                className="px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground rounded-full font-bold text-base md:text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <PlayCircle className="w-6 h-6" /> 体验【领星数据同步】
                                <ExternalLink className="w-5 h-5 opacity-90" aria-hidden />
                            </button>
                            <span className="text-xs text-muted-foreground">新标签页打开，演示不中断</span>
                        </div>
                    </div>
                ),
            },
            {
                key: "observe",
                presenterNotes:
                    "先讲清「面→点」：大盘回答今天谁该被管；穿透回答这个 SKU 的钱和货分别在哪儿。今日关注里可点「重点预警/全局看板」切换；库存查询强调可售天数=各节点库存÷日均销，以及趋势与供需缺口对计划会的价值。",
                content: (
                    <div className="flex flex-col h-full max-w-5xl mx-auto px-6 md:px-12 py-8 animate-in fade-in slide-in-from-right-8 overflow-y-auto">
                        <h2 className="text-3xl md:text-4xl font-bold border-l-8 border-primary pl-6 mb-5">洞察与穿透 — 从大盘到 SKU</h2>
                        <p className="text-base md:text-lg text-foreground/90 leading-relaxed mb-5 max-w-4xl">
                            计划会最怕两件事：<b className="text-foreground">不知道今天该先救谁</b>（缺一张「风险地图」），以及<b className="text-foreground">知道要救但说不清货在哪一段链路</b>（缺一条「单品账本」）。
                            本页对应两层设计：<span className="text-primary font-semibold">今日关注</span>抓<b>面</b>——按款、按异常类型聚合，帮管理层和组长排优先级；
                            <span className="text-primary font-semibold">库存查询</span>抓<b>点</b>——锁定单个 SKU，把 FBA、在途、在产、本地仓串成一条数，支撑拍板补货、调拨还是催工厂。
                        </p>
                        <div className="rounded-xl border border-primary/25 bg-primary/5 px-5 py-4 mb-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-4xl">
                            <span className="font-semibold text-foreground">对客户一句话：</span>
                            上午打开「今日关注」开站会定清单；下午对争议 SKU 进「库存查询」对齐口径——两边共用同一套底池数据，避免「会上一个数、Excel 里又一个数」。
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                            <div className="bg-card p-6 md:p-7 rounded-xl border border-border shadow-md flex flex-col">
                                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                    <LayoutDashboard className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-xl mb-3">今日关注</h3>
                                <p className="text-muted-foreground text-base mb-3 leading-relaxed">
                                    面向「今天要处理什么」：<b className="text-foreground">重点预警</b>侧重日销脉搏、断货/积压 TOP、在产与在途异常工单式列表；
                                    <b className="text-foreground">全局看板</b>补充款式/SKU 体量、FBA 与在途大盘、按款的预警分布和发货/工厂结构图，便于周会复盘。
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside flex-1 leading-relaxed">
                                    <li>把「可售天数过低、滞销占资、工厂延误、头程卡关」等拉成同一屏，减少跨表拼接。</li>
                                    <li>每条异常可理解为待办入口：后续在计划模拟、供应链执行里落地，形成闭环。</li>
                                </ul>
                                <button
                                    type="button"
                                    onClick={() => handleLink("/")}
                                    className="px-5 py-3 bg-primary text-primary-foreground text-base font-medium rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
                                >
                                    打开仪表盘 <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
                                </button>
                            </div>
                            <div className="bg-card p-6 md:p-7 rounded-xl border border-border shadow-md flex flex-col">
                                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                    <Search className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-xl mb-3">库存查询</h3>
                                <p className="text-muted-foreground text-base mb-3 leading-relaxed">
                                    面向「这个 SKU 到底怎么回事」：支持按 SKU 或<b className="text-foreground">款式 × 颜色 × 尺码</b>交叉定位；一眼汇总
                                    <b className="text-foreground">FBA 可售、头程在途、工厂在产、国内现货、平台预留</b>等节点数量，并用日均销量推算<b className="text-foreground">综合可售天数</b>。
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-2 mb-4 list-disc list-inside flex-1 leading-relaxed">
                                    <li>下钻到 FBA 分仓、发货批次、采购合同行等明细，方便计划与物流、采购同屏对质。</li>
                                    <li>趋势曲线与「预期需求 vs 预期供给」类缺口表，用于解释为什么系统给出补货或控量建议，而不是黑箱数字。</li>
                                </ul>
                                <button
                                    type="button"
                                    onClick={() => handleLink("/query")}
                                    className="px-5 py-3 bg-muted text-foreground text-base font-medium rounded-lg hover:bg-muted/80 flex items-center justify-center gap-2 border border-border"
                                >
                                    打开库存查询 <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
                                </button>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: "plan",
                presenterNotes: "顺序：目标预期（运营输入）→ 产品测算（立项/毛利）→ 计划模拟（色码矩阵）→ 供应链执行（落地）。可任选一页深讲。",
                content: (
                    <div className="flex flex-col h-full max-w-5xl mx-auto px-6 md:px-12 py-8 animate-in fade-in slide-in-from-right-8 overflow-y-auto">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold border-l-8 border-primary pl-6">第二步：计划与经营闭环</h2>
                            <ShieldCheck className="w-10 h-10 text-muted-foreground/20 shrink-0 hidden sm:block" aria-hidden />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-card p-5 rounded-xl border border-border shadow-md">
                                <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-blue-500" /> 目标预期
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3">SKU 级月度目标与 CTR/CVR；保存需填写原因，满足审计。</p>
                                <button type="button" onClick={() => handleLink("/forecast")} className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5">
                                    演示目标预期 <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                </button>
                            </div>
                            <div className="bg-card p-5 rounded-xl border border-border shadow-md">
                                <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-violet-500" /> 产品测算
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3">立项前成本结构、净利与毛利率门槛，快照与审批提示。</p>
                                <button type="button" onClick={() => handleLink("/product-setup")} className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5">
                                    演示产品测算 <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                </button>
                            </div>
                            <div className="bg-card p-5 rounded-xl border border-border shadow-md">
                                <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-blue-500" /> 计划模拟
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3">色码矩阵、补货到 N 天、模拟前后对比与预案导出。</p>
                                <button type="button" onClick={() => handleLink("/simulation")} className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5">
                                    演示计划模拟 <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                </button>
                            </div>
                            <div className="bg-card p-5 rounded-xl border border-border shadow-md">
                                <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-orange-500" /> 供应链执行
                                </h3>
                                <p className="text-muted-foreground text-sm mb-3">发运批次、采购订单、工厂档案与进度下钻。</p>
                                <button type="button" onClick={() => handleLink("/supply-chain")} className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1.5">
                                    演示供应链执行 <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                </button>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: "govern",
                presenterNotes: "强调应用层行级权限（非仅库级）；备份是运维底线；审计对接法务/内控「谁改了什么」。",
                content: (
                    <div className="flex flex-col h-full max-w-5xl mx-auto px-6 md:px-12 py-8 animate-in fade-in slide-in-from-right-8 overflow-y-auto">
                        <h2 className="text-2xl md:text-3xl font-bold border-l-8 border-primary pl-6 mb-8">第三步：治理与安全 — 权限、灾备、审计</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">数据权限</h3>
                                <p className="text-muted-foreground text-sm flex-1 mb-4">RBAC + 到 SKU、工厂等维度的行级隔离。</p>
                                <button
                                    type="button"
                                    onClick={() => handleLink("/permissions")}
                                    className="px-4 py-2.5 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 flex justify-center items-center gap-2 text-sm"
                                >
                                    打开权限 <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
                                </button>
                            </div>
                            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                    <Database className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">备份恢复</h3>
                                <p className="text-muted-foreground text-sm flex-1 mb-4">快照、校验与灾难重置流程可视化。</p>
                                <button
                                    type="button"
                                    onClick={() => handleLink("/backup")}
                                    className="px-4 py-2.5 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 flex justify-center items-center gap-2 text-sm"
                                >
                                    打开备份中心 <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
                                </button>
                            </div>
                            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">系统审计</h3>
                                <p className="text-muted-foreground text-sm flex-1 mb-4">关键业务动作与时间线，支持变更前后 Diff 对照。</p>
                                <button
                                    type="button"
                                    onClick={() => handleLink("/audit")}
                                    className="px-4 py-2.5 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 flex justify-center items-center gap-2 text-sm"
                                >
                                    打开审计 <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
                                </button>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: "closing",
                presenterNotes: "提示右下角打开 AI 助理，演示预设对话与多角色切换；再回到今日关注收束。",
                content: (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-6 animate-in fade-in slide-in-from-bottom-8 overflow-y-auto py-8">
                        <div className="w-28 h-28 relative">
                            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                            <div className="absolute inset-2 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-primary">
                                <LayoutDashboard className="w-10 h-10 text-primary" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black mb-3">战略落地到实操仪表盘</h2>
                            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                                数据接入、洞察查询、目标测算、模拟执行与治理留痕在同一套产品中闭环。
                            </p>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-card/80 px-5 py-4 max-w-xl text-left">
                            <Bot className="w-10 h-10 text-primary shrink-0" aria-hidden />
                            <p className="text-sm text-muted-foreground">
                                右下角 <b className="text-foreground">AI 决策助理</b>：可演示库存风险提示、归因说明与引导跳转至计划模拟等模块（演示对话已预置）。
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => handleLink("/")}
                                className="px-8 md:px-10 py-3 md:py-4 bg-foreground text-background rounded-full font-bold text-lg md:text-xl shadow-2xl hover:scale-105 transition-all outline-none ring-[6px] ring-foreground/20 inline-flex items-center gap-2"
                            >
                                直达【今日关注】
                                <ExternalLink className="w-5 h-5 shrink-0" aria-hidden />
                            </button>
                            <span className="text-xs text-muted-foreground">新标签页打开</span>
                        </div>
                    </div>
                ),
            },
            {
                key: "appendix",
                presenterNotes: "答疑阶段快速跳转任意模块；可按客户角色点名两到三个路径现场打开。",
                content: (
                    <div className="flex flex-col h-full max-w-5xl mx-auto px-6 md:px-12 py-8 animate-in fade-in slide-in-from-right-8 overflow-y-auto">
                        <h2 className="text-2xl md:text-3xl font-bold border-l-8 border-primary pl-6 mb-2">附录：模块索引</h2>
                        <p className="text-sm text-muted-foreground mb-6">与侧边栏一致；点击在新标签页打开对应功能页。</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {MODULE_INDEX.map((m) => (
                                <button
                                    key={m.path}
                                    type="button"
                                    onClick={() => handleLink(m.path)}
                                    className="text-left rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:bg-muted/30 transition-colors flex flex-col gap-1"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-foreground">{ROUTE_LABELS[m.path]}</span>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{m.hint}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ),
            },
        ];
    }, [handleLink]);

    const slideCount = slideDefs.length;

    useEffect(() => {
        setCurrentSlide((s) => Math.min(s, Math.max(0, slideCount - 1)));
    }, [slideCount]);

    useEffect(() => {
        closeBtnRef.current?.focus();
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }
            if (isEditableKeyTarget(e.target)) return;
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                setCurrentSlide((s) => Math.max(0, s - 1));
                return;
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                setCurrentSlide((s) => Math.min(slideCount - 1, s + 1));
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose, slideCount]);

    const active = slideDefs[currentSlide];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="商业闭门演示课件"
            tabIndex={-1}
            className="fixed inset-0 z-[100] bg-background flex flex-col animate-in fade-in zoom-in-95 duration-500 text-foreground overflow-hidden outline-none"
        >
            <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/40 shrink-0 bg-card gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <PlayCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-bold tracking-widest text-xs md:text-sm uppercase text-muted-foreground truncate">PROPOSAL DECK</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={() => setPresenterOverride((v) => !(v ?? presenterFromUrl))}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${presenterMode ? "border-amber-500/60 bg-amber-500/15 text-amber-900 dark:text-amber-100" : "border-border bg-muted text-muted-foreground hover:text-foreground"}`}
                        title="也可在地址栏追加 ?presenter=1"
                    >
                        讲者备注
                    </button>
                    <div className="text-xs md:text-sm font-bold text-muted-foreground bg-muted px-3 md:px-4 py-1.5 rounded-full tabular-nums">
                        {currentSlide + 1} / {slideCount}
                    </div>
                    <button ref={closeBtnRef} type="button" onClick={onClose} aria-label="关闭演示" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-6 h-6 border rounded-full border-border bg-background shadow-sm text-muted-foreground" />
                    </button>
                </div>
            </header>

            <main className="flex-1 relative bg-dot-pattern flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                    {active.content}
                </div>
                <PresenterNotesBar show={presenterMode} text={active.presenterNotes} />
            </main>

            <footer className="h-20 border-t border-border/40 bg-card/50 backdrop-blur-md shrink-0 flex items-center justify-center gap-4 md:gap-8 relative z-10 px-2">
                <button
                    type="button"
                    disabled={currentSlide === 0}
                    onClick={() => setCurrentSlide((s) => s - 1)}
                    aria-label="上一张幻灯片"
                    className={`p-3 rounded-full flex items-center justify-center transition-all ${currentSlide === 0 ? "text-muted-foreground/30" : "text-foreground bg-muted hover:bg-primary hover:text-primary-foreground shadow-sm"}`}
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                <div className="flex gap-2 md:gap-3 max-w-[50vw] overflow-x-auto py-1" role="group" aria-label={`幻灯片页码，共 ${slideCount} 张`}>
                    {slideDefs.map((d, i) => (
                        <button
                            key={d.key}
                            type="button"
                            aria-current={currentSlide === i ? "true" : undefined}
                            aria-label={`第 ${i + 1} 张，共 ${slideCount} 张`}
                            onClick={() => setCurrentSlide(i)}
                            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all shrink-0 ${currentSlide === i ? "bg-primary scale-125" : "bg-border hover:bg-muted-foreground/50"}`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    disabled={currentSlide === slideCount - 1}
                    onClick={() => setCurrentSlide((s) => s + 1)}
                    aria-label="下一张幻灯片"
                    className={`p-3 rounded-full flex items-center justify-center transition-all ${currentSlide === slideCount - 1 ? "text-muted-foreground/30" : "text-foreground bg-muted hover:bg-primary hover:text-primary-foreground shadow-sm"}`}
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </footer>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
        .bg-dot-pattern {
          background-image: radial-gradient(var(--border) 1px, transparent 1px);
          background-size: 32px 32px;
          background-position: center;
        }
      `,
                }}
            />
        </div>
    );
}
