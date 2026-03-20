import { useState } from "react";
import { Database, HardDrive, RefreshCw, AlertCircle, Save, Clock, DownloadCloud, Play, Settings, CheckCircle2, CalendarDays, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Backup() {
    const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
    const [backupFrequency, setBackupFrequency] = useState("daily");
    const [backupTime, setBackupTime] = useState("02:00");
    const [retainDays, setRetainDays] = useState("30");
    const [isBackingUp, setIsBackingUp] = useState(false);

    // Mock data for backup history
    const [backupHistory, setBackupHistory] = useState([
        { id: "BK-20260320-0200", type: "自动备份", size: "1.2 GB", date: "2026-03-20 02:00:00", status: "success" },
        { id: "BK-20260319-1530", type: "手动备份", size: "1.2 GB", date: "2026-03-19 15:30:45", status: "success" },
        { id: "BK-20260319-0200", type: "自动备份", size: "1.18 GB", date: "2026-03-19 02:00:00", status: "success" },
        { id: "BK-20260318-0200", type: "自动备份", size: "1.15 GB", date: "2026-03-18 02:00:00", status: "success" },
    ]);

    const handleManualBackup = () => {
        setIsBackingUp(true);
        toast.info("正在执行全量数据快照备份，这可能需要一点时间...");

        setTimeout(() => {
            setIsBackingUp(false);
            const newBackup = {
                id: `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${new Date().toLocaleTimeString('zh-CN', { hour12: false }).replace(/:/g, "").slice(0, 4)}`,
                type: "手动备份",
                size: "1.21 GB",
                date: new Date().toLocaleString('zh-CN', { hour12: false }),
                status: "success"
            };
            setBackupHistory([newBackup, ...backupHistory]);
            toast.success("手动备份创建成功！数据安全已得到保障。");
        }, 2500);
    };

    const handleRestore = (id: string) => {
        toast.error(`演示环境：无法直接回滚至快照点 ${id}。如果在真实环境中，系统将在此处重启并覆盖底层池。`);
    };

    const savePolicy = () => {
        toast.success("备份策略已更新！系统将严格按照此策略执行底池保护。");
    };

    return (
        <div className="space-y-6 max-w-[1200px]">
            <h2 className="section-title flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> 系统级灾备与恢复中心</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Policy Settings Panel */}
                <div className="stat-card md:col-span-1 space-y-6 flex flex-col hidden-scrollbar h-fit">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                        <Settings className="w-4 h-4 text-primary" />
                        <span className="font-bold text-sm">自动灾备策略配置</span>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium">开启定期自动备份</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">每日低峰期自动将系统底池镜像归档</div>
                            </div>
                            <button
                                onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
                                className={`w-10 h-5 rounded-full relative transition-colors ${autoBackupEnabled ? 'bg-primary' : 'bg-muted'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${autoBackupEnabled ? 'left-5.5' : 'left-0.5'}`} />
                            </button>
                        </div>

                        <div className={`space-y-4 transition-all duration-300 overflow-hidden ${autoBackupEnabled ? 'opacity-100 h-auto' : 'opacity-30 h-auto pointer-events-none'}`}>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">备份频次</label>
                                <select
                                    value={backupFrequency}
                                    onChange={(e) => setBackupFrequency(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="daily">每天</option>
                                    <option value="weekly">每周</option>
                                    <option value="monthly">每月</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">执行时间 (建议低峰期)</label>
                                <input
                                    type="time"
                                    value={backupTime}
                                    onChange={(e) => setBackupTime(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">快照冷备库保留时长 (天)</label>
                                <input
                                    type="number"
                                    value={retainDays}
                                    onChange={(e) => setRetainDays(e.target.value)}
                                    min="1" max="365"
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <div className="text-[10px] text-muted-foreground mt-1">超过设定天数的早期自动备份将从云端自动擦除。</div>
                            </div>
                        </div>
                    </div>

                    <button onClick={savePolicy} className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                        应用此策略
                    </button>
                </div>

                {/* Action and History Panel */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="stat-card border-t-4 border-t-primary relative overflow-hidden shadow-sm">
                            <Database className="w-24 h-24 absolute -right-4 -bottom-4 opacity-5 text-primary" />
                            <div className="text-sm text-muted-foreground mb-1">当前数据快照基准线</div>
                            <div className="text-2xl font-bold text-foreground mb-2">{backupHistory[0].id}</div>
                            <div className="text-xs text-success flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 数据库引擎健康，全池安全</div>
                        </div>
                        <div className="stat-card flex flex-col justify-center items-center text-center">
                            <div className="text-xs text-muted-foreground mb-2">随时构建数据底池隔离镜像</div>
                            <button
                                onClick={handleManualBackup}
                                disabled={isBackingUp}
                                className={`px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md transition-all ${isBackingUp ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:scale-105'}`}
                            >
                                {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isBackingUp ? "系统热备写入中..." : "立即手工全量快照"}
                            </button>
                        </div>
                    </div>

                    <div className="stat-card">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2 border-b border-border/50 pb-2"><Clock className="w-4 h-4" /> 历史回滚镜像版本池</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground bg-muted/30">
                                    <tr>
                                        <th className="px-3 py-2 rounded-l-md font-medium">版本卷标</th>
                                        <th className="px-3 py-2 font-medium">切片类型</th>
                                        <th className="px-3 py-2 font-medium">体积</th>
                                        <th className="px-3 py-2 font-medium">生成时间</th>
                                        <th className="px-3 py-2 rounded-r-md font-medium text-center">系统动作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {backupHistory.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="px-3 py-3 font-medium text-primary">{item.id}</td>
                                            <td className="px-3 py-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.type === '自动备份' ? 'bg-blue-500/10 text-blue-600' : 'bg-orange-500/10 text-orange-600'}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-muted-foreground">{item.size}</td>
                                            <td className="px-3 py-3 font-mono text-xs">{item.date}</td>
                                            <td className="px-3 py-3 text-center">
                                                <button
                                                    onClick={() => handleRestore(item.id)}
                                                    className="px-3 py-1.5 rounded-md bg-danger/10 text-danger text-xs font-bold hover:bg-danger hover:text-white transition-colors flex items-center gap-1.5 mx-auto"
                                                >
                                                    <RefreshCw className="w-3 h-3" /> 重置底池并恢复
                                                </button>
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
