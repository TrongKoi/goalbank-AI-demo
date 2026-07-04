import React, { useState } from "react";
import { Landmark, Bell } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  const [showNotif, setShowNotif] = useState(true); // Quản lý chấm đỏ của chuông

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#060d1a" }}>
      {/* iPhone 15 Pro frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 393,
          height: 852,
          background: "#0b1221",
          borderRadius: 55,
          border: "10px solid #1a1a2e",
          boxShadow: "0 0 0 1px #2a2a4a, 0 40px 80px rgba(0,0,0,0.8)",
          fontFamily: "'Figtree', sans-serif",
        }}
      >
        {/* Dynamic island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-[120px] h-[34px] bg-black rounded-[20px]" />
        
        {/* App Header chung */}
        <div className="flex items-center justify-between px-5 pt-14 pb-2 flex-shrink-0">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('goHome'))}
            className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-95 active:scale-90 text-left"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#2563eb18] border border-[#2563eb30]">
              <Landmark className="w-4 h-4 text-[#2563eb]" />
            </div>
            <span className="text-base font-extrabold text-white tracking-tighter">
              GoalBank<span className="text-[#2563eb]"> AI</span>
            </span>
          </button>
          <div className="flex items-center gap-3">
            <button
              className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-150"
              style={{ background: "#111c32", border: "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => setShowNotif(false)}
              aria-label="Notifications"
            >
              <Bell size={18} style={{ color: "#a8b4cc" }} />
              {showNotif && (
                <span
                  className="absolute top-2 right-2 w-2 h-2 rounded-full"
                  style={{ background: "#ef4444", boxShadow: "0 0 6px rgba(239,68,68,0.8)" }}
                />
              )}
            </button>
            <div
              className="w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ border: "2px solid #2563eb", boxShadow: "0 0 0 1px rgba(37,99,235,0.3)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
                alt="Alex Rivera profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Nội dung từng màn hình sẽ nằm ở đây */}
        {children}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}