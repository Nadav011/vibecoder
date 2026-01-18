import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "build/**",
      "android/**",
      "ios/**",
      "*.config.js",
      "public/**", // Service worker and static files
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        fetch: "readonly",
        URL: "readonly",
        Blob: "readonly",
        KeyboardEvent: "readonly",
        HTMLElement: "readonly",
        Event: "readonly",
        Element: "readonly",
        EventTarget: "readonly",
        MessageEvent: "readonly",
        crypto: "readonly",
        AudioContext: "readonly",
        // Node globals (for config files)
        module: "readonly",
        require: "readonly",
        process: "readonly",
        __dirname: "readonly",
        // React Native globals
        __DEV__: "readonly",
        global: "readonly",
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // TypeScript rules
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-require-imports": "off",

      // React rules
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "react/prop-types": "off", // Using TypeScript for prop validation
      "react/display-name": "off",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Disable strict purity rules that conflict with React Native Reanimated
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",

      // Code style (matching existing codebase - uses semicolons)
      semi: ["error", "always"],
      indent: "off", // Let Prettier handle this
      quotes: ["error", "double", { avoidEscape: true }],

      // General best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-control-regex": "off", // Used intentionally in sanitization utilities

      // RTL-friendly: Warn about directional properties (prefer logical properties)
      // Note: This is a reminder - manual review needed for marginLeft/marginRight etc.
    },
  },
];
