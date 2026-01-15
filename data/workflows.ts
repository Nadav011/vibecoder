// מרכז הפיקוד - כל הפקודות מ-ALIGNMENT_WORKFLOWS.md v17.3.0 OMEGA EDITION
// ~100 פקודות מלאות עם פלאגים, פרמטרים ותיאורים

export interface Command {
  id: string;
  command: string;
  flags?: string[];
  params?: string;
  description: string;
  output?: string;
  shortcut?: string;
  isQuickAction?: boolean;
  requirement?: string; // דרישה (e.g., "100%", "קריטי")
  timeEstimate?: string; // זמן משוער (e.g., "30s")
  isAutonomous?: boolean; // פועל אוטונומית
}

export interface Phase {
  id: string;
  number: string;
  name: string;
  nameHe: string;
  skill: string;
  icon: string;
  color: string;
  commands: Command[];
  hardStops?: string[];
  description?: string; // תיאור מורחב של ה-Phase
}

export interface UseCase {
  id: string;
  name: string;
  nameHe: string;
  icon: string;
  commands: string[]; // רשימת command IDs בסדר
  description: string;
}

// ================================
// USE CASES - תבניות שימוש מוכנות
// ================================

export const USE_CASES: UseCase[] = [
  {
    id: "new-project",
    name: "New Project",
    nameHe: "פרויקט חדש",
    icon: "rocket-outline",
    description: "יצירת פרויקט חדש מאפס",
    commands: [
      "/scan",
      "/map",
      "/analyze",
      "/init new",
      "/tpa audit",
      "/ui dna",
      "/ui page home",
      "/qa run",
      "/verify-app",
      "/audit",
      "/certify",
      "/commit-push-pr",
    ],
  },
  {
    id: "existing-project",
    name: "Existing Project",
    nameHe: "פרויקט קיים",
    icon: "folder-open-outline",
    description: "Onboarding לפרויקט קיים",
    commands: [
      "/scan --deep",
      "/map",
      "/analyze",
      "/init align --force",
      "/tpa fix --any",
      "/ui discover --deep",
      "/ui slop-check",
      "/qa run",
      "/verify-app",
      "/audit",
    ],
  },
  {
    id: "during-dev",
    name: "During Development",
    nameHe: "במהלך פיתוח",
    icon: "code-working-outline",
    description: "פקודות שימושיות במהלך עבודה",
    commands: [
      "/status",
      "/check",
      "/fix --all",
      "/tpa fix --any",
      "/qa heal",
      "/verify-app flow",
      "/verify-iterate",
    ],
  },
  {
    id: "before-release",
    name: "Before Release",
    nameHe: "לפני Release",
    icon: "checkmark-done-circle-outline",
    description: "בדיקות סופיות לפני שחרור",
    commands: [
      "/qa coverage",
      "/prime perf",
      "/prime secure",
      "/prime audit --boris",
      "/certify",
      "/release",
    ],
  },
  {
    id: "emergency",
    name: "Emergency",
    nameHe: "מצב חירום",
    icon: "flame-outline",
    description: "כשיש באג קריטי בפרודקשן",
    commands: [
      "/monitor errors --last 1h",
      "/hotfix start [issue-id]",
      "/forensic",
      "/fix [file]",
      "/hotfix verify",
      "/hotfix deploy --fast",
      "/monitor errors --last 15m",
      "/hotfix close",
    ],
  },
  {
    id: "deploy-flow",
    name: "Deploy Flow",
    nameHe: "פריסה",
    icon: "cloud-upload-outline",
    description: "פריסה מלאה ל-staging ולפרודקשן",
    commands: [
      "/audit",
      "/deploy staging",
      "/verify-app",
      "/deploy production",
      "/monitor status",
    ],
  },
];

// ================================
// PROJECT FLOWS - זרימת עבודה לפי סוג פרויקט
// ================================

export interface ProjectFlowStep {
  stepNumber: number;
  phase: string; // Phase ID reference
  title: string;
  titleHe: string;
  description: string;
  commands: string[];
  tips?: string[];
  warning?: string;
  isRequired: boolean;
}

export interface ProjectFlow {
  id: string;
  name: string;
  nameHe: string;
  icon: string;
  color: string;
  description: string;
  estimatedTime: string;
  steps: ProjectFlowStep[];
}

