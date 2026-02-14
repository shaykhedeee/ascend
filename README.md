# 🚀 ASCEND - AI-Powered Life Transformation System

<div align="center">
  <img src="public/icons/icon.svg" alt="ASCEND Logo" width="120" height="120" />
  <br />
  <strong>Rise to Your Potential</strong>
  <br />
  <em>Intelligent goal decomposition, habit tracking, and gamified progress</em>
</div>

---

## ✨ Features

### 🎯 AI Goal Decomposition
- Transform any life goal into actionable steps
- Automatic breakdown: Ultimate Goal → Milestones → Weekly Objectives → Daily Tasks
- Works with or without OpenAI API (smart mock fallback)

### 📊 Habit Tracking
- Create and track daily/weekly habits
- Visual progress with streaks and completion rates
- Heatmap calendar view

### 🎮 Gamification System
- Earn XP for completing tasks and habits
- Level up with meaningful titles
- Achievement badges and streak rewards

### 📅 Interactive Calendar
- Monthly view of all activities
- Track perfect days and streaks
- Visual completion indicators

### 🌙 Dark/Light Theme
- Beautiful dark mode by default
- Easy toggle in header
- Theme persists across sessions

### 💾 Data Management
- Export data to JSON backup
- Generate PDF progress reports
- Import backups to restore data

### 📱 Progressive Web App (PWA)
- Install on mobile or desktop
- Offline-capable (static content)
- Native app-like experience

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand (localStorage persistence)
- **Charts:** Recharts
- **Icons:** Lucide React
- **PDF Generation:** jsPDF + jspdf-autotable
- **AI:** OpenAI API (optional)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ascend.git
cd ascend

# Install dependencies
npm install

# Create environment file (optional - for AI features)
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# OpenAI API Key (Optional)
# If not provided, the app will use intelligent mock templates for goal decomposition
NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
```

**Note:** The app works fully without an API key. The AI goal decomposer will generate smart templates based on goal categories.

---

## 📦 Production Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard (if using OpenAI)
4. Deploy!

### Deploy to Other Platforms

The app exports as static files when possible. For other platforms:

```bash
# Build the app
npm run build

# The .next folder contains the build output
# For static export (if needed):
# Add "output": "export" to next.config.js
```

### Docker Deployment

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles & CSS variables
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main app page
│   └── manifest.ts      # PWA manifest route
├── components/
│   ├── AddHabitModal.tsx    # Create new habits
│   ├── Analytics.tsx        # Stats & charts
│   ├── CalendarView.tsx     # Monthly calendar
│   ├── GoalWizard.tsx       # AI goal setup
│   ├── HabitGrid.tsx        # Habit tracking grid
│   ├── Header.tsx           # Navigation header
│   ├── Onboarding.tsx       # New user flow
│   ├── SettingsModal.tsx    # App settings
│   ├── ThemeProvider.tsx    # Theme context
│   ├── Toast.tsx            # Notifications
│   └── TodaysTasks.tsx      # Daily task list
├── lib/
│   ├── ai-goal-decomposer.ts  # AI goal breakdown
│   ├── export.ts              # Data export utils
│   ├── store.ts               # Zustand store
│   └── utils.ts               # Helper functions
└── types/
    └── index.ts             # TypeScript types
```

---

## 🧪 Testing the App

1. **Onboarding:** First launch shows goal setup wizard
2. **Dashboard:** View stats, today's tasks, habits
3. **Goals Tab:** Manage goals and milestones
4. **Habits Tab:** Track daily habits with streaks
5. **Analytics Tab:** Charts and progress insights
6. **Calendar Tab:** Monthly activity view
7. **Settings:** Export data, view profile

---

## 🎨 Customization

### Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --ascend-primary: #14B899;  /* Main accent color */
  --gold-primary: #F59E0B;    /* Secondary accent */
  --background: #0A0A0B;      /* Dark background */
}
```

### Add New Goal Categories

Edit `src/lib/ai-goal-decomposer.ts` to add templates for new categories.

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

<div align="center">
  <strong>Built with ❤️ using Next.js and AI</strong>
  <br />
  <em>Start your transformation journey today</em>
</div>
