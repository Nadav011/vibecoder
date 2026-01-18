import { useState, useMemo, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { haptics } from "../../../utils/haptics";
import { storage } from "../../../utils/storage";
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

  // Filtered data (memoized)
  filteredPhases: Phase[];
  filteredSkills: typeof SKILLS_SUMMARY;
  filteredUseCases: UseCase[];
  filteredProjectFlows: ProjectFlow[];
  filteredCategories: typeof CATEGORIES;
  selectedPhase: Phase;
  filteredCommands: Command[];
  allSearchResults: Command[];

  // Callbacks
  toggleStepComplete: (flowId: string, stepNumber: number) => void;
  isStepCompleted: (flowId: string, stepNumber: number) => boolean;
  getFlowProgress: (flow: ProjectFlow) => FlowProgress;
  handleCopy: (text: string) => void;
  copyUseCaseCommands: (useCase: UseCase) => Promise<void>;
}

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
        storage.setWorkflowProgress([...newSet]);
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
    setRecentCopies((prev) => [text, ...prev.slice(0, 9)]);
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

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      const saved = await storage.getWorkflowProgress();
      if (saved && Array.isArray(saved)) {
        setCompletedSteps(new Set(saved));
      }
    };
    loadProgress();
  }, []);

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

    // Filtered data (memoized)
    filteredPhases,
    filteredSkills,
    filteredUseCases,
    filteredProjectFlows,
    filteredCategories,
    selectedPhase,
    filteredCommands,
    allSearchResults,

    // Callbacks
    toggleStepComplete,
    isStepCompleted,
    getFlowProgress,
    handleCopy,
    copyUseCaseCommands,
  };
}
