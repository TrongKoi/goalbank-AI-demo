import { useState, useCallback } from "react";
import { Shell } from './Shell';
import {
  BellDot,
  CircleUserRound,
  Target,
  Calendar,
  Wallet,
  TrendingDown,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Landmark,
  Check,
} from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat("id-ID").format(n);

const parseNum = (s: string) => parseInt(s.replace(/\D/g, ""), 10) || 0;

const fmtInput = (raw: string) => {
  const n = parseNum(raw);
  return n > 0 ? fmt(n) : "";
};

// ─── stepper ──────────────────────────────────────────────────────────────────

const STEPS = ["Goal", "Income", "Review"];

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} className="flex items-center">
            {/* connector before */}
            {i > 0 && (
              <div
                className="h-px w-8 transition-colors duration-500"
                style={{ background: done || active ? "#2563eb" : "#1e2d4d" }}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-400"
                style={{
                  background: done
                    ? "#2563eb"
                    : active
                    ? "transparent"
                    : "#1a2540",
                  border: active
                    ? "2px solid #2563eb"
                    : done
                    ? "none"
                    : "2px solid #1e2d4d",
                }}
              >
                {done ? (
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                ) : (
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: active ? "#2563eb" : "#3a4d6e",
                      fontFamily: "'Epilogue', sans-serif",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-semibold tracking-wide uppercase"
                style={{
                  color: active ? "#f0f4ff" : done ? "#2563eb" : "#3a4d6e",
                  fontFamily: "'Epilogue', sans-serif",
                }}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: "#6b7fa8", fontFamily: "'Epilogue', sans-serif" }}
      >
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export function GoalSetup({ onNext, initialStep = 0 }: { onNext: () => void; initialStep?: number }) {
  const [step, setStep] = useState(initialStep);

  // Step 0
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState(30_000_000);
  const [deadline, setDeadline] = useState("");

  // Step 1
  const [incomeRaw, setIncomeRaw] = useState("");
  const [expenseRaw, setExpenseRaw] = useState("");
  const [aiEnabled, setAiEnabled] = useState(true);

  // Done
  const [submitted, setSubmitted] = useState(false);

  const income = parseNum(incomeRaw);
  const expense = parseNum(expenseRaw);
  const savings = Math.max(0, income - expense);
  const monthsNeeded = savings > 0 ? Math.ceil(targetAmount / savings) : null;

  const canNext =
    step === 0
      ? goalName.trim().length > 0 && !!deadline
      : step === 1
      ? incomeRaw.length > 0 && expenseRaw.length > 0
      : true;

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      // 1. Đóng gói dữ liệu người dùng nhập
      const payload = {
        name: goalName,
        target_amount: targetAmount,
        deadline: deadline,
        monthly_income: income,
        monthly_expense: expense,
        ai_enabled: aiEnabled
      };

      try {
        // 2. Gửi dữ liệu lên Backend
        const response = await fetch("http://localhost:8000/api/goals/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          // 3. Nếu Server báo thành công, hiện màn hình Goal Created!
          setSubmitted(true); 
        } else {
          console.error("Lỗi từ server:", await response.text());
        }
      } catch (error) {
        console.error("Lỗi kết nối Backend:", error);
      }
    }
  };

  // ── success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center flex-1 px-5 gap-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "#2563eb22", border: "2px solid #2563eb55" }}
          >
            <CheckCircle2 className="w-9 h-9" style={{ color: "#2563eb" }} />
          </div>
          <div className="text-center">
            <h2
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "'Epilogue', sans-serif" }}
            >
              Goal Created!
            </h2>
            <p style={{ color: "#6b7fa8" }} className="text-sm">
              Your AI savings plan for{" "}
              <span className="text-white font-semibold">{goalName || "your goal"}</span> is live.
            </p>
          </div>
          <div
            className="w-full rounded-2xl p-5 space-y-3"
            style={{ background: "#141c2f", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {[
              ["Target", `${fmt(targetAmount)}`],
              ["Monthly savings", `${fmt(savings)}`],
              monthsNeeded ? ["Time to goal", `${monthsNeeded} months`] : null,
              ["AI analysis", aiEnabled ? "Active" : "Off"],
            ]
              .filter((item): item is [string, string] => item !== null)
              .map(([k, v]) => (
                <div key={k as string} className="flex justify-between items-center">
                  <span style={{ color: "#6b7fa8" }} className="text-xs uppercase tracking-wider font-semibold" >
                    {k as string}
                  </span>
                  <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                    {v as string}
                  </span>
                </div>
              ))}
          </div>
          <button
            onClick={onNext} // Nút này sẽ kích hoạt chuyển màn ngay lập tức
            className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#2563eb", fontFamily: "'Epilogue', sans-serif" }}
            >
            Continue to Analysis
            </button>
        </div>
      </Shell>
    );
  }