export const PROJECT_FLOWS: ProjectFlow[] = [
  {
    id: "new-project",
    name: "New Project",
    nameHe: "פרויקט חדש",
    icon: "rocket-outline",
    color: "#34D399",
    description: "יצירת פרויקט חדש מאפס - כולל כל השלבים מהתחלה",
    estimatedTime: "30-60 דקות",
    steps: [
      {
        stepNumber: 1,
        phase: "phase-boot",
        title: "Start Session",
        titleHe: "התחלת Session",
        description: "חובה להריץ בכל פתיחת Claude Code חדשה",
        commands: ["/boot"],
        tips: [
          "הרץ /boot בכל פעם שאתה פותח Claude Code",
          "אם עברו 25k tokens - הרץ /boot שוב",
        ],
        warning: "אם לא מריצים /boot - המערכת לא תעבוד נכון!",
        isRequired: true,
      },
      {
        stepNumber: 2,
        phase: "phase-0",
        title: "Scan & Map",
        titleHe: "סריקה ומיפוי",
        description: "יצירת הקשר ראשוני והבנת מה יש בתיקייה",
        commands: ["/scan", "/map", "/analyze"],
        tips: [
          "גם אם התיקייה ריקה - הרץ /scan",
          "/map יוצר דיאגרמת ארכיטקטורה",
        ],
        isRequired: true,
      },
      {
        stepNumber: 3,
        phase: "phase-1",
        title: "Initialize Project",
        titleHe: "אתחול הפרויקט",
        description: "יצירת כל הקבצים והמבנה הבסיסי",
        commands: ["/init new [project-name]"],
        tips: [
          "החלף [project-name] בשם הפרויקט שלך",
          "זה יוצר: package.json, tsconfig, מבנה תיקיות",
        ],
        isRequired: true,
      },
      {
        stepNumber: 4,
        phase: "phase-2",
        title: "Setup Types",
        titleHe: "הגדרת טייפים",
        description: "וידוא שכל הטייפים מוגדרים נכון",
        commands: ["/tpa audit", "/tpa fix --any"],
        tips: [
          "אפס any types = קוד יציב יותר",
          "אם יש שגיאות - /tpa fix --any מתקן אוטומטית",
        ],
        isRequired: true,
      },
      {
        stepNumber: 5,
        phase: "phase-2-6",
        title: "Create Design DNA",
        titleHe: "יצירת DNA עיצובי",
        description: "יצירת שפה עיצובית יחודית לפרויקט",
        commands: ["/ui dna", "/ui page home"],
        tips: [
          "/ui dna יוצר Design DNA יחודי",
          "/ui page home יוצר את הדף הראשון",
        ],
        isRequired: false,
      },
      {
        stepNumber: 6,
        phase: "phase-3",
        title: "Run Tests",
        titleHe: "הרצת טסטים",
        description: "וידוא שהכל עובד לפני commit",
        commands: ["/qa run", "/verify-app"],
        tips: [
          "/qa run מריץ את כל הטסטים",
          "/verify-app פותח דפדפן ובודק ויזואלית",
        ],
        isRequired: true,
      },
      {
        stepNumber: 7,
        phase: "phase-4",
        title: "Certify Quality",
        titleHe: "אישור איכות",
        description: "בדיקת 49-Gate לפני commit",
        commands: ["/audit", "/certify"],
        tips: ["/audit בודק 49 קריטריונים", "צריך לעבור לפני כל commit"],
        warning: "אם הציון מתחת ל-35 - אסור לעשות commit!",
        isRequired: true,
      },
      {
        stepNumber: 8,
        phase: "phase-5",
        title: "Deploy to Git",
        titleHe: "שמירה ב-Git",
        description: "commit, push ו-PR",
        commands: ["/commit-push-pr"],
        tips: [
          "/commit-push-pr עושה הכל בפעולה אחת",
          "או לחלופין: /commit → /push → /pr",
        ],
        isRequired: true,
      },
      {
        stepNumber: 9,
        phase: "phase-5-5",
        title: "Deploy to Staging",
        titleHe: "פריסה ל-Staging",
        description: "בדיקה ב-staging לפני פרודקשן",
        commands: ["/deploy staging", "/deploy verify"],
        tips: [
          "תמיד לבדוק ב-staging לפני פרודקשן",
          "/deploy verify בודק עם Playwright",
        ],
        isRequired: true,
      },
      {
        stepNumber: 10,
        phase: "phase-5-5",
        title: "Deploy to Production",
        titleHe: "פריסה לפרודקשן",
        description: "פריסה לפרודקשן",
        commands: ["/deploy production"],
        tips: [
          "רק אחרי בדיקות staging מוצלחות",
          "אפשר להשתמש ב---force לעקוף בדיקות",
        ],
        warning: "אסור לפרוס לפרודקשן בלי לעבור staging!",
        isRequired: true,
      },
      {
        stepNumber: 11,
        phase: "phase-6",
        title: "Monitor Production",
        titleHe: "מעקב פרודקשן",
        description: "בדיקת בריאות אחרי פריסה",
        commands: ["/monitor status", "/monitor errors --last 1h"],
        tips: ["תמיד לבדוק שגיאות אחרי פריסה", "אם יש שגיאות - /hotfix start"],
        isRequired: true,
      },
    ],
  },
  {
    id: "existing-project",
    name: "Existing Project",
    nameHe: "פרויקט קיים",
    icon: "folder-open-outline",
    color: "#818CF8",
    description: "הצטרפות לפרויקט קיים - סריקה, הבנה ויישור",
    estimatedTime: "15-30 דקות",
    steps: [
      {
        stepNumber: 1,
        phase: "phase-boot",
        title: "Start Session",
        titleHe: "התחלת Session",
        description: "חובה להריץ בכל פתיחת Claude Code חדשה",
        commands: ["/boot"],
        tips: [
          "הרץ /boot בכל פעם שאתה פותח Claude Code",
          "אם עברו 25k tokens - הרץ /boot שוב",
        ],
        warning: "אם לא מריצים /boot - המערכת לא תעבוד נכון!",
        isRequired: true,
      },
      {
        stepNumber: 2,
        phase: "phase-0",
        title: "Deep Scan",
        titleHe: "סריקה עמוקה",
        description: "הבנת הפרויקט הקיים לעומק",
        commands: ["/scan --deep", "/map", "/analyze"],
        tips: [
          "--deep סורק יותר לעומק",
          "קורא את כל הקבצים ויוצר AI_CONTEXT.md",
        ],
        isRequired: true,
      },
      {
        stepNumber: 3,
        phase: "phase-1",
        title: "Align to Standards",
        titleHe: "יישור לתקנים",
        description: "יישור הפרויקט לסטנדרטים של OMEGA",
        commands: ["/init align --force"],
        tips: [
          "--force מיישר גם אם יש התנגשויות",
          "לא משנה קבצים קיימים - רק מוסיף חסרים",
        ],
        isRequired: true,
      },
      {
        stepNumber: 4,
        phase: "phase-2",
        title: "Fix Types",
        titleHe: "תיקון טייפים",
        description: "מציאת ותיקון בעיות טייפים",
        commands: ["/tpa audit", "/tpa fix --any"],
        tips: [
          "יכול למצוא הרבה any types בפרויקטים ישנים",
          "תיקון הדרגתי - לא חייב לתקן הכל בבת אחת",
        ],
        isRequired: false,
      },
      {
        stepNumber: 5,
        phase: "phase-2-6",
        title: "Discover Design",
        titleHe: "גילוי עיצוב",
        description: "הבנת השפה העיצובית הקיימת",
        commands: ["/ui discover --deep", "/ui slop-check"],
        tips: [
          "/ui discover מזהה את הסגנון הקיים",
          "/ui slop-check מוצא דפוסים גנריים",
        ],
        isRequired: false,
      },
      {
        stepNumber: 6,
        phase: "phase-3",
        title: "Run Tests",
        titleHe: "הרצת טסטים",
        description: "וידוא שהכל עובד",
        commands: ["/qa run", "/verify-app"],
        tips: [
          "אם אין טסטים - /qa heal יכול ליצור",
          "/verify-app בודק ויזואלית",
        ],
        isRequired: true,
      },
      {
        stepNumber: 7,
        phase: "phase-4",
        title: "Audit Quality",
        titleHe: "ביקורת איכות",
        description: "הבנת מצב האיכות הנוכחי",
        commands: ["/audit"],
        tips: [
          "הציון הראשוני יכול להיות נמוך - זה בסדר",
          "זה נותן לך baseline להשוואה",
        ],
        isRequired: true,
      },
      {
        stepNumber: 8,
        phase: "phase-5-5",
        title: "Deploy to Staging",
        titleHe: "פריסה ל-Staging",
        description: "בדיקה ב-staging",
        commands: ["/deploy staging"],
        tips: ["תמיד לבדוק ב-staging לפני פרודקשן"],
        isRequired: false,
      },
      {
        stepNumber: 9,
        phase: "phase-6",
        title: "Monitor",
        titleHe: "מעקב",
        description: "בדיקת שגיאות ובעיות",
        commands: ["/monitor errors --last 24h"],
        tips: ["אם יש שגיאות קריטיות - /hotfix start"],
        isRequired: false,
      },
    ],
  },
  {
    id: "emergency-flow",
    name: "Emergency Hotfix",
    nameHe: "תיקון חירום",
    icon: "flame-outline",
    color: "#EF4444",
    description: "כשיש באג קריטי בפרודקשן - workflow מהיר לתיקון",
    estimatedTime: "15-45 דקות",
    steps: [
      {
        stepNumber: 1,
        phase: "phase-6",
        title: "Identify Issue",
        titleHe: "זיהוי הבעיה",
        description: "הבנת מה השתבש",
        commands: ["/monitor errors --last 1h"],
        tips: ["בדוק שגיאות אחרונות", "זהה את הבעיה הקריטית"],
        warning: "אל תיכנס לפאניקה - תעבוד שלב אחרי שלב",
        isRequired: true,
      },
      {
        stepNumber: 2,
        phase: "phase-emergency",
        title: "Start Hotfix",
        titleHe: "פתיחת Hotfix",
        description: "יצירת branch חירום",
        commands: ["/hotfix start [issue-id]"],
        tips: [
          "תן ID ברור לבעיה (e.g., BUG-123)",
          "זה יוצר branch נפרד לתיקון",
        ],
        isRequired: true,
      },
      {
        stepNumber: 3,
        phase: "phase-2-5",
        title: "Investigate",
        titleHe: "חקירה",
        description: "מציאת מקור הבעיה",
        commands: ["/forensic", "/cld forensic"],
        tips: ["/forensic מחפש patterns", "מזהה קוד בעייתי"],
        isRequired: true,
      },
      {
        stepNumber: 4,
        phase: "phase-2-5",
        title: "Apply Fix",
        titleHe: "החלת תיקון",
        description: "תיקון הבעיה",
        commands: ["/hotfix apply", "/fix [file]"],
        tips: ["תיקון ממוקד - לא לשנות דברים אחרים", "שינויים מינימליים"],
        isRequired: true,
      },
      {
        stepNumber: 5,
        phase: "phase-emergency",
        title: "Verify Fix",
        titleHe: "אימות התיקון",
        description: "בדיקה שהתיקון עובד",
        commands: ["/hotfix verify", "/qa run"],
        tips: ["חובה לוודא שהתיקון פותר את הבעיה", "הרץ טסטים רלוונטיים"],
        warning: "לא לפרוס בלי אימות!",
        isRequired: true,
      },
      {
        stepNumber: 6,
        phase: "phase-emergency",
        title: "Fast Deploy",
        titleHe: "פריסה מהירה",
        description: "פריסה ישירה לפרודקשן",
        commands: ["/hotfix deploy --fast"],
        tips: ["--fast עוקף בדיקות staging", "רק לחירום אמיתי"],
        warning: "השתמש ב---fast רק כשממש דחוף!",
        isRequired: true,
      },
      {
        stepNumber: 7,
        phase: "phase-6",
        title: "Verify Production",
        titleHe: "אימות פרודקשן",
        description: "וידוא שהבעיה נפתרה",
        commands: ["/monitor errors --last 15m", "/monitor status"],
        tips: ["בדוק שאין שגיאות חדשות", "אם עדיין יש בעיה - /hotfix rollback"],
        isRequired: true,
      },
      {
        stepNumber: 8,
        phase: "phase-emergency",
        title: "Close Hotfix",
        titleHe: "סגירת Hotfix",
        description: "סגירת workflow החירום",
        commands: ["/hotfix close"],
        tips: ["מסמן שהחירום נפתר", "מתעד את התיקון"],
        isRequired: true,
      },
    ],
  },
];

