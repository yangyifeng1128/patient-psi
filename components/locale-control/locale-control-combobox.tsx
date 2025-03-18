/**
 * @file 语言环境控制组合框
 */
'use client';

import * as React from 'react';

import { CheckIcon } from 'lucide-react';
import { useLocale } from 'next-intl';

import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LocaleCode, supportedLocales } from '@/lib/locale';
import { saveUserLocaleCode } from '@/lib/locale/server';
import { cn } from '@/lib/utils';
import { getTranslations } from './i18n';
import { LocaleControlButton, LocaleControlIconButton } from './locale-control-button';

/* ==================== LocaleControlCombobox ==================== */

type LocaleControlComboboxProps = {
  buttonProps?: React.ComponentPropsWithRef<typeof LocaleControlButton>;
};

export const LocaleControlCombobox = ({ buttonProps }: LocaleControlComboboxProps) => {
  //

  // -------------------- 处理国际化信息 --------------------

  const locale = useLocale();
  const localeCode = locale as LocaleCode;
  const t = getTranslations(localeCode);

  // -------------------- 处理组件内容 --------------------

  // 使用“非阻塞式渲染”

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = React.useTransition();

  // 使用“组合框打开状态”

  const [open, setOpen] = React.useState(false);

  // 处理选择事件

  const selectHandler = (current: string) => {
    setOpen(false);
    startTransition(async () => {
      const currentCode = current as LocaleCode;
      await saveUserLocaleCode(currentCode);
    });
  };

  // -------------------- 返回组件内容 --------------------

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <LocaleControlButton {...buttonProps} />
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {supportedLocales.map((item) => {
                const itemCode = item.code as LocaleCode;
                return (
                  <CommandItem key={itemCode} onSelect={selectHandler} value={itemCode}>
                    <span>{t(itemCode)}</span>
                    <CheckIcon className={cn('ml-auto', localeCode === itemCode ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/* ==================== LocaleControlIconCombobox ==================== */

type LocaleControlIconComboboxProps = {
  buttonProps?: React.ComponentPropsWithRef<typeof LocaleControlIconButton>;
};

export const LocaleControlIconCombobox = ({ buttonProps }: LocaleControlIconComboboxProps) => {
  //

  // -------------------- 处理国际化信息 --------------------

  const locale = useLocale();
  const localeCode = locale as LocaleCode;
  const t = getTranslations(localeCode);

  // -------------------- 处理组件内容 --------------------

  // 使用“非阻塞式渲染”

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = React.useTransition();

  // 使用“组合框打开状态”

  const [open, setOpen] = React.useState(false);

  // 处理选择事件

  const selectHandler = (current: string) => {
    setOpen(false);
    startTransition(async () => {
      const currentCode = current as LocaleCode;
      await saveUserLocaleCode(currentCode);
    });
  };

  // -------------------- 返回组件内容 --------------------

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <LocaleControlIconButton {...buttonProps} />
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {supportedLocales.map((item) => {
                const itemCode = item.code as LocaleCode;
                return (
                  <CommandItem key={itemCode} onSelect={selectHandler} value={itemCode}>
                    <span>{t(itemCode)}</span>
                    <CheckIcon className={cn('ml-auto', localeCode === itemCode ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
