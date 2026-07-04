import { useState, useEffect, useRef } from "react";
import { Bell, Plus, TrendingUp, Target, Calendar, ChevronRight, Wallet, Zap, Home, BarChart2, Settings } from "lucide-react";
import { Shell } from './Shell';

interface Goal {
  id: string | number;
  name: string;
  emoji: string;
  target?: number;
  target_amount?: number;
  saved?: number;
  saved_amount?: number;
  deadline: string;
  created_at?: string;
  color: string;
  glowColor?: string;
  glow_color?: string;
  category: string;
}

const goals: Goal[] = [
  {
    id: 1,
    name: "Emergency Fund",
    emoji: "🛡️",
    target: 15000,
    saved: 11250,
    deadline: "Dec 2025",
    color: "#2563eb",
    glowColor: "rgba(37,99,235,0.25)",
    category: "Security",
  },
  {
    id: 2,
    name: "Tokyo Trip",
    emoji: "✈️",
    target: 4800,
    saved: 3120,
    deadline: "Mar 2026",
    color: "#8b5cf6",
    glowColor: "rgba(139,92,246,0.25)",
    category: "Travel",
  },
  {
    id: 3,
    name: "MacBook Pro",
    emoji: "💻",
    target: 2499,
    saved: 2200,
    deadline: "Aug 2025",
    color: "#10b981",
    glowColor: "rgba(16,185,129,0.25)",
    category: "Tech",
  },
  {
    id: 4,
    name: "Wedding Fund",
    emoji: "💍",
    target: 30000,
    saved: 8400,
    deadline: "Jun 2027",
    color: "#f59e0b",
    glowColor: "rgba(245,158,11,0.25)",
    category: "Life",
  },
  {
    id: 5,
    name: "Down Payment",
    emoji: "🏠",
    target: 60000,
    saved: 14200,
    deadline: "Jan 2028",
    color: "#ef4444",
    glowColor: "rgba(239,68,68,0.25)",
    category: "Property",
  },
];

function formatCurrency(n: number) {
  return n >= 1000
    ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
    : `$${n.toLocaleString()}`;
}

function daysUntil(deadlineStr: string) {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const [mon, yr] = deadlineStr.split(" ");
  const target = new Date(parseInt(yr), months[mon], 1);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}


