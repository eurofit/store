'use client';

import { sendContactEmail } from '@/actions/contact';
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
import { useMutation } from '@tanstack/react-query';
import Script from 'next/script';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ContactForm() {
  const { mutate: sendEmail, isPending: isSending } = useMutation({
    mutationKey: ['contact-email'],
    mutationFn: sendContactEmail,
    onSuccess: () => {
      toast.success('Email sent successfully!', {
        description: 'We will get back to you as soon as possible.',
        duration: 5000,
      });
    },
    onError: () => {
      toast.error('Failed to send email', {
        description: 'Please try again.',
        duration: 5000,
      });
    },
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      'cf-turnstile-response': '',
    },
  });

  useEffect(() => {
    // SUCCESS
    // @ts-ignore
    window.onTurnstileSuccess = (token: string) => {
      form.setValue('cf-turnstile-response', token, {
        shouldValidate: true,
      });
    };

    const resetTurnstile = () => {
      // @ts-ignore
      if (window.turnstile) {
        // reset specific widget
        // @ts-ignore
        window.turnstile.reset('#turnstile-widget');
      }
    };

    const reExecute = () => {
      // @ts-ignore
      if (window.turnstile) {
        // @ts-ignore
        window.turnstile.execute('#turnstile-widget');
      }
    };

    // ERROR
    // @ts-ignore
    window.onTurnstileError = () => {
      form.setValue('cf-turnstile-response', '');
      form.setError('cf-turnstile-response', {
        type: 'manual',
        message: 'Human verification failed. Retrying...',
      });

      resetTurnstile();
      reExecute();
    };

    // EXPIRED
    // @ts-ignore
    window.onTurnstileExpired = () => {
      form.setValue('cf-turnstile-response', '');
      form.setError('cf-turnstile-response', {
        type: 'manual',
        message: 'Verification expired. Retrying...',
      });

      resetTurnstile();
      reExecute();
    };

    // TIMEOUT
    // @ts-ignore
    window.onTurnstileTimeout = () => {
      form.setValue('cf-turnstile-response', '');
      form.setError('cf-turnstile-response', {
        type: 'manual',
        message: 'Verification timed out. Retrying...',
      });

      resetTurnstile();
      reExecute();
    };

    return () => {
      // cleanup
      // @ts-ignore
      delete window.onTurnstileSuccess;
      // @ts-ignore
      delete window.onTurnstileError;
      // @ts-ignore
      delete window.onTurnstileExpired;
      // @ts-ignore
      delete window.onTurnstileTimeout;
    };
  }, [form]);

  const handleSendEmail = (data: ContactFormValues) => {
    sendEmail(data);
  };

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      <form
        id="contact-form"
        className="max-w-md space-y-4 p-6 shadow-md"
        onSubmit={form.handleSubmit(handleSendEmail)}
        method="post"
      >
        {form.formState.errors['cf-turnstile-response']?.message && (
          <div className="text-destructive">
            {form.formState.errors['cf-turnstile-response']?.message}
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

                  <Input
                    placeholder="Your name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="name"
                    {...field}
                  />

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
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
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

                  <Input
                    placeholder="Subject…"
                    data-invalid={fieldState.invalid}
                    autoComplete="off"
                    {...field}
                  />

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

                  <Textarea
                    placeholder="Your message…"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <div
              id="turnstile-widget"
              className="cf-turnstile"
              data-sitekey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY}
              data-theme="light"
              data-size="invisible"
              data-callback="onTurnstileSuccess"
              data-error-callback="onTurnstileError"
              data-expired-callback="onTurnstileExpired"
              data-timeout-callback="onTurnstileTimeout"
            />

            <Button
              type="submit"
              className={cn('w-full', {
                'bg-destructive text-white':
                  form.formState.errors['cf-turnstile-response']?.message,
              })}
              disabled={isSending}
            >
              {isSending && <Spinner aria-hidden="true" />}
              {isSending ? 'Sending…' : 'Send Message'}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </>
  );
}