// ================================
// PHASES - כל 16 השלבים (Phase -1 to META + EMERGENCY)
// ================================

export const PHASES: Phase[] = [
  // PHASE -1: BOOT - MUST BE FIRST!
  {
    id: "phase-boot",
    number: "-1",
    name: "BOOT",
    nameHe: "אתחול",
    skill: "OMEGA-BOOT",
    icon: "power-outline",
    color: "#F43F5E",
    description: "חובה להריץ בכל פתיחת Session חדש!",
    commands: [
      {
        id: "boot",
        command: "/boot",
        description: "רצף אתחול מלא (5 שלבים)",
        output: "Session Report",
        isQuickAction: true,
      },
      {
        id: "boot-status",
        command: "/boot status",
        description: "בדיקת בריאות מהירה (Gates 1-7)",
        output: "Health Status",
      },
      {
        id: "boot-skills",
        command: "/boot skills",
        description: "רשימת 14 סקילים עם סטטוס",
        output: "Skills Table",
      },
      {
        id: "boot-context",
        command: "/boot context",
        description: "הצגת היררכיית ההקשר",
        output: "Context Ladder",
      },
      {
        id: "boot-phase",
        command: "/boot phase",
        description: "הצגת שלב פרויקט נוכחי",
        output: "Phase Info",
      },
      {
        id: "boot-route",
        command: "/boot route",
        params: '"[prompt]"',
        description: "זיהוי אוטומטי לפרומפט",
        output: "Skill Recommendation",
      },
    ],
    hardStops: [
      "OMEGA-BOOT חייב לרוץ בכל פתיחת Session חדש",
      "אם MASTER_COORDINATE לא נקרא → Session לא יכול להמשיך",
      "כל 25k tokens → הרץ /boot שוב (Entropy Anchoring)",
    ],
  },

  // PHASE 0: DISCOVERY
  {
    id: "phase-0",
    number: "0",
    name: "DISCOVERY",
    nameHe: "גילוי",
    skill: "APEX-PRIME",
    icon: "search-outline",
    color: "#818CF8",
    description: "הבנת הפרויקט, יצירת קונטקסט ומיפוי ארכיטקטורה",
    commands: [
      {
        id: "scan",
        command: "/scan",
        flags: ["--deep"],
        description: "סריקה מלאה של הפרויקט",
        output: "AI_CONTEXT.md",
        isQuickAction: true,
      },
      {
        id: "map",
        command: "/map",
        description: "יצירת דיאגרמת ארכיטקטורה",
        output: "ARCHITECTURE.md",
      },
      {
        id: "analyze",
        command: "/analyze",
        flags: ["--refresh"],
        description: "יצירת כל הספקים",
        output:
          "API_SPEC.md, COMPONENTS.md, DATA_FLOW.md, TECH_STACK.md, SECURITY.md",
      },
      {
        id: "check",
        command: "/check",
        description: "בדיקת בריאות מהירה",
        output: "סטטוס",
      },
      {
        id: "drift",
        command: "/drift",
        description: "בדיקת סטייה מ-MASTER_COORDINATE",
        output: "CDI Score",
      },
      {
        id: "prime",
        command: "/prime",
        description: "קיצור ל-APEX-PRIME",
        shortcut: "/apex-prime",
      },
    ],
    hardStops: ["אם AI_CONTEXT.md לא נוצר → הרץ /scan --deep"],
  },

  // PHASE 1: GENESIS
  {
    id: "phase-1",
    number: "1",
    name: "GENESIS",
    nameHe: "יצירה",
    skill: "APEX-INIT",
    icon: "rocket-outline",
    color: "#34D399",
    description: "יצירת פרויקט חדש או יישור פרויקט קיים",
    commands: [
      {
        id: "init-new",
        command: "/init new",
        params: "[project-name]",
        description: "יצירת פרויקט חדש מלא (כל 5 השלבים)",
      },
      {
        id: "init-phase",
        command: "/init phase",
        params: "[1-5]",
        description: "הרצת שלב ספציפי בלבד",
      },
      {
        id: "init-align",
        command: "/init align",
        flags: ["--force"],
        description: "סנכרון כפוי ל-MASTER_COORDINATE",
      },
      {
        id: "init-context",
        command: "/init context",
        flags: ["--sync"],
        description: "רענון AI_CONTEXT.md",
      },
      {
        id: "init-mcp",
        command: "/init mcp",
        params: "[server-name]",
        description: "אתחול שרת MCP (supabase, github)",
      },
      {
        id: "init-dna-lock",
        command: "/init dna-lock",
        description: "אימות שלמות DNA",
      },
      {
        id: "init-purge",
        command: "/init purge",
        flags: ["--heavy"],
        description: "מחיקה כבדה של קוד ישן",
      },
      {
        id: "init-audit",
        command: "/init audit",
        flags: ["--49"],
        description: "49-Gate Genesis Audit",
      },
      {
        id: "genesis",
        command: "/genesis",
        description: "קיצור ל-/init new",
        shortcut: "/init new",
      },
      {
        id: "bootstrap",
        command: "/bootstrap",
        description: "קיצור ל-/init",
        shortcut: "/init",
      },
      {
        id: "align",
        command: "/align",
        description: "קיצור ל-/init align --force",
        shortcut: "/init align --force",
      },
      {
        id: "context",
        command: "/context",
        description: "קיצור ל-/init context --sync",
        shortcut: "/init context --sync",
      },
      {
        id: "dna-lock",
        command: "/dna-lock",
        description: "קיצור ל-/init dna-lock",
        shortcut: "/init dna-lock",
      },
      {
        id: "init-shortcut",
        command: "/init",
        description: "קיצור ל-APEX-INIT",
        shortcut: "/apex-init",
      },
    ],
    hardStops: ["אם DNA לא נעול → הרץ /init dna-lock"],
  },

  // PHASE 2: STRUCTURE
  {
    id: "phase-2",
    number: "2",
    name: "STRUCTURE",
    nameHe: "מבנה",
    skill: "TPA",
    icon: "code-slash-outline",
    color: "#F59E0B",
    description: "TypeScript strict, Zod schemas, Result<T,E>",
    commands: [
      {
        id: "tpa-component",
        command: "/tpa component",
        params: '"[description]"',
        description: "יצירת קומפוננט React עם PPR",
      },
      {
        id: "tpa-hook",
        command: "/tpa hook",
        params: '"[description]"',
        description: "יצירת hook לוגי",
      },
      {
        id: "tpa-schema",
        command: "/tpa schema",
        params: '"[description]"',
        description: "יצירת Zod schema",
      },
      {
        id: "tpa-align",
        command: "/tpa align",
        description: "יישור קובץ ל-MASTER_COORDINATE",
      },
      {
        id: "tpa-audit",
        command: "/tpa audit",
        description: "בדיקת כיסוי טייפים מלאה",
      },
      {
        id: "tpa-fix",
        command: "/tpa fix",
        flags: ["--any"],
        description: "מחיקת כל ה-any types",
      },
      {
        id: "tpa-brand",
        command: "/tpa brand",
        params: "[type-name]",
        description: "יצירת branded type",
      },
      {
        id: "tpa-result",
        command: "/tpa result",
        params: "[function-name]",
        description: "עטיפה ב-Result<T,E>",
      },
      {
        id: "tpa-strict",
        command: "/tpa strict",
        description: "הפעלת strict mode",
      },
      {
        id: "tpa-coverage",
        command: "/tpa coverage",
        description: "דוח כיסוי טייפים",
      },
      {
        id: "types",
        command: "/types",
        description: "קיצור ל-/tpa",
        shortcut: "/tpa",
      },
    ],
    hardStops: [
      "אם any > 0 → הרץ /tpa fix --any",
      "אם קובץ > 150 שורות → פצל אוטומטית",
    ],
  },

  // PHASE 2.5: FORENSICS
  {
    id: "phase-2-5",
    number: "2.5",
    name: "FORENSICS",
    nameHe: "תיקון",
    skill: "CLD",
    icon: "hammer-outline",
    color: "#EF4444",
    description: "God Mode - תיקונים אוטומטיים ואיפוס הקשר",
    commands: [
      {
        id: "cld-shred",
        command: "/cld shred",
        description: "איפוס הקשר, טעינה מחדש",
        isAutonomous: true,
      },
      {
        id: "cld-override",
        command: "/cld override",
        params: "[file/target]",
        description: "יישור כפוי ל-9D",
        isAutonomous: true,
      },
      {
        id: "cld-forensic",
        command: "/cld forensic",
        params: "[query]",
        description: "סריקה עמוקה לחוב נסתר",
        isAutonomous: true,
      },
      {
        id: "cld-preview",
        command: "/cld preview",
        params: "[operation]",
        description: "תצוגה מקדימה לפני שינוי",
        isAutonomous: true,
      },
      {
        id: "cld-audit",
        command: "/cld audit",
        flags: ["--49"],
        description: "49-Gate Override Audit",
        isAutonomous: true,
      },
      {
        id: "cld-fix",
        command: "/cld fix",
        flags: ["--all"],
        description: "תיקון אוטומטי של הכל",
        isAutonomous: true,
      },
      {
        id: "cld-god",
        command: "/cld god",
        description: "מצב אוטונומי מלא",
        isAutonomous: true,
      },
      {
        id: "cld-purge",
        command: "/cld purge",
        flags: ["--aggressive"],
        description: "מחיקה אגרסיבית",
        isAutonomous: true,
      },
      {
        id: "fix",
        command: "/fix",
        flags: ["--all"],
        description: "קיצור ל-/cld fix --all",
        shortcut: "/cld fix --all",
        isQuickAction: true,
      },
      {
        id: "god",
        command: "/god",
        description: "קיצור ל-/cld god",
        shortcut: "/cld god",
        isQuickAction: true,
      },
      {
        id: "shred",
        command: "/shred",
        description: "קיצור ל-/cld shred",
        shortcut: "/cld shred",
      },
      {
        id: "override",
        command: "/override",
        params: "[target]",
        description: "קיצור ל-/cld override",
        shortcut: "/cld override",
      },
      {
        id: "preview",
        command: "/preview",
        params: "[op]",
        description: "קיצור ל-/cld preview",
        shortcut: "/cld preview",
      },
      {
        id: "purge",
        command: "/purge",
        description: "קיצור ל-/cld purge",
        shortcut: "/cld purge",
      },
      {
        id: "forensic",
        command: "/forensic",
        params: "[query]",
        description: "קיצור ל-/cld forensic",
        shortcut: "/cld forensic",
      },
      {
        id: "fix-shortcut",
        command: "/fix",
        description: "קיצור ל-CLD",
        shortcut: "/cld",
      },
    ],
  },

  // PHASE 2.6: DESIGN
  {
    id: "phase-2-6",
    number: "2.6",
    name: "DESIGN",
    nameHe: "עיצוב",
    skill: "APEX-UI",
    icon: "color-palette-outline",
    color: "#EC4899",
    description: "Design DNA, Anti-Slop, RTL, WCAG AAA",
    commands: [
      // Discovery Commands
      {
        id: "ui-discover",
        command: "/ui discover",
        flags: ["--deep"],
        description: "ניתוח מלא של כל הדפים",
        timeEstimate: "60s",
      },
      {
        id: "ui-analyze",
        command: "/ui analyze",
        params: "[page-name]",
        description: "צלילה עמוקה לדף בודד",
        timeEstimate: "30s",
      },
      {
        id: "ui-context",
        command: "/ui context",
        description: "חילוץ tech stack + patterns",
        timeEstimate: "20s",
      },
      {
        id: "ui-audit",
        command: "/ui audit",
        description: "בדיקת 49-Gate SENSATION",
        timeEstimate: "45s",
      },
      // DNA Generation Commands
      {
        id: "ui-dna",
        command: "/ui dna",
        flags: ["--archetype [type]"],
        description: "יצירת Design DNA יחודי",
        timeEstimate: "30s",
      },
      {
        id: "ui-tokens",
        command: "/ui tokens",
        flags: ["--preview"],
        description: "יצירת design tokens",
        timeEstimate: "20s",
      },
      // Generation Commands
      {
        id: "ui-page",
        command: "/ui page",
        params: "[page-name]",
        description: "דף שלם עם layout + components",
        timeEstimate: "90s",
      },
      {
        id: "ui-component",
        command: "/ui component",
        params: '"[description]"',
        description: "קומפוננט בודד",
        timeEstimate: "30s",
      },
      {
        id: "ui-layout",
        command: "/ui layout",
        params: "[dashboard/marketing/app]",
        description: "מערכת layout",
        timeEstimate: "45s",
      },
      {
        id: "ui-section",
        command: "/ui section",
        params: '"[description]"',
        description: "section (hero/features/pricing)",
        timeEstimate: "40s",
      },
      {
        id: "ui-form",
        command: "/ui form",
        params: '"[description]"',
        description: "טופס עם validation",
        timeEstimate: "35s",
      },
      {
        id: "ui-nav",
        command: "/ui nav",
        params: "[sidebar/topbar/mobile]",
        description: "ניווט",
        timeEstimate: "30s",
      },
      // Enhancement Commands
      {
        id: "ui-animate",
        command: "/ui animate",
        params: "[target]",
        description: "הוספת אנימציות",
        timeEstimate: "20s",
      },
      {
        id: "ui-motion",
        command: "/ui motion",
        params: "[page]",
        description: "transitions + scroll animations",
        timeEstimate: "30s",
      },
      {
        id: "ui-glass",
        command: "/ui glass",
        params: "[target]",
        description: "אפקט glassmorphism",
        timeEstimate: "15s",
      },
      {
        id: "ui-depth",
        command: "/ui depth",
        params: "[target]",
        description: "צללים ועומק",
        timeEstimate: "15s",
      },
      // Validation Commands
      {
        id: "ui-rtl",
        command: "/ui rtl",
        description: "בדיקת RTL",
        timeEstimate: "20s",
      },
      {
        id: "ui-a11y",
        command: "/ui a11y",
        description: "בדיקת WCAG AAA",
        timeEstimate: "30s",
      },
      {
        id: "ui-slop-check",
        command: "/ui slop-check",
        description: "זיהוי דפוסים גנריים",
        timeEstimate: "25s",
      },
      {
        id: "ui-perf",
        command: "/ui perf",
        description: "בדיקת ביצועים",
        timeEstimate: "20s",
      },
      // Framework Commands
      {
        id: "ui-nextjs",
        command: "/ui nextjs",
        params: "[component]",
        description: "Next.js 15+ RSC",
        timeEstimate: "35s",
      },
      {
        id: "ui-react",
        command: "/ui react",
        params: "[component]",
        description: "React Vite",
        timeEstimate: "30s",
      },
      {
        id: "ui-vue",
        command: "/ui vue",
        params: "[component]",
        description: "Vue 3",
        timeEstimate: "30s",
      },
      {
        id: "ui-nuxt",
        command: "/ui nuxt",
        params: "[component]",
        description: "Nuxt 3",
        timeEstimate: "35s",
      },
      {
        id: "ui-shortcut",
        command: "/ui",
        description: "קיצור ל-APEX-UI",
        shortcut: "/apex-ui",
      },
    ],
    hardStops: ["אם slop > 20% → הרץ /ui dna --regenerate"],
  },

  // PHASE 2.75: NEURAL
  {
    id: "phase-2-75",
    number: "2.75",
    name: "NEURAL",
    nameHe: "ניורל",
    skill: "APEX-AI",
    icon: "hardware-chip-outline",
    color: "#8B5CF6",
    description: "Agent orchestration, MCP 2.0, HLTM Memory",
    commands: [
      {
        id: "ai-agent",
        command: "/ai agent",
        params: '"[mission]"',
        description: "שליחת agent אוטונומי",
      },
      {
        id: "ai-mcp-link",
        command: "/ai mcp-link",
        description: "חיבור לשרתי MCP 2.0",
      },
      {
        id: "ai-simulate",
        command: "/ai simulate",
        flags: ["--ast"],
        description: "סימולציית AST ב-RSC/PPR",
      },
      {
        id: "ai-audit",
        command: "/ai audit",
        flags: ["--omega"],
        description: "בדיקת 49-Gate neural",
      },
      {
        id: "agent",
        command: "/agent",
        params: '"[mission]"',
        description: "קיצור ל-/ai agent",
        shortcut: "/ai agent",
      },
      {
        id: "mcp",
        command: "/mcp",
        description: "קיצור ל-/ai mcp-link",
        shortcut: "/ai mcp-link",
      },
      {
        id: "simulate",
        command: "/simulate",
        description: "קיצור ל-/ai simulate --ast",
        shortcut: "/ai simulate --ast",
      },
      {
        id: "ai-shortcut",
        command: "/ai",
        description: "קיצור ל-APEX-AI",
        shortcut: "/apex-ai",
      },
    ],
  },

  // PHASE 3: QA
  {
    id: "phase-3",
    number: "3",
    name: "QA",
    nameHe: "בדיקות",
    skill: "APEX-QA",
    icon: "shield-checkmark-outline",
    color: "#06B6D4",
    description: "Vitest, Playwright, Security, RTL Testing",
    commands: [
      {
        id: "qa-run",
        command: "/qa run",
        description: "כל הטסטים (Unit+Integration+E2E)",
        requirement: "100%",
      },
      {
        id: "qa-unit",
        command: "/qa unit",
        description: "Vitest unit tests",
        requirement: ">95%",
      },
      {
        id: "qa-e2e",
        command: "/qa e2e",
        description: "Playwright headless",
        requirement: "100%",
      },
      {
        id: "qa-rtl",
        command: "/qa rtl",
        description: "טסטים לעברית/ערבית",
        requirement: "מותאם",
      },
      {
        id: "qa-secure",
        command: "/qa secure",
        description: "בדיקות אבטחה (RLS, XSS, CSRF)",
        requirement: "קריטי",
      },
      {
        id: "qa-perf",
        command: "/qa perf",
        description: "ביצועים (LCP, CLS, FPS)",
        requirement: "LCP<700ms",
      },
      {
        id: "qa-heal",
        command: "/qa heal",
        description: "תיקון אוטומטי של טסטים",
        requirement: "אוטו",
      },
      {
        id: "qa-report",
        command: "/qa report",
        description: "דוח 9D Quality Certificate",
        requirement: "מלא",
      },
      {
        id: "qa-coverage",
        command: "/qa coverage",
        description: "דוח כיסוי",
        requirement: ">95%",
      },
      {
        id: "qa-vrt",
        command: "/qa vrt",
        description: "Visual Regression Testing",
        requirement: "לכל קומפוננט",
      },
      {
        id: "qa-regression",
        command: "/qa regression",
        description: "Full regression suite",
        requirement: "הכל",
      },
      {
        id: "qa-watch",
        command: "/qa watch",
        description: "מצב צפייה",
        requirement: "פיתוח",
      },
      {
        id: "test",
        command: "/test",
        description: "קיצור ל-/qa run",
        shortcut: "/qa run",
      },
      {
        id: "unit",
        command: "/unit",
        description: "קיצור ל-/qa unit",
        shortcut: "/qa unit",
      },
      {
        id: "e2e",
        command: "/e2e",
        description: "קיצור ל-/qa e2e",
        shortcut: "/qa e2e",
      },
      {
        id: "rtl",
        command: "/rtl",
        description: "קיצור ל-/qa rtl",
        shortcut: "/qa rtl",
      },
      {
        id: "secure",
        command: "/secure",
        description: "קיצור ל-/qa secure",
        shortcut: "/qa secure",
      },
      {
        id: "perf",
        command: "/perf",
        description: "קיצור ל-/qa perf",
        shortcut: "/qa perf",
      },
      {
        id: "coverage",
        command: "/coverage",
        description: "קיצור ל-/qa coverage",
        shortcut: "/qa coverage",
      },
      {
        id: "vrt",
        command: "/vrt",
        description: "קיצור ל-/qa vrt",
        shortcut: "/qa vrt",
      },
      {
        id: "regression",
        command: "/regression",
        description: "קיצור ל-/qa regression",
        shortcut: "/qa regression",
      },
      {
        id: "watch",
        command: "/watch",
        description: "קיצור ל-/qa watch",
        shortcut: "/qa watch",
      },
      {
        id: "qa-shortcut",
        command: "/qa",
        description: "קיצור ל-APEX-QA",
        shortcut: "/apex-qa",
      },
    ],
    hardStops: [
      "אם coverage < 95% → אין deployment",
      "אם יש critical bugs → תקן קודם",
      "אם security נכשל → /cld god",
    ],
  },

  // PHASE 3.5: VERIFY
  {
    id: "phase-3-5",
    number: "3.5",
    name: "VERIFY",
    nameHe: "אימות",
    skill: "VERIFY-APP",
    icon: "eye-outline",
    color: "#10B981",
    description: "Browser verification, Boris Pattern loops",
    commands: [
      {
        id: "verify-app",
        command: "/verify-app",
        description: "אימות E2E בדפדפן",
        isQuickAction: true,
      },
      {
        id: "verify-app-flow",
        command: "/verify-app flow",
        params: "[flow-name]",
        description: "אימות flow ספציפי",
      },
      {
        id: "verify-app-rtl",
        command: "/verify-app rtl",
        description: "אימות RTL בדפדפן",
      },
      {
        id: "verify-app-perf",
        command: "/verify-app perf",
        description: "אימות ביצועים",
      },
      {
        id: "verify-app-screenshot",
        command: "/verify-app screenshot",
        description: "צילומי מסך",
      },
      {
        id: "verify-iterate",
        command: "/verify-iterate",
        params: "[max-attempts]",
        description: "לולאה עד שלם (Boris Pattern)",
      },
    ],
  },

  // PHASE 4: CERTIFICATION
  {
    id: "phase-4",
    number: "4",
    name: "CERTIFICATION",
    nameHe: "אישור",
    skill: "APEX-PRIME",
    icon: "ribbon-outline",
    color: "#F97316",
    description: "49-Gate Matrix, DNA Lock, Quality Certificate",
    commands: [
      {
        id: "prime-audit",
        command: "/prime audit",
        flags: ["--boris"],
        description: "בדיקת 49-Gate + verify-app",
        output: "49/49",
      },
      {
        id: "prime-certify",
        command: "/prime certify",
        flags: ["--atomic"],
        description: "DNA_REPORT.md + commit-push-pr",
        output: "Sealed",
      },
      {
        id: "prime-sandbox",
        command: "/prime sandbox",
        params: "[target]",
        description: "סימולציה אדוורסרית",
        output: "Risk report",
      },
      {
        id: "prime-heal",
        command: "/prime heal",
        flags: ["--learn"],
        description: "תיקון אוטומטי + לוג ל-CLAUDE.md",
        output: "Healed",
      },
      {
        id: "prime-clean",
        command: "/prime clean",
        description: "פרוטוקולי EXORCIST",
        output: "Purged",
      },
      {
        id: "prime-perf",
        command: "/prime perf",
        description: "בנצ'מרקים",
        output: "Metrics",
      },
      {
        id: "prime-secure",
        command: "/prime secure",
        description: "stress-test אבטחה",
        output: "Green/Red",
      },
      {
        id: "prime-sync",
        command: "/prime sync",
        description: "יישור ל-Global Root DNA",
        output: "Synced",
      },
      {
        id: "prime-report",
        command: "/prime report",
        description: "סיכום 9-Dimensional",
        output: "Report",
      },
      {
        id: "audit",
        command: "/audit",
        description: "קיצור ל-/prime audit",
        shortcut: "/prime audit",
        isQuickAction: true,
      },
      {
        id: "certify",
        command: "/certify",
        description: "קיצור ל-/prime certify",
        shortcut: "/prime certify",
      },
      {
        id: "heal",
        command: "/heal",
        description: "קיצור ל-/prime heal",
        shortcut: "/prime heal",
      },
      {
        id: "clean",
        command: "/clean",
        description: "קיצור ל-/prime clean",
        shortcut: "/prime clean",
      },
      {
        id: "sandbox",
        command: "/sandbox",
        params: "[target]",
        description: "קיצור ל-/prime sandbox",
        shortcut: "/prime sandbox",
      },
      {
        id: "report",
        command: "/report",
        description: "קיצור ל-/prime report",
        shortcut: "/prime report",
      },
      {
        id: "omega",
        command: "/omega",
        description: "Full 9D certification",
      },
      {
        id: "verify",
        command: "/verify",
        description: "קיצור ל-/audit",
        shortcut: "/audit",
      },
      {
        id: "sync",
        command: "/sync",
        description: "קיצור ל-/prime sync",
        shortcut: "/prime sync",
      },
    ],
    hardStops: [
      "אם score < 35 → BLOCK deployment",
      "אם Evolution Gates (43-49) < 6/7 → BLOCK commit",
    ],
  },

  // PHASE 5: DEPLOY
  {
    id: "phase-5",
    number: "5",
    name: "DEPLOY",
    nameHe: "פריסה",
    skill: "APEX-GIT",
    icon: "git-branch-outline",
    color: "#14B8A6",
    description: "Git-Ops, Conventional Commits, OMEGA Flow",
    commands: [
      {
        id: "git-status",
        command: "/git status",
        flags: ["--omega"],
        description: "סטטוס / executive dashboard",
        requirement: "בריאות",
      },
      {
        id: "git-commit",
        command: "/git commit",
        flags: ["--quick"],
        params: '"[message]"',
        description: "commit עם OMEGA flow",
        requirement: "Audited",
        isQuickAction: true,
      },
      {
        id: "git-push",
        command: "/git push",
        description: "push עם Evolution Gates",
        requirement: "Gates 43-49",
      },
      {
        id: "git-pr",
        command: "/git pr",
        flags: ["--draft"],
        description: "PR עם 9D Impact Report",
        requirement: "Audited",
      },
      {
        id: "git-sync",
        command: "/git sync",
        description: "יישור Git state",
        requirement: "Synced",
      },
      {
        id: "git-release",
        command: "/git release",
        params: "[version]",
        description: "release עם DNA-Lock",
        requirement: "Tagged",
      },
      {
        id: "git-tag",
        command: "/git tag",
        params: "[name]",
        description: "tag עם audit hash",
        requirement: "Sealed",
      },
      {
        id: "git-audit",
        command: "/git audit",
        description: "49-Gate בלי commit",
        requirement: "Verified",
      },
      {
        id: "git-clean",
        command: "/git clean",
        description: "פרוטוקולי EXORCIST",
        requirement: "Purged",
      },
      {
        id: "status",
        command: "/status",
        description: "קיצור ל-/git status",
        shortcut: "/git status",
      },
      {
        id: "commit",
        command: "/commit",
        params: '"[message]"',
        description: "קיצור ל-/git commit",
        shortcut: "/git commit",
      },
      {
        id: "push",
        command: "/push",
        description: "קיצור ל-/git push",
        shortcut: "/git push",
      },
      {
        id: "pr",
        command: "/pr",
        description: "קיצור ל-/git pr",
        shortcut: "/git pr",
      },
      {
        id: "deploy",
        command: "/deploy",
        description: "Full deployment",
      },
      {
        id: "release",
        command: "/release",
        params: "[version]",
        description: "קיצור ל-/git release",
        shortcut: "/git release",
      },
      {
        id: "tag",
        command: "/tag",
        params: "[name]",
        description: "קיצור ל-/git tag",
        shortcut: "/git tag",
      },
      {
        id: "commit-push-pr",
        command: "/commit-push-pr",
        params: '"[message]"',
        description: "Atomic flow (3 בפעולה אחת)",
      },
      {
        id: "git-shortcut",
        command: "/git",
        description: "קיצור ל-APEX-GIT",
        shortcut: "/apex-git",
      },
    ],
    hardStops: [
      "לעולם לא commit בלי 49-Gate audit",
      "לעולם לא push אם Evolution Gates נכשלים",
      "לעולם לא להכניס secrets (.env, *.pem, *.key)",
      "תמיד לכלול DNA-Lock hash ב-releases",
      "תמיד להשתמש ב-Conventional Commits",
    ],
  },

  // PHASE 5.5: DEPLOYMENT (NEW!)
  {
    id: "phase-5-5",
    number: "5.5",
    name: "DEPLOYMENT",
    nameHe: "פריסה מתקדמת",
    skill: "APEX-DEPLOY",
    icon: "cloud-upload-outline",
    color: "#10B981",
    description:
      "Staging verification, Production deployment, Zero-downtime, Rollback",
    commands: [
      {
        id: "deploy-staging",
        command: "/deploy staging",
        description: "פריסה ל-staging לבדיקות",
        output: "Staging URL",
        isQuickAction: true,
      },
      {
        id: "deploy-production",
        command: "/deploy production",
        flags: ["--force"],
        description: "פריסה לפרודקשן",
        output: "Production URL",
        requirement: "Audit Pass",
      },
      {
        id: "deploy-preview",
        command: "/deploy preview",
        params: "[branch]",
        description: "פריסת preview לבדיקה",
        output: "Preview URL",
      },
      {
        id: "deploy-rollback",
        command: "/deploy rollback",
        params: "[version]",
        description: "חזרה לגרסה קודמת",
        output: "Rollback Status",
        requirement: "קריטי",
      },
      {
        id: "deploy-status",
        command: "/deploy status",
        description: "סטטוס כל הפריסות",
        output: "Deployments Table",
      },
      {
        id: "deploy-migrate",
        command: "/deploy migrate",
        flags: ["--dry-run"],
        description: "מיגרציית בסיס נתונים",
        output: "Migration Status",
        requirement: "קריטי",
      },
      {
        id: "deploy-verify",
        command: "/deploy verify",
        params: "[url]",
        description: "אימות פריסה עם Playwright",
        output: "Verification Report",
      },
    ],
    hardStops: [
      "אין פריסה לפרודקשן בלי /audit",
      "rollback מיידי אם יש 5xx errors",
      "חובה לאמת עם /deploy verify אחרי כל פריסה",
    ],
  },

  // PHASE 6: OBSERVABILITY (NEW!)
  {
    id: "phase-6",
    number: "6",
    name: "OBSERVABILITY",
    nameHe: "מעקב",
    skill: "APEX-MONITOR",
    icon: "analytics-outline",
    color: "#3B82F6",
    description:
      "Production health, Error tracking, Performance metrics, Alerting",
    commands: [
      {
        id: "monitor-status",
        command: "/monitor status",
        description: "דשבורד בריאות פרודקשן",
        output: "Health Dashboard",
        isQuickAction: true,
      },
      {
        id: "monitor-errors",
        command: "/monitor errors",
        params: "--last [time]",
        description: "שגיאות אחרונות (1h, 24h, 7d)",
        output: "Errors List",
      },
      {
        id: "monitor-perf",
        command: "/monitor perf",
        description: "מדדי ביצועים (LCP, CLS, FID)",
        output: "Performance Metrics",
      },
      {
        id: "monitor-setup",
        command: "/monitor setup",
        params: "[sentry|vercel]",
        description: "התקנת monitoring",
        output: "Setup Guide",
      },
      {
        id: "monitor-alerts",
        command: "/monitor alerts",
        description: "התראות פעילות",
        output: "Alerts List",
      },
      {
        id: "monitor-logs",
        command: "/monitor logs",
        flags: ["--tail"],
        description: "לוגים חיים",
        output: "Live Logs",
      },
    ],
    hardStops: [
      "אם יש 5xx > 1% → בדוק מיד",
      "אם LCP > 2.5s → optimizations נדרשות",
    ],
  },

  // EMERGENCY: HOTFIX (NEW!)
  {
    id: "phase-emergency",
    number: "EMERGENCY",
    name: "HOTFIX",
    nameHe: "חירום",
    skill: "APEX-HOTFIX",
    icon: "flame-outline",
    color: "#EF4444",
    description: "Critical bug fixes, Emergency patches, Incident response",
    commands: [
      {
        id: "hotfix-start",
        command: "/hotfix start",
        params: "[issue-id]",
        description: "פתיחת workflow חירום",
        output: "Hotfix Branch",
        isQuickAction: true,
      },
      {
        id: "hotfix-apply",
        command: "/hotfix apply",
        description: "החלת התיקון",
        output: "Applied Changes",
      },
      {
        id: "hotfix-verify",
        command: "/hotfix verify",
        description: "אימות התיקון עובד",
        output: "Verification Status",
      },
      {
        id: "hotfix-deploy",
        command: "/hotfix deploy",
        flags: ["--fast"],
        description: "פריסה מהירה לפרודקשן",
        output: "Deploy Status",
        requirement: "קריטי",
      },
      {
        id: "hotfix-rollback",
        command: "/hotfix rollback",
        description: "חזרה מהתיקון",
        output: "Rollback Status",
      },
      {
        id: "hotfix-close",
        command: "/hotfix close",
        description: "סגירת workflow חירום",
        output: "Closed",
      },
    ],
    hardStops: [
      "hotfix רק לבעיות קריטיות",
      "חובה לסגור עם /hotfix close",
      "תיעוד post-mortem נדרש",
    ],
  },

  // POST-DEPLOY: MEMORY
  {
    id: "phase-post",
    number: "POST",
    name: "MEMORY",
    nameHe: "זיכרון",
    skill: "INSTITUTIONAL",
    icon: "library-outline",
    color: "#6366F1",
    description: "לוג טעויות ולמידה מתמשכת",
    commands: [
      {
        id: "claude-update",
        command: "/claude-update",
        flags: ["--analyze"],
        params: '"[Category] Issue → Fix"',
        description: "עדכון CLAUDE.md עם טעות שנלמדה",
      },
      {
        id: "session-start",
        command: "/session-start",
        description: "התחלת session (Boris Protocol)",
      },
      {
        id: "worktree-new",
        command: "/worktree new",
        params: "[name]",
        description: "יצירת worktree לעבודה מקבילה",
      },
      {
        id: "worktree-list",
        command: "/worktree list",
        description: "רשימת worktrees",
      },
      {
        id: "worktree-remove",
        command: "/worktree remove",
        params: "[name]",
        description: "מחיקת worktree",
      },
      {
        id: "worktree-clean",
        command: "/worktree clean",
        description: "ניקוי worktrees",
      },
      {
        id: "worktree-shortcut",
        command: "/worktree",
        description: "ניהול worktrees לעבודה מקבילה",
        shortcut: "Boris pattern",
      },
    ],
  },

  // META: SKILL CREATION
  {
    id: "phase-meta",
    number: "META",
    name: "FORGE",
    nameHe: "יצירה",
    skill: "SINGULARITY-FORGE",
    icon: "construct-outline",
    color: "#A855F7",
    description: "יצירת skills חדשים GOD-TIER",
    commands: [
      {
        id: "buildskill",
        command: "/buildskill",
        params: '"[description]"',
        description: "יצירת skill חדש GOD-TIER",
      },
    ],
  },
];

