# GoalBank AI — UI prototype

Frontend prototype of **GoalBank AI**, a goal-based personal savings concept
built for the **Vietnamese Student HackAIthon 2026** (team placed Top 40).

This repository holds the **user interface only**. See
[What is not in this repo](#what-is-not-in-this-repo) before judging what the
project does.

---

## What is in this repo

A four-screen mobile flow, rendered inside a phone frame in the browser:

| Screen | What the user does |
| :--- | :--- |
| **Dashboard** | Sees total saved, overall progress and the list of savings goals. A goal card can be dragged sideways to delete it. |
| **Goal Setup** | Three-step form: goal name, target amount and deadline; monthly income and expense; review, then submit. |
| **Analysis** | Shows a goal score with two factors: spending pattern and savings rate. |
| **Smart Surplus** | Splits the monthly surplus into three buckets: Goal Savings 45%, Auto-save 35%, Flexible Deposit 20%. |

**Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 4, shadcn/ui (Radix),
Recharts, lucide-react. The screens were scaffolded with Figma Make and then
edited to call a REST API.

## What is not in this repo

- **The backend.** The screens call a REST API at `http://127.0.0.1:8000`.
  That FastAPI service was part of the hackathon build but is kept out of this
  repository (`backend/` is listed in `.gitignore`).
- **The AI services.** The hackathon concept pairs this UI with VNPT AI
  services (Smartbot, SmartReader, eKYC) and rule-based calculation engines.
  None of that integration is in this repository.

Without the backend running, the Dashboard shows an empty state and Goal Setup
cannot be submitted.

## API the UI expects

| Method | Path | Called from | Fields used |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/goals` | Dashboard | `id`, `name`, `emoji`, `target_amount`, `saved_amount`, `deadline`, `color`, `category` |
| `DELETE` | `/api/goals/{id}` | Dashboard | — |
| `POST` | `/api/goals/setup` | Goal Setup | sends `name`, `target_amount`, `deadline`, `monthly_income`, `monthly_expense`, `ai_enabled` |
| `GET` | `/api/goals/analysis` | Analysis, Smart Surplus | `score`, `current_monthly`, `total_goal`, `time_frame`, `spending_pattern`, `savings_rate` |

## Run locally

Requires Node.js 18 or newer.

```bash
git clone https://github.com/TrongKoi/goalbank-AI-demo.git
cd goalbank-AI-demo
npm install
npm run dev
```

Then open the address Vite prints (usually `http://localhost:5173`).

## Known limitations

- The API address is hard-coded in the components.
- Demo content is hard-coded: the sample user name, the insight card on the
  Dashboard, and the currency labels (the screens mix `$` and `IDR`).
- No automated tests.

## Credits

UI components from shadcn/ui and photos from Unsplash — see
[ATTRIBUTIONS.md](ATTRIBUTIONS.md).
