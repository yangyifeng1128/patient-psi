import { supportedLocales } from './config';
import { LocaleCode } from './types';

/**
 * 从平台支持的语言环境列表中，获取下一个语言环境
 *
 * @returns 下一个平台支持的语言环境
 */
export function getNextSupportedLocaleCode(localeCode: LocaleCode) {
  const index = supportedLocales.map((item) => item.code).indexOf(localeCode);
  const nextIndex = index < supportedLocales.length - 1 ? index + 1 : 0;

  return supportedLocales[nextIndex].code;
}
