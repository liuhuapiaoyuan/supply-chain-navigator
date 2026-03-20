import { useState } from "react";
import { Shield, Users, Lock, Save, Eye, EyeOff, Key, Database, Search } from "lucide-react";
import { toast } from "sonner";

type Role = {
    id: string;
    name: string;
    usersCount: number;
    description: string;
    type: "system" | "business" | "external";
};

const defaultRoles: Role[] = [
    { id: "r1", name: "超级管理员", usersCount: 2, description: "拥有系统最高权限及所有底池数据物理管控权", type: "system" },
    { id: "r2", name: "供应链总监", usersCount: 1, description: "全盘供应链统筹：审批补货矩阵、修改全局备货防线", type: "business" },
    { id: "r3", name: "采购专员", usersCount: 5, description: "负责将协同建议转化为实际的执行采购单并下发工厂", type: "business" },
    { id: "r4", name: "外部驻厂统筹", usersCount: 12, description: "【隔离视角】仅可见指派给自身名下工厂的订单及交期数据", type: "external" },
    { id: "r5", name: "财务结算经理", usersCount: 3, description: "管控总大盘成本与发货运费开支，不具有补货干预权", type: "business" },
];

const permissionModules = [
    {
        category: "数据核心底座 (Data Core)",
        items: [
            { id: "p1", name: "查看全局商品出入库总流水", defaultChecked: ["r1", "r2", "r5"] },
            { id: "p2", name: "查看敏感成本/财务净利率", defaultChecked: ["r1", "r2", "r5"] },
            { id: "p3", name: "隔离模式：仅锁定可见自身业务池SKU", defaultChecked: ["r3", "r4"] },
        ]
    },
    {
        category: "应用层决策与协同 (App Ops)",
        items: [
            { id: "p4", name: "修改「智能补货模拟」全局基准防线", defaultChecked: ["r1", "r2"] },
            { id: "p5", name: "生成/下发最终协同采购矩阵执行", defaultChecked: ["r1", "r2", "r3"] },
            { id: "p6", name: "干预预测转化率与退货模型参数", defaultChecked: ["r1", "r2"] },
        ]
    },
    {
        category: "系统基础设施视角 (Infrastructures)",
        items: [
            { id: "p7", name: "查阅审计追溯雷达全量快照", defaultChecked: ["r1"] },
            { id: "p8", name: "执行数据底池隔离镜像与回滚指令", defaultChecked: ["r1"] },
            { id: "p9", name: "全局RBAC（角色控制）指派配置", defaultChecked: ["r1"] },
        ]
    }
];

export default function Permissions() {
    const [activeRole, setActiveRole] = useState<string>("r2");
    const [permissions, setPermissions] = useState<Record<string, string[]>>(() => {
        // initialize mapping: permissionId -> array of role IDs
        const initials: Record<string, string[]> = {};
        permissionModules.forEach(group => {
            group.items.forEach(item => {
                initials[item.id] = [...item.defaultChecked];
            });
        });
        return initials;
    });

    const togglePermission = (permId: string, roleId: string) => {
        setPermissions(prev => {
            const currentRoles = prev[permId] || [];
            if (currentRoles.includes(roleId)) {
                return { ...prev, [permId]: currentRoles.filter(r => r !== roleId) };
            } else {
                return { ...prev, [permId]: [...currentRoles, roleId] };
            }
        });
    };

    const handleSave = () => {
        toast.success(`角色「${defaultRoles.find(r => r.id === activeRole)?.name}」的数据安全应用范围已更新！应用层视图已重新下发隔离。`);
    };

    return (
        <div className="space-y-6 max-w-[1200px] h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <h2 className="section-title mb-0 flex items-center gap-2"><Lock className="w-5 h-5" /> 数据安全与权限护城河</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-border text-foreground hover:bg-muted text-sm font-medium rounded-lg transition-colors flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /> 账户池配置</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium rounded-lg transition-opacity flex items-center gap-2"><Save className="w-4 h-4" /> 下发此角色权限边界</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">

                {/* Roles Sidebar */}
                <div className="stat-card md:col-span-4 flex flex-col min-h-0 h-full !pb-0 !px-0 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-5 pt-4 pb-3 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="搜索全局岗位与角色..."
                                className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-input rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto hidden-scrollbar p-3 space-y-1 bg-muted/10">
                        {defaultRoles.map((role) => (
                            <div
                                key={role.id}
                                onClick={() => setActiveRole(role.id)}
                                className={`p-3 rounded-lg cursor-pointer transition-all border ${activeRole === role.id ? 'bg-primary/5 border-primary shadow-sm' : 'border-transparent hover:bg-muted'}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        {role.type === 'system' && <Database className="w-4 h-4 text-primary" />}
                                        {role.type === 'business' && <Shield className="w-4 h-4 text-blue-500" />}
                                        {role.type === 'external' && <EyeOff className="w-4 h-4 text-orange-500" />}
                                        <span className={`font-bold text-sm ${activeRole === role.id ? 'text-primary' : 'text-foreground'}`}>{role.name}</span>
                                    </div>
                                    <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{role.usersCount}人</span>
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed opacity-80">{role.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Matrix Area */}
                <div className="md:col-span-8 flex flex-col min-h-0 h-full">
                    <div className="stat-card flex-1 flex flex-col h-full rounded-xl overflow-hidden shadow-sm border-t-4 border-t-primary !p-0">
                        <div className="px-6 py-5 border-b border-border bg-muted/10 shrink-0">
                            <h3 className="font-bold text-lg mb-1">{defaultRoles.find(r => r.id === activeRole)?.name} - 数据可视与操作授权</h3>
                            <div className="text-xs text-muted-foreground flex items-center gap-4">
                                <span className="flex items-center gap-1"><Key className="w-3 h-3 text-warning" /> 严禁越权访问</span>
                                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-success" /> 应用层底池全隔离</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-2">
                            <div className="space-y-8 mt-4 mb-8">
                                {permissionModules.map((group, gIdx) => (
                                    <div key={gIdx} className="space-y-3">
                                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 border-b border-primary/20 pb-2">{group.category}</h4>
                                        <div className="space-y-4">
                                            {group.items.map((item) => {
                                                const isGranted = (permissions[item.id] || []).includes(activeRole);
                                                return (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => togglePermission(item.id, activeRole)}
                                                        className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all ${isGranted ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-background border-border hover:border-border/80'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${isGranted ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-input'}`}>
                                                                {isGranted && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                            </div>
                                                            <div>
                                                                <div className={`text-sm font-medium ${isGranted ? 'text-foreground' : 'text-muted-foreground'}`}>{item.name}</div>
                                                                {item.name.includes("隔离") && (
                                                                    <div className="text-[10px] text-danger mt-1 flex items-center gap-1"><EyeOff className="w-3 h-3" /> 数据行级安全：启用后应用层强行过滤该岗位非关联数据底池</div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Read-only indicators for other roles that have this permission */}
                                                        <div className="flex items-center gap-1 -translate-y-1">
                                                            {permissions[item.id]?.filter(r => r !== activeRole).map(roleId => {
                                                                const role = defaultRoles.find(r => r.id === roleId);
                                                                if (!role) return null;
                                                                return (
                                                                    <div key={roleId} className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center text-[10px] text-muted-foreground font-bold shadow-sm" title={role.name}>
                                                                        {role.name.charAt(0)}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
