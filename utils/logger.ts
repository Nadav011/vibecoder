/**
 * Logger utility that only logs in development mode
 * Prevents console output in production builds
 */

type _LogLevel = "log" | "info" | "warn" | "error" | "debug";

interface Logger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

const noop = () => {};

function createLogger(): Logger {
  // __DEV__ is a global constant in React Native/Expo
  // In production builds, it's false
  const isDev =
    typeof __DEV__ !== "undefined"
      ? __DEV__
      : process.env.NODE_ENV !== "production";

  if (!isDev) {
    return {
      log: noop,
      info: noop,
      warn: noop,
      error: noop,
      debug: noop,
    };
  }

  return {
    log: (...args: unknown[]) => console.log("[VibeCoder]", ...args),
    info: (...args: unknown[]) => console.info("[VibeCoder]", ...args),
    warn: (...args: unknown[]) => console.warn("[VibeCoder]", ...args),
    error: (...args: unknown[]) => console.error("[VibeCoder]", ...args),
    debug: (...args: unknown[]) => console.debug("[VibeCoder]", ...args),
  };
}

export const logger = createLogger();

// Shorthand exports
export const { log, info, warn, error, debug } = logger;
