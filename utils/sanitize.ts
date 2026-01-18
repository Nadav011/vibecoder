/**
 * Input sanitization utilities
 * Prevents XSS and other injection attacks
 */

/**
 * Escapes HTML special characters to prevent XSS
 * Use this when user input might be rendered as HTML
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return text.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Removes potentially dangerous characters from text
 * Use for general text input sanitization
 */
export function sanitizeText(text: string): string {
  // Remove null bytes
  let sanitized = text.replace(/\0/g, "");

  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitizes text for use in filenames
 * Removes characters that are invalid in file systems
 */
export function sanitizeFilename(filename: string): string {
  // Remove or replace invalid characters
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_") // Invalid chars to underscore
    .replace(/^\.+/, "") // Remove leading dots
    .replace(/\.+$/, "") // Remove trailing dots
    .replace(/\s+/g, "_") // Spaces to underscores
    .slice(0, 255); // Limit length
}

/**
 * Validates and sanitizes a task title
 */
export function sanitizeTaskTitle(title: string, maxLength = 100): string {
  const sanitized = sanitizeText(title);
  return sanitized.slice(0, maxLength);
}

/**
 * Validates and sanitizes a task description
 */
export function sanitizeTaskDescription(
  description: string,
  maxLength = 500,
): string {
  const sanitized = sanitizeText(description);
  return sanitized.slice(0, maxLength);
}

/**
 * Validates and sanitizes JSON data for import
 * Returns null if data is invalid
 */
export function validateImportData<T>(
  data: unknown,
  validator: (data: unknown) => data is T,
): T | null {
  try {
    if (validator(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Type guard for task array validation
 */
export function isValidTaskArray(data: unknown): data is { title: string }[] {
  if (!Array.isArray(data)) return false;

  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).title === "string",
  );
}
