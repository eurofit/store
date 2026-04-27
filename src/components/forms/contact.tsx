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
import { Form } from '@/payload/types';
import { cn } from '@/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));
type FormData = z.infer<typeof schema>;

type ContactFormProps = {
  form: Form;
};

export function ContactForm({ form: serverForm }: ContactFormProps) {
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

  const serverFormDefaultValues = serverForm.fields?.reduce((defaultValues, field) => {
    if ('name' in field && 'defaultValue' in field) {
      return {
        ...defaultValues,
        [field.name]: field.defaultValue ?? '',
      };
    }
    return defaultValues;
  }, {} as FormData);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(serverFormDefaultValues ?? {}),
      cfTurnstileResponse: '',
    },
  });

  const hasFields = serverForm.fields && serverForm.fields.length > 0;

  if (!hasFields) {
    return null;
  }

  return (
    <form id="contact-form" className="max-w-md space-y-4 p-6 shadow-md" method="post">
      {form.formState.errors['cf-turnstile-response']?.message && (
        <div className="text-destructive">
          {form.formState.errors['cf-turnstile-response']?.message}
        </div>
      )}
      <FieldSet>
        <FieldGroup>
          {serverForm.fields && serverForm.fields.map((f) => renderFormField(form, f))}
          <Turnstile
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
            disabled={isSending}
          >
            {isSending && <Spinner aria-hidden="true" />}
            {isSending ? 'Sending…' : 'Send Message'}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

function renderFormField(
  form: UseFormReturn,
  formField: NonNullable<Form['fields']>[number],
) {
  if (formField.blockType === 'text') {
    return (
      <Controller
        control={form.control}
        name={formField.name}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{formField.label}</FieldLabel>
            <Input aria-invalid={fieldState.invalid} {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  }

  if (formField.blockType === 'email') {
    return (
      <Controller
        control={form.control}
        name={formField.name}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{formField.label}</FieldLabel>
            <Input type="email" aria-invalid={fieldState.invalid} {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  }
  if (formField.blockType === 'textarea') {
    return (
      <Controller
        control={form.control}
        name={formField.name}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{formField.label}</FieldLabel>
            <Textarea aria-invalid={fieldState.invalid} {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    );
  }
  return null;
}
