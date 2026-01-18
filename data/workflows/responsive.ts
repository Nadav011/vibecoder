// ================================
// RESPONSIVE DATA - Breakpoints, Devices, and Touch Targets
// ================================

import { Breakpoint, Device, TouchTarget } from "./types";

export const BREAKPOINTS: Breakpoint[] = [
  {
    name: "Mobile",
    minWidth: 320,
    maxWidth: 767,
    tailwindClass: "sm",
    description: "טלפונים ומסכים קטנים",
  },
  {
    name: "Tablet",
    minWidth: 768,
    maxWidth: 1023,
    tailwindClass: "md",
    description: "טאבלטים",
  },
  {
    name: "Desktop",
    minWidth: 1024,
    maxWidth: 1279,
    tailwindClass: "lg",
    description: "מסכי מחשב",
  },
  {
    name: "Large Desktop",
    minWidth: 1280,
    maxWidth: 1535,
    tailwindClass: "xl",
    description: "מסכים גדולים",
  },
  {
    name: "Ultra Wide",
    minWidth: 1536,
    tailwindClass: "2xl",
    description: "מסכים רחבים מאוד",
  },
];

export const DEVICES: Device[] = [
  {
    name: "iPhone SE",
    width: 320,
    height: 568,
    type: "mobile",
    required: true,
  },
  {
    name: "Android ישן",
    width: 360,
    height: 640,
    type: "mobile",
    required: true,
  },
  {
    name: "iPhone 6/7/8",
    width: 375,
    height: 667,
    type: "mobile",
    required: true,
  },
  {
    name: "iPhone Plus",
    width: 414,
    height: 736,
    type: "mobile",
    required: true,
  },
  { name: "Pixel 5", width: 393, height: 851, type: "mobile", required: true },
  {
    name: "iPhone 12",
    width: 390,
    height: 844,
    type: "mobile",
    required: true,
  },
  {
    name: "iPad Portrait",
    width: 768,
    height: 1024,
    type: "tablet",
    required: true,
  },
  {
    name: "iPad Landscape",
    width: 1024,
    height: 768,
    type: "tablet",
    required: true,
  },
  {
    name: "Desktop סטנדרטי",
    width: 1280,
    height: 720,
    type: "desktop",
    required: true,
  },
  {
    name: "Desktop רחב",
    width: 1440,
    height: 900,
    type: "desktop",
    required: false,
  },
  {
    name: "Full HD",
    width: 1920,
    height: 1080,
    type: "desktop",
    required: false,
  },
  { name: "QHD", width: 2560, height: 1440, type: "desktop", required: false },
  { name: "4K", width: 3840, height: 2160, type: "desktop", required: false },
];

export const TOUCH_TARGETS: TouchTarget[] = [
  { element: "כפתורים", minimum: "44x44px", recommended: "48x48px" },
  { element: "לינקים", minimum: "44x44px", recommended: "48x48px" },
  {
    element: "Form inputs",
    minimum: "44px height",
    recommended: "48px height",
  },
  { element: "רווח בין targets", minimum: "8px", recommended: "12px" },
];
