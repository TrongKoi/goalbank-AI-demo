import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  Zap,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Bell,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Sparkles,
} from "lucide-react";
import { Shell } from './Shell';



// ── palette ──────────────────────────────────────────────────────────────────
const C = {
  navy:    "#0b1221",
  surface: "#111c32",
  card:    "#15213a",
  cardHi:  "#192845",
  border:  "rgba(255,255,255,0.06)",
  blue:    "#2563eb",
  blueGl:  "rgba(37,99,235,0.22)",
  blueHi:  "#3b82f6",
  green:   "#22c55e",
  greenBg: "rgba(34,197,94,0.12)",
  amber:   "#f59e0b",
  amberBg: "rgba(245,158,11,0.12)",
  red:     "#ef4444",
  redBg:   "rgba(239,68,68,0.12)",
 text:    "#eef2ff",
  sub:     "#94a3b8",
  muted:   "#475569",
  mono:    "'Epilogue', sans-serif",
  sans:    "'Epilogue', sans-serif",
  body:    "'Figtree', sans-serif",
};

// ── data ─────────────────────────────────────────────────────────────────────
const SCORE = 78;
const DONUT = [{ v: SCORE }, { v: 100 - SCORE }];

const FACTORS = [
  { key: "Income Stability", icon: TrendingUp, score: 85, bar: C.green, bg: C.greenBg, tag: "+7 pts", tagBg: C.greenBg, tagCol: C.green, detail: "14-month consistent income" },
  { key: "Spending Pattern", icon: CreditCard, score: 72, bar: C.amber, bg: C.amberBg, tag: "−4 pts", tagBg: C.amberBg, tagCol: C.amber, detail: "Discretionary at 31% of income" },
  { key: "Savings Rate", icon: PiggyBank, score: 68, bar: C.red, bg: C.redBg, tag: "−9 pts", tagBg: C.redBg, tagCol: C.red, detail: "11% rate — target 20%" },
];

const STATS = [
  { label: "Current Monthly", value: "$890", delta: null },
  { label: "Gap to Close", value: "$350", delta: "up" },
  { label: "Target Date", value: "Jul 2028", delta: null },
  { label: "Total Goal", value: "$85K", delta: null },
];

// ── sub-components ────────────────────────────────────────────────────────────
function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: 5, background: "rgba(255,255,255,0.07)" }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: color, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }}
      />
    </div>
  );
}

