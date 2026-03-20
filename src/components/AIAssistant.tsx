import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, ChevronDown } from "lucide-react";

type Message = { id: string; sender: "ai" | "user"; text: string; time: string };

const initialMessages: Message[] = [
    { id: "1", sender: "ai", text: "您好！我是您的中台AI决策助理。我可以帮您分析库存异常、预警断货风险，或直接生成补货测算建议。今天有什么可以帮您？", time: "09:00" },
    { id: "2", sender: "user", text: "帮我看一下 ABC001 最近的断货风险。", time: "09:02" },
    { id: "3", sender: "ai", text: "正在为您检索底层数据库...\n\n款式 **ABC001 (运动T恤)** 当前预警情况：\n🔴 黑色(S码) 可售天数仅剩 12 天，属于高度断货风险。\n🔴 红色全尺码销售缓慢，存在 52 天以上的积压重置风险。\n\n建议您立即前往【计划模拟】模块，设定 60天 备货目标生成测算矩阵。需要我直接为您跳转吗？", time: "09:02" }
];

const agents = [
    { id: "global", name: "全能大模型", icon: "✨" },
    { id: "supply", name: "供应链统筹", icon: "📦" },
    { id: "data", name: "底层数据池", icon: "📊" },
    { id: "planner", name: "补货测算器", icon: "🧮" },
    { id: "risk", name: "断货风控眼", icon: "🚨" },
    { id: "finance", name: "财务核算师", icon: "💰" },
    { id: "factory", name: "云驻厂监工", icon: "🏭" },
    { id: "logistics", name: "全球运筹官", icon: "🚢" },
];

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeAgent, setActiveAgent] = useState(agents[0].id);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            endRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [isOpen, messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: inputValue,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMsg]);
        setInputValue("");

        // Auto reply
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                sender: "ai",
                text: "这是一个演示沙盒环境。在真实打通数据对接后，我将基于庞大的底层BI池数据，为您进行实时智能归因分析、自动化预警并在您的授权下自动开单。欢迎继续探索此系统框架！",
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 1200);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all z-40 group ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
            >
                <Sparkles className="w-6 h-6 absolute transition-transform group-hover:rotate-12" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-danger rounded-full border-2 border-background animate-pulse"></span>
            </button>

            {/* Chat Panel */}
            <div
                className={`fixed bottom-6 right-6 w-[320px] h-[820px] max-h-[85vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col z-50 transition-all origin-bottom-right duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}
            >
                <div className="h-14 bg-sidebar flex items-center justify-between px-4 rounded-t-xl shrink-0 border-b border-sidebar-border">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-sidebar-foreground">智能供应链超能助理</div>
                            <div className="text-[10px] text-success flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>
                                实时在线 / 算力充足
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-sidebar-muted hover:text-sidebar-foreground transition-colors p-1 rounded-md hover:bg-sidebar-accent/50">
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>

                {/* Agent Switcher Area */}
                <div className="bg-muted/30 p-3 grid grid-cols-4 gap-2 border-b border-border shrink-0">
                    {agents.map(a => (
                        <button
                            key={a.id}
                            onClick={() => setActiveAgent(a.id)}
                            className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeAgent === a.id ? 'bg-background shadow border border-primary/20 text-primary scale-105' : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-transparent hover:scale-100'}`}
                        >
                            <span className="text-[22px] leading-none mb-0.5">{a.icon}</span>
                            <span className="text-[10px] font-medium whitespace-nowrap opacity-90">{a.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                    {messages.map(m => (
                        <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-md' : 'bg-background border border-border text-foreground rounded-tl-sm shadow-sm'
                                }`}>
                                <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                                <div className={`text-[10px] mt-1.5 font-medium ${m.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>{m.time}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={endRef} />
                </div>

                <div className="p-3 bg-background border-t border-border rounded-b-xl shrink-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="向AI提问或输入系统指令..."
                            className="w-full pl-4 pr-12 py-3 rounded-lg border border-input bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            className={`absolute right-1.5 top-1.5 p-1.5 rounded-md transition-colors ${inputValue.trim() ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-2.5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {["预测下月爆款", "复盘近期高退货", "一键安全补货预测", "开启智能巡检"].map(tag => (
                            <button
                                key={tag}
                                onClick={() => { setInputValue(tag); }}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-accent/40 border border-border/50 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors hover:border-primary/20"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
