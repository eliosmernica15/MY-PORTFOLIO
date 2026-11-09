/**
 * ESLint flat config (ESLint 9 default).
 *
 * Mirrors .eslintrc.json (which `next lint` still reads) via FlatCompat.
 * Both extend next/core-web-vitals with the same rule overrides, so
 * `npx eslint .` (lint-staged, editors) and `npm run lint` (next lint)
 * agree.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'public/**',
      'src/data/knowledge.generated.ts',
      'scripts/ipv4-first.cjs',
    ],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
