/**
 * @file Prettier 配置文件
 *
 * 参考资料：
 * - {@link https://prettier.io/docs/en/configuration}
 */
/** @type {import("prettier").Config} */
const config = {
  printWidth: 120,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'lf',

  // 针对指定文件，覆盖默认配置
  // 参考资料：
  // - https://prettier.io/docs/configuration#configuration-overrides

  overrides: [
    {
      files: ['**/*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],

  plugins: [
    // 依赖包导入排序插件
    // 参考资料：
    // - https://github.com/IanVS/prettier-plugin-sort-imports

    '@ianvs/prettier-plugin-sort-imports',

    // Tailwind 插件
    // 将 'prettier-plugin-tailwindcss' 设置为最后一个插件
    // 参考资料：
    // - https://tailwindcss.com/docs/editor-setup

    'prettier-plugin-tailwindcss',
  ],

  tailwindFunctions: ['cva', 'cn'],

  // 依赖包导入排序

  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/(.*)$',
    '^[.]',
  ],
};

export default config;
