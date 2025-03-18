import type { NextConfig } from 'next';

import createNextIntl from 'next-intl/plugin';

// 国际化插件
// 参考资料：
// - https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing

const withNextIntl = createNextIntl();

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