// ── main form ───────────────────────────────────────────────────────────────
  return (
    <Shell>
      {/* Page title */}
      <div className="px-5 pb-1 pt-2 flex-shrink-0">
        <h1
          className="text-2xl font-extrabold text-white leading-tight"
          style={{ fontFamily: "'Epilogue', sans-serif", letterSpacing: "-0.03em" }}
        >
          Set your goal
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "#6b7fa8" }}>
          Tell us what you're saving for.
        </p>
      </div>

      {/* stepper */}
      <div className="px-5 py-3">
        <Stepper step={step} />
      </div>

      {/* scrollable form body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-4 space-y-3">

        {/* ── STEP 0 ── */}
        {step === 0 && (
          <Card>
            <CardHeader icon={<Target className="w-3.5 h-3.5" style={{ color: "#2563eb" }} />} title="Goal Details" />
            <div className="p-5 space-y-6">
              {/* Goal name */}
              <Field label="Goal Name" icon={<Target className="w-3 h-3" />}>
                <input
                  type="text"
                  placeholder="e.g. Buy Laptop"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#3a4d6e] outline-none transition-all"
                  style={{
                    background: "#1a2540",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontFamily: "'Figtree', sans-serif",
                    caretColor: "#2563eb",
                  }}
                  onFocus={(e) => (e.currentTarget.style.border = "1px solid #2563eb55")}
                  onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)")}
                />
              </Field>

              {/* Target amount */}
              <Field label="Target Amount" icon={<Wallet className="w-3 h-3" />}>
                {/* Big number display */}
                <div
                  className="rounded-xl px-4 py-3.5 flex items-center justify-between"
                  style={{ background: "#1a2540", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: "#f0f4ff", fontFamily: "'Epilogue', sans-serif" }}
                  >
                    {fmt(targetAmount)}
                  </span>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-lg"
                    style={{ color: "#2563eb", background: "#2563eb18" }}
                  >
                    IDR
                  </span>
                </div>

                {/* Slider */}
                <div className="pt-1 space-y-2">
                  <input
                    type="range"
                    min={10_000_000}
                    max={100_000_000}
                    step={500_000}
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer goalbank-slider"
                    style={{
                      background: `linear-gradient(to right, #2563eb ${((targetAmount - 10_000_000) / 90_000_000) * 100}%, #1e2d4d ${((targetAmount - 10_000_000) / 90_000_000) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between">
                    <span className="text-[10px] font-medium" style={{ color: "#3a4d6e" }}>10,000,000</span>
                    <span className="text-[10px] font-medium" style={{ color: "#3a4d6e" }}>100,000,000</span>
                  </div>
                </div>

                {/* Quick picks */}
                <div className="flex gap-2 flex-wrap">
                  {[10_000_000, 25_000_000, 50_000_000, 75_000_000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setTargetAmount(v)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: targetAmount === v ? "#2563eb" : "#1e2d4d",
                        color: targetAmount === v ? "#fff" : "#6b7fa8",
                        border: `1px solid ${targetAmount === v ? "#2563eb" : "transparent"}`,
                        fontFamily: "'Epilogue', sans-serif",
                      }}
                    >
                      {v >= 1_000_000 ? `${v / 1_000_000}M` : `${v / 1_000}K`}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Deadline */}
              <Field label="Deadline" icon={<Calendar className="w-3 h-3" />}>
                <input
                  type="date"
                  value={deadline}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
                  style={{
                    background: "#1a2540",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: deadline ? "#f0f4ff" : "#3a4d6e",
                    fontFamily: "'Figtree', sans-serif",
                    colorScheme: "dark",
                    caretColor: "#2563eb",
                  }}
                  onFocus={(e) => (e.currentTarget.style.border = "1px solid #2563eb55")}
                  onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)")}
                />
              </Field>
            </div>
          </Card>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <Card>
              <CardHeader icon={<Wallet className="w-3.5 h-3.5" style={{ color: "#2563eb" }} />} title="Monthly Finances" />
              <div className="p-5 space-y-5">
                <Field label="Monthly Income">
                  <NumInput
                    value={incomeRaw}
                    onChange={setIncomeRaw}
                    placeholder="e.g. 8,000,000"
                    accentColor="#10b981"
                  />
                </Field>
                <Field label="Monthly Expense" icon={<TrendingDown className="w-3 h-3" />}>
                  <NumInput
                    value={expenseRaw}
                    onChange={setExpenseRaw}
                    placeholder="e.g. 5,500,000"
                    accentColor="#ef4444"
                  />
                </Field>

                {/* savings preview */}
                {income > 0 && expense > 0 && (
                  <div
                    className="rounded-xl p-4 flex items-center justify-between"
                    style={{
                      background: savings > 0 ? "#10b98115" : "#ef444415",
                      border: `1px solid ${savings > 0 ? "#10b98130" : "#ef444430"}`,
                    }}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#6b7fa8" }}>
                        Monthly savings
                      </p>
                      <p
                        className="text-xl font-bold"
                        style={{
                          color: savings > 0 ? "#10b981" : "#ef4444",
                          fontFamily: "'Epilogue', sans-serif",
                        }}
                      >
                        {fmt(savings)}
                      </p>
                    </div>
                    {monthsNeeded && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#6b7fa8" }}>
                          Time to goal
                        </p>
                        <p className="text-xl font-bold text-white" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                          {monthsNeeded}
                          <span className="text-xs text-[#6b7fa8] font-normal ml-1">mo</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* AI Toggle */}
            <Card>
              <div className="p-5 flex items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: "#2563eb" }} />
                    <span
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: "'Epilogue', sans-serif" }}
                    >
                      AI Transaction Analysis
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b7fa8" }}>
                    GoalBank AI reviews your spending patterns and sends monthly optimization tips.
                  </p>
                  {aiEnabled && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <ShieldCheck className="w-3 h-3 text-[#10b981]" />
                      <span className="text-[10px] font-semibold text-[#10b981]">
                        End-to-end encrypted
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setAiEnabled((v) => !v)}
                  className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 mt-0.5 overflow-hidden"
                  style={{ 
                    background: aiEnabled ? "#2563eb" : "#475569"
                  }}
                  role="switch"
                  aria-checked={aiEnabled}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300"
                    style={{ 
                      // 24px là khoảng cách vừa đủ để cục trắng nằm gọn bên phải khung 48px
                      transform: aiEnabled ? "translateX(24px)" : "translateX(0px)" 
                    }}
                  />
                </button>
              </div>
            </Card>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <Card>
              <CardHeader
                icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />}
                title="Review Your Plan"
              />
              <div className="px-5 pb-5 space-y-0">
                {[
                  { label: "Goal Name", val: goalName || "—" },
                  { label: "Target Amount", val: fmt(targetAmount), big: true },
                  {
                    label: "Deadline",
                    val: deadline
                      ? new Date(deadline).toLocaleDateString("en-GB", {
                          day: "numeric", month: "long", year: "numeric",
                        })
                      : "—",
                  },
                  { label: "Monthly Income", val: income ? fmt(income) : "—" },
                  { label: "Monthly Expense", val: expense ? fmt(expense) : "—" },
                  { label: "Monthly Savings", val: fmt(savings), accent: true },
                  { label: "AI Analysis", val: aiEnabled ? "Enabled" : "Disabled" },
                ].map(({ label, val, big, accent }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-3.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span
                      className="text-[11px] uppercase tracking-widest font-semibold"
                      style={{ color: "#6b7fa8" }}
                    >
                      {label}
                    </span>
                    <span
                      className={`font-bold ${big ? "text-base" : "text-sm"}`}
                      style={{
                        color: accent ? "#10b981" : "#f0f4ff",
                        fontFamily: "'Epilogue', sans-serif",
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Progress bar */}
            {monthsNeeded && (
              <Card>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "#6b7fa8" }}>
                      6-Month Forecast
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#2563eb", fontFamily: "'Epilogue', sans-serif" }}>
                      {Math.min(100, Math.round((savings * 6 / targetAmount) * 100))}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1a2540" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, Math.round((savings * 6 / targetAmount) * 100))}%`,
                        background: "linear-gradient(to right, #2563eb, #10b981)",
                      }}
                    />
                  </div>
                  <p className="text-[10px]" style={{ color: "#3a4d6e" }}>
                    You reach your goal in approximately{" "}
                    <span className="text-white font-semibold">{monthsNeeded} months</span>.
                  </p>
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* bottom nav */}
      <div
        className="px-5 pb-8 pt-3 space-y-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: canNext ? "#2563eb" : "#1a2540",
            color: canNext ? "#fff" : "#3a4d6e",
            fontFamily: "'Epilogue', sans-serif",
            opacity: canNext ? 1 : 0.7,
          }}
        >
          {step === STEPS.length - 1 ? "Confirm & Create Goal" : "Continue"}
          {step < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all hover:bg-white/5"
            style={{ color: "#6b7fa8", fontFamily: "'Epilogue', sans-serif" }}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[10px] font-medium" style={{ color: "#3a4d6e" }}>
          </span>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .goalbank-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 3px solid #0b1221;
          box-shadow: 0 0 0 2px #2563eb, 0 2px 8px rgba(37,99,235,0.5);
        }
        .goalbank-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 3px solid #0b1221;
          box-shadow: 0 0 0 2px #2563eb, 0 2px 8px rgba(37,99,235,0.5);
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.4) sepia(1) hue-rotate(190deg);
          cursor: pointer;
        }
      `}</style>
    </Shell>
  );
}

// ─── sub-components ────────────────────────────────────────────────────────────



function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#141c2f", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {children}
    </div>
  );
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div
      className="flex items-center gap-2 px-5 py-3.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      {icon}
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "#6b7fa8", fontFamily: "'Epilogue', sans-serif" }}
      >
        {title}
      </span>
    </div>
  );
}

function NumInput({
  value,
  onChange,
  placeholder,
  accentColor,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  accentColor: string;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "");
        onChange(raw ? fmt(parseInt(raw, 10)) : "");
      }}
      className="w-full rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all"
      style={{
        background: "#1a2540",
        border: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Figtree', sans-serif",
        caretColor: accentColor,
      }}
      onFocus={(e) => (e.currentTarget.style.border = `1px solid ${accentColor}55`)}
      onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)")}
    />
  );
}
