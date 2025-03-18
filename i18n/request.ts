/**
 * @file next-intl 配置文件
 *
 * 参考资料：
 * - {@link https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing}
 */
import { getRequestConfig } from 'next-intl/server';

import { fetchUserLocaleCode } from '@/lib/locale/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale) {
    locale = await fetchUserLocaleCode();
  }

  const messages = {
    ...(await import(`../messages/${locale}/app.json`)).default,
    ...(await import(`../messages/${locale}/components.json`)).default,
  };

  return { locale, messages };
});
