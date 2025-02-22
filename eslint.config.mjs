// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript", "standard", 
//     "plugin:tailwindcss/recommended", "prettier")
// ];

// export default eslintConfig;


// module.exports = {
//   extends: [
//     "next/core-web-vitals",
//     "next",
//     "standard",
//     "plugin:tailwindcss/recommended",
//     "prettier"
//   ],
//   rules: {
//     // Add custom rules here if needed
//   }
// };


const eslintConfig = [
  {
    ignores: ["node_modules/", "dist/", ".next/"],
  },
  {
    plugins: {
      tailwindcss: require("eslint-plugin-tailwindcss"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];

export default eslintConfig;

