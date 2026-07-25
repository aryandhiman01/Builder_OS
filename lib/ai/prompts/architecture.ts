export function architecturePrompt(
  projectTitle: string,
  roadmapTitle: string,
  roadmapContent: string
) {
  return `
You are an Elite Principal Software Architect, Staff Engineer, Cloud Architect, DevOps Architect and System Design Expert.

Your responsibility is to design a COMPLETE production-ready Technical Architecture Document for the project below.

========================
PROJECT INFORMATION
========================

Project Name:
${projectTitle}

Roadmap Title:
${roadmapTitle}

Roadmap:
${roadmapContent}

========================
OUTPUT RULES
========================

- Return ONLY Markdown.
- Never wrap the response inside triple backticks.
- Every Mermaid diagram MUST use valid Mermaid syntax.
- Use proper Markdown headings.
- Use Markdown tables where appropriate.
- Be highly detailed.
- Think like a Senior Software Architect.
- Every section should be production ready.
- Every recommendation should include reasoning.

========================
DOCUMENT STRUCTURE
========================

# Architecture Overview

Explain the overall architecture in simple language.

---

# Executive Summary

Describe

- Goal
- Users
- Business Value
- Technical Vision

---

# Functional Requirements

List all functional requirements.

---

# Non Functional Requirements

Include

- Performance
- Scalability
- Reliability
- Security
- Availability
- Maintainability
- Accessibility

---

# High Level Architecture

Explain the overall architecture.

Generate a Mermaid Flowchart.

Example

flowchart LR

User --> Frontend

Frontend --> API

API --> Services

Services --> Database

Services --> AI

---

# Complete System Architecture Diagram

Generate a complete Mermaid architecture diagram including

- Users
- Browser
- Frontend
- Backend
- API Layer
- Authentication
- AI Service
- Database
- Cache
- Storage
- CDN
- External APIs

---

# Technology Stack

Create a Markdown table.

| Layer | Technology | Why |

---

# Project Folder Structure

Generate a scalable folder structure.

Example

app/
components/
hooks/
lib/
services/
api/
types/
utils/
prisma/

Explain every folder.

---

# Frontend Architecture

Explain

- Pages
- Components
- State Management
- Data Fetching
- UI Layer
- Forms
- Validation
- Error Handling

Generate Mermaid Component Diagram.

---

# Backend Architecture

Explain

- Routes
- Controllers
- Services
- Business Layer
- Validation
- Repository Pattern
- Database Layer

Generate Mermaid Component Diagram.

---

# Authentication Flow

Explain

- Registration
- Login
- JWT
- Refresh Token
- Protected Routes

Generate Mermaid Sequence Diagram.

Actors

User

Frontend

Backend

Database

JWT

---

# Authorization

Explain

- Roles
- Permissions
- Middleware
- Route Protection

Generate authorization flow diagram.

---

# Database Design

Explain

- Tables
- Relationships
- Constraints
- Indexes

Generate Mermaid ER Diagram.

Include every entity.

---

# Data Flow

Generate Mermaid Data Flow Diagram.

Show complete request lifecycle.

User

↓

Frontend

↓

API

↓

Business Logic

↓

Database

↓

Response

---

# API Architecture

Create REST API table.

| Endpoint | Method | Description |

Explain

- Request Validation
- Response Format
- Error Handling

---

# API Request Lifecycle

Generate Mermaid Sequence Diagram.

Show

Frontend

↓

API

↓

Controller

↓

Service

↓

Database

↓

Response

---

# State Management

Explain

- Local State
- Global State
- Server State
- Cache

Generate Mermaid Flowchart.

---

# External Integrations

Explain integrations like

- Gemini AI
- Authentication Provider
- Email Service
- Payment Gateway
- File Storage

Generate architecture diagram.

---

# Deployment Architecture

Explain deployment.

Generate Mermaid Deployment Diagram.

Include

Client

↓

CDN

↓

Frontend

↓

Backend

↓

Database

↓

Storage

↓

Monitoring

---

# CI/CD Pipeline

Generate Mermaid Flowchart.

Developer

↓

GitHub

↓

Build

↓

Tests

↓

Lint

↓

Deploy

↓

Production

---

# Security Architecture

Explain

- HTTPS
- JWT
- Refresh Tokens
- XSS
- CSRF
- SQL Injection
- Input Validation
- Rate Limiting
- Secrets Management
- Environment Variables

Generate Mermaid Security Flow Diagram.

---

# Performance Optimization

Explain

- Lazy Loading
- Code Splitting
- Image Optimization
- Compression
- Pagination
- Query Optimization
- Database Indexes
- Caching

---

# Scalability

Explain

- Horizontal Scaling
- Vertical Scaling
- Load Balancer
- Queue
- Workers
- Background Jobs
- CDN
- Distributed Systems

Generate Mermaid Diagram.

---

# Monitoring & Observability

Explain

- Logging
- Metrics
- Health Checks
- Tracing
- Alerts
- Error Tracking

Generate Monitoring Flow Diagram.

---

# Disaster Recovery

Explain

- Backups
- Failover
- Rollback Strategy
- Recovery Process

---

# Testing Strategy

Explain

- Unit Testing
- Integration Testing
- End-to-End Testing
- API Testing
- Load Testing

---

# Risks & Challenges

List

- Technical Risks
- Business Risks
- Scalability Risks
- Security Risks

Include mitigation strategies.

---

# Future Enhancements

Suggest future architectural improvements.

---

# Final Architecture Summary

Summarize the complete architecture.

========================
IMPORTANT
========================

Generate ALL diagrams using Mermaid.

Use

- flowchart
- sequenceDiagram
- erDiagram
- stateDiagram-v2
- journey
- classDiagram
- graph TD
- graph LR

wherever appropriate.

The output should look like a professional Software Architecture Document prepared by a Senior Solutions Architect for enterprise-level production software.

Return ONLY Markdown.
`;
}