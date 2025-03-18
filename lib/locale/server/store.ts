'use server';

import { cookies, headers } from 'next/headers';

import { supportedLocales } from '../config';
import { LocaleCode } from '../types';

const USER_PREFERRED_LOCALE_CODE_COOKIE_NAME = 'user_language';
const USER_PREFERRED_LOCALE_CODE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * 获取用户自定义语言环境代码
 *
 * @returns 用户自定义语言环境代码
 */
export async function fetchUserLocaleCode() {
  // 获取平台使用 cookie 保存的用户偏好语言环境代码

  const cookieStore = await cookies();
  const userPreferredLocaleCode = cookieStore.get(USER_PREFERRED_LOCALE_CODE_COOKIE_NAME)?.value;
  if (userPreferredLocaleCode) {
    const supportedUserPreferredLocale = supportedLocales.find(({ code }) => {
      return userPreferredLocaleCode.includes(code);
    });
    if (supportedUserPreferredLocale) {
      return supportedUserPreferredLocale.code;
    }
  }

  // 获取浏览器设置中保存的用户偏好语言环境代码

  const headerStore = await headers();
  const acceptLocaleCode = headerStore.get('accept-language');
  const navigatorLocaleCode = acceptLocaleCode?.split(';')[0].split(',')[0];
  if (navigatorLocaleCode) {
    const supportedNavigatorLocale = supportedLocales.find(({ code }) => {
      return navigatorLocaleCode.includes(code);
    });
    if (supportedNavigatorLocale) {
      return supportedNavigatorLocale.code;
    }
  }

  // 获取平台使用 .env 保存的默认语言环境代码

  const defaultLocaleCode = process.env.NEXT_PUBLIC_APP_DEFAULT_LOCALE_CODE ?? 'en';
  return defaultLocaleCode;
}

/**
 * 保存用户自定义语言环境代码
 *
 * @param code 用户自定义语言环境代码
 */
export async function saveUserLocaleCode(code: LocaleCode) {
  const cookieStore = await cookies();

  // 参考资料：
  // - https://nextjs.org/docs/app/api-reference/functions/cookies#options

  cookieStore.set(USER_PREFERRED_LOCALE_CODE_COOKIE_NAME, code, {
    maxAge: USER_PREFERRED_LOCALE_CODE_COOKIE_MAX_AGE,
    // secure: true,
    httpOnly: true,
  });
}