// ================================
// PLUGINS - תוספים
// ================================

export interface Plugin {
  id: string;
  name: string;
  description: string;
  commands: Command[];
}

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
      {
        id: "gh-pr",
        command: "gh pr",
        description: "פעולות Pull Request",
      },
      {
        id: "gh-issue",
        command: "gh issue",
        description: "ניהול Issues",
      },
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
      {
        id: "commit-cmd",
        command: "/commit",
        description: "יצירת commit",
      },
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
      {
        id: "ts-check",
        command: "tsc --noEmit",
        description: "בדיקת טייפים",
      },
      {
        id: "ts-watch",
        command: "tsc --watch",
        description: "מצב צפייה",
      },
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
      {
        id: "pw-type",
        command: "browser_type",
        description: "הקלדת טקסט",
      },
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

// ================================
// HARD STOPS SUMMARY
// ================================

export interface HardStop {
  after: string;
  check: string;
  condition: string;
  ifFailed: string;
}

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
  {
    after: "/audit",
    check: "49-Gate",
    condition: "49/49",
    ifFailed: "/heal",
  },
  {
    after: "/git audit",
    check: "Pre-commit",
    condition: "All pass",
    ifFailed: "DO NOT COMMIT",
  },
];

// ================================
// SKILLS SUMMARY
// ================================

