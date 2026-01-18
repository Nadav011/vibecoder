import { strings } from "./strings";

/**
 * Format a timestamp to a human-readable date string in Hebrew
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return strings.today;
  if (days === 1) return strings.tomorrow;
  if (days === -1) return strings.yesterday;
  if (days < 0)
    return strings.daysAgo.replace("{days}", String(Math.abs(days)));
  if (days <= 7) return strings.inDays.replace("{days}", String(days));

  return date.toLocaleDateString("he-IL", { month: "short", day: "numeric" });
}

/**
 * Format a timestamp to a relative time string (for notes)
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דקות`;
  if (hours < 24) return `לפני ${hours} שעות`;
  if (days === 1) return strings.yesterday;
  if (days < 7) return `לפני ${days} ימים`;

  return new Date(timestamp).toLocaleDateString("he-IL", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a timestamp to a full date/time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date/time string
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
