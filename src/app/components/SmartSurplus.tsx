
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronLeft, Bell, Shield, TrendingUp, PiggyBank, Wallet, CheckCircle2, Info } from "lucide-react";
import { Shell } from './Shell';


import { useState, useEffect } from "react"; // Ensure standard hooks are present

const slices = [
  {
    key: "goal",
    label: "Goal Savings",
    pct: 45,
    color: "#2563EB",
    lightColor: "#3b82f6",
    icon: PiggyBank,
    desc: "Long-term milestones",
  },
  {
    key: "auto",
    label: "Auto-save",
    pct: 35,
    color: "#1E3A8A",
    lightColor: "#2563EB",
    icon: TrendingUp,
    desc: "Recurring smart transfers",
  },
  {
    key: "flex",
    label: "Flexible Deposit",
    pct: 20,
    color: "#60a5fa",
    lightColor: "#93c5fd",
    icon: Wallet,
    desc: "Liquid daily interest",
  },
];

function fmtNum(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function SmartSurplus({ onBack }: { onBack: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [activeSlice, setActiveSlice] = useState<string | null>(null);
  const [liveTotal, setLiveTotal] = useState<number>(2800000); // Defaults safely, updates reactively

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/goals/analysis")
      .then(res => res.json())
      .then(data => {
        if (data && data.current_monthly > 0) {
          setLiveTotal(data.current_monthly); // Binds surplus view to the live created thặng dư
        }
      })
      .catch(err => console.error("Error reading active cash surplus:", err));
  }, []);

  const data = slices.map((s) => ({
    ...s,
    value: Math.round((s.pct / 100) * liveTotal),
  }));

  const active = activeSlice ? slices.find((s) => s.key === activeSlice) : null;
  const activeData = active ? data.find((d) => d.key === activeSlice) : null;

  return (
    <Shell>
      {/* Đã xóa nút Back và gộp thẻ để triệt tiêu khoảng trống thừa 200px */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-36 pt-4">
        <div className="flex-1">
          {/* Idle funds pill */}
          <div className="px-5 mb-5">
            <div
              className="flex items-center justify-between px-4 py-3 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(30,58,138,0.5) 0%, rgba(37,99,235,0.2) 100%)",
                border: "1px solid rgba(37,99,235,0.25)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-xl"
                  style={{ background: "rgba(37,99,235,0.25)" }}
                >
                  <Shield size={14} color="#3b82f6" />
                </div>
                <div>
                  <p style={{ color: "#4d6a99", fontSize: 10, fontFamily: "'Epilogue', sans-serif", letterSpacing: "0.06em" }}>
                    IDLE FUNDS
                  </p>
                  <p style={{ color: "#e8edf8", fontSize: 18, fontFamily: "'Epilogue', sans-serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
                    {fmtNum(liveTotal)}
                  </p>
                </div>
              </div>
              <div
                className="px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)" }}
              >
                <span style={{ color: "#3b82f6", fontSize: 10, fontFamily: "'Epilogue', sans-serif", fontWeight: 500 }}>
                  READY
                </span>
              </div>
            </div>
          </div>

          {/* Donut chart */}
          <div className="flex flex-col items-center mb-6 px-5">
            <div className="relative" style={{ width: 220, height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={104}
                    dataKey="value"
                    paddingAngle={3}
                    stroke="none"
                    onMouseEnter={(_, index) => setActiveSlice(data[index].key)}
                    onMouseLeave={() => setActiveSlice(null)}
                  >
                    {data.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={entry.color}
                        opacity={activeSlice && activeSlice !== entry.key ? 0.35 : 1}
                        style={{ cursor: "pointer", transition: "opacity 0.2s, filter 0.2s" }}
                        filter={activeSlice === entry.key ? "brightness(1.2)" : undefined}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center content */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                {active && activeData ? (
                  <>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center mb-1"
                      style={{ background: active.color + "30" }}
                    >
                      <active.icon size={14} color={active.lightColor} />
                    </div>
                    <p style={{ color: "#4d6a99", fontSize: 9, fontFamily: "'Epilogue', sans-serif", letterSpacing: "0.06em" }}>
                      {active.label.toUpperCase().slice(0, 10)}
                    </p>
                    <p style={{ color: "#e8edf8", fontSize: 15, fontFamily: "'Epilogue', sans-serif", fontWeight: 500, letterSpacing: "-0.02em" }}>
                      {fmtNum(activeData.value)}
                    </p>
                    <p style={{ color: active.lightColor, fontSize: 12, fontFamily: "'Epilogue', sans-serif", fontWeight: 500 }}>
                      {active.pct}%
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ color: "#4d6a99", fontSize: 10, fontFamily: "'Epilogue', sans-serif", letterSpacing: "0.08em", marginBottom: 2 }}>
                      TOTAL
                    </p>
                    <p style={{ color: "#e8edf8", fontSize: 20, fontFamily: "'Epilogue', sans-serif", fontWeight: 500, letterSpacing: "-0.03em" }}>
                      {fmtNum(liveTotal)}
                    </p>
                    <p style={{ color: "#4d6a99", fontSize: 10, fontFamily: "'Epilogue', sans-serif" }}>
                      3 categories
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Legend dots */}
            <div className="flex items-center gap-5 mt-3">
              {slices.map((s) => (
                <button
                  key={s.key}
                  className="flex items-center gap-1.5"
                  onMouseEnter={() => setActiveSlice(s.key)}
                  onMouseLeave={() => setActiveSlice(null)}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: s.color }}
                  />
                  <span style={{ color: activeSlice === s.key ? "#e8edf8" : "#4d6a99", fontSize: 11, transition: "color 0.15s" }}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Allocation cards */}
          <div className="px-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <p style={{ color: "#e8edf8", fontWeight: 600, fontSize: 15 }}>Allocation Breakdown</p>
              <button className="flex items-center gap-1">
                <Info size={12} color="#4d6a99" />
                <span style={{ color: "#4d6a99", fontSize: 11 }}>Details</span>
              </button>
            </div>

            {data.map((item) => {
              const Icon = item.icon;
              const isActive = activeSlice === item.key;
              return (
                <div
                  key={item.key}
                  className="rounded-2xl p-4"
                  style={{
                    background: isActive ? "rgba(37,99,235,0.1)" : "#141c2f",
                    border: isActive
                      ? `1px solid ${item.color}60`
                      : "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setActiveSlice(item.key)}
                  onMouseLeave={() => setActiveSlice(null)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                      style={{ background: item.color + "22" }}
                    >
                      <Icon size={16} color={item.lightColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p style={{ color: "#e8edf8", fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>
                          {item.label}
                        </p>
                        <p
                          style={{
                            color: "#e8edf8",
                            fontFamily: "'Epilogue', sans-serif",
                            fontSize: 14,
                            fontWeight: 500,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {fmtNum(item.value)}
                        </p>
                      </div>
                      <p style={{ color: "#4d6a99", fontSize: 11, marginTop: 1 }}>{item.desc}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div
                      className="rounded-full overflow-hidden"
                      style={{ height: 5, background: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.pct}%`,
                          background: `linear-gradient(90deg, ${item.color}, ${item.lightColor})`,
                          transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span style={{ color: "#2a3f66", fontSize: 10, fontFamily: "'Epilogue', sans-serif" }}>
                        0
                      </span>
                      <span
                        style={{
                          color: item.lightColor,
                          fontSize: 10,
                          fontFamily: "'Epilogue', sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        {item.pct}% · {fmtNum(item.value)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Summary row */}
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-2.5"
              style={{
                background: "rgba(37,99,235,0.07)",
                border: "1px solid rgba(37,99,235,0.15)",
              }}
            >
              <CheckCircle2 size={14} color="#3b82f6" className="flex-shrink-0" />
              <p style={{ color: "#4d6a99", fontSize: 12, lineHeight: 1.4 }}>
                100% allocated — est. yield{" "}
                <span style={{ color: "#3b82f6", fontFamily: "'Epilogue', sans-serif", fontWeight: 500 }}>
                  +4.2% p.a.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Fixed footer */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-8 flex flex-col gap-3 flex-shrink-0"
          style={{
            background: "linear-gradient(to top, #0b1221 85%, transparent 100%)",
          }}
        >
          <button
            onClick={() => setConfirmed((v) => !v)}
            className="w-full rounded-2xl py-4 flex items-center justify-center gap-2.5 relative overflow-hidden transition-all duration-200 active:scale-95"
            style={{
              background: confirmed ? "rgba(37,99,235,0.25)" : "#2563EB",
              border: confirmed ? "1px solid rgba(37,99,235,0.4)" : "none",
              boxShadow: confirmed ? "none" : "0 8px 24px rgba(37,99,235,0.4)",
              color: confirmed ? "#3b82f6" : "#ffffff",
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: "-0.01em",
              cursor: "pointer",
            }}
          >
            {confirmed ? (
              <>
                <CheckCircle2 size={18} />
                <span>Allocation Activated</span>
              </>
            ) : (
              <>
                <Shield size={17} />
                <span>Confirm Activation</span>
              </>
            )}
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