export interface SkillSummary {
  number: number;
  name: string;
  phase: string;
  role: string;
  keyCommands: string[];
}

export const SKILLS_SUMMARY: SkillSummary[] = [
  {
    number: 0,
    name: "OMEGA-BOOT",
    phase: "-1",
    role: "Session Orchestrator",
    keyCommands: ["/boot", "/boot status", "/boot route"],
  },
  {
    number: 1,
    name: "APEX-PRIME",
    phase: "0 + 4",
    role: "Supreme Auditor",
    keyCommands: ["/scan", "/audit --boris", "/certify --atomic"],
  },
  {
    number: 2,
    name: "APEX-INIT",
    phase: "1",
    role: "System Bootstrapper",
    keyCommands: ["/init new", "/init align --force", "/init audit --49"],
  },
  {
    number: 3,
    name: "TPA",
    phase: "2",
    role: "Type Guardian",
    keyCommands: ["/tpa audit", "/tpa fix --any", "/tpa align"],
  },
  {
    number: 4,
    name: "CLD",
    phase: "2.5",
    role: "God Mode Repairs",
    keyCommands: ["/fix --all", "/god", "/cld audit --49"],
  },
  {
    number: 5,
    name: "APEX-UI",
    phase: "2.6",
    role: "Design Visionary",
    keyCommands: [
      "/ui dna --archetype",
      "/ui discover --deep",
      "/ui slop-check",
    ],
  },
  {
    number: 6,
    name: "APEX-AI",
    phase: "2.75",
    role: "Neural Orchestrator",
    keyCommands: ["/ai agent", "/mcp", "/ai audit --omega"],
  },
  {
    number: 7,
    name: "APEX-QA",
    phase: "3",
    role: "Forensic Sentinel",
    keyCommands: ["/qa run", "/qa secure", "/qa watch"],
  },
  {
    number: 8,
    name: "VERIFY-APP",
    phase: "3.5",
    role: "E2E Verification",
    keyCommands: ["/verify-app", "/verify-iterate"],
  },
  {
    number: 9,
    name: "APEX-GIT",
    phase: "5",
    role: "Deployment Guardian",
    keyCommands: ["/commit", "/commit-push-pr", "/git status --omega"],
  },
  {
    number: 10,
    name: "APEX-DEPLOY",
    phase: "5.5",
    role: "Deployment Orchestrator",
    keyCommands: ["/deploy staging", "/deploy production", "/deploy rollback"],
  },
  {
    number: 11,
    name: "APEX-MONITOR",
    phase: "6",
    role: "Observability Engine",
    keyCommands: ["/monitor status", "/monitor errors", "/monitor perf"],
  },
  {
    number: 12,
    name: "APEX-HOTFIX",
    phase: "EMERGENCY",
    role: "Emergency Responder",
    keyCommands: ["/hotfix start", "/hotfix deploy --fast", "/hotfix close"],
  },
  {
    number: 13,
    name: "SINGULARITY-FORGE",
    phase: "META",
    role: "Skill Architect",
    keyCommands: ["/buildskill"],
  },
];

