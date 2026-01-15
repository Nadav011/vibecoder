// Hebrew strings for VibeCoder
export const strings = {
  // App
  appName: "וייבקודר",
  appSubtitle: "ניהול פרויקטים לוייב קודרים",
  pro: "PRO",

  // Navigation
  board: "לוח",
  tasks: "משימות",
  notes: "הערות",

  // Kanban
  columns: {
    todo: "לביצוע",
    inProgress: "בתהליך",
    complete: "הושלם",
  },

  // Task
  newTask: "משימה חדשה",
  editTask: "עריכת משימה",
  taskTitle: "כותרת",
  taskTitlePlaceholder: "מה צריך לעשות?",
  taskDescription: "תיאור",
  taskDescriptionPlaceholder: "הוסף פרטים נוספים...",
  status: "סטטוס",
  priority: "עדיפות",
  labels: "תגיות",
  subtasks: "תתי-משימות",
  addSubtask: "הוסף תת-משימה...",
  aiGenerated: "נוצר עם AI",
  aiGeneratedDesc: "סמן כנוצר בעזרת בינה מלאכותית",
  dueDate: "תאריך יעד",

  // Priority
  priorities: {
    p0: "דחוף",
    p1: "גבוה",
    p2: "רגיל",
    p3: "נמוך",
  },

  // Actions
  create: "צור",
  createTask: "צור משימה",
  save: "שמור",
  saveChanges: "שמור שינויים",
  cancel: "ביטול",
  delete: "מחק",
  clear: "נקה",

  // Search
  searchTasks: "חפש משימות...",
  ai: "AI",
  aiOnly: "רק AI",
  noAi: "ללא AI",

  // Todo
  quickTasks: "משימות מהירות",
  pending: "ממתינות",
  addQuickTask: "הוסף משימה מהירה...",
  clearCompleted: "נקה {count} שהושלמו",

  // Notes
  notesTitle: "הערות",
  startWriting: "התחל לכתוב את המחשבות שלך...",
  untitled: "ללא כותרת",

  // Empty states
  empty: {
    tasks: {
      title: "אין משימות עדיין",
      description: "צור את המשימה הראשונה שלך כדי להתחיל",
      action: "צור משימה",
    },
    todos: {
      title: "הכל מעודכן!",
      description: "הוסף משימות מהירות לתפיסת רעיונות תוך כדי תנועה",
      action: "הוסף משימה",
    },
    notes: {
      title: "אין הערות עדיין",
      description: "התחל לכתוב כדי לתפוס את המחשבות והרעיונות שלך",
      action: "צור הערה",
    },
    search: {
      title: "לא נמצאו תוצאות",
      description: "נסה להתאים את החיפוש או הסינון",
    },
  },

  // Time
  today: "היום",
  tomorrow: "מחר",
  yesterday: "אתמול",
  daysAgo: "לפני {days} ימים",
  inDays: "בעוד {days} ימים",

  // Default labels
  defaultLabels: {
    feature: "פיצ'ר",
    bug: "באג",
    docs: "תיעוד",
    refactor: "ריפקטור",
  },

  // Premium features
  premium: {
    // Command Palette
    commandPalette: "פלטת פקודות",
    searchCommands: "חפש פקודות...",
    recentCommands: "פקודות אחרונות",
    noCommandsFound: "לא נמצאו פקודות",

    // Pomodoro
    pomodoro: "פומודורו",
    startPomodoro: "התחל פומודורו",
    pausePomodoro: "עצור פומודורו",
    skipBreak: "דלג על הפסקה",
    workSession: "זמן עבודה",
    shortBreak: "הפסקה קצרה",
    longBreak: "הפסקה ארוכה",
    sessionsToday: "סשנים היום",
    workMinutes: "דקות עבודה",
    idle: "לא פעיל",

    // Focus Mode
    focusMode: "מצב מיקוד",
    exitFocus: "יציאה ממצב מיקוד",

    // Analytics
    analytics: "סטטיסטיקות",
    tasksCompleted: "משימות שהושלמו",
    todayProgress: "התקדמות היום",
    weeklyStats: "סטטיסטיקות שבועיות",
    productivityScore: "ציון פרודוקטיביות",
    streak: "רצף ימים",
    completionRate: "אחוז השלמה",
    avgCompletionTime: "זמן ממוצע להשלמה",
    mostProductiveHour: "שעה פרודוקטיבית",
    thisWeek: "השבוע",
    thisMonth: "החודש",

    // Export/Import
    export: "ייצוא",
    import: "ייבוא",
    exportData: "ייצוא נתונים",
    exportJson: "ייצוא JSON",
    exportCsv: "ייצוא CSV",
    exportMarkdown: "ייצוא Markdown",
    format: "פורמט",
    whatToExport: "מה לייצא?",
    includeCompleted: "כולל משימות שהושלמו",
    fullBackup: "גיבוי מלא של הנתונים",
    spreadsheetCompatible: "לייבוא לאקסל/גוגל שיטס",
    humanReadable: "קריא ונוח לשיתוף",
    webOnlyWarning: "הורדת קבצים זמינה רק בגרסת הווב",

    // Templates
    templates: "תבניות",
    useTemplate: "השתמש בתבנית",
    saveAsTemplate: "שמור כתבנית",
    bugFix: "תיקון באג",
    newFeature: "פיצ'ר חדש",
    refactorTask: "ריפקטור",
    documentation: "תיעוד",

    // Settings
    settings: "הגדרות",
    theme: "ערכת נושא",
    darkMode: "מצב כהה",
    lightMode: "מצב בהיר",
    systemTheme: "לפי המערכת",

    // Shortcuts
    shortcuts: "קיצורי מקלדת",
    showShortcuts: "הצג קיצורים",
  },
} as const;

export type Strings = typeof strings;