function ScoreDonut({ score }: { score: number }) {
  const dynamicDonut = [{ v: score }, { v: Math.max(0, 100 - score) }];
  return (
    <div className="relative flex items-center justify-center" style={{ width: 164, height: 164 }}>
      <PieChart width={164} height={164}>
        <Pie
          data={dynamicDonut}
          dataKey="v"
          cx={82}
          cy={82}
          innerRadius={54}
          outerRadius={70}
          startAngle={90}
          endAngle={-270}
          strokeWidth={0}
        >
          <Cell fill={C.blue} style={{ filter: "drop-shadow(0 0 10px rgba(37,99,235,0.55))" }} />
          <Cell fill="rgba(255,255,255,0.05)" />
        </Pie>
      </PieChart>
      <div className="absolute top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: C.sans, fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
          score
        </span>
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
export function Analysis({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [tab, setTab] = useState<"overview" | "history">("overview");
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Gọi API lấy dữ liệu phân tích
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/goals/analysis")
      .then(res => res.json())
      .then(data => setAnalysisData(data))
      .catch(err => console.log("Chưa có API Analysis:", err));
  }, []);

  const currentMonthly = analysisData ? analysisData.current_monthly : 0;
  const currentScore = analysisData ? analysisData.score : 78;
  
  const liveStats = [
    { label: "Current Monthly", value: `${currentMonthly.toLocaleString()} IDR`, delta: null },
    { label: "Gap to Close", value: "0 IDR", delta: null },
    { label: "Target Window", value: analysisData ? analysisData.time_frame : "0 months", delta: null },
    { label: "Total Target", value: analysisData ? `${(analysisData.total_goal / 1000000).toFixed(0)}M IDR` : "0M IDR", delta: null },
  ];

  const liveFactors = [
    { key: "Spending Pattern", icon: CreditCard, score: analysisData ? analysisData.spending_pattern : 30, bar: C.amber, bg: C.amberBg, tag: "Live", tagBg: C.amberBg, tagCol: C.amber, detail: `Discretionary spend at ${analysisData ? analysisData.spending_pattern : 30}% of income` },
    { key: "Savings Rate", icon: PiggyBank, score: analysisData ? analysisData.savings_rate : 70, bar: C.green, bg: C.greenBg, tag: "Live", tagBg: C.greenBg, tagCol: C.green, detail: `Net surplus accumulation rate at ${analysisData ? analysisData.savings_rate : 70}%` },
  ];

  return (
    <Shell>
      <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── SCROLLABLE BODY ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ── CARD 1: Monthly Savings Required ── */}
        <div
          style={{
            background: `linear-gradient(145deg, #1a2f5e 0%, #152245 50%, ${C.card} 100%)`,
            border: `1px solid rgba(37,99,235,0.3)`,
            borderRadius: 20,
            padding: "20px 20px 18px",
          }}
        >
          {/* top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: C.mono, fontSize: 10, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
                Monthly Savings Required
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontFamily: C.sans, fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {currentMonthly.toLocaleString()} IDR
                </span>
                <span style={{ fontFamily: C.body, fontSize: 14, color: C.muted }}>/mo</span>
              </div>
            </div>
            <div
              style={{
                background: "rgba(34,197,94,0.14)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: 10,
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <ArrowUpRight size={12} color={C.green} />
              <span style={{ fontFamily: C.mono, fontSize: 11, color: C.green, fontWeight: 600 }}>Live Analysis</span>
            </div>
          </div>

          {/* mini stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              borderTop: `1px solid rgba(255,255,255,0.06)`,
              paddingTop: 14,
            }}
          >
            {liveStats.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                  {s.label}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontFamily: C.sans, fontSize: 13, fontWeight: 700, color: s.delta === "up" ? C.amber : C.text }}>
                    {s.value}
                  </span>
                  {s.delta === "up" && <ArrowDownRight size={12} color={C.amber} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CARD 2: Goal Health Score ── */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "18px 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                  Goal Health Score
                </div>
                <div style={{ fontFamily: C.body, fontSize: 13, color: C.sub }}>
                  Ranked based on real cashflow data
                </div>
              </div>
            <ScoreDonut score={currentScore} />
          </div>

          {/* score mini-row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              borderTop: `1px solid rgba(255,255,255,0.06)`,
              paddingTop: 14,
              gap: 0,
            }}
          >
            {liveFactors.map((f, i) => (
              <div
                key={f.key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  borderRight: i < 1 ? `1px solid rgba(255,255,255,0.06)` : "none",
                }}
              >
                <span style={{ fontFamily: C.sans, fontSize: 20, fontWeight: 700, color: f.bar }}>{f.score}%</span>
                <span style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, textTransform: "uppercase", textAlign: "center", letterSpacing: "0.05em" }}>
                  {f.key.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CARD 3: Progress Indicators ── */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "18px 20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Score Breakdown
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.muted }}>Why {currentScore}%?</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {liveFactors.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.key}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: f.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={15} color={f.bar} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <span style={{ fontFamily: C.body, fontSize: 13, fontWeight: 600, color: C.text }}>{f.key}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontFamily: C.mono, fontSize: 12, color: f.bar }}>{f.score}</span>
                          <span
                            style={{
                              fontFamily: C.mono,
                              fontSize: 10,
                              color: f.tagCol,
                              background: f.tagBg,
                              padding: "1px 6px",
                              borderRadius: 5,
                            }}
                          >
                            {f.tag}
                          </span>
                        </div>
                      </div>
                      <Bar pct={f.score} color={f.bar} />
                    </div>
                  </div>
                  <div style={{ paddingLeft: 42 }}>
                    <span style={{ fontFamily: C.body, fontSize: 11, color: C.muted }}>{f.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CARD 4: AI Tip ── */}
        <div
          style={{
            background: C.card,
            border: `1px solid rgba(37,99,235,0.2)`,
            borderRadius: 20,
            padding: "16px 18px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.blueGl,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={16} color={C.blueHi} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: C.body, fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>
              AI Capital Efficiency
            </div>
            <div style={{ fontFamily: C.body, fontSize: 12, color: C.muted, lineHeight: 1.55 }}>
              Your current saving vector ranks in the <span style={{ color: C.green }}>Top Tier</span> for this income bracket.
            </div>
          </div>
          <ChevronRight size={16} color={C.muted} style={{ flexShrink: 0, marginTop: 2 }} />
        </div>

        {/* ── CARD 5: Quick Stats ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {[
            { icon: Target, label: "Initial Vector", value: "0%", sub: `of ${analysisData ? (analysisData.total_goal).toLocaleString() : 0} IDR`, color: C.blue, bg: C.blueGl },
            { icon: TrendingUp, label: "Monthly Accum.", value: `+${currentMonthly.toLocaleString()}`, sub: "net cash surplus", color: C.green, bg: C.greenBg },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 18,
                  padding: "16px 16px",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: item.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Icon size={15} color={item.color} />
                </div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: C.sans, fontSize: 20, fontWeight: 700, color: item.color, lineHeight: 1 }}>
                  {item.value}
                </div>
                <div style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, marginTop: 3 }}>{item.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div
        className="flex flex-col gap-3"
        style={{
          padding: "12px 16px 24px",
          background: `linear-gradient(to top, ${C.navy} 85%, transparent)`,
        }}
      >
        <button
          onClick={onNext} // Gọi onNext để chuyển sang màn 3 (SmartSurplus)
          style={{
            width: "100%",
            padding: "17px 24px",
            borderRadius: 18,
            background: C.blue,
            border: "none",
            color: "#fff",
            fontFamily: C.sans,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            boxShadow: "0 6px 36px rgba(37,99,235,0.42)",
            transition: "all 0.2s",
          }}
          onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"; }}
          onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={15} fill="#fff" color="#fff" />
          </div>
          Smart Surplus
          <ChevronRight size={18} color="rgba(255,255,255,0.55)" />
        </button>

        {/* Nút Back mới ở dưới cùng */}
        <button
          onClick={onBack}
          className="w-full py-2 flex items-center justify-center gap-1.5 transition-opacity hover:opacity-70"
        >
          <ChevronLeft size={16} color="#6b7fa8" />
          <span style={{ color: "#6b7fa8", fontSize: 14, fontFamily: "'Epilogue', sans-serif", fontWeight: 600 }}>
            Back
          </span>
        </button>
      </div>
    </div>
    </Shell>
  );
}