// ================================
// RESPONSIVE DESIGN - Breakpoints & Devices
// ================================

export interface Breakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  tailwindClass: string;
  description: string;
}

export const BREAKPOINTS: Breakpoint[] = [
  {
    name: "Mobile",
    minWidth: 320,
    maxWidth: 767,
    tailwindClass: "sm",
    description: "טלפונים ומסכים קטנים",
  },
  {
    name: "Tablet",
    minWidth: 768,
    maxWidth: 1023,
    tailwindClass: "md",
    description: "טאבלטים",
  },
  {
    name: "Desktop",
    minWidth: 1024,
    maxWidth: 1279,
    tailwindClass: "lg",
    description: "מסכי מחשב",
  },
  {
    name: "Large Desktop",
    minWidth: 1280,
    maxWidth: 1535,
    tailwindClass: "xl",
    description: "מסכים גדולים",
  },
  {
    name: "Ultra Wide",
    minWidth: 1536,
    tailwindClass: "2xl",
    description: "מסכים רחבים מאוד",
  },
];

export interface Device {
  name: string;
  width: number;
  height: number;
  type: "mobile" | "tablet" | "desktop";
  required: boolean;
}

export const DEVICES: Device[] = [
  {
    name: "iPhone SE",
    width: 320,
    height: 568,
    type: "mobile",
    required: true,
  },
  {
    name: "Android ישן",
    width: 360,
    height: 640,
    type: "mobile",
    required: true,
  },
  {
    name: "iPhone 6/7/8",
    width: 375,
    height: 667,
    type: "mobile",
    required: true,
  },
  {
    name: "iPhone Plus",
    width: 414,
    height: 736,
    type: "mobile",
    required: true,
  },
  { name: "Pixel 5", width: 393, height: 851, type: "mobile", required: true },
  {
    name: "iPhone 12",
    width: 390,
    height: 844,
    type: "mobile",
    required: true,
  },
  {
    name: "iPad Portrait",
    width: 768,
    height: 1024,
    type: "tablet",
    required: true,
  },
  {
    name: "iPad Landscape",
    width: 1024,
    height: 768,
    type: "tablet",
    required: true,
  },
  {
    name: "Desktop סטנדרטי",
    width: 1280,
    height: 720,
    type: "desktop",
    required: true,
  },
  {
    name: "Desktop רחב",
    width: 1440,
    height: 900,
    type: "desktop",
    required: false,
  },
  {
    name: "Full HD",
    width: 1920,
    height: 1080,
    type: "desktop",
    required: false,
  },
  { name: "QHD", width: 2560, height: 1440, type: "desktop", required: false },
  { name: "4K", width: 3840, height: 2160, type: "desktop", required: false },
];

