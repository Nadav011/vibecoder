// Main Analytics component
export { Analytics } from "./Analytics";

// Sub-components
export { AnalyticsContent } from "./AnalyticsContent";
export { CompactAnalytics } from "./CompactAnalytics";
export { ProductivityScore } from "./ProductivityScore";
export { TodayStats } from "./TodayStats";
export { WeeklyChart } from "./WeeklyChart";
export { PriorityDistribution } from "./PriorityDistribution";
export { CompletionRate } from "./CompletionRate";
export { AllTimeStats } from "./AllTimeStats";
export { TipsCard } from "./TipsCard";
export { StatCard } from "./StatCard";
export { LegendItem } from "./LegendItem";

// Hook
export { useAnalyticsData } from "./useAnalyticsData";

// Types
export type {
  AnalyticsData,
  DailyStat,
  WeeklyDataPoint,
  PriorityDistribution as PriorityDistributionType,
  PomodoroStatsData,
  StatCardProps,
  LegendItemProps,
} from "./types";
