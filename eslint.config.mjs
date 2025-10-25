import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'out/**',
      '.backup_global/**',
      'archive/**',
      'pages_backup/**',
      'pages_backup_archived/**',
      'scripts/**',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Next.js core web vitals rules
      ...nextPlugin.configs['core-web-vitals'].rules,
      // Project-specific overrides
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'warn',
    },
  },
  // TypeScript-specific parsing and recommended rules (no type-aware rules)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Project relaxations to avoid blocking on known patterns
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
