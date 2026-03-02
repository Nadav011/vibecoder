// ================================
// SKILLS SUMMARY - All 40 Skills Data (v24.7.0)
// Source of truth: ~/.claude/settings.json
// Updated: 2026-02-25
// ================================

import type { SkillSummary } from "./types";

// Pipeline Skills — ordered by workflow phase (0-19)
export const PIPELINE_SKILLS: SkillSummary[] = [
  {
    number: 0,
    name: "project-detect",
    phase: "-1",
    role: "Project Detector",
    keyCommands: ["/detect", "/project-type"],
  },
  {
    number: 1,
    name: "apex-prime",
    phase: "0 + 4",
    role: "Supreme Quality Guardian",
    keyCommands: ["/prime scan", "/prime audit", "/prime certify"],
  },
  {
    number: 2,
    name: "project-align",
    phase: "0.5",
    role: "Project Alignment Engine",
    keyCommands: ["/project-align", "/align"],
  },
  {
    number: 3,
    name: "apex-init",
    phase: "1",
    role: "System Bootstrapper",
    keyCommands: ["/apex-init new [name]", "/apex-init phase [1-5]"],
  },
  {
    number: 4,
    name: "pwa-expert",
    phase: "2.4",
    role: "PWA Expert",
    keyCommands: ["/pwa scan", "/pwa setup", "/pwa audit"],
  },
  {
    number: 5,
    name: "apex-sec",
    phase: "2.5",
    role: "Security Sentinel",
    keyCommands: ["/sec audit", "/sec rls", "/sec headers", "/sec owasp"],
  },
  {
    number: 6,
    name: "rtl-validator",
    phase: "2.6",
    role: "RTL Enforcer",
    keyCommands: ["/rtl", "/rtl audit", "/rtl fix"],
  },
  {
    number: 7,
    name: "apex-coverage",
    phase: "3",
    role: "Coverage Enforcer",
    keyCommands: ["/coverage", "/coverage report", "/coverage --risk"],
  },
  {
    number: 8,
    name: "integration-test",
    phase: "3.3",
    role: "Integration Test Executor",
    keyCommands: ["/integration-test run", "/integration-test contract"],
  },
  {
    number: 9,
    name: "db-perf",
    phase: "3.35",
    role: "Database Performance Analyst",
    keyCommands: ["/db-perf audit", "/db-perf explain [query]", "/db-perf indexes"],
  },
  {
    number: 10,
    name: "race-test",
    phase: "3.4",
    role: "Race Condition Detector",
    keyCommands: ["/race-test scan", "/race-test double-submit"],
  },
  {
    number: 11,
    name: "verify-app",
    phase: "3.5",
    role: "E2E Verification Agent",
    keyCommands: ["/verify-app", "/verify-app flow [name]"],
  },
  {
    number: 12,
    name: "visual-regression",
    phase: "3.55",
    role: "Visual Regression Guardian",
    keyCommands: ["/visual-regression run", "/visual-regression component [name]"],
  },
  {
    number: 13,
    name: "perf-expert",
    phase: "3.6",
    role: "Supreme Performance Guardian",
    keyCommands: ["/perf", "/perf lighthouse", "/perf bundle", "/perf vitals"],
  },
  {
    number: 14,
    name: "load-test",
    phase: "3.7",
    role: "Load Test Executor",
    keyCommands: ["/load-test run", "/load-test stress", "/load-test spike"],
  },
  {
    number: 15,
    name: "resilience-test",
    phase: "3.8",
    role: "Resilience Test Executor",
    keyCommands: ["/resilience-test run", "/resilience-test offline"],
  },
  {
    number: 16,
    name: "browserstack",
    phase: "3.85",
    role: "Real Device Testing Guardian",
    keyCommands: ["/browserstack", "/browserstack a11y", "/browserstack percy"],
  },
  {
    number: 17,
    name: "test-mega",
    phase: "3.9",
    role: "Master Test Orchestrator",
    keyCommands: ["/test-mega", "/test-mega quick", "/test-mega report"],
  },
  {
    number: 18,
    name: "meta-reflect",
    phase: "4.5",
    role: "Metacognitive Reflector",
    keyCommands: ["/reflect"],
  },
  {
    number: 19,
    name: "apex-git",
    phase: "5",
    role: "Deployment Guardian",
    keyCommands: ["/git commit", "/git push", "/git pr", "/git status --omega"],
  },
];

