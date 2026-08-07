# 🚀 Contributing to BuilderOS

Thank you for your interest in contributing to **BuilderOS**! We welcome contributions from developers of all skill levels.

---

## 🛠️ Development Setup & Prerequisites

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **PostgreSQL Database**: Neon PostgreSQL database or local PostgreSQL instance

### Quickstart Guide

1. **Fork & Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Builder_OS.git
   cd Builder_OS
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Sync Prisma Database Schema**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start Local Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📐 Development & Code Style Guidelines

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS v4 + Vanilla CSS + Framer Motion
- **Icons**: Lucide React (`lucide-react`)
- **State & Data**: React Hooks + Redux Toolkit / React Query

### Code Quality Rules
1. **Zero Errors**: Always run `npx tsc --noEmit` before submitting a PR.
2. **Mobile First & Responsive**: Ensure components look pristine on both mobile phones and desktop displays.
3. **Hardware Acceleration**: Use GPU-accelerated CSS classes (`transform-gpu`) for animations to guarantee smooth 60fps performance.

---

## 🔄 Pull Request Workflow

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m 'feat: add amazing feature'`
3. Run verification checks:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request on GitHub targeting the `main` branch.

Thank you for building the future of product development with BuilderOS! 🎉
