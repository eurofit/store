'use client';

import { subscribeToNewsletter } from '@/actions/newsletter';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NewsLetterData, newsletterSchema } from '@/schemas/newsletter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SendHorizonal } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ButtonGroup } from './ui/button-group';
import { Spinner } from './ui/spinner';

export function Newsletter() {
  const { mutateAsync: subscribe, isPending: isSubscribing } = useMutation({
    mutationFn: subscribeToNewsletter,
  });

  const form = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: NewsLetterData) => {
    toast.promise(subscribe(data), {
      loading: 'Subscribing...',
      success: 'Subscribed successfully!',
      error: 'Failed to subscribe. Please try again.',
    });
  };

  return (
    <div className="grid max-w-xs gap-2 max-sm:col-span-full max-sm:row-start-3 md:col-span-2 lg:col-span-1">
      <p className="text-sm font-semibold">Stay Updated</p>
      <p className="text-muted-foreground text-sm">
        Subscribe for exclusive offers & tips.
      </p>
      <form
        className="flex flex-col gap-2"
        aria-label="Newsletter signup"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldSet>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <ButtonGroup>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-9"
                      autoComplete="email"
                      spellCheck={false}
                      required
                      aria-label="Email address"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    <ButtonGroup>
                      <Button
                        type="submit"
                        size="icon-lg"
                        aria-label="Subscribe to newsletter"
                        disabled={isSubscribing}
                      >
                        {isSubscribing ? (
                          <>
                            <Spinner />
                            <span className="sr-only">Subscribing...</span>
                          </>
                        ) : (
                          <>
                            <SendHorizonal aria-hidden="true" />
                            <span className="sr-only">Subscribe</span>
                          </>
                        )}
                      </Button>
                    </ButtonGroup>
                  </ButtonGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
