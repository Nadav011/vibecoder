import { Platform } from "react-native";

/**
 * Cleanup function type returned by registerServiceWorker
 */
type CleanupFunction = () => void;

/**
 * Registers the service worker for PWA functionality on web platform.
 *
 * Features:
 * - Only runs on web platform
 * - Registers service worker at '/sw.js'
 * - Listens for SW_UPDATED messages to notify of new versions
 * - Checks for updates every 30 minutes
 * - Returns cleanup function to remove listeners and intervals
 *
 * @param onUpdate - Callback invoked when a new version is available
 * @returns Cleanup function or undefined if not on web platform
 */
export function registerServiceWorker(
  onUpdate: (version: string) => void,
): CleanupFunction | undefined {
  if (
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    "serviceWorker" in navigator
  ) {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    // Listen for update messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SW_UPDATED") {
        console.log("PWA Update available:", event.data.version);
        onUpdate(event.data.version);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration.scope);

          // Check for updates periodically (every 30 minutes)
          intervalId = setInterval(
            () => {
              registration.update();
            },
            30 * 60 * 1000,
          );
        })
        .catch((error) => {
          console.log("SW registration failed:", error);
        });
    });

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }
  return undefined;
}

export default registerServiceWorker;
