export function buildPRDPrompt(research: string) {
  return `
You are an expert Senior Product Manager.

Based on the following product research, generate a complete Product Requirements Document (PRD).

Research:
${research}

Return the output in Markdown.

The PRD must contain these sections:

# Executive Summary

# Product Vision

# Problem Statement

# Goals & Objectives

# Target Audience

# User Personas

# Functional Requirements

# Non Functional Requirements

# User Stories

# Acceptance Criteria

# User Flow

# Edge Cases

# Risks

# Success Metrics

# Future Scope

# Conclusion

Rules:

- Professional language.
- Use markdown headings.
- Use bullet points where appropriate.
- Use tables where useful.
- Don't explain your reasoning.
- Return ONLY markdown.
`;
}