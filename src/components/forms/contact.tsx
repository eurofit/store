'use client';

import { sendContactEmail } from '@/actions/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { env } from '@/env.mjs';
import { contactFormSchema, ContactFormValues } from '@/schemas/contact';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Script from 'next/script';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '../ui/field';
import { Spinner } from '../ui/spinner';

export function ContactForm() {
  const { mutate: sendEmail, isPending: isSending } = useMutation({
    mutationKey: ['contact'],
    mutationFn: sendContactEmail,
    onSuccess: () => {
      toast.success('Email sent successfully!', {
        description: 'We will get back to you as soon as possible.',
        duration: 5000,
      });
    },
    onError: () => {
      toast.error('Failed to send email');
    },
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const handleSendEmail = (data: ContactFormValues) => {
    sendEmail(data);
  };

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <form
        onSubmit={form.handleSubmit(handleSendEmail)}
        className="max-w-md space-y-4 p-6 shadow-md"
      >
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

            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending && <Spinner aria-hidden="true" />}
              {isSending ? 'Sending…' : 'Send Message'}
            </Button>
          </FieldGroup>
        </FieldSet>
        <div
          className="cf-turnstile"
          data-theme="light"
          data-size="flexible"
          data-sitekey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY}
        />
      </form>
    </>
  );
}
