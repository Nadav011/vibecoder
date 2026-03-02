import { useState, useMemo, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { haptics } from "../../../utils/haptics";
import { storage } from "../../../utils/storage";
import {
  syncWorkflowProgressToCloud,
  fetchWorkflowProgressFromCloud,
} from "../../../lib/sync";
import {
  PHASES,
  SKILLS_SUMMARY,
  USE_CASES,
  PROJECT_FLOWS,
  CATEGORIES,
  searchCommands,
  getFlutterPhases,
  getWebPhases,
  getFlutterSkills,
  getWebSkills,
  getFlutterUseCases,
  getWebUseCases,
  getFlutterProjectFlows,
  getWebProjectFlows,
  getFlutterCategories,
  getWebCategories,
  Phase,
  Command,
  UseCase,
  ProjectFlow,
  PlatformFilter,
} from "../../../data/workflows";
import { colors } from "../../../theme";

export type ViewMode =
  | "fullFlow"
  | "categories"
  | "phases"
  | "useCases"
  | "skills"
  | "components"
  | "hardStops"
  | "plugins"
  | "responsive";

export interface FlowProgress {
  completed: number;
  total: number;
  percent: number;
}

export interface CategoryProgressItem {
  id: string;
  label: string;
  icon: string;
  completed: number;
  total: number;
  color: string;
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: string;
}

export interface UseWorkflowsStateReturn {
  // Basic state
  selectedPhaseId: string;
  setSelectedPhaseId: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  platformFilter: PlatformFilter;
  setPlatformFilter: React.Dispatch<React.SetStateAction<PlatformFilter>>;

  // Category and flow selection
  selectedCategoryId: string | null;
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedFlowId: string | null;
  setSelectedFlowId: React.Dispatch<React.SetStateAction<string | null>>;

  // UI state
  recentCopies: string[];
  setRecentCopies: React.Dispatch<React.SetStateAction<string[]>>;
  showHelpPopup: boolean;
  setShowHelpPopup: React.Dispatch<React.SetStateAction<boolean>>;
  selectedHelpTopic: string | null;
  setSelectedHelpTopic: React.Dispatch<React.SetStateAction<string | null>>;

  // Expansion state
  expandedSkillName: string | null;
  setExpandedSkillName: React.Dispatch<React.SetStateAction<string | null>>;
  expandedPhaseId: string | null;
  setExpandedPhaseId: React.Dispatch<React.SetStateAction<string | null>>;
  expandedPluginId: string | null;
  setExpandedPluginId: React.Dispatch<React.SetStateAction<string | null>>;

  // Progress tracking
  completedSteps: Set<string>;
  setCompletedSteps: React.Dispatch<React.SetStateAction<Set<string>>>;

  // NEW: Beginner mode
  isBeginnerMode: boolean;
  setIsBeginnerMode: React.Dispatch<React.SetStateAction<boolean>>;

  // NEW: Search history
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  // NEW: Progress expanded state
  isProgressExpanded: boolean;
  setIsProgressExpanded: React.Dispatch<React.SetStateAction<boolean>>;

  // Filtered data (memoized)
  filteredPhases: Phase[];
  filteredSkills: typeof SKILLS_SUMMARY;
  filteredUseCases: UseCase[];
  filteredProjectFlows: ProjectFlow[];
  filteredCategories: typeof CATEGORIES;
  selectedPhase: Phase;
  filteredCommands: Command[];
  allSearchResults: Command[];

  // NEW: Category progress for GlobalProgress
  categoryProgress: CategoryProgressItem[];
  totalProgress: { completed: number; total: number };

  // NEW: Breadcrumb items
  breadcrumbItems: BreadcrumbItem[];

  // Callbacks
  toggleStepComplete: (flowId: string, stepNumber: number) => void;
  isStepCompleted: (flowId: string, stepNumber: number) => boolean;
  getFlowProgress: (flow: ProjectFlow) => FlowProgress;
  handleCopy: (text: string) => void;
  copyUseCaseCommands: (useCase: UseCase) => Promise<void>;
  clearRecentCopies: () => void;
  navigateBreadcrumb: (itemId: string, index: number) => void;
}

// View mode labels for breadcrumb
const VIEW_MODE_LABELS: Record<ViewMode, { label: string; icon: string }> = {
  fullFlow: { label: "זרימה", icon: "git-network-outline" },
  categories: { label: "קטגוריות", icon: "grid-outline" },
  phases: { label: "שלבים", icon: "layers-outline" },
  useCases: { label: "תבניות", icon: "document-text-outline" },
  skills: { label: "סקילים", icon: "flash-outline" },
  components: { label: "קומפוננטות", icon: "cube-outline" },
  hardStops: { label: "Hard Stops", icon: "warning-outline" },
  plugins: { label: "פלאגינים", icon: "extension-puzzle-outline" },
  responsive: { label: "רספונסיב", icon: "phone-portrait-outline" },
};

export function useWorkflowsState(): UseWorkflowsStateReturn {
  // Basic state
  const [selectedPhaseId, setSelectedPhaseId] = useState(PHASES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("fullFlow");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");

  // Category and flow selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

  // UI state
  const [recentCopies, setRecentCopies] = useState<string[]>([]);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [selectedHelpTopic, setSelectedHelpTopic] = useState<string | null>(
    null,
  );

  // Expansion state
  const [expandedSkillName, setExpandedSkillName] = useState<string | null>(
    null,
  );
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);
  const [expandedPluginId, setExpandedPluginId] = useState<string | null>(null);

  // Progress tracking - Track completed steps per flow (flowId-stepNumber format)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // NEW: Beginner mode
  const [isBeginnerMode, setIsBeginnerMode] = useState(false);

  // NEW: Search history
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // NEW: Progress expanded state
  const [isProgressExpanded, setIsProgressExpanded] = useState(false);

  // Filtered data based on platform selection
  const filteredPhases = useMemo(() => {
    switch (platformFilter) {
      case "web":
        return getWebPhases();
      case "flutter":
        return getFlutterPhases();
      default:
        return PHASES;
    }
  }, [platformFilter]);

  const filteredSkills = useMemo(() => {
    switch (platformFilter) {
      case "web":
        return getWebSkills();
      case "flutter":
        return getFlutterSkills();
      default:
        return SKILLS_SUMMARY;
    }
  }, [platformFilter]);

  const filteredUseCases = useMemo(() => {
    switch (platformFilter) {
      case "web":
        return getWebUseCases();
      case "flutter":
        return getFlutterUseCases();
      default:
        return USE_CASES;
    }
  }, [platformFilter]);

  const filteredProjectFlows = useMemo(() => {
    switch (platformFilter) {
      case "web":
        return getWebProjectFlows();
      case "flutter":
        return getFlutterProjectFlows();
      default:
        return PROJECT_FLOWS;
    }
  }, [platformFilter]);

  const filteredCategories = useMemo(() => {
    switch (platformFilter) {
      case "web":
        return getWebCategories();
      case "flutter":
        return getFlutterCategories();
      default:
        return CATEGORIES;
    }
  }, [platformFilter]);

  // Get selected phase
  const selectedPhase = useMemo(
    () => PHASES.find((p) => p.id === selectedPhaseId) || PHASES[0],
    [selectedPhaseId],
  );

  // Filter commands by search
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectedPhase.commands;
    }
    return searchCommands(searchQuery).filter(
      (cmd) =>
        (cmd as Command & { phaseId?: string }).phaseId === selectedPhaseId ||
        !searchQuery,
    );
  }, [searchQuery, selectedPhase, selectedPhaseId]);

  // All search results (across all phases)
  const allSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchCommands(searchQuery);
  }, [searchQuery]);

  // NEW: Category progress for GlobalProgress
  const categoryProgress = useMemo<CategoryProgressItem[]>(() => {
    const categories: CategoryProgressItem[] = [
      {
        id: "start",
        label: "התחלה",
        icon: "rocket-outline",
        color: colors.accent.success,
        completed: 0,
        total: 0,
      },
      {
        id: "learn",
        label: "למידה",
        icon: "book-outline",
        color: colors.accent.primary,
        completed: 0,
        total: 0,
      },
      {
        id: "reference",
        label: "Reference",
        icon: "library-outline",
        color: colors.accent.info,
        completed: 0,
        total: 0,
      },
      {
        id: "tools",
        label: "כלים",
        icon: "construct-outline",
        color: colors.accent.warning,
        completed: 0,
        total: 0,
      },
    ];

    // Count progress based on project flows
    filteredProjectFlows.forEach((flow) => {
      const stepsCompleted = flow.steps.filter((step) =>
        completedSteps.has(`${flow.id}-${step.stepNumber}`),
      ).length;
      const totalSteps = flow.steps.length;

      // Assign to first category for simplicity
      categories[0].completed += stepsCompleted;
      categories[0].total += totalSteps;
    });

    return categories;
  }, [filteredProjectFlows, completedSteps]);

  // NEW: Total progress
  const totalProgress = useMemo(() => {
    let completed = 0;
    let total = 0;
    filteredProjectFlows.forEach((flow) => {
      flow.steps.forEach((step) => {
        total++;
        if (completedSteps.has(`${flow.id}-${step.stepNumber}`)) {
          completed++;
        }
      });
    });
    return { completed, total };
  }, [filteredProjectFlows, completedSteps]);

  // NEW: Breadcrumb items
  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { id: "home", label: "Workflows", icon: "home-outline" },
    ];

    const viewInfo = VIEW_MODE_LABELS[viewMode];
    items.push({ id: viewMode, label: viewInfo.label, icon: viewInfo.icon });

    // Add sub-selection if any
    if (selectedCategoryId && viewMode === "categories") {
      const category = filteredCategories.find(
        (c) => c.id === selectedCategoryId,
      );
      if (category) {
        items.push({
          id: selectedCategoryId,
          label: category.nameHe || category.name,
        });
      }
    }

    if (selectedFlowId && viewMode === "phases") {
      const flow = filteredProjectFlows.find((f) => f.id === selectedFlowId);
      if (flow) {
        items.push({ id: selectedFlowId, label: flow.nameHe || flow.name });
      }
    }

    if (expandedSkillName && viewMode === "skills") {
      items.push({ id: expandedSkillName, label: expandedSkillName });
    }

    return items;
  }, [
    viewMode,
    selectedCategoryId,
    selectedFlowId,
    expandedSkillName,
    filteredCategories,
    filteredProjectFlows,
  ]);

  // Toggle step completion
  const toggleStepComplete = useCallback(
    (flowId: string, stepNumber: number) => {
      const key = `${flowId}-${stepNumber}`;
      setCompletedSteps((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        // Save to persistent storage (works on all platforms)
        const completedArray = [...newSet];
        storage.setWorkflowProgress(completedArray);

        // Sync to cloud - extract step numbers for this flow
        const flowSteps = completedArray
          .filter((k) => k.startsWith(`${flowId}-`))
          .map((k) => parseInt(k.split("-")[1], 10));
        syncWorkflowProgressToCloud(flowId, flowSteps);

        return newSet;
      });
      haptics.light();
    },
    [],
  );

  // Check if step is completed
  const isStepCompleted = useCallback(
    (flowId: string, stepNumber: number) => {
      return completedSteps.has(`${flowId}-${stepNumber}`);
    },
    [completedSteps],
  );

  // Get progress for a flow
  const getFlowProgress = useCallback(
    (flow: ProjectFlow): FlowProgress => {
      const completed = flow.steps.filter((step) =>
        isStepCompleted(flow.id, step.stepNumber),
      ).length;
      return {
        completed,
        total: flow.steps.length,
        percent: Math.round((completed / flow.steps.length) * 100),
      };
    },
    [isStepCompleted],
  );

  // Handle copy tracking
  const handleCopy = useCallback((text: string) => {
    setRecentCopies((prev) => {
      // Avoid duplicates
      const filtered = prev.filter((t) => t !== text);
      return [text, ...filtered.slice(0, 9)];
    });
  }, []);

  // Clear recent copies
  const clearRecentCopies = useCallback(() => {
    setRecentCopies([]);
    haptics.light();
  }, []);

  // Copy use case commands
  const copyUseCaseCommands = useCallback(
    async (useCase: UseCase) => {
      const text = useCase.commands.join("\n");
      if (Platform.OS === "web" && typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(text);
      }
      haptics.success();
      handleCopy(text);
    },
    [handleCopy],
  );

  // NEW: Add search to history
  const addSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q !== query);
      return [query, ...filtered.slice(0, 9)];
    });
  }, []);

  // NEW: Clear search history
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    haptics.light();
  }, []);

  // NEW: Navigate breadcrumb
  const navigateBreadcrumb = useCallback((itemId: string, _index: number) => {
    if (itemId === "home") {
      // Go to default view
      setViewMode("fullFlow");
      setSelectedCategoryId(null);
      setSelectedFlowId(null);
      setExpandedSkillName(null);
    } else if (VIEW_MODE_LABELS[itemId as ViewMode]) {
      // Clear sub-selections
      setSelectedCategoryId(null);
      setSelectedFlowId(null);
      setExpandedSkillName(null);
    }
    haptics.selection();
  }, []);

  // Load saved progress on mount (cloud first, then local)
  useEffect(() => {
    const loadProgress = async () => {
      // Try cloud first
      const cloudProgress = await fetchWorkflowProgressFromCloud();
      if (cloudProgress && cloudProgress.size > 0) {
        // Convert Map to Set of "flowId-stepNumber" strings
        const completedSet = new Set<string>();
        cloudProgress.forEach((steps, flowId) => {
          steps.forEach((stepNum) => {
            completedSet.add(`${flowId}-${stepNum}`);
          });
        });
        storage.setWorkflowProgress([...completedSet]);
        setCompletedSteps(completedSet);
        return;
      }

      // Fall back to local
      const saved = await storage.getWorkflowProgress();
      if (saved && Array.isArray(saved)) {
        setCompletedSteps(new Set(saved));
        // Sync local data to cloud
        const flowMap = new Map<string, number[]>();
        saved.forEach((key: string) => {
          const [flowId, stepStr] = key.split("-");
          const steps = flowMap.get(flowId) || [];
          steps.push(parseInt(stepStr, 10));
          flowMap.set(flowId, steps);
        });
        flowMap.forEach((steps, flowId) => {
          syncWorkflowProgressToCloud(flowId, steps);
        });
      }
    };
    loadProgress();
  }, []);

  // Track search queries
  useEffect(() => {
    if (searchQuery.trim() && searchQuery.length >= 2) {
      const timer = setTimeout(() => {
        addSearchHistory(searchQuery);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, addSearchHistory]);

  return {
    // Basic state
    selectedPhaseId,
    setSelectedPhaseId,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    platformFilter,
    setPlatformFilter,

    // Category and flow selection
    selectedCategoryId,
    setSelectedCategoryId,
    selectedFlowId,
    setSelectedFlowId,

    // UI state
    recentCopies,
    setRecentCopies,
    showHelpPopup,
    setShowHelpPopup,
    selectedHelpTopic,
    setSelectedHelpTopic,

    // Expansion state
    expandedSkillName,
    setExpandedSkillName,
    expandedPhaseId,
    setExpandedPhaseId,
    expandedPluginId,
    setExpandedPluginId,

    // Progress tracking
    completedSteps,
    setCompletedSteps,

    // NEW: Beginner mode
    isBeginnerMode,
    setIsBeginnerMode,

    // NEW: Search history
    searchHistory,
    addSearchHistory,
    clearSearchHistory,

    // NEW: Progress expanded state
    isProgressExpanded,
    setIsProgressExpanded,

    // Filtered data (memoized)
    filteredPhases,
    filteredSkills,
    filteredUseCases,
    filteredProjectFlows,
    filteredCategories,
    selectedPhase,
    filteredCommands,
    allSearchResults,

    // NEW: Category progress
    categoryProgress,
    totalProgress,

    // NEW: Breadcrumb items
    breadcrumbItems,

    // Callbacks
    toggleStepComplete,
    isStepCompleted,
    getFlowProgress,
    handleCopy,
    copyUseCaseCommands,
    clearRecentCopies,
    navigateBreadcrumb,
  };
}
