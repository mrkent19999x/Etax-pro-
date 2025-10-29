import nextConfig from "eslint-config-next"

export default [
  {
    ignores: [
      "node_modules",
      ".next",
      "playwright-report",
      "test-results",
      "temp_test.js",
      "temp_login_test.spec.ts",
      "eslint.config.mjs",
    ],
  },
  ...nextConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "import/no-anonymous-default-export": "off",
    },
  },
  {
    files: ["tests/**/*.{js,jsx,ts,tsx}", "tests/**/*.spec.ts"],
    rules: {
      "no-console": "off",
    },
  },
]