// Thuật toán chuẩn ngân hàng: Kiểm tra tiến độ mục tiêu
function isOnTrack(goal: Goal): boolean {
  const saved = goal.saved_amount ?? goal.saved ?? 0;
  const target = goal.target_amount ?? goal.target ?? 0;
  
  if (target === 0) return false;
  if (saved >= target) return true; // Đã đạt mục tiêu thì chắc chắn On Track

  const deadlineDate = new Date(goal.deadline);
  const now = new Date();
  
  if (now > deadlineDate) return false; // Đã quá hạn chót mà chưa đủ tiền -> Behind

  // Tạm giả lập ngày tạo là 30 ngày trước nếu DB chưa có (Sẽ fix triệt để ở Backend)
  const createdDate = goal.created_at ? new Date(goal.created_at) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const totalDays = Math.max(1, (deadlineDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.max(0, (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  // Tính số tiền kỳ vọng phải có tại thời điểm hiện tại
  const expectedSavings = (target / totalDays) * daysElapsed;
  
  // Nếu tiền thực tế >= tiền kỳ vọng -> Đúng tiến độ
  return saved >= expectedSavings;
}

function GoalCard({ goal, index, onDelete }: { goal: Goal; index: number; onDelete: (id: string | number) => void }) {
  const saved = goal.saved_amount ?? goal.saved ?? 0;
  const target = goal.target_amount ?? goal.target ?? 0;
  const glowColor = goal.glow_color ?? goal.glowColor ?? "rgba(37,99,235,0.25)";
  const pct = target > 0 ? Math.round((saved / target) * 100) : 0;
  
  const days = daysUntil(goal.deadline);
  const urgency = days < 90;

  // -- BỘ CẢM BIẾN VUỐT (SWIPE) CHUẨN IOS --
  const cardRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const MAX_SWIPE = -80; // Chiều rộng của nút Xóa
  const THRESHOLD = -40; // Ngưỡng kéo qua -40px sẽ tự động mở

  const onDragStart = (clientX: number) => {
    startX.current = clientX;
    isDragging.current = true;
    if (cardRef.current) cardRef.current.style.transition = 'none'; // Tắt mượt để kéo bám sát tay
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging.current) return;
    currentX.current = clientX;
    const diff = currentX.current - startX.current;
    
    let newOffset = isOpen ? MAX_SWIPE + diff : diff;
    if (newOffset > 0) newOffset = 0; // Không cho vuốt ngược sang phải
    if (newOffset < MAX_SWIPE - 20) newOffset = MAX_SWIPE - 20; // Hiệu ứng đàn hồi (căng dây) khi kéo lố

    if (cardRef.current) cardRef.current.style.transform = `translateX(${newOffset}px)`;
  };

  const onDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = currentX.current - startX.current;

    let finalOffset = 0;
    // Phân tích lực kéo để quyết định đóng hay mở
    if (!isOpen && diff < THRESHOLD) {
      finalOffset = MAX_SWIPE;
      setIsOpen(true);
    } else if (isOpen && diff > -THRESHOLD) {
      finalOffset = 0;
      setIsOpen(false);
    } else if (isOpen) {
      finalOffset = MAX_SWIPE;
    } else {
      finalOffset = 0;
    }

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'; // Bật lại hiệu ứng mượt
      cardRef.current.style.transform = `translateX(${finalOffset}px)`;
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-3 bg-[#ef4444]">
      
      {/* LỚP NỀN: Nút Xóa (Nằm ẩn bên dưới) */}
      <div className="absolute inset-y-0 right-0 w-[80px] flex items-center justify-center">
        <button
          onClick={() => onDelete(goal.id)}
          className="w-full h-full flex flex-col items-center justify-center text-white hover:bg-red-600 transition-colors active:scale-95"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          <span className="text-[11px] font-semibold tracking-wide" style={{ fontFamily: "Epilogue, sans-serif" }}>Xóa</span>
        </button>
      </div>

      {/* BỀ MẶT NỔI: Khối GoalCard (Sẽ trượt qua trái) */}
      <div
        ref={cardRef}
        // Hỗ trợ cảm ứng (Mobile)
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
        // Hỗ trợ chuột (PC)
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={() => { if (isDragging.current) onDragEnd(); }}
        className="relative z-10 p-5 w-full rounded-2xl cursor-grab active:cursor-grabbing"
        style={{
          background: "#111c32",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: isOpen ? "none" : `0 4px 24px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.04)`,
        }}
      >
        {/* Subtle gradient shimmer top-right */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${glowColor}, transparent 70%)`, filter: "blur(20px)" }} />

        <div className="relative z-10 pointer-events-none">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${goal.color}22`, border: `1px solid ${goal.color}44` }}>
                {goal.emoji}
              </div>
              <div>
                <p className="font-semibold text-[15px] leading-tight text-[#e8eaf0]" style={{ fontFamily: "Epilogue, sans-serif" }}>{goal.name}</p>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: `${goal.color}18`, color: goal.color, fontFamily: "Figtree, sans-serif", border: `1px solid ${goal.color}30` }}>
                  {goal.category}
                </span>
              </div>
            </div>
            <ChevronRight className="text-[#6b7a99] mt-1 flex-shrink-0" size={16} />
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-[#6b7a99]" style={{ fontFamily: "Figtree, sans-serif" }}>Progress</span>
              <span className="text-[13px] font-semibold tabular-nums" style={{ fontFamily: "Epilogue, sans-serif", color: goal.color }}>{pct}%</span>
            </div>
            <div className="h-[5px] w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${goal.color}99, ${goal.color})`, boxShadow: `0 0 8px ${goal.color}80` }} />
            </div>
          </div>

          {/* Amounts + deadline */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-[11px] mb-0.5 text-[#6b7a99]" style={{ fontFamily: "Figtree, sans-serif" }}>Saved</p>
              <p className="text-[17px] font-bold tabular-nums text-[#e8eaf0]" style={{ fontFamily: "Epilogue, sans-serif" }}>{formatCurrency(saved)}</p>
            </div>
            <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="text-right">
              <p className="text-[11px] mb-0.5 text-[#6b7a99]" style={{ fontFamily: "Figtree, sans-serif" }}>Target</p>
              <p className="text-[17px] font-bold tabular-nums text-[#a8b4cc]" style={{ fontFamily: "Epilogue, sans-serif" }}>{formatCurrency(target)}</p>
            </div>
            <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="text-right">
              <p className="text-[11px] mb-0.5 text-[#6b7a99]" style={{ fontFamily: "Figtree, sans-serif" }}>Deadline</p>
              <div className="flex items-center gap-1 justify-end">
                <Calendar size={11} style={{ color: urgency ? "#f59e0b" : "#6b7a99" }} />
                <p className="text-[13px] font-semibold" style={{ fontFamily: "Epilogue, sans-serif", color: urgency ? "#f59e0b" : "#a8b4cc" }}>
                  {goal.deadline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div
      className="flex-1 rounded-2xl p-4 flex flex-col gap-2"
      style={{
        background: "#111c32",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest" style={{ fontFamily: "Figtree, sans-serif", color: "#6b7a99" }}>
          {label}
        </span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={14} style={{ color }} />
        </div>
      </div>
      <p className="text-[20px] font-bold" style={{ fontFamily: "Epilogue, sans-serif", color: "#e8eaf0" }}>
        {value}
      </p>
    </div>
  );
}

export function Dashboard({ onAddGoal }: { onAddGoal: () => void }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState("home");
  const [showNotif, setShowNotif] = useState(true);

  // Gọi API lấy dữ liệu từ Backend khi mở Dashboard
  useEffect(() => {
    fetch("http://localhost:8000/api/goals")
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(err => console.error("Lỗi tải Goals:", err));
  }, []);

  // Gọi API lấy dữ liệu từ Backend khi mở Dashboard
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/goals")
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(err => console.error("Lỗi tải Goals:", err));
  }, []);
  
  // -- THÊM HÀM XÓA GOAL VÀO ĐÂY --
  const handleDeleteGoal = async (id: string | number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/goals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Cập nhật lại UI lập tức sau khi xóa thành công (Bóp hiệu ứng)
        setGoals(prevGoals => prevGoals.filter(g => g.id !== id));
      } else {
        alert("Có lỗi xảy ra khi xóa mục tiêu từ Server.");
      }
    } catch (error) {
      console.error("Lỗi xóa Goal:", error);
    }
  };
  
  // Tính toán dựa trên dữ liệu thật (Xử lý an toàn undefined cho TypeScript)
  const totalSaved = goals.reduce((s, g) => s + (g.saved_amount ?? g.saved ?? 0), 0);
  const totalTarget = goals.reduce((s, g) => s + (g.target_amount ?? g.target ?? 0), 0);
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  
  // Thêm dòng đếm số lượng On Track này
  const onTrackCount = goals.filter(isOnTrack).length;
  
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "goals", icon: Target, label: "Goals" },
    { id: "analytics", icon: BarChart2, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

    return (
    <Shell>
      <div className="relative flex flex-col h-full overflow-y-auto scrollbar-hide pb-24">

        {/* Lời chào (Greeting) */}
        <div className="px-5 py-2 flex-shrink-0 mb-3 mt-1">
          <p className="text-[14px]" style={{ color: "#6b7a99", fontFamily: "Figtree, sans-serif" }}>Good morning,</p>
          <h1 className="text-[26px] font-bold leading-tight mt-0.5" style={{ fontFamily: "Epilogue, sans-serif", color: "#e8eaf0" }}>
            Alex Rivera
          </h1>
        </div>

        {/* Summary hero card */}
        <div className="px-5 mb-4 flex-shrink-0">
          <div
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a3a7a 0%, #1e40af 50%, #2563eb 100%)",
              boxShadow: "0 8px 32px rgba(37,99,235,0.35), 0 0 0 1px rgba(255,255,255,0.1) inset",
            }}
          >
            {/* Glow orb */}
            <div
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }}
            />
            <div
              className="absolute bottom-0 left-8 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%)" }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Wallet size={13} style={{ color: "rgba(255,255,255,0.7)" }} />
                <p className="text-[12px] uppercase tracking-widest" style={{ fontFamily: "Figtree, sans-serif", color: "rgba(255,255,255,0.7)" }}>
                  Total Saved
                </p>
              </div>
              <p className="text-[34px] font-bold mb-1 tabular-nums" style={{ fontFamily: "Epilogue, sans-serif", color: "#ffffff" }}>
                ${totalSaved.toLocaleString()}
              </p>
              <p className="text-[13px] mb-4" style={{ fontFamily: "Figtree, sans-serif", color: "rgba(255,255,255,0.6)" }}>
                of ${totalTarget.toLocaleString()} across {goals.length} goals
              </p>
              {/* Overall progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[12px]" style={{ fontFamily: "Figtree, sans-serif", color: "rgba(255,255,255,0.65)" }}>
                    Overall progress
                  </span>
                  <span className="text-[12px] font-semibold" style={{ fontFamily: "Epilogue, sans-serif", color: "#ffffff" }}>
                    {overallPct}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.18)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${overallPct}%`,
                      background: "linear-gradient(90deg, rgba(255,255,255,0.7), #ffffff)",
                      boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="px-5 mb-5 flex gap-3 flex-shrink-0">
          <StatPill label="Active" value={`${goals.length}`} icon={Target} color="#2563eb" />
          {/* Đổi value="4" thành biến đếm động */}
          <StatPill label="On Track" value={`${onTrackCount}`} icon={TrendingUp} color="#10b981" />
        </div>

        {/* Goals section */}
        <div className="flex items-center justify-between px-5 mb-3 flex-shrink-0">
          <h2 className="text-[16px] font-semibold" style={{ fontFamily: "Epilogue, sans-serif", color: "#e8eaf0" }}>
            Savings Goals
          </h2>
          <button
            className="text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ fontFamily: "Figtree, sans-serif", color: "#2563eb" }}
          >
            See all
          </button>
        </div>

        {/* Danh sách Goal (Bây giờ sẽ cuộn chung với toàn bộ trang) */}
        <div className="px-5">
          <div className="flex flex-col gap-0">
            {goals.map((goal, i) => (
              <GoalCard key={goal.id} goal={goal} index={i} onDelete={handleDeleteGoal} />
            ))}
          </div>

          {/* AI insight card */}
          <div
            className="mt-4 rounded-2xl p-4"
            style={{
              background: "linear-gradient(135deg, #0f2348 0%, #111c32 100%)",
              border: "1px solid rgba(37,99,235,0.2)",
              boxShadow: "0 0 20px rgba(37,99,235,0.08)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)" }}
              >
                <Zap size={14} style={{ color: "#2563eb" }} />
              </div>
              <div>
                <p className="text-[13px] font-semibold mb-1" style={{ fontFamily: "Epilogue, sans-serif", color: "#e8eaf0" }}>
                  GoalBank AI Insight
                </p>
                <p className="text-[12px] leading-relaxed" style={{ fontFamily: "Figtree, sans-serif", color: "#6b7a99" }}>
                      Increase your MacBook Pro savings by{" "}
                      <span style={{ color: "#10b981", fontWeight: 600 }}>$299</span> this month to
                      hit your August deadline. You{"'"}re 88% there!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* <--- ĐÓNG KHUNG CUỘN Ở ĐÂY */ }

          {/* FAB ĐẶT NGOÀI KHUNG CUỘN - Sẽ ghim chặt vào góc phải dưới của ứng dụng */}
          <button
            onClick={onAddGoal}
            className="absolute right-6 bottom-8 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 active:scale-95 hover:scale-105 z-50"
            style={{
              background: "#2563eb",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              border: "none",
            }}
          >
            <Plus size={28} color="#ffffff" strokeWidth={2.5} />
          </button>
        </Shell>
  );
}
