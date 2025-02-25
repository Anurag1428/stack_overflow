import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import next from "eslint-config-next";
import prettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      prettier: prettier, // Added Prettier plugin
    },
    rules: {
      "prettier/prettier": "error", // Ensures formatting rules are enforced
    },
  },
  js.configs.recommended, // JavaScript rules
  tseslint.configs.recommended, // TypeScript rules
  react.configs.recommended, // React rules
  next.configs.recommended, // Next.js compatibility
  next.configs.coreWebVitals, // Enables Core Web Vitals rules
];
