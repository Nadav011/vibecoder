// ================================
// PLUGINS - Claude Code plugins and external tools
// ================================

import type { Plugin } from "./types";

export const PLUGINS: Plugin[] = [
  {
    id: "ralph-loop",
    name: "Ralph Loop",
    description: "לולאות איטרציה אוטומטיות",
    commands: [
      {
        id: "ralph-loop",
        command: "/ralph-loop",
        description: "התחלת Ralph Loop",
      },
      {
        id: "cancel-ralph",
        command: "/cancel-ralph",
        description: "ביטול לולאה פעילה",
      },
    ],
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Deployment לVercel",
    commands: [
      {
        id: "vercel-setup",
        command: "/vercel setup",
        description: "הגדרת Vercel CLI",
      },
      {
        id: "vercel-deploy",
        command: "/vercel deploy",
        description: "deployment לVercel",
      },
      {
        id: "vercel-logs",
        command: "/vercel logs",
        description: "צפייה ב-logs",
      },
    ],
  },
  {
    id: "code-review",
    name: "Code Review",
    description: "סקירת קוד",
    commands: [
      {
        id: "code-review",
        command: "/code-review",
        description: "Code review על PR",
      },
    ],
  },
  {
    id: "github",
    name: "GitHub (MCP)",
    description: "שילוב עם GitHub API",
    commands: [
      { id: "gh-pr", command: "gh pr", description: "פעולות Pull Request" },
      { id: "gh-issue", command: "gh issue", description: "ניהול Issues" },
      {
        id: "gh-actions",
        command: "gh actions",
        description: "ניהול GitHub Actions",
      },
    ],
  },
  {
    id: "commit-commands",
    name: "commit-commands",
    description: "פקודות Git מתקדמות",
    commands: [
      { id: "commit-cmd", command: "/commit", description: "יצירת commit" },
      {
        id: "commit-push-pr-cmd",
        command: "/commit-push-pr",
        description: "Atomic flow: commit → push → PR",
      },
      {
        id: "clean-gone",
        command: "/clean_gone",
        description: "מחיקת branches שנמחקו מremote",
      },
    ],
  },
  {
    id: "typescript-lsp",
    name: "TypeScript LSP",
    description: "TypeScript Language Server",
    commands: [
      { id: "ts-check", command: "tsc --noEmit", description: "בדיקת טייפים" },
      { id: "ts-watch", command: "tsc --watch", description: "מצב צפייה" },
    ],
  },
  {
    id: "playwright",
    name: "Playwright (MCP)",
    description: "Browser automation",
    commands: [
      {
        id: "pw-navigate",
        command: "browser_navigate",
        description: "ניווט לURL",
      },
      {
        id: "pw-snapshot",
        command: "browser_snapshot",
        description: "צילום מצב נגישות",
      },
      {
        id: "pw-screenshot",
        command: "browser_take_screenshot",
        description: "צילום מסך",
      },
      {
        id: "pw-click",
        command: "browser_click",
        description: "לחיצה על אלמנט",
      },
      { id: "pw-type", command: "browser_type", description: "הקלדת טקסט" },
      {
        id: "pw-console",
        command: "browser_console_messages",
        description: "הודעות console",
      },
    ],
  },
  {
    id: "context7",
    name: "Context7 (MCP)",
    description: "תיעוד ספריות עדכני",
    commands: [
      {
        id: "c7-resolve",
        command: "resolve-library-id",
        description: "מציאת library ID",
      },
      {
        id: "c7-query",
        command: "query-docs",
        description: "שליפת documentation",
      },
    ],
  },
  {
    id: "frontend-design",
    name: "Frontend Design",
    description: "יצירת UI components",
    commands: [
      {
        id: "fd-design",
        command: "/frontend-design",
        description: "יצירת קומפוננט UI",
      },
    ],
  },
];
