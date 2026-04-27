'use client';

import { submitContactForm } from '@/actions/contact';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { env } from '@/env.mjs';
import { contactFormSchema, ContactFormValues } from '@/schemas/contact';
import { cn } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ContactForm() {
  const turnstileRef = React.useRef<TurnstileInstance | null>(null);
  const [state, action, isSubmitting] = React.useActionState(submitContactForm, null);

  React.useEffect(() => {
    if (!state) return;

    if (state === true) {
      toast.success('Email sent successfully!', {
        description: 'We will get back to you as soon as possible.',
        duration: 5000,
      });
      form.reset();
      turnstileRef.current?.reset();
      return;
    }

    console.log('errors', state.errors);

    if (state.errors.length > 0) {
      toast.error(state.errors.join('\n'));
    }

    if ('properties' in state.errors) {
      toast.error('Please submit correct data');
    }
  }, [state]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      cfTurnstileResponse: '',
    },
  });

  return (
    <form
      id="contact-form"
      className="max-w-md space-y-4 p-6 shadow-md"
      method="post"
      action={action}
    >
      {form.formState.errors['cfTurnstileResponse']?.message && (
        <div className="text-destructive">
          {form.formState.errors['cfTurnstileResponse']?.message}
        </div>
      )}
      <FieldSet>
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>
                <Input aria-invalid={fieldState.invalid} autoComplete="name" {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                  {...field}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="subject"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Subject</FieldLabel>
                <Input aria-invalid={fieldState.invalid} {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="message"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Message</FieldLabel>
                <Textarea aria-invalid={fieldState.invalid} {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Turnstile
            ref={turnstileRef}
            siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY}
            injectScript={false}
            options={{
              theme: 'light',
              responseFieldName: 'cfTurnstileResponse',
              size: 'flexible',
            }}
          />
          <Button
            type="submit"
            className={cn('w-full', {
              'bg-destructive text-white':
                form.formState.errors['cfTurnstileResponse']?.message,
            })}
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner aria-hidden="true" />}
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
