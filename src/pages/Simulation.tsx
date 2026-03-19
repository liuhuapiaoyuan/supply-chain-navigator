import { useState } from "react";
import { Calculator, ArrowRight, Download, Save } from "lucide-react";

const colors = ["黑色", "白色", "灰色", "藏青", "红色", "蓝色"];
const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

// Current sellable days matrix
const currentDays: Record<string, Record<string, number>> = {
  黑色: { S: 12, M: 18, L: 35, XL: 42, "2XL": 58, "3XL": 65, "4XL": 72 },
  白色: { S: 15, M: 22, L: 38, XL: 45, "2XL": 62, "3XL": 70, "4XL": 78 },
  灰色: { S: 8, M: 14, L: 28, XL: 35, "2XL": 52, "3XL": 60, "4XL": 68 },
  藏青: { S: 20, M: 25, L: 40, XL: 48, "2XL": 55, "3XL": 63, "4XL": 75 },
  红色: { S: 5, M: 8, L: 12, XL: 25, "2XL": 45, "3XL": 52, "4XL": 60 },
  蓝色: { S: 10, M: 16, L: 30, XL: 38, "2XL": 50, "3XL": 58, "4XL": 66 },
};

const dailySales: Record<string, Record<string, number>> = {
  黑色: { S: 5, M: 8, L: 12, XL: 8, "2XL": 5, "3XL": 3, "4XL": 2 },
  白色: { S: 4, M: 7, L: 10, XL: 7, "2XL": 4, "3XL": 3, "4XL": 2 },
  灰色: { S: 3, M: 5, L: 8, XL: 5, "2XL": 3, "3XL": 2, "4XL": 1 },
  藏青: { S: 3, M: 4, L: 7, XL: 5, "2XL": 3, "3XL": 2, "4XL": 1 },
  红色: { S: 2, M: 4, L: 6, XL: 4, "2XL": 2, "3XL": 1, "4XL": 1 },
  蓝色: { S: 3, M: 5, L: 8, XL: 5, "2XL": 3, "3XL": 2, "4XL": 1 },
};

function getDaysBadge(d: number) {
  if (d < 14) return <span className="alert-badge-danger">🔴 {d}</span>;
  if (d < 30) return <span className="alert-badge-warning">🟡 {d}</span>;
  return <span className="text-sm">{d}</span>;
}

