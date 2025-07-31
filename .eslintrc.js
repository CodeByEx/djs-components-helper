module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended'
  ],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es2020: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'no-case-declarations': 'off'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    '**/*.js'
  ],
  overrides: [
    {
      files: ['**/*.test.ts', '**/__tests__/**/*.ts'],
      env: {
        jest: true
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ]
}; 