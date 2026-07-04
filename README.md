# GoalBank AI 🎯

GoalBank AI is an advanced Personal Finance Management (PFM) mobile dashboard tailored to individual cashflow dynamics. Powered by banking-grade algorithms and reactive AI-driven forecasting analytics, the platform helps users bridge the gap between financial targets and daily spending behaviors through structural capital allocation.

Designed inside a native **iPhone 15 Pro iOS framework shell** with fluid micro-interactions and rigorous accounting precision.

---

## 🛠️ Core Engineering & Financial Architecture

### 1. Dynamic Savings Engine (Core Banking Standards)
*   **Linear Time Projections:** Calculates exact financial milestones using continuous timeline ratios instead of rigid or static constants. Time horizons are estimated dynamically using ceiling constraints ($Math.ceil$) to align with institutional accounting horizons.
*   **Banking-Grade Calibration:** Features a dynamically scaling **Financial Health Scoring matrix (up to 96)** that actively monitors real-world data points.

### 2. Live Financial Vector Analysis
*   **Reactive Telemetry:** Replaces static interface layouts with real-time API integrations tracking immediate metrics.
*   **Cashflow Vectors:** Actively decodes consumption architecture into two key mathematical variables:
    *   `Spending Pattern`: Active monitoring of live living costs relative to total earnings.
    *   `Savings Rate`: Direct metric indicating the exact percentage of net monthly financial surplus.

### 3. Smart Surplus Asset Allocation
*   **Penny-Perfect Ledgering:** Automates the allocation of idle investment capital into three dedicated asset buckets with zero-variance errors:
    *   `Goal Savings (45%)`: Capital reserved for high-priority long-term milestones.
    *   `Auto-save (35%)`: Systematic automated asset transfers.
    *   `Flexible Deposit (20%)`: Highly liquid capital with optimized compound yields.
*   **Zero-Overhead Balance:** Syncs Python's financial roundings on the backend with JavaScript's rendering math to prevent currency-drop discrepancies.

### 4. iOS-Native Gesture System
*   **Elastic Spring Mechanics:** Features high-performance interactive `GoalCard` view blocks with touch event capture listeners mimicking native Apple system layouts.
*   **Physics Framework:** Implements structural spring dampening using an organic physics profile (`cubic-bezier(0.32, 0.72, 0, 1)`) with seamless asynchronous backend orchestration upon deletion trigger.

---

## 💻 Tech Stack & Dependencies

*   **Frontend Hub:** React 18, TypeScript, Tailwind CSS, Recharts Architecture, Lucide React Icons.
*   **Backend Hub (Local Engine):** FastAPI (Python 3.11+), Pydantic Data Validations, Uvicorn ASGI Server.

---

## 📊 Verification Matrix (Financial Test Cases)

The core validation engine successfully satisfies strict institutional finance conditions during system verification tests:

| Metric Vector | Test Case 01 (Balanced Saver) | Test Case 02 (Elite Accumulator) | Test Case 03 (Tight Budget) |
| :--- | :--- | :--- | :--- |
| **Monthly Income** | 20,000,000 IDR | 50,000,000 IDR | 15,000,000 IDR |
| **Monthly Expense** | 14,000,000 IDR | 15,000,000 IDR | 13,500,000 IDR |
| **Net Cash Surplus** | **6,000,000 IDR** | **35,000,000 IDR** | **1,500,000 IDR** |
| **Savings Rate Score**| **30% Ratio** | **70% Ratio** | **10% Ratio** |
| **Goal Health Score** | **88 / 100** | **96 / 100** | **55 / 100** |



## 🚀 Getting Started & Installation

Follow these steps to run the GoalBank AI frontend dashboard on your local machine.

### Prerequisites
Ensure you have **Node.js** (v18 or higher) installed on your system.

### 1. Clone the Repository
```bash
git clone [https://github.com/TrongKoi/goalbank-AI-demo.git](https://github.com/TrongKoi/goalbank-AI-demo.git)
cd goalbank-AI-demo
2. Install Dependencies
Install the required packages using npm (or pnpm / yarn if configured):

Bash
npm install
3. Run the Development Server
Launch the local Vite environment:

Bash
npm run dev
Once started, open your browser and navigate to the local address provided in your terminal (usually http://localhost:5173).

💡 System Note: The frontend is configured to securely exchange transactional telemetry with a local backend engine running at http://127.0.0.1:8000. Ensure your local REST API router is active to populate real-time data metrics.