// Reference Skills — AUTO phase, alphabetical (20-39)
export const REFERENCE_SKILLS: SkillSummary[] = [
  {
    number: 20,
    name: "a11y",
    phase: "AUTO",
    role: "Accessibility Specialist",
    keyCommands: ["/a11y", "/a11y audit", "/a11y test"],
  },
  {
    number: 21,
    name: "agent-audit",
    phase: "AUTO",
    role: "Agent Self-Auditor",
    keyCommands: ["/agent-audit", "/agent-audit --full"],
  },
  {
    number: 22,
    name: "ai-rules",
    phase: "AUTO",
    role: "AI Rules Reference",
    keyCommands: ["/ai-rules"],
  },
  {
    number: 23,
    name: "apex-core-rules",
    phase: "AUTO",
    role: "APEX Core Rules",
    keyCommands: ["/apex-core-rules"],
  },
  {
    number: 24,
    name: "apex-guards",
    phase: "AUTO",
    role: "Behavioral Guard",
    keyCommands: ["/apex-guards"],
  },
  {
    number: 25,
    name: "audit-antipatterns",
    phase: "AUTO",
    role: "Antipattern Auditor",
    keyCommands: ["/audit-antipatterns", "/audit-antipatterns scan"],
  },
  {
    number: 26,
    name: "backend-rules",
    phase: "AUTO",
    role: "Backend Rules Reference",
    keyCommands: ["/backend-rules"],
  },
  {
    number: 27,
    name: "cross-model-sync",
    phase: "AUTO",
    role: "Cross-Model Bridge",
    keyCommands: ["/sync-agents", "/cross-model-status"],
  },
  {
    number: 28,
    name: "devops-rules",
    phase: "AUTO",
    role: "DevOps Rules Reference",
    keyCommands: ["/devops-rules"],
  },
  {
    number: 29,
    name: "flutter-audit",
    phase: "AUTO",
    role: "Flutter Antipattern Auditor",
    keyCommands: ["/flutter-audit", "/flutter-audit scan"],
  },
  {
    number: 30,
    name: "flutter-rules",
    phase: "AUTO",
    role: "Flutter Rules Reference",
    keyCommands: ["/flutter-rules"],
  },
  {
    number: 31,
    name: "frontend-rules",
    phase: "AUTO",
    role: "Frontend Rules Reference",
    keyCommands: ["/frontend-rules"],
  },
  {
    number: 32,
    name: "mobile-mastery",
    phase: "AUTO",
    role: "Mobile Mastery Specialist",
    keyCommands: ["/mobile-mastery", "/mobile-mastery capacitor"],
  },
  {
    number: 33,
    name: "mobile-upgrade-2026",
    phase: "AUTO",
    role: "Mobile Upgrade Tracker",
    keyCommands: ["/mobile-upgrade-2026"],
  },
  {
    number: 34,
    name: "nextjs-patterns",
    phase: "AUTO",
    role: "Next.js Framework Patterns",
    keyCommands: ["/nextjs patterns"],
  },
  {
    number: 35,
    name: "owasp-security",
    phase: "AUTO",
    role: "OWASP Security Advisor",
    keyCommands: [],
  },
  {
    number: 36,
    name: "reflection-seeds",
    phase: "AUTO",
    role: "Reflection Seed Capture",
    keyCommands: ["/reflect-seeds"],
  },
  {
    number: 37,
    name: "security-rules",
    phase: "AUTO",
    role: "Security Rules Reference",
    keyCommands: ["/security-rules"],
  },
  {
    number: 38,
    name: "skill-extractor",
    phase: "AUTO",
    role: "Skill Extractor",
    keyCommands: ["/extract-skill"],
  },
  {
    number: 39,
    name: "testing-rules",
    phase: "AUTO",
    role: "Testing Rules Reference",
    keyCommands: ["/testing-rules"],
  },
];

// Combined Skills Summary (all 40 skills)
export const SKILLS_SUMMARY: SkillSummary[] = [
  ...PIPELINE_SKILLS,
  ...REFERENCE_SKILLS,
];

// Backward compatibility — existing code imports these names
export const WEB_SKILLS = SKILLS_SUMMARY;
export const FLUTTER_SKILLS: SkillSummary[] = [];
