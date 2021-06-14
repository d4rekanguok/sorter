/* eslint-disable */
module.exports = {
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  env: {
    es2021: true,
    browser: true,
  },
  extends: "eslint:recommended",
  plugins: ["svelte3"],
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  ignorePatterns: ['**/*.d.ts']
};