export default function Simulation() {
  const [orders, setOrders] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    colors.forEach((c) => { init[c] = {}; sizes.forEach((s) => { init[c][s] = 0; }); });
    return init;
  });
  const [calculated, setCalculated] = useState(false);

  const setOrder = (color: string, size: string, val: number) => {
    setOrders((prev) => ({ ...prev, [color]: { ...prev[color], [size]: val } }));
    setCalculated(false);
  };

  const fillTo = (targetDays: number) => {
    const newOrders: Record<string, Record<string, number>> = {};
    colors.forEach((c) => {
      newOrders[c] = {};
      sizes.forEach((s) => {
        const gap = targetDays - (currentDays[c]?.[s] || 0);
        newOrders[c][s] = gap > 0 ? Math.round(gap * (dailySales[c]?.[s] || 1)) : 0;
      });
    });
    setOrders(newOrders);
    setCalculated(false);
  };

  const rowTotal = (color: string) => sizes.reduce((s, sz) => s + (orders[color]?.[sz] || 0), 0);
  const grandTotal = colors.reduce((s, c) => s + rowTotal(c), 0);

  // After calc
  const totalCurrentStock = colors.reduce((s, c) => s + sizes.reduce((ss, sz) => ss + (currentDays[c]?.[sz] || 0) * (dailySales[c]?.[sz] || 1), 0), 0);
  const warningBefore = colors.reduce((s, c) => s + sizes.filter((sz) => (currentDays[c]?.[sz] || 0) < 30).length, 0);
  const afterStock = totalCurrentStock + grandTotal;
  const warningAfter = colors.reduce((s, c) => s + sizes.filter((sz) => {
    const added = orders[c]?.[sz] || 0;
    const newDays = (currentDays[c]?.[sz] || 0) + (added / (dailySales[c]?.[sz] || 1));
    return newDays < 30;
  }).length, 0);

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0"><Calculator className="w-4 h-4" /> 模拟下单计算</h2>
          <select className="px-3 py-2 rounded-lg border border-input bg-background text-sm">
            <option>ABC001 运动T恤</option><option>ABC002 运动短裤</option><option>ABC003 运动外套</option>
          </select>
        </div>
      </div>

      {/* Current stock days */}
      <div className="stat-card">
        <h3 className="section-title">📊 当前库存状态（可售天数）</h3>
        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr><th></th>{sizes.map((s) => <th key={s} className="text-center">{s}</th>)}</tr>
            </thead>
            <tbody>
              {colors.map((c) => (
                <tr key={c}>
                  <td className="font-medium">{c}</td>
                  {sizes.map((s) => <td key={s} className="text-center">{getDaysBadge(currentDays[c]?.[s] || 0)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span>🔴 &lt;14天(紧急)</span><span>🟡 14-30天(警告)</span><span>⚪ &gt;30天(正常)</span>
        </div>
      </div>

      {/* Order input */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title mb-0">➕ 模拟新增订单</h3>
          <div className="flex gap-2">
            <button onClick={() => fillTo(60)} className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs hover:opacity-80">补货到60天</button>
            <button onClick={() => fillTo(90)} className="px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs hover:opacity-80">补货到90天</button>
            <button onClick={() => { const init: Record<string, Record<string, number>> = {}; colors.forEach(c => { init[c] = {}; sizes.forEach(s => init[c][s] = 0); }); setOrders(init); setCalculated(false); }} className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs hover:opacity-80">清空</button>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr><th></th>{sizes.map((s) => <th key={s} className="text-center">{s}</th>)}<th className="text-center">小计</th></tr>
            </thead>
            <tbody>
              {colors.map((c) => (
                <tr key={c}>
                  <td className="font-medium">{c}</td>
                  {sizes.map((s) => (
                    <td key={s} className="text-center">
                      <input
                        type="number"
                        min={0}
                        value={orders[c]?.[s] || 0}
                        onChange={(e) => setOrder(c, s, parseInt(e.target.value) || 0)}
                        className="w-16 text-center py-1 rounded border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </td>
                  ))}
                  <td className="text-center font-medium">{rowTotal(c)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td>合计</td>
                {sizes.map((s) => <td key={s} className="text-center">{colors.reduce((sum, c) => sum + (orders[c]?.[s] || 0), 0)}</td>)}
                <td className="text-center text-primary">{grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button onClick={() => setCalculated(true)} className="px-8 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
            🔄 计算结果
          </button>
        </div>
      </div>

      {/* Results */}
      {calculated && (
        <div className="stat-card">
          <h3 className="section-title">📈 计算结果</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm font-medium mb-3">模拟前</div>
              <div className="space-y-2 text-sm">
                <div>总库存: <b>{totalCurrentStock.toLocaleString()}件</b></div>
                <div>预警SKU: <b className="text-danger">{warningBefore}个 ({Math.round(warningBefore / (colors.length * sizes.length) * 100)}%)</b></div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-accent/50 border border-primary/20">
              <div className="text-sm font-medium mb-3">模拟后</div>
              <div className="space-y-2 text-sm">
                <div>总库存: <b>{afterStock.toLocaleString()}件</b> ⬆️</div>
                <div>预警SKU: <b className="text-success">{warningAfter}个 ({Math.round(warningAfter / (colors.length * sizes.length) * 100)}%)</b> ⬇️</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-accent/30 text-sm">
            💡 建议: 下单{grandTotal.toLocaleString()}件后，预警SKU从{warningBefore}个降至{warningAfter}个
          </div>

          <div className="flex gap-3 mt-6">
            <button className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm flex items-center gap-2"><Save className="w-4 h-4" /> 保存为草稿</button>
            <button className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm flex items-center gap-2"><Download className="w-4 h-4" /> 导出Excel</button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2">生成采购单 <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