export interface TouchTarget {
  element: string;
  minimum: string;
  recommended: string;
}

export const TOUCH_TARGETS: TouchTarget[] = [
  { element: "כפתורים", minimum: "44x44px", recommended: "48x48px" },
  { element: "לינקים", minimum: "44x44px", recommended: "48x48px" },
  {
    element: "Form inputs",
    minimum: "44px height",
    recommended: "48px height",
  },
  { element: "רווח בין targets", minimum: "8px", recommended: "12px" },
];

// ================================
// CATEGORIES - קטגוריות לפי תחום
// ================================

export interface Category {
  id: string;
  name: string;
  nameHe: string;
  icon: string;
  color: string;
  commandPatterns: string[]; // Patterns to match command IDs
}

export const CATEGORIES: Category[] = [
  {
    id: "boot",
    name: "Boot/Session",
    nameHe: "אתחול",
    icon: "power-outline",
    color: "#F43F5E",
    commandPatterns: ["boot"],
  },
  {
    id: "ui-ux",
    name: "UI/UX",
    nameHe: "עיצוב",
    icon: "color-palette-outline",
    color: "#EC4899",
    commandPatterns: ["ui-"],
  },
  {
    id: "types",
    name: "Types/Structure",
    nameHe: "טייפים",
    icon: "code-slash-outline",
    color: "#F59E0B",
    commandPatterns: ["tpa-", "types"],
  },
  {
    id: "fix",
    name: "Fix/Debug",
    nameHe: "תיקון",
    icon: "hammer-outline",
    color: "#EF4444",
    commandPatterns: [
      "cld-",
      "fix",
      "god",
      "shred",
      "override",
      "purge",
      "forensic",
      "preview",
    ],
  },
  {
    id: "qa",
    name: "QA/Tests",
    nameHe: "בדיקות",
    icon: "shield-checkmark-outline",
    color: "#06B6D4",
    commandPatterns: [
      "qa-",
      "test",
      "unit",
      "e2e",
      "rtl",
      "secure",
      "perf",
      "coverage",
      "vrt",
      "regression",
      "watch",
    ],
  },
  {
    id: "verify",
    name: "Verify",
    nameHe: "אימות",
    icon: "eye-outline",
    color: "#10B981",
    commandPatterns: ["verify-"],
  },
  {
    id: "audit",
    name: "Audit/Certify",
    nameHe: "אישור",
    icon: "ribbon-outline",
    color: "#F97316",
    commandPatterns: [
      "prime-",
      "audit",
      "certify",
      "heal",
      "clean",
      "sandbox",
      "report",
      "omega",
      "verify",
      "sync",
    ],
  },
  {
    id: "git",
    name: "Git/Deploy",
    nameHe: "גיט",
    icon: "git-branch-outline",
    color: "#14B8A6",
    commandPatterns: [
      "git-",
      "status",
      "commit",
      "push",
      "pr",
      "deploy",
      "release",
      "tag",
    ],
  },
  {
    id: "init",
    name: "Init/Genesis",
    nameHe: "יצירה",
    icon: "rocket-outline",
    color: "#34D399",
    commandPatterns: [
      "init-",
      "genesis",
      "bootstrap",
      "align",
      "context",
      "dna-lock",
    ],
  },
  {
    id: "ai",
    name: "AI/Neural",
    nameHe: "ניורל",
    icon: "hardware-chip-outline",
    color: "#8B5CF6",
    commandPatterns: ["ai-", "agent", "mcp", "simulate"],
  },
  {
    id: "scan",
    name: "Scan/Analyze",
    nameHe: "סריקה",
    icon: "search-outline",
    color: "#818CF8",
    commandPatterns: ["scan", "map", "analyze", "check", "drift"],
  },
  {
    id: "deploy",
    name: "Deploy",
    nameHe: "פריסה",
    icon: "cloud-upload-outline",
    color: "#10B981",
    commandPatterns: [
      "deploy-",
      "deploy staging",
      "deploy production",
      "deploy rollback",
    ],
  },
  {
    id: "monitor",
    name: "Monitor",
    nameHe: "מעקב",
    icon: "analytics-outline",
    color: "#3B82F6",
    commandPatterns: [
      "monitor-",
      "monitor status",
      "monitor errors",
      "monitor perf",
    ],
  },
  {
    id: "hotfix",
    name: "Hotfix/Emergency",
    nameHe: "חירום",
    icon: "flame-outline",
    color: "#EF4444",
    commandPatterns: [
      "hotfix-",
      "hotfix start",
      "hotfix deploy",
      "hotfix close",
    ],
  },
];

