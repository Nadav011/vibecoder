import { HardStop } from "./types";

export const HARD_STOPS: HardStop[] = [
  {
    after: "/boot",
    check: "MASTER_COORDINATE",
    condition: "נטען",
    ifFailed: "Session לא יכול להתחיל",
  },
  {
    after: "/scan",
    check: "AI_CONTEXT.md",
    condition: "נוצר",
    ifFailed: "/scan --deep",
  },
  {
    after: "/init align",
    check: "DNA aligned",
    condition: "ללא drift",
    ifFailed: "/init dna-lock",
  },
  {
    after: "/tpa audit",
    check: "Types",
    condition: "any = 0",
    ifFailed: "/tpa fix --any",
  },
  {
    after: "/cld forensic",
    check: "Shadow debt",
    condition: "debt = 0",
    ifFailed: "/fix --all",
  },
  {
    after: "/ui slop-check",
    check: "Design",
    condition: "slop < 20%",
    ifFailed: "/ui dna",
  },
  {
    after: "/ui audit",
    check: "Responsive",
    condition: "Gate UI-6 pass",
    ifFailed: "תקן breakpoints",
  },
  {
    after: "/qa e2e",
    check: "Devices",
    condition: "כל המכשירים עוברים",
    ifFailed: "/qa heal",
  },
  {
    after: "/qa secure",
    check: "Security",
    condition: "0 vulnerabilities",
    ifFailed: "/cld god",
  },
  {
    after: "/verify-app",
    check: "UI",
    condition: "All flows pass",
    ifFailed: "/verify-iterate",
  },
  { after: "/audit", check: "49-Gate", condition: "49/49", ifFailed: "/heal" },
  {
    after: "/git audit",
    check: "Pre-commit",
    condition: "All pass",
    ifFailed: "DO NOT COMMIT",
  },
];
