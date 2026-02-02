'use client';

import type { CurrentUser } from '@/actions/auth/get-current-user';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const accountFormSchema = z.object({
  email: z.email('Invalid email address'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(30, 'First name must not be longer than 30 characters.'),
  middleName: z
    .string()
    .min(2, 'Middle name must be at least 2 characters.')
    .max(30, 'Middle name must not be longer than 30 characters.')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters.')
    .max(30, 'Last name must not be longer than 30 characters.'),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

type AccountFormProps = {
  user: NonNullable<CurrentUser>;
};

export function AccountForm({ user }: AccountFormProps) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName ?? undefined,
      lastName: user.lastName,
    },
  });

  function onSubmit(data: AccountFormValues) {}

  return (
    <form>
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className='after:text-destructive after:-ml-0.5 after:content-["*"]'
                >
                  Email
                </FieldLabel>
                <Input
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );
          }}
        />
        <div className="grid gap-2 md:grid-cols-3">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className='after:text-destructive after:-ml-0.5 after:content-["*"]'
                  >
                    First Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="given-name"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
          <Controller
            control={form.control}
            name="middleName"
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Middle Name</FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="middle-name"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className='after:text-destructive after:-ml-0.5 after:content-["*"]'
                  >
                    Last Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="family-name"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
        </div>
      </FieldGroup>
    </form>
  );
}
