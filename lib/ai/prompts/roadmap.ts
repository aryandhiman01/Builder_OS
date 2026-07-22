export function buildRoadmapPrompt(prd: string) {
  return `
You are an expert Senior Product Manager, Technical Program Manager, and Software Architect.

Your task is to analyze the following Product Requirements Document (PRD) and generate a comprehensive software development roadmap.

The roadmap should be structured, implementation-focused, and suitable for engineering teams.

The roadmap must be written in clean Markdown.

---

# Product Requirements Document

${prd}

---

Generate the roadmap using the following structure.

# 🚀 Development Roadmap

## 1. Executive Summary

- Brief overview of the product
- Business goal
- Technical objective

---

## 2. Development Phases

Break the project into logical phases.

For every phase provide:

- Objective
- Estimated Duration
- Deliverables
- Dependencies
- Risks

Example:

Phase 1 — Planning

Phase 2 — UI/UX

Phase 3 — Backend

Phase 4 — AI Integration

Phase 5 — Testing

Phase 6 — Deployment

---

## 3. Sprint Planning

Create sprint-wise execution.

Each sprint should include:

Sprint Name

Duration

Tasks

Expected Deliverables

Acceptance Criteria

---

## 4. Milestones

Generate major milestones with expected completion order.

---

## 5. Team Responsibilities

Break responsibilities into:

Product Manager

Frontend Engineer

Backend Engineer

AI Engineer

DevOps Engineer

QA Engineer

UI/UX Designer

---

## 6. Technology Stack

Recommend:

Frontend

Backend

Database

Authentication

Cloud

AI Models

Caching

Storage

CI/CD

Monitoring

Analytics

---

## 7. Feature Priority Matrix

Categorize features into

Must Have

Should Have

Could Have

Future Enhancements

---

## 8. Risk Analysis

Technical Risks

Business Risks

Operational Risks

Security Risks

Scalability Risks

Mitigation Strategies

---

## 9. Success Metrics

KPIs

Performance Metrics

Business Metrics

Engineering Metrics

---

## 10. Deployment Strategy

Development

Staging

Production

Rollback Strategy

Monitoring Strategy

---

## 11. Estimated Timeline

Generate a week-wise timeline.

Week 1

Week 2

Week 3

...

Until project completion.

---

## 12. Final Recommendations

Provide implementation recommendations, scalability suggestions, and best practices.

---

Guidelines:

- Return ONLY Markdown.
- Do NOT wrap output inside triple backticks.
- Use headings, tables, and bullet points where appropriate.
- Make the roadmap detailed and production-ready.
`;
}