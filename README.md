<h1 align="center">Builder OS</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma" alt="Prisma 6" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Gemini-AI-8A2BE2?style=for-the-badge" alt="Gemini AI" />
</p>

<p align="center">
  <a href="#installation"><img src="https://img.shields.io/badge/Setup-Quick%20Start-4CAF50?style=for-the-badge" alt="Quick Start" /></a>
  <a href="#workflow-example"><img src="https://img.shields.io/badge/Workflow-Product%20Lifecycle-FF6B6B?style=for-the-badge" alt="Workflow" /></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Stack-Modern%20AI%20Stack-00BFA5?style=for-the-badge" alt="Tech Stack" /></a>
</p>

<p align="center">
  Builder OS is an AI-native workspace for turning ambitious ideas into structured product outcomes. It helps teams move from discovery and research to PRDs, roadmaps, architecture, execution, and collaboration through one intelligent workflow.
</p>

> Builder OS brings strategy, planning, and delivery together in a single unified workspace for modern product teams.

## Why Builder OS

Builder OS turns a product idea into a working delivery system by combining:

<p align="center">
  <img src="https://img.shields.io/badge/AI-Research%20%26%20PRD-9C27B0?style=flat-square" alt="AI Research and PRD" />
  <img src="https://img.shields.io/badge/Roadmaps-Planning-03A9F4?style=flat-square" alt="Roadmaps" />
  <img src="https://img.shields.io/badge/Architecture-Visual-FF9800?style=flat-square" alt="Architecture" />
  <img src="https://img.shields.io/badge/Collaboration-Team-4CAF50?style=flat-square" alt="Team Collaboration" />
</p>

- AI-assisted research and product discovery
- Product requirements document generation
- Roadmap planning
- Technical architecture generation
- Project and task management
- Team collaboration with invitations and membership roles
- Real-time dashboard analytics and activity tracking

## Product Workflow

```mermaid
flowchart LR
    A[User creates project] --> B[Dashboard overview]
    B --> C[AI Workspace]
    C --> D[Research]
    D --> E[PRD]
    E --> F[Roadmap]
    F --> G[Architecture]
    G --> H[Tasks + Delivery]
    H --> I[Team collaboration]
```

## Core AI Pipeline

```mermaid
flowchart TD
    P[Project Idea] --> R[Generate Research]
    R --> PRD[Generate PRD]
    PRD --> RM[Generate Roadmap]
    RM --> ARC[Generate Architecture]
    ARC --> T[Task Breakdown and Execution]
```

## System Architecture

```mermaid
flowchart TB
    U[User Browser] --> N[Next.js App Router]
    N --> A[Auth & Session Layer]
    N --> P[Project APIs]
    N --> AI[AI Workspace APIs]
    P --> DB[(PostgreSQL via Prisma)]
    AI --> GEN[Gemini AI Generation Services]
    GEN --> DOCS[Research / PRD / Roadmap / Architecture Documents]
    DB --> R[Dashboard Stats, Projects, Tasks, Invites]
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth
- Gemini AI model integration
- Tailwind CSS
- Radix UI + shadcn-style primitives
- Resend for email delivery
- Mermaid rendering for architecture diagrams and docs

## Monorepo-Style Structure

```text
app/                   # App Router pages and API routes
components/            # UI components for landing, dashboard, tasks, AI workspace and architecture
hooks/                 # Reusable client hooks
lib/                   # Auth, AI prompt builders, Mermaid utilities, prisma client
prisma/                # Database schema and migrations
services/              # Service layer for auth, API, project and AI operations
store/                 # Redux slices and global state
types/                 # Shared TS interfaces
public/                # Static assets
```

## Main Features

### 1. Project-based workspaces
Create, update, and organize products with status, color tagging, and collaboration members.

### 2. AI asset generation
Generate the following artifacts from prompt-driven workflows:

- Research
- PRD
- Roadmap
- Architecture
- Documents

### 3. Collaboration
Invite teammates, manage project memberships, and send onboarding emails through a secure project flow.

### 4. Dashboard intelligence
Track project counts, task states, AI request volume, and overall completion percentage in real time.

### 5. Visual docs and diagrams
Use Mermaid-based architecture rendering and structured roadmap outputs for better team comprehension.

## Installation

<p align="center">
  <img src="https://img.shields.io/badge/Step%201-Clone%20Repo-6D28D9?style=flat-square" alt="Clone repo" />
  <img src="https://img.shields.io/badge/Step%202-Install%20Deps-2563EB?style=flat-square" alt="Install dependencies" />
  <img src="https://img.shields.io/badge/Step%203-Configure%20Env-F59E0B?style=flat-square" alt="Configure env" />
</p>

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Configure your environment variables in a `.env` file.

### Required environment variables

```env
DATABASE_URL=postgresql://... 
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_API_KEY=your-gemini-key
RESEND_API_KEY=your-resend-key
```

## Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

## Run the Application

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Workflow Example

A typical Builder OS session looks like this:

1. Create a new project.
2. Open the AI workspace.
3. Ask for market, customer, or technical research.
4. Convert that research into a PRD.
5. Generate a roadmap from the PRD.
6. Build a system architecture and review Mermaid output.
7. Track execution through tasks and dashboard metrics.

## API and App Layer Notes

The repository uses the App Router and exposes application logic through route handlers such as:

- `/api/ai/*`
- `/api/projects/*`
- `/api/dashboard/*`
- `/api/auth/*`
- `/api/invitations/*`

These APIs coordinate database persistence, AI generation, and the UI state that powers the dashboard and project pages.

## Recommended Development Flow

```mermaid
flowchart LR
    A[Design idea] --> B[Create project]
    B --> C[Research]
    C --> D[PRD]
    D --> E[Roadmap]
    E --> F[Architecture]
    F --> G[Tasks]
    G --> H[Review + ship]
```

## Contribution

Contributions are welcome. If you extend the AI generation pipeline or improve the app experience, keep changes aligned with the existing project abstractions:

- Keep prompts and generation services isolated in `lib/ai`
- Keep route logic under `app/api`
- Keep page-level UI under `app/` and reusable UI under `components/`
- Make schema changes through Prisma and migration files

## License

This project is currently structured as an internal product workspace. Please confirm your own licensing and deployment policy before production use.

