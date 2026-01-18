// ================================
// PHASES - Combined Export
// ================================

import { Phase } from "../types";
import { WEB_PHASES } from "./web";
import { FLUTTER_PHASES } from "./flutter";

// Combined phases array
export const PHASES: Phase[] = [...WEB_PHASES, ...FLUTTER_PHASES];

// Re-export individual arrays
export { WEB_PHASES, FLUTTER_PHASES };
