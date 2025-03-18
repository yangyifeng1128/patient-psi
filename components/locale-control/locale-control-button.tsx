/**
 * @file 语言环境控制按钮
 */
'use client';

import * as React from 'react';

import { GlobeIcon } from 'lucide-react';
import { useLocale } from 'next-intl';

import { Button, IconButton } from '@/components/ui/button';
import { getNextSupportedLocaleCode, LocaleCode } from '@/lib/locale';
import { saveUserLocaleCode } from '@/lib/locale/server';
import { getTranslations } from './i18n';

/* ==================== LocaleControlButton ==================== */

type LocaleControlButtonProps = React.ComponentPropsWithRef<typeof Button> & {
  showIcon?: boolean;
};

export const LocaleControlButton = ({ showIcon = true, ...props }: LocaleControlButtonProps) => {
  //

  // -------------------- 处理国际化信息 --------------------

  const locale = useLocale();
  const localeCode = locale as LocaleCode;
  const t = getTranslations(localeCode);

  // -------------------- 处理组件内容 --------------------

  // 使用“非阻塞式渲染”

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = React.useTransition();

  // 处理点击事件

  const clickHandler = () => {
    const nextLocaleCode = getNextSupportedLocaleCode(localeCode) as LocaleCode;
    startTransition(async () => {
      await saveUserLocaleCode(nextLocaleCode);
    });
  };

  // -------------------- 返回组件内容 --------------------

  return (
    <Button onClick={clickHandler} variant="ghost" {...props}>
      {showIcon && <GlobeIcon />}
      <span>{t(localeCode)}</span>
    </Button>
  );
};

/* ==================== LocaleControlIconButton ==================== */

type LocaleControlIconButtonProps = React.ComponentPropsWithRef<typeof IconButton> & {};

export const LocaleControlIconButton = ({ ...props }: LocaleControlIconButtonProps) => {
  //

  // -------------------- 处理国际化信息 --------------------

  const locale = useLocale();
  const localeCode = locale as LocaleCode;

  // -------------------- 处理组件内容 --------------------

  // 使用“非阻塞式渲染”

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = React.useTransition();

  // 处理点击事件

  const clickHandler = () => {
    const nextLocaleCode = getNextSupportedLocaleCode(localeCode) as LocaleCode;
    startTransition(async () => {
      await saveUserLocaleCode(nextLocaleCode);
    });
  };

  // -------------------- 返回组件内容 --------------------

  return (
    <IconButton onClick={clickHandler} variant="ghost" {...props}>
      <GlobeIcon />
    </IconButton>
  );
};
