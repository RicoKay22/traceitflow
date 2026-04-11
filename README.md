# TraceItFlow

> **Trace the logic. Step by step.**

A production-grade algorithm visualizer that animates sorting, searching, and graph traversal algorithms in real time. Watch every comparison, swap, and pivot happen live — with pseudocode that highlights the exact line currently executing.

**Built by [Rico Kay](https://github.com/RicoKay22) · Web3Bridge Cohort XIV Final Project**

🔗 **Live Demo:** [traceitflow.vercel.app](https://traceitflow.vercel.app)

---

## ✨ Features

### 🔬 Algorithm Visualization
- **7 algorithms** across 3 categories — each with a unique color identity
- **Sorting:** Bubble Sort · Merge Sort · Quick Sort
- **Searching:** Binary Search · Linear Search
- **Graph:** BFS (Breadth First Search) · DFS (Depth First Search)
- Step-by-step animation with Play / Pause / Step Forward / Step Back / Reset
- Adjustable speed (0.25× to 4×) and array size (10–80 elements)
- Bar glow effects highlight active comparisons and swaps in real time

### 📖 Pseudocode Sync Panel
- Right-side drawer showing pseudocode for the active algorithm
- **Active line highlights** in sync with every animation step
- Language switcher: **JavaScript · Python · C**
- Complexity badges: Best / Average / Worst / Space complexity

### ⚔️ Comparison Mode
- Run **two algorithms simultaneously** on the same array
- Independent play controls per side
- Live race timer counting up in real time
- Winner banner with margin of victory
- Tie detection

### 🔐 Authentication
- Email + password registration and login
- **Google OAuth** (Continue with Google)
- Password reveal toggle
- Forgot password with **email validation** — only registered emails receive reset links
- Full password reset flow via email link

### 🎨 UI & Design
- **BB8 Star Wars dark/light toggle** (rolls from desert day to starry night)
- Dark mode default: Charcoal `#0D0D0D` + Acid Green `#AAFF00`
- Light mode: Warm White `#FAFAF7` + Deep Teal `#0A4A5C`
- **Radix UI** components: sliders with +/− buttons, tabs, tooltips, dialog drawer
- Responsive design · Space Mono + DM Sans + JetBrains Mono typography
- Branded 404 page with countdown redirect

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| State Management | useReducer + Context API |
| Styling | Tailwind CSS v4 + CSS Variables |
| UI Components | Radix UI + styled-components (21st.dev patterns) |
| Backend & Auth | Supabase (PostgreSQL + Auth) |
| Icons | Lucide React |
| Typography | Space Mono · DM Sans · JetBrains Mono |
| Deployment | Vercel |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/RicoKay22/traceitflow.git
cd traceitflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase

Create a new Supabase project, then run this SQL in the **SQL Editor**:

```sql
-- Create profiles table
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  username      text not null,
  email         text,
  preferred_speed float default 1.0,
  last_algorithm  text default 'bubbleSort',
  theme           text default 'dark',
  created_at      timestamp with time zone default timezone('utc', now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies
create policy "Users can read their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Anyone can check if email exists for password reset"
  on public.profiles for select using (true);
```

### 4. Configure environment variables

Create a `.env.local` file in the root folder:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from: **Supabase Dashboard → Project Settings → API**

### 5. Configure Supabase Auth URLs

In **Supabase → Authentication → URL Configuration:**
- **Site URL:** `http://localhost:5173`
- **Redirect URLs:** Add `http://localhost:5173/**`

### 6. Start the dev server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🚀

---

## 🔑 Google OAuth Setup (Optional)

To enable "Continue with Google":

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → APIs & Services → Credentials → OAuth 2.0 Client
3. Application type: **Web application**
4. Authorized JavaScript origins: `http://localhost:5173`
5. Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret into **Supabase → Authentication → Providers → Google**

---

## 📁 Project Structure

```
src/
├── algorithms/
│   ├── sorting/
│   │   ├── bubbleSort.js     # Step snapshot engine
│   │   ├── mergeSort.js
│   │   └── quickSort.js
│   ├── searching/
│   │   ├── binarySearch.js
│   │   └── linearSearch.js
│   ├── graph/
│   │   ├── bfs.js
│   │   └── dfs.js
│   └── index.js              # Central algorithm registry
├── components/
│   ├── layout/
│   │   ├── TopBar.jsx         # Header with BB8 toggle + user chip
│   │   ├── Sidebar.jsx        # Collapsible algorithm navigator
│   │   └── RightDrawer.jsx    # Pseudocode + complexity panel
│   ├── visualizer/
│   │   ├── BarCanvas.jsx      # Animated bar chart renderer
│   │   ├── GraphCanvas.jsx    # SVG node/edge renderer for BFS/DFS
│   │   └── Controls.jsx       # Playback controls with Radix sliders
│   └── ui/
│       └── BB8Toggle.jsx      # Star Wars dark/light toggle
├── context/
│   ├── AuthContext.jsx        # Supabase auth session management
│   └── ThemeContext.jsx       # Dark/light mode with localStorage
├── hooks/
│   └── useAnimationPlayer.js  # useReducer animation state machine
├── pages/
│   ├── AuthPage.jsx           # Split-panel auth with live bar preview
│   ├── Dashboard.jsx          # Command center with algorithm grid
│   ├── VisualizerPage.jsx     # Full visualizer (bars or graph)
│   ├── ComparisonPage.jsx     # Dual-canvas race mode
│   ├── UpdatePasswordPage.jsx # Password reset landing page
│   └── NotFoundPage.jsx       # Branded 404 with countdown
├── lib/
│   └── supabase.js            # Supabase client
└── styles/
    └── globals.css            # Design tokens + CSS variables
```

---

## 🧠 Architecture Highlights

### Step Snapshot Pattern
Each algorithm pre-computes **all steps** into an array of snapshots before animation starts. Each snapshot contains the full array state plus metadata (comparing indices, sorted indices, current node, active pseudocode line). This enables:
- Instant step forward/backward without recomputing
- Deterministic progress bar
- Pseudocode line sync

### Animation State Machine
`useAnimationPlayer` uses `useReducer` to manage a state machine with actions: `PLAY`, `PAUSE`, `RESET`, `STEP_FORWARD`, `STEP_BACK`, `SET_SPEED`. A `useRef` holds the `setInterval` ID for clean cancellation on pause/reset — preventing memory leaks.

### Algorithm Registry
All 7 algorithms are registered in `src/algorithms/index.js` with a consistent interface: `generateSteps`, `pseudocode` (JS/Python/C), `complexity`, `accentColor`. Adding a new algorithm requires only one registry entry.

---

## 📜 Git Commit History

This project follows conventional commits with 15+ meaningful commits documenting each feature phase — from scaffold to deployment.

---

## 👤 Author

**Rico Kay (Olumide Olayinka)**
- GitHub: [@RicoKay22](https://github.com/RicoKay22)
- Project: [KayAcademy](https://kayacademy.vercel.app) — E-learning platform for African professionals
- Porfolio: [Digital-Business-Card] (https://digital-business-card-beta-opal.vercel.app/)

---

## 📄 License

This project was built as a Web3Bridge Cohort XIV final project submission.
