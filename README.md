# Assessment Monitor – Professional Secure Evaluation Platform

A high-performance React + TypeScript application designed for secure technical assessments with real-time proctoring, event logging, and full-screen enforcement. Built with a focus on security, extensibility, and modern UI/UX.

🔗 **Live Demo:** [https://assessment-monitor.vercel.app/](https://assessment-monitor.vercel.app/)

🚀 **Tech Stack**

**Frontend**
- React 18/19 + TypeScript
- Bun / Vite
- TailwindCSS
- Lucide React
- Radix UI (Shadcn/UI components)
- HSL Mesh Gradients for background

**Backend & Services**
- Supabase (Backend as a Service)
- Real-time Event Logging
- Persistent Session Management
- Security Services (Lockdown & Timer)

✨ **Features**

**Secure Assessment Environment**
- Full-screen lockdown enforcement.
- Real-time monitoring of tab switching and focus loss.
- Automatic copy, paste, and right-click disabling.
- DevTools access logging and prevention.

**Dynamic Assessment Interface**
- Immersive full-page question experience with optimized typography.
- Smart "Question Palette" for quick navigation.
- Color-coded question status (Answered, Marked as Doubt, Current).
- Professional animated mesh gradient background.

**Multi-Stack Support**
- Pre-configured sets for:
  - Frontend Development
  - Backend Architecture
  - SQL Management
  - Devops Engineering
  - Android/IOS Development
- Support for Easy, Medium, and Hard difficulty levels.

**Results & Analytics**
- Real-time timer with auto-submit functionality.
- Professional submission summary with time-taken and performance metrics.
- Secure event logs stored in Supabase for audit trails.

🧩 **Extensibility – How to Add New Stacks**
This application is context-driven and easy to extend.

**Step 1: Add a Stack**
Open `src/contexts/AssessmentContext.tsx` and add a new entry to the `MOCK_QUESTIONS` record with your question objects.

**Step 2: Update Start Page**
Add the new stack to the `Select` component in `src/components/StartPage.tsx`.

**Step 3: Done**
The application automatically handles the routing, timer initialization, and proctoring for the new stack.

🛠️ **Setup Instructions**

**Prerequisites**
- Node.js ≥ 20 or Bun ≥ 1.1

**Installation**
```bash
bun install
# or
npm install
```

**Development**
```bash
bun dev
# or
npm run dev
```

**Production Build**
```bash
bun run build
# or
npm run build
```

📌 **Design Decisions & Assumptions**
- **Security First**: Proctoring events are logged optimistically to ensure data integrity even on network failure.
- **Glassmorphism**: UI uses backdrop blurs and semi-transparent layers for a premium, modern feel.
- **Client-Side Heavy**: Most assessment logic is handled via Context API to minimize latency during sessions.

🧪 **Backend**
A real Supabase backend is used for logging and session persistence.

📬 **Submission**
- **GitHub Repo:** [https://github.com/Dharshini231001/assessment-monitor/](https://github.com/Dharshini231001/assessment-monitor/)
- **Live URL:** [https://assessment-monitor.vercel.app/](https://assessment-monitor.vercel.app/)
