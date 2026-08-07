<div align="center">

  <h1>⚡ BuilderOS</h1>

  <p><strong>The unified platform to plan, architect, and ship software products.</strong></p>
  <p>Streamline your entire product lifecycle — moving seamlessly from initial research and PRDs to visual system blueprints, strategic roadmaps, and task execution.</p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
    <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM" /></a>
    <a href="https://neon.tech"><img src="https://img.shields.io/badge/Neon-PostgreSQL-02E693?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon PostgreSQL" /></a>
    <a href="https://ai.google.dev"><img src="https://img.shields.io/badge/Google_Gemini-AI-8E44AD?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" /></a>
  </p>

  <p>
    <a href="https://builder-os-silk.vercel.app"><b>🌐 Live Demo</b></a> •
    <a href="#-quick-start"><b>🚀 Quick Start</b></a> •
    <a href="#-core-modules"><b>✨ Core Modules</b></a> •
    <a href="#-system-architecture"><b>📐 Architecture</b></a> •
    <a href="#-contributing"><b>🤝 Contributing</b></a>
  </p>

  <br />
</div>

---

## 📌 Overview

**BuilderOS** brings product strategy, system architecture, roadmaps, and sprint execution together into a single, unified workspace for software engineering teams.

It empowers developers, software architects, and tech leads to move seamlessly from raw concepts to **Product Requirement Documents (PRDs)**, **visual system architecture blueprints**, **strategic roadmaps**, and **drag-and-drop task delivery** through one streamlined workflow.

---

## ✨ Core Modules

### 1. 🗺️ Roadmap Hub & Strategic Planning Engine
* **Standalone & Project Roadmaps:** Create independent planning roadmaps or bind roadmaps directly to active development projects.
* **Instant 0ms Filtering:** Switch instantly between *All Roadmaps*, *Standalone*, *Project Roadmaps*, and *Completed* without network latency.
* **Interactive Checklist & Progress:** Track step-by-step milestone completion with real-time percentage indicators.
* **AI Concept Explainer:** Get instant AI explanations for any step or technical concept right inside the roadmap.
* **Curated AI Resources:** Automatically search and curate top documentation links, video tutorials, GitHub repos, and courses for your roadmap.
* **1-Click Project Conversion:** Seamlessly convert standalone roadmaps into full execution projects with dedicated task boards.

### 2. 📑 AI PRD & Product Discovery Studio
* **Automated Requirements Generation:** Generate detailed Product Requirement Documents (PRDs) containing feature specs, user stories, and acceptance criteria.
* **Custom PRD Input:** Synthesize custom technical requirements into structured documentation.

### 3. 📐 Visual System Architecture Generator
* **Mermaid.js Diagramming:** Automatically output interactive architecture diagrams (Microservices, Monolith, Serverless, Event-Driven).
* **Tech Stack Recommendations:** Receive AI-recommended backend, database, and infrastructure choices based on project scope.

### 4. ⚡ Task Execution & Kanban Board
* **Drag-and-Drop Interface:** Powered by `@dnd-kit` for responsive task management across *To Do*, *In Progress*, and *Done*.
* **Today's Focus & Overdue Tracking:** Instantly filter high-priority tasks and stay ahead of deadlines.
* **AI Task Generation:** Convert PRDs and roadmaps into granular actionable tasks automatically.

### 5. 🤖 AI Workspace & Multi-Source Intelligence
* **Multi-Model Assistant:** Integrated with Google Gemini AI for code generation, architecture advice, and product research.
* **Contextual Knowledge Integration:** Source context directly from active project files and research documents.

### 6. 📊 Real-Time Analytics & Team Collaboration
* **Velocity Metrics:** Monitor total project health, milestone completion rates, and sprint completion analytics.
* **Workspace Membership:** Invite team members, manage RBAC roles, and collaborate effortlessly.

---

## 📐 System Architecture

