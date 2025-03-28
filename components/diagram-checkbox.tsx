'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { helplessBeliefItems, unlovableBeliefItems, worthlessBeliefItems } from '@/app/api/data/core-beliefs';
import { emotionItems } from '@/app/api/data/emotions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface CheckboxReactHookFormMultipleProps {
  category: string;
  onCheckboxChange: (category: string, checkedValues: { id: string; label: string }[]) => void;
  checkboxValues: { id: string; label: string }[];
}

const FormSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    }),
  ),
});

export interface CoreBeliefMapping {
  Helpless: { id: string; label: string }[];
  Unlovable: { id: string; label: string }[];
  Worthless: { id: string; label: string }[];
  Emotion: { id: string; label: string }[];
  [key: string]: { id: string; label: string }[]; // index signature
}

export function CheckboxReactHookFormMultiple({
  category,
  onCheckboxChange,
  checkboxValues,
}: CheckboxReactHookFormMultipleProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const coreBeliefMapping: CoreBeliefMapping = {
    Helpless: helplessBeliefItems,
    Unlovable: unlovableBeliefItems,
    Worthless: worthlessBeliefItems,
    Emotion: emotionItems,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(/*data: z.infer<typeof FormSchema>*/) {
    // toast({
    //     title: "You submitted the following values:",
    //     description: (
    //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //             <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //         </pre>
    //     ),
    // })
  }

  return (
    <div>
      <Collapsible className="mb-4 w-[350px] space-y-2" onOpenChange={setIsOpen} open={isOpen}>
        <div className="flex items-center space-x-1 px-0">
          <div className="rounded-md border px-2 py-3 text-sm font-semibold">
            {'Expand to select '}
            <span className="underline"> {category === 'Emotion' ? 'emotions' : category + ' Core Beliefs'} </span>
          </div>
          <CollapsibleTrigger asChild>
            <Button className="w-9 p-0 hover:bg-gray-200" size="sm" variant="ghost">
              <ChevronsUpDown className="size-5" />
              <span className="sr-only">{'Toggle'}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem>
                    <div className="mb-3">
                      {/* <FormLabel className="block text-sm font-medium mb-1">{category} Core Beliefs</FormLabel> */}
                      <FormDescription>
                        {category == 'Emotion' ? 'Select one or more emotions' : 'Select one or more beliefs'}
                      </FormDescription>
                    </div>
                    {coreBeliefMapping[category].map((item) => (
                      <FormField
                        control={form.control}
                        key={item.id}
                        name="items"
                        render={({ field }) => {
                          // Determine if the item is initially checked
                          const isCheckedInitially = checkboxValues.some((v) => v.id === item.id);

                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0" key={item.id}>
                              <FormControl>
                                <Checkbox
                                  // Set checked state based on whether the item is in checkboxValues
                                  checked={field.value?.some((value) => value.id === item.id) || isCheckedInitially}
                                  onCheckedChange={(checked) => {
                                    const currentValue = Array.isArray(field.value) ? field.value : [];
                                    const newValue = checked
                                      ? [...currentValue, item]
                                      : currentValue.filter((value) => value.id !== item.id);
                                    field.onChange(newValue);
                                    onCheckboxChange(category, newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
