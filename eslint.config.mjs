/**
 * @file ESLint 配置文件
 *
 * 参考资料：
 * - {@link https://eslint.org/docs/latest/use/configure/configuration-files}
 */
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  // 参考资料：
  // - https://eslint.org/docs/latest/use/configure/ignore

  {
    ignores: ['**/.next/', '**/.turbo/', '**/build/', '**/dist/', '**/out/', '**/output/', '**/target/'],
  },

  ...compat.config({
    // 参考资料：
    // - https://nextjs.org/docs/app/api-reference/config/eslint#with-core-web-vitals
    // - https://nextjs.org/docs/app/api-reference/config/eslint#with-typescript
    // - https://nextjs.org/docs/app/api-reference/config/eslint#with-prettier

    extends: ['next', 'next/core-web-vitals', 'next/typescript', 'prettier'],

    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', {}],
      'react/jsx-no-literals': 'warn',
      'react/jsx-sort-props': 'warn',
    },
  }),
];

export default config;
