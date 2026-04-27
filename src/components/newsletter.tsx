'use client';

import { subscribeToNewsletter } from '@/actions/newsletter';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { env } from '@/env.mjs';
import { newsletterSchema } from '@/schemas/newsletter';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { SendHorizonal } from 'lucide-react';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ButtonGroup } from './ui/button-group';
import { Spinner } from './ui/spinner';

export function Newsletter() {
  const turnstileRef = React.useRef<TurnstileInstance | null>(null!);
  const [state, action, isSubscribing] = React.useActionState(
    subscribeToNewsletter,
    null,
  );

  React.useEffect(() => {
    if (!state) return;

    if (state === true) {
      toast.success('Subscribed to newsletter!');
      form.reset();
      turnstileRef.current?.reset();
      return;
    }

    // incase the error is not produced by fields
    if ('errors' in state && !('properties' in state)) {
      toast.error(state.errors.join('\n') ?? 'Something went wrong!');
      return;
    }

    if ('properties' in state) {
      toast.error(state.properties?.email?.errors.join('\n') ?? 'Something went wrong!');
      form.setError('email', {
        message: state.properties?.email?.errors.join('\n'),
      });
    }
  }, [state]);

  const form = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  });

  return (
    <div className="w-full max-w-sm space-y-2">
      <p className="text-sm font-semibold">Stay Updated</p>
      <p className="text-muted-foreground text-sm">
        Subscribe for exclusive offers & tips.
      </p>
      <form
        className="flex flex-col gap-2"
        aria-label="Newsletter signup"
        action={action}
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
            <Field>
              <Turnstile
                ref={turnstileRef}
                siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY}
                injectScript={false}
                options={{
                  theme: 'light',
                  responseFieldName: 'cfTurnstileResponse',
                  size: 'invisible',
                }}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
