'use client';

import * as React from 'react';

import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export const Command = ({ className, ...props }: React.ComponentPropsWithRef<typeof CommandPrimitive>) => {
  return (
    <CommandPrimitive
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        className,
      )}
      data-slot="command"
      {...props}
    />
  );
};

type CommandDialogProps = React.ComponentPropsWithRef<typeof Dialog> & {};

export const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export const CommandInput = ({ className, ...props }: React.ComponentPropsWithRef<typeof CommandPrimitive.Input>) => {
  return (
    <div className="flex h-9 items-center gap-2 border-b px-3" data-slot="command-input-wrapper">
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        className={cn(
          'outline-hidden flex h-10 w-full rounded-md bg-transparent py-3 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        data-slot="command-input"
        {...props}
      />
    </div>
  );
};

export const CommandList = ({ className, ...props }: React.ComponentPropsWithRef<typeof CommandPrimitive.List>) => {
  return (
    <CommandPrimitive.List
      className={cn('max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden', className)}
      data-slot="command-list"
      {...props}
    />
  );
};

export const CommandEmpty = ({ ...props }: React.ComponentPropsWithRef<typeof CommandPrimitive.Empty>) => {
  return <CommandPrimitive.Empty className="py-6 text-center text-sm" data-slot="command-empty" {...props} />;
};

export const CommandGroup = ({ className, ...props }: React.ComponentPropsWithRef<typeof CommandPrimitive.Group>) => {
  return (
    <CommandPrimitive.Group
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className,
      )}
      data-slot="command-group"
      {...props}
    />
  );
};

export const CommandSeparator = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Separator>) => {
  return (
    <CommandPrimitive.Separator
      className={cn('-mx-1 h-px bg-border', className)}
      data-slot="command-separator"
      {...props}
    />
  );
};

export const CommandItem = ({ className, ...props }: React.ComponentPropsWithRef<typeof CommandPrimitive.Item>) => {
  return (
    <CommandPrimitive.Item
      className={cn(
        "outline-hidden relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="command-item"
      {...props}
    />
  );
};

export const CommandShortcut = ({ className, ...props }: React.ComponentPropsWithRef<'span'>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      data-slot="command-shortcut"
      {...props}
    />
  );
};
