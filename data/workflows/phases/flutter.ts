// ================================
// FLUTTER PHASES - 28 Mobile Development Skills
// ================================

import { Phase } from "../types";

export const FLUTTER_PHASES: Phase[] = [
  // FLUTTER PHASE -1: BOOT
  {
    id: "flutter-boot",
    number: "-1",
    name: "FLUTTER BOOT",
    nameHe: "אתחול Flutter",
    skill: "FLUTTER-BOOT",
    icon: "phone-portrait-outline",
    color: "#02D7F2",
    description: "התחלת Session Flutter - חובה בכל פתיחה!",
    commands: [
      {
        id: "flutter-boot",
        command: "/flutter boot",
        description: "אתחול סביבת Flutter מלא",
        isQuickAction: true,
      },
      {
        id: "flutter-boot-status",
        command: "/flutter boot status",
        description: "בדיקת סטטוס Flutter SDK",
      },
      {
        id: "flutter-boot-doctor",
        command: "/flutter boot doctor",
        description: "הרצת flutter doctor",
      },
      {
        id: "flutter-boot-upgrade",
        command: "/flutter boot upgrade",
        description: "עדכון Flutter SDK",
      },
      {
        id: "flutter-boot-clean",
        command: "/flutter boot clean",
        description: "ניקוי cache",
      },
      {
        id: "flutter-boot-route",
        command: "/flutter boot route",
        params: '"[prompt]"',
        description: "ניתוב לסקיל המתאים",
      },
    ],
    hardStops: [
      "חובה להריץ /flutter boot בתחילת כל Session",
      "ודא ש-Flutter SDK מותקן ומעודכן",
      "הרץ flutter doctor לפני תחילת עבודה",
    ],
  },

  // FLUTTER PHASE 0+4: PRIME
  {
    id: "flutter-prime",
    number: "0+4",
    name: "FLUTTER PRIME",
    nameHe: "סריקת Flutter",
    skill: "FLUTTER-PRIME",
    icon: "search-outline",
    color: "#818CF8",
    description: "סריקה ואודיט מקיף לפרויקט Flutter",
    commands: [
      {
        id: "flutter-scan",
        command: "/flutter scan",
        flags: ["--deep"],
        description: "סריקת פרויקט מהירה",
        isQuickAction: true,
      },
      {
        id: "flutter-audit",
        command: "/flutter audit",
        description: "אודיט 49-Gate מלא",
      },
      {
        id: "flutter-certify",
        command: "/flutter certify",
        description: "קבלת תעודת איכות",
      },
      {
        id: "flutter-heal",
        command: "/flutter heal",
        description: "תיקון אוטומטי של בעיות",
      },
      {
        id: "flutter-sync",
        command: "/flutter sync",
        description: "סנכרון עם MASTER_COORDINATE",
      },
      {
        id: "flutter-report",
        command: "/flutter report",
        description: "יצירת דוח מלא",
      },
      {
        id: "flutter-check",
        command: "/flutter check",
        description: "בדיקה מהירה",
      },
      {
        id: "flutter-status",
        command: "/flutter status",
        description: "סטטוס פרויקט",
      },
    ],
  },

  // FLUTTER PHASE 1: INIT
  {
    id: "flutter-init",
    number: "1",
    name: "FLUTTER INIT",
    nameHe: "יצירת פרויקט",
    skill: "FLUTTER-INIT",
    icon: "rocket-outline",
    color: "#34D399",
    description: "יצירת פרויקט Flutter חדש עם ארכיטקטורה נכונה",
    commands: [
      {
        id: "flutter-init-new",
        command: "/flutter init new",
        params: "[name]",
        description: "יצירת פרויקט חדש",
        isQuickAction: true,
      },
      {
        id: "flutter-init-firebase",
        command: "/flutter init firebase",
        description: "הוספת Firebase לפרויקט קיים",
      },
      {
        id: "flutter-init-supabase",
        command: "/flutter init supabase",
        description: "הוספת Supabase לפרויקט קיים",
      },
      {
        id: "flutter-init-align",
        command: "/flutter init align",
        flags: ["--force"],
        description: "יישור פרויקט קיים לסטנדרטים",
      },
      {
        id: "flutter-init-template",
        command: "/flutter init template",
        params: "[type]",
        description: "יצירה מתבנית מוכנה",
      },
    ],
  },

  // FLUTTER PHASE 2: ARCH
  {
    id: "flutter-arch",
    number: "2",
    name: "FLUTTER ARCH",
    nameHe: "ארכיטקטורה",
    skill: "FLUTTER-ARCH",
    icon: "git-network-outline",
    color: "#F59E0B",
    description: "Clean Architecture ו-Feature-First structure",
    commands: [
      {
        id: "flutter-arch-analyze",
        command: "/flutter arch analyze",
        description: "ניתוח ארכיטקטורה קיימת",
        isQuickAction: true,
      },
      {
        id: "flutter-arch-feature",
        command: "/flutter arch feature",
        params: "[name]",
        description: "יצירת feature folder מלא",
      },
      {
        id: "flutter-arch-layer",
        command: "/flutter arch layer",
        params: "[name]",
        description: "יצירת layer חדש",
      },
      {
        id: "flutter-arch-refactor",
        command: "/flutter arch refactor",
        description: "שיפור ארכיטקטורה",
      },
      {
        id: "flutter-arch-di",
        command: "/flutter arch di",
        description: "הגדרת Dependency Injection",
      },
      {
        id: "flutter-arch-diagram",
        command: "/flutter arch diagram",
        description: "יצירת דיאגרמת ארכיטקטורה",
      },
    ],
  },

  // FLUTTER PHASE 2.1: TPA
  {
    id: "flutter-tpa",
    number: "2.1",
    name: "FLUTTER TPA",
    nameHe: "טייפים",
    skill: "FLUTTER-TPA",
    icon: "code-slash-outline",
    color: "#F59E0B",
    description: "Dart 3.x Type Safety - Zero Dynamic Tolerance",
    commands: [
      {
        id: "flutter-tpa-audit",
        command: "/flutter tpa audit",
        description: "מציאת כל dynamic types",
        isQuickAction: true,
      },
      {
        id: "flutter-tpa-fix",
        command: "/flutter tpa fix",
        description: "תיקון אוטומטי של טייפים",
      },
      {
        id: "flutter-tpa-strict",
        command: "/flutter tpa strict",
        description: "הפעלת strict mode מקסימלי",
      },
      {
        id: "flutter-tpa-brand",
        command: "/flutter tpa brand",
        params: "[name]",
        description: "יצירת Branded Type (UserId, Email)",
      },
      {
        id: "flutter-tpa-result",
        command: "/flutter tpa result",
        description: "יצירת Result<T,E> pattern",
      },
      {
        id: "flutter-tpa-sealed",
        command: "/flutter tpa sealed",
        params: "[name]",
        description: "יצירת Sealed Class",
      },
      {
        id: "flutter-tpa-extension",
        command: "/flutter tpa extension",
        params: "[name]",
        description: "יצירת Extension Type",
      },
      {
        id: "flutter-tpa-analyze",
        command: "/flutter tpa analyze",
        description: "ניתוח analysis_options.yaml",
      },
    ],
    hardStops: [
      "אסור להשתמש ב-dynamic בשום מקום",
      "כל משתנה חייב טיפוס מפורש",
      "Strict mode חייב להיות פעיל",
    ],
  },

  // FLUTTER PHASE 2.2: STATE
  {
    id: "flutter-state",
    number: "2.2",
    name: "FLUTTER STATE",
    nameHe: "ניהול מצב",
    skill: "FLUTTER-STATE",
    icon: "layers-outline",
    color: "#54C5F8",
    description: "Riverpod 3.0 - State Management",
    commands: [
      {
        id: "flutter-state-setup",
        command: "/flutter state setup",
        description: "התקנת Riverpod 3.0",
        isQuickAction: true,
      },
      {
        id: "flutter-state-add",
        command: "/flutter state add",
        params: "[feature]",
        description: "הוספת state לפיצ'ר",
      },
      {
        id: "flutter-state-migrate",
        command: "/flutter state migrate",
        description: "מיגרציה מ-Provider/Bloc",
      },
      {
        id: "flutter-state-test",
        command: "/flutter state test",
        description: "יצירת בדיקות ל-state",
      },
      {
        id: "flutter-state-async",
        command: "/flutter state async",
        params: "[name]",
        description: "יצירת AsyncNotifier",
      },
      {
        id: "flutter-state-family",
        command: "/flutter state family",
        params: "[name]",
        description: "יצירת Family Provider",
      },
    ],
    hardStops: [
      "רק Riverpod 3.0 - לא Provider, לא Bloc, לא GetX",
      "AsyncNotifier לכל API call",
      "immutable state בלבד",
    ],
  },

  // FLUTTER PHASE 2.3: FIREBASE
  {
    id: "flutter-firebase",
    number: "2.3",
    name: "FLUTTER FIREBASE",
    nameHe: "Firebase",
    skill: "FLUTTER-FIREBASE",
    icon: "flame-outline",
    color: "#FFCA28",
    description: "Firebase Backend Integration",
    commands: [
      {
        id: "flutter-firebase-init",
        command: "/flutter firebase init",
        description: "הגדרת Firebase מלאה",
        isQuickAction: true,
      },
      {
        id: "flutter-firebase-auth",
        command: "/flutter firebase auth",
        description: "הוספת Authentication",
      },
      {
        id: "flutter-firebase-firestore",
        command: "/flutter firebase firestore",
        description: "הגדרת Firestore",
      },
      {
        id: "flutter-firebase-storage",
        command: "/flutter firebase storage",
        description: "הגדרת Storage",
      },
      {
        id: "flutter-firebase-functions",
        command: "/flutter firebase functions",
        description: "הגדרת Cloud Functions",
      },
      {
        id: "flutter-firebase-rules",
        command: "/flutter firebase rules",
        description: "יצירת Security Rules",
      },
      {
        id: "flutter-firebase-messaging",
        command: "/flutter firebase messaging",
        description: "הגדרת FCM",
      },
      {
        id: "flutter-firebase-analytics",
        command: "/flutter firebase analytics",
        description: "הגדרת Analytics",
      },
    ],
  },

  // FLUTTER PHASE 2.3: SUPABASE (Alternative)
  {
    id: "flutter-supabase",
    number: "2.3",
    name: "FLUTTER SUPABASE",
    nameHe: "Supabase",
    skill: "FLUTTER-SUPABASE",
    icon: "server-outline",
    color: "#3ECF8E",
    description: "Supabase + PowerSync Offline-First",
    commands: [
      {
        id: "flutter-supabase-init",
        command: "/flutter supabase init",
        description: "הגדרת Supabase",
        isQuickAction: true,
      },
      {
        id: "flutter-supabase-auth",
        command: "/flutter supabase auth",
        description: "הוספת Auth",
      },
      {
        id: "flutter-supabase-offline",
        command: "/flutter supabase offline",
        description: "הגדרת PowerSync",
      },
      {
        id: "flutter-supabase-rls",
        command: "/flutter supabase rls",
        description: "הגדרת Row Level Security",
      },
      {
        id: "flutter-supabase-migrate",
        command: "/flutter supabase migrate",
        description: "הרצת migrations",
      },
      {
        id: "flutter-supabase-realtime",
        command: "/flutter supabase realtime",
        description: "הגדרת Realtime",
      },
      {
        id: "flutter-supabase-storage",
        command: "/flutter supabase storage",
        description: "הגדרת Storage",
      },
    ],
  },

  // FLUTTER PHASE 2.4: NATIVE
  {
    id: "flutter-native",
    number: "2.4",
    name: "FLUTTER NATIVE",
    nameHe: "Native",
    skill: "FLUTTER-NATIVE",
    icon: "hardware-chip-outline",
    color: "#69F0AE",
    description: "Pigeon FFI - Native Integration",
    commands: [
      {
        id: "flutter-native-pigeon",
        command: "/flutter native pigeon",
        description: "יצירת Pigeon bindings",
        isQuickAction: true,
      },
      {
        id: "flutter-native-ffi",
        command: "/flutter native ffi",
        description: "הגדרת FFI",
      },
      {
        id: "flutter-native-ios",
        command: "/flutter native ios",
        description: "קוד Swift native",
      },
      {
        id: "flutter-native-android",
        command: "/flutter native android",
        description: "קוד Kotlin native",
      },
      {
        id: "flutter-native-channel",
        command: "/flutter native channel",
        params: "[name]",
        description: "יצירת Platform Channel",
      },
      {
        id: "flutter-native-plugin",
        command: "/flutter native plugin",
        params: "[name]",
        description: "יצירת Plugin",
      },
    ],
  },

  // FLUTTER PHASE 2.4: OFFLINE
  {
    id: "flutter-offline",
    number: "2.4",
    name: "FLUTTER OFFLINE",
    nameHe: "Offline",
    skill: "FLUTTER-OFFLINE",
    icon: "cloud-offline-outline",
    color: "#78909C",
    description: "Offline-First Architecture",
    commands: [
      {
        id: "flutter-offline-setup",
        command: "/flutter offline setup",
        description: "הגדרת Hive/Drift",
        isQuickAction: true,
      },
      {
        id: "flutter-offline-sync",
        command: "/flutter offline sync",
        description: "הגדרת sync engine",
      },
      {
        id: "flutter-offline-conflict",
        command: "/flutter offline conflict",
        description: "הגדרת conflict resolution",
      },
      {
        id: "flutter-offline-background",
        command: "/flutter offline background",
        description: "הגדרת background sync",
      },
      {
        id: "flutter-offline-cache",
        command: "/flutter offline cache",
        description: "הגדרת cache strategy",
      },
      {
        id: "flutter-offline-migrate",
        command: "/flutter offline migrate",
        description: "מיגרציית schema",
      },
    ],
  },

  // FLUTTER PHASE 2.5: SECURITY
  {
    id: "flutter-security",
    number: "2.5",
    name: "FLUTTER SECURITY",
    nameHe: "אבטחה",
    skill: "FLUTTER-SECURITY",
    icon: "shield-checkmark-outline",
    color: "#EF4444",
    description: "OWASP Mobile 2024 Compliance",
    commands: [
      {
        id: "flutter-security-audit",
        command: "/flutter security audit",
        description: "אודיט OWASP מלא",
        isQuickAction: true,
      },
      {
        id: "flutter-security-harden",
        command: "/flutter security harden",
        description: "הקשחת האפליקציה",
      },
      {
        id: "flutter-security-pin",
        command: "/flutter security pin",
        description: "Certificate Pinning",
      },
      {
        id: "flutter-security-biometric",
        command: "/flutter security biometric",
        description: "הוספת Biometric Auth",
      },
      {
        id: "flutter-security-storage",
        command: "/flutter security storage",
        description: "Secure Storage setup",
      },
      {
        id: "flutter-security-obfuscate",
        command: "/flutter security obfuscate",
        description: "Code Obfuscation",
      },
    ],
    hardStops: [
      "לא לאחסן secrets בקוד",
      "Certificate Pinning חובה ל-Production",
      "Biometric Auth לפעולות רגישות",
    ],
  },

  // FLUTTER PHASE 2.5: REPAIR
  {
    id: "flutter-repair",
    number: "2.5",
    name: "FLUTTER REPAIR",
    nameHe: "תיקון",
    skill: "FLUTTER-REPAIR",
    icon: "construct-outline",
    color: "#F97316",
    description: "Surgical Code Repair - Zero-Error",
    commands: [
      {
        id: "flutter-repair-diagnose",
        command: "/flutter repair diagnose",
        description: "אבחון בעיות",
        isQuickAction: true,
      },
      {
        id: "flutter-repair-fix",
        command: "/flutter repair fix",
        description: "תיקון אוטומטי",
      },
      {
        id: "flutter-repair-analyze",
        command: "/flutter repair analyze",
        description: "ניתוח AST",
      },
      {
        id: "flutter-repair-deps",
        command: "/flutter repair deps",
        description: "תיקון dependencies",
      },
      {
        id: "flutter-repair-imports",
        command: "/flutter repair imports",
        description: "תיקון imports",
      },
      {
        id: "flutter-repair-null-safety",
        command: "/flutter repair null-safety",
        description: "תיקון null safety",
      },
      {
        id: "flutter-repair-clean",
        command: "/flutter repair clean",
        description: "ניקוי מלא",
      },
    ],
  },

  // FLUTTER PHASE 2.6: UI
  {
    id: "flutter-ui",
    number: "2.6",
    name: "FLUTTER UI",
    nameHe: "עיצוב",
    skill: "FLUTTER-UI",
    icon: "color-palette-outline",
    color: "#EC4899",
    description: "Material 3 - RTL-First Design",
    commands: [
      {
        id: "flutter-ui-discover",
        command: "/flutter ui discover",
        description: "ניתוח Design DNA",
        isQuickAction: true,
      },
      {
        id: "flutter-ui-theme",
        command: "/flutter ui theme",
        description: "הגדרת Material 3 theme",
      },
      {
        id: "flutter-ui-page",
        command: "/flutter ui page",
        params: "[name]",
        description: "יצירת עמוד חדש",
      },
      {
        id: "flutter-ui-component",
        command: "/flutter ui component",
        params: "[name]",
        description: "יצירת component",
      },
      {
        id: "flutter-ui-rtl",
        command: "/flutter ui rtl",
        description: "בדיקת RTL compliance",
      },
      {
        id: "flutter-ui-animate",
        command: "/flutter ui animate",
        description: "הוספת spring animations",
      },
      {
        id: "flutter-ui-responsive",
        command: "/flutter ui responsive",
        description: "הוספת responsive design",
      },
      {
        id: "flutter-ui-a11y",
        command: "/flutter ui a11y",
        description: "בדיקת נגישות",
      },
    ],
    hardStops: [
      "RTL-first - תמיד start/end לא left/right",
      "Spring animations בלבד",
      "WCAG AAA compliance",
    ],
  },

  // FLUTTER PHASE 2.65: I18N
  {
    id: "flutter-i18n",
    number: "2.65",
    name: "FLUTTER I18N",
    nameHe: "לוקליזציה",
    skill: "FLUTTER-I18N",
    icon: "language-outline",
    color: "#8B5CF6",
    description: "Localization & Internationalization",
    commands: [
      {
        id: "flutter-i18n-setup",
        command: "/flutter i18n setup",
        description: "הגדרת l10n",
        isQuickAction: true,
      },
      {
        id: "flutter-i18n-add",
        command: "/flutter i18n add",
        params: "[locale]",
        description: "הוספת שפה חדשה",
      },
      {
        id: "flutter-i18n-rtl",
        command: "/flutter i18n rtl",
        description: "הגדרת RTL support",
      },
      {
        id: "flutter-i18n-extract",
        command: "/flutter i18n extract",
        description: "חילוץ מחרוזות",
      },
      {
        id: "flutter-i18n-sync",
        command: "/flutter i18n sync",
        description: "סנכרון תרגומים",
      },
    ],
  },

  // FLUTTER PHASE 2.68: NOTIFICATIONS
  {
    id: "flutter-notifications",
    number: "2.68",
    name: "FLUTTER NOTIFICATIONS",
    nameHe: "התראות",
    skill: "FLUTTER-NOTIFICATIONS",
    icon: "notifications-outline",
    color: "#F97316",
    description: "Push Notifications - FCM/APNs",
    commands: [
      {
        id: "flutter-notify-setup",
        command: "/flutter notify setup",
        description: "הגדרת Push Notifications",
        isQuickAction: true,
      },
      {
        id: "flutter-notify-fcm",
        command: "/flutter notify fcm",
        description: "הגדרת Firebase Cloud Messaging",
      },
      {
        id: "flutter-notify-local",
        command: "/flutter notify local",
        description: "הגדרת Local Notifications",
      },
      {
        id: "flutter-notify-test",
        command: "/flutter notify test",
        description: "בדיקת notifications",
      },
      {
        id: "flutter-notify-handlers",
        command: "/flutter notify handlers",
        description: "הגדרת handlers",
      },
    ],
  },

  // FLUTTER PHASE 2.7: COMPONENTS
  {
    id: "flutter-components",
    number: "2.7",
    name: "FLUTTER COMPONENTS",
    nameHe: "קומפוננטות",
    skill: "FLUTTER-COMPONENTS",
    icon: "cube-outline",
    color: "#A855F7",
    description: "65+ RTL-First Widgets",
    commands: [
      {
        id: "flutter-components-list",
        command: "/flutter components list",
        description: "רשימת כל 65+ widgets",
        isQuickAction: true,
      },
      {
        id: "flutter-components-install",
        command: "/flutter components install",
        params: "[name]",
        description: "התקנת widget",
      },
      {
        id: "flutter-components-preview",
        command: "/flutter components preview",
        params: "[name]",
        description: "צפייה ב-widget",
      },
      {
        id: "flutter-components-search",
        command: "/flutter components search",
        params: "[query]",
        description: "חיפוש widgets",
      },
      {
        id: "flutter-components-create",
        command: "/flutter components create",
        params: "[name]",
        description: "יצירת widget חדש",
      },
    ],
  },

  // FLUTTER PHASE 2.75: AI
  {
    id: "flutter-ai",
    number: "2.75",
    name: "FLUTTER AI",
    nameHe: "AI מובייל",
    skill: "FLUTTER-AI",
    icon: "bulb-outline",
    color: "#EA80FC",
    description: "Cloud ML Integration - Firebase ML / Gemini",
    commands: [
      {
        id: "flutter-ai-setup",
        command: "/flutter ai setup",
        description: "הגדרת Firebase ML",
        isQuickAction: true,
      },
      {
        id: "flutter-ai-gemini",
        command: "/flutter ai gemini",
        description: "הגדרת Gemini API",
      },
      {
        id: "flutter-ai-vision",
        command: "/flutter ai vision",
        description: "הגדרת Vision ML",
      },
      {
        id: "flutter-ai-text",
        command: "/flutter ai text",
        description: "הגדרת Text ML",
      },
      {
        id: "flutter-ai-model",
        command: "/flutter ai model",
        params: "[type]",
        description: "הוספת ML model",
      },
    ],
  },

  // FLUTTER PHASE 2.76: AI-EDGE
  {
    id: "flutter-ai-edge",
    number: "2.76",
    name: "FLUTTER AI-EDGE",
    nameHe: "AI On-Device",
    skill: "FLUTTER-AI-EDGE",
    icon: "hardware-chip-outline",
    color: "#7C4DFF",
    description: "On-Device ML - TFLite / MediaPipe",
    commands: [
      {
        id: "flutter-ai-edge-setup",
        command: "/flutter ai-edge setup",
        description: "הגדרת TFLite",
        isQuickAction: true,
      },
      {
        id: "flutter-ai-edge-mediapipe",
        command: "/flutter ai-edge mediapipe",
        description: "הגדרת MediaPipe",
      },
      {
        id: "flutter-ai-edge-model",
        command: "/flutter ai-edge model",
        params: "[path]",
        description: "טעינת model מקומי",
      },
      {
        id: "flutter-ai-edge-optimize",
        command: "/flutter ai-edge optimize",
        description: "אופטימיזציית model",
      },
      {
        id: "flutter-ai-edge-benchmark",
        command: "/flutter ai-edge benchmark",
        description: "בדיקת ביצועים",
      },
    ],
  },

  // FLUTTER PHASE 3: QA
  {
    id: "flutter-qa",
    number: "3",
    name: "FLUTTER QA",
    nameHe: "בדיקות",
    skill: "FLUTTER-QA",
    icon: "shield-checkmark-outline",
    color: "#06B6D4",
    description: "Testing Suite - 80% Coverage Minimum",
    commands: [
      {
        id: "flutter-qa-run",
        command: "/flutter qa run",
        description: "הרצת כל הבדיקות",
        isQuickAction: true,
      },
      {
        id: "flutter-qa-unit",
        command: "/flutter qa unit",
        description: "בדיקות unit בלבד",
      },
      {
        id: "flutter-qa-widget",
        command: "/flutter qa widget",
        description: "בדיקות widget בלבד",
      },
      {
        id: "flutter-qa-e2e",
        command: "/flutter qa e2e",
        description: "בדיקות integration",
      },
      {
        id: "flutter-qa-coverage",
        command: "/flutter qa coverage",
        description: "דוח coverage",
      },
      {
        id: "flutter-qa-golden",
        command: "/flutter qa golden",
        description: "Golden tests",
      },
      {
        id: "flutter-qa-watch",
        command: "/flutter qa watch",
        description: "בדיקות בזמן אמת",
      },
      {
        id: "flutter-qa-heal",
        command: "/flutter qa heal",
        description: "תיקון בדיקות שבורות",
      },
    ],
    hardStops: [
      "מינימום 80% coverage",
      "Golden tests לכל UI component",
      "אסור לדלג על בדיקות",
    ],
  },

  // FLUTTER PHASE 3.3: PERF
  {
    id: "flutter-perf",
    number: "3.3",
    name: "FLUTTER PERF",
    nameHe: "ביצועים",
    skill: "FLUTTER-PERF",
    icon: "speedometer-outline",
    color: "#10B981",
    description: "60fps - Performance Profiling",
    commands: [
      {
        id: "flutter-perf-profile",
        command: "/flutter perf profile",
        description: "פרופיילינג מלא",
        isQuickAction: true,
      },
      {
        id: "flutter-perf-frames",
        command: "/flutter perf frames",
        description: "ניתוח frame rate",
      },
      {
        id: "flutter-perf-memory",
        command: "/flutter perf memory",
        description: "בדיקת memory leaks",
      },
      {
        id: "flutter-perf-startup",
        command: "/flutter perf startup",
        description: "אופטימיזציית cold start",
      },
      {
        id: "flutter-perf-bundle",
        command: "/flutter perf bundle",
        description: "ניתוח גודל bundle",
      },
      {
        id: "flutter-perf-tree",
        command: "/flutter perf tree",
        description: "ניתוח widget tree",
      },
    ],
    hardStops: [
      "60fps minimum (16ms frame budget)",
      "Cold start < 2 seconds",
      "No memory leaks allowed",
    ],
  },

  // FLUTTER PHASE 3.5: VERIFY
  {
    id: "flutter-verify",
    number: "3.5",
    name: "FLUTTER VERIFY",
    nameHe: "אימות",
    skill: "FLUTTER-VERIFY",
    icon: "eye-outline",
    color: "#10B981",
    description: "E2E Device Verification",
    commands: [
      {
        id: "flutter-verify-run",
        command: "/flutter verify run",
        description: "הרצת E2E",
        isQuickAction: true,
      },
      {
        id: "flutter-verify-device",
        command: "/flutter verify device",
        description: "בדיקה על device",
      },
      {
        id: "flutter-verify-all",
        command: "/flutter verify all",
        description: "כל הבדיקות",
      },
      {
        id: "flutter-verify-rtl",
        command: "/flutter verify rtl",
        description: "בדיקות RTL",
      },
      {
        id: "flutter-verify-perf",
        command: "/flutter verify perf",
        description: "בדיקות ביצועים",
      },
      {
        id: "flutter-verify-screenshot",
        command: "/flutter verify screenshot",
        description: "screenshots לאימות",
      },
    ],
  },

  // FLUTTER PHASE 5: CI
  {
    id: "flutter-ci",
    number: "5",
    name: "FLUTTER CI",
    nameHe: "CI/CD",
    skill: "FLUTTER-CI",
    icon: "git-branch-outline",
    color: "#8B5CF6",
    description: "Codemagic / GitHub Actions",
    commands: [
      {
        id: "flutter-ci-setup",
        command: "/flutter ci setup",
        description: "הגדרת CI/CD",
        isQuickAction: true,
      },
      {
        id: "flutter-ci-ios",
        command: "/flutter ci ios",
        description: "iOS pipeline",
      },
      {
        id: "flutter-ci-android",
        command: "/flutter ci android",
        description: "Android pipeline",
      },
      {
        id: "flutter-ci-test",
        command: "/flutter ci test",
        description: "Test pipeline",
      },
      {
        id: "flutter-ci-fastlane",
        command: "/flutter ci fastlane",
        description: "הגדרת Fastlane",
      },
      {
        id: "flutter-ci-sign",
        command: "/flutter ci sign",
        description: "הגדרת signing",
      },
    ],
  },

  // FLUTTER PHASE 5: GIT
  {
    id: "flutter-git",
    number: "5",
    name: "FLUTTER GIT",
    nameHe: "גיט",
    skill: "FLUTTER-GIT",
    icon: "git-commit-outline",
    color: "#14B8A6",
    description: "OMEGA Commit Flow",
    commands: [
      {
        id: "flutter-git-commit",
        command: "/flutter git commit",
        description: "OMEGA commit",
        isQuickAction: true,
      },
      {
        id: "flutter-git-push",
        command: "/flutter git push",
        description: "Verified push",
      },
      {
        id: "flutter-git-pr",
        command: "/flutter git pr",
        description: "יצירת Pull Request",
      },
      {
        id: "flutter-git-status",
        command: "/flutter git status",
        description: "סטטוס מורחב",
      },
      {
        id: "flutter-git-sync",
        command: "/flutter git sync",
        description: "סנכרון עם remote",
      },
      {
        id: "flutter-git-tag",
        command: "/flutter git tag",
        params: "[version]",
        description: "יצירת tag",
      },
      {
        id: "flutter-git-release",
        command: "/flutter git release",
        description: "יצירת release",
      },
    ],
  },

  // FLUTTER PHASE 5.5: DEPLOY
  {
    id: "flutter-deploy",
    number: "5.5",
    name: "FLUTTER DEPLOY",
    nameHe: "פריסה",
    skill: "FLUTTER-DEPLOY",
    icon: "cloud-upload-outline",
    color: "#3B82F6",
    description: "App Store & Play Store Deployment",
    commands: [
      {
        id: "flutter-deploy-android",
        command: "/flutter deploy android",
        description: "פריסה ל-Play Store",
        isQuickAction: true,
      },
      {
        id: "flutter-deploy-ios",
        command: "/flutter deploy ios",
        description: "פריסה ל-App Store",
      },
      {
        id: "flutter-deploy-both",
        command: "/flutter deploy both",
        description: "פריסה לשניהם",
      },
      {
        id: "flutter-deploy-beta",
        command: "/flutter deploy beta",
        description: "פריסה ל-TestFlight/Internal",
      },
      {
        id: "flutter-deploy-status",
        command: "/flutter deploy status",
        description: "סטטוס פריסה",
      },
    ],
  },

  // FLUTTER PHASE 5.6: SHOREBIRD
  {
    id: "flutter-shorebird",
    number: "5.6",
    name: "FLUTTER SHOREBIRD",
    nameHe: "OTA",
    skill: "FLUTTER-SHOREBIRD",
    icon: "flash-outline",
    color: "#F59E0B",
    description: "OTA Code Push - No App Store Wait",
    commands: [
      {
        id: "flutter-shorebird-init",
        command: "/flutter shorebird init",
        description: "הגדרת Shorebird",
        isQuickAction: true,
      },
      {
        id: "flutter-shorebird-release",
        command: "/flutter shorebird release",
        description: "יצירת base release",
      },
      {
        id: "flutter-shorebird-patch",
        command: "/flutter shorebird patch",
        description: "שליחת OTA patch",
      },
      {
        id: "flutter-shorebird-status",
        command: "/flutter shorebird status",
        description: "סטטוס patches",
      },
      {
        id: "flutter-shorebird-rollback",
        command: "/flutter shorebird rollback",
        description: "חזרה לגרסה קודמת",
      },
      {
        id: "flutter-shorebird-preview",
        command: "/flutter shorebird preview",
        description: "preview לפני push",
      },
    ],
  },

  // FLUTTER PHASE 6: MONITOR
  {
    id: "flutter-monitor",
    number: "6",
    name: "FLUTTER MONITOR",
    nameHe: "ניטור",
    skill: "FLUTTER-MONITOR",
    icon: "analytics-outline",
    color: "#EC4899",
    description: "Crashlytics & Analytics",
    commands: [
      {
        id: "flutter-monitor-setup",
        command: "/flutter monitor setup",
        description: "הגדרת ניטור",
        isQuickAction: true,
      },
      {
        id: "flutter-monitor-status",
        command: "/flutter monitor status",
        description: "סטטוס בריאות",
      },
      {
        id: "flutter-monitor-errors",
        command: "/flutter monitor errors",
        description: "שגיאות אחרונות",
      },
      {
        id: "flutter-monitor-perf",
        command: "/flutter monitor perf",
        description: "מטריקות ביצועים",
      },
      {
        id: "flutter-monitor-alerts",
        command: "/flutter monitor alerts",
        description: "הגדרת התראות",
      },
      {
        id: "flutter-monitor-dashboard",
        command: "/flutter monitor dashboard",
        description: "פתיחת dashboard",
      },
    ],
  },

  // FLUTTER PHASE EMERGENCY: HOTFIX
  {
    id: "flutter-hotfix",
    number: "EMERGENCY",
    name: "FLUTTER HOTFIX",
    nameHe: "חירום",
    skill: "FLUTTER-HOTFIX",
    icon: "flame-outline",
    color: "#DC2626",
    description: "Emergency Bug Fix Flow",
    commands: [
      {
        id: "flutter-hotfix-start",
        command: "/flutter hotfix start",
        params: "[issue-id]",
        description: "התחלת hotfix",
        isQuickAction: true,
      },
      {
        id: "flutter-hotfix-apply",
        command: "/flutter hotfix apply",
        description: "החלת התיקון",
      },
      {
        id: "flutter-hotfix-verify",
        command: "/flutter hotfix verify",
        description: "אימות התיקון",
      },
      {
        id: "flutter-hotfix-deploy",
        command: "/flutter hotfix deploy",
        description: "פריסה מהירה",
      },
      {
        id: "flutter-hotfix-rollback",
        command: "/flutter hotfix rollback",
        description: "חזרה לאחור",
      },
      {
        id: "flutter-hotfix-close",
        command: "/flutter hotfix close",
        description: "סגירת hotfix",
      },
    ],
    hardStops: [
      "בדיקות חובה לפני deploy",
      "תיעוד מלא של השינויים",
      "Post-mortem חובה אחרי סגירה",
    ],
  },

  // FLUTTER PHASE META: FORGE
  {
    id: "flutter-forge",
    number: "META",
    name: "FLUTTER FORGE",
    nameHe: "יצירת סקיל",
    skill: "FLUTTER-FORGE",
    icon: "hammer-outline",
    color: "#6366F1",
    description: "Build New Flutter Skills",
    commands: [
      {
        id: "flutter-forge",
        command: "/flutter forge",
        params: "[description]",
        description: "יצירת סקיל חדש",
        isQuickAction: true,
      },
      {
        id: "flutter-forge-template",
        command: "/flutter forge template",
        description: "תבנית בסיסית",
      },
      {
        id: "flutter-forge-verify",
        command: "/flutter forge verify",
        description: "אימות סקיל",
      },
    ],
  },
];