```mermaid
flowchart TB
    subgraph Client ["Client Layer (Browser)"]
        UI["React 19 / Next.js App Router"]
        FM["Framer Motion (60fps GPU Accelerated)"]
        DND["@dnd-kit Kanban Engine"]
    end

    subgraph API ["Application & Middleware"]
        NEXT["Next.js 16 Server Components & Routes"]
        AUTH["NextAuth.js (JWT Session Security)"]
        RETRY["Neon DB Cold-Start Resilience Layer"]
    end

    subgraph Data ["Data & AI Infrastructure"]
        PRISMA["Prisma ORM 6.19"]
        NEON[("Neon PostgreSQL Database")]
        GEMINI["Google Gemini AI Engine"]
    end

    UI --> NEXT
    NEXT --> AUTH
    NEXT --> RETRY
    RETRY --> PRISMA
    PRISMA --> NEON
    NEXT --> GEMINI
```

---

## 🔄 End-to-End Product Lifecycle Workflow

```mermaid
flowchart LR
    A[💡 Idea Discovery] --> B[🔍 AI Research]
    B --> C[📄 PRD Generation]
    C --> D[🗺️ Strategic Roadmap]
    D --> E[📐 System Architecture]
    E --> F[📋 Task Kanban]
    F --> G[🚀 Production Shipping]
```

---

## 💻 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| **UI Library** | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) (Hardware Accelerated) |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech/) |
| **ORM** | [Prisma 6.19](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) |
| **AI Intelligence** | [Google Gemini AI SDK](https://ai.google.dev/) |
| **Diagrams** | [Mermaid.js](https://mermaid.js.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |

---

## ⚡ Performance & Mobile Optimizations

* **Sub-Second Rendering:** Consolidated server-side Prisma queries down to single-trip relational fetches.
* **Instant 0ms Client Filtering:** React `useMemo` in-memory filtering for zero-latency tab switching.
* **Neon DB Cold-Start Resilience:** Built-in auto-retry layer to handle serverless pooler wakeups gracefully without crashing.
* **60fps Mobile Performance:** Hardware-accelerated CSS transforms (`transform-gpu`) and touch-optimized hit targets (`touch-manipulation`).

---

## 🚀 Quick Start

### Prerequisites
* **Node.js** `v20.x` or higher
* **npm** `v10.x` or higher
* **PostgreSQL Database** (Neon or Local instance)

### 1. Clone & Install
```bash
git clone https://github.com/aryandhiman01/Builder_OS.git
cd Builder_OS
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@ep-your-database-pooler.us-east-1.aws.neon.tech/builder_os?sslmode=require"
NEXTAUTH_SECRET="your-super-secret-nextauth-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-google-gemini-api-key"
RESEND_API_KEY="your-resend-api-key"
```

### 3. Database Initialization
```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to launch BuilderOS.

---

## 📂 Project Structure

```text
Builder_OS/
├── .github/                  # Issue templates, PR templates, Security & Guidelines
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CONTRIBUTING.md
│   ├── CODE_OF_CONDUCT.md
│   └── SECURITY.md
├── app/                      # Next.js 16 App Router (Pages & API Routes)
│   ├── api/                  # REST API Endpoints (Roadmaps, Tasks, AI, Projects)
│   ├── roadmaps/             # Roadmap Hub & Detail Views
│   ├── projects/             # Project Management & Architecture Studio
│   ├── dashboard/            # Real-Time Analytics Dashboard
│   └── ai-workspace/         # Multi-Source AI Assistant
├── components/               # Modular UI Components
│   ├── roadmaps/             # Roadmap Filters, Cards, Header & Modals
│   ├── ui/                   # Reusable Design Primitives & Confirm Dialogs
│   ├── architecture/         # Mermaid Architecture Viewers
│   └── tasks/                # Drag & Drop Kanban Boards
├── lib/                      # Core Utilities, Prisma Client & Auth Config
├── prisma/                   # Database Schema (`schema.prisma`)
└── public/                   # Static Brand Assets
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](.github/CONTRIBUTING.md) and [Code of Conduct](.github/CODE_OF_CONDUCT.md) before submitting Pull Requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Run verification checks (`npx tsc --noEmit`)
4. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

---

## 🛡️ Security

If you discover any security issues, please review our [Security Policy](.github/SECURITY.md) and report them confidentially via [GitHub Security Advisories](https://github.com/aryandhiman01/Builder_OS/security/advisories/new).

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/aryandhiman01">Aryan Dhiman</a> & the BuilderOS Community.
</p>