// Get commands by category
export function getCommandsByCategory(
  categoryId: string,
): (Command & { phaseId?: string; phaseName?: string })[] {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];

  return ALL_COMMANDS.filter((cmd) =>
    category.commandPatterns.some(
      (pattern) => cmd.id.includes(pattern) || cmd.command.includes(pattern),
    ),
  );
}

// ================================
// HELPER FUNCTIONS
// ================================

// Quick Actions - הפקודות הכי נפוצות
export const QUICK_ACTIONS: Command[] = PHASES.flatMap((phase) =>
  phase.commands.filter((cmd) => cmd.isQuickAction),
);

// כל הפקודות ברשימה אחת
export const ALL_COMMANDS: (Command & {
  phaseId?: string;
  phaseName?: string;
})[] = PHASES.flatMap((phase) =>
  phase.commands.map((cmd) => ({
    ...cmd,
    phaseId: phase.id,
    phaseName: phase.name,
  })),
);

// ספירת פקודות
export const TOTAL_COMMANDS = ALL_COMMANDS.length;

// חיפוש פקודות
export function searchCommands(
  query: string,
): (Command & { phaseId?: string; phaseName?: string })[] {
  const lowerQuery = query.toLowerCase();
  return ALL_COMMANDS.filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery) ||
      cmd.flags?.some((f) => f.toLowerCase().includes(lowerQuery)) ||
      cmd.params?.toLowerCase().includes(lowerQuery),
  );
}

// מציאת Phase לפי ID
export function getPhaseById(id: string): Phase | undefined {
  return PHASES.find((p) => p.id === id);
}

// מציאת פקודה לפי ID
export function getCommandById(id: string): Command | undefined {
  return ALL_COMMANDS.find((c) => c.id === id);
}

// בניית טקסט מלא של פקודה
export function buildFullCommand(cmd: Command, withFlags = false): string {
  let text = cmd.command;

  if (withFlags && cmd.flags?.length) {
    text += ` ${cmd.flags[0]}`;
  }

  if (cmd.params) {
    text += ` ${cmd.params}`;
  }

  return text;
}

// מציאת Hard Stop לפי פקודה
export function getHardStopForCommand(
  commandStr: string,
): HardStop | undefined {
  return HARD_STOPS.find((hs) => hs.after === commandStr);
}
