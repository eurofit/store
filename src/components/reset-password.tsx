'use client';

import { MailSent as MailSentIcon } from '@/components/illustrations/mail-sent';
import {
  MailSent,
  MailSentContent,
  MailSentHeader,
  MailSentTitle,
} from '@/components/mail-sent';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ResetPasswordData, resetPasswordSchema } from '@/schemas/reset-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { resetPassword } from '@/actions/auth/reset-password';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from './ui/field';
import { Input } from './ui/input';
import { Spinner } from './ui/spinner';

export function ResetPassword() {
  const [showPassword, setShowPassword] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '', token: token ?? '' },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      const success = await resetPassword(data);

      if (success) {
        toast.success('Password changed successfully!', {
          description: 'You can now log in with your new password.',
        });
        form.reset();
        router.push('/login');
      } else {
        toast.error('Invalid Token', {
          description: 'Token is either invalid or has expired.',
        });
      }
    } catch (error: unknown) {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  if (!token) {
    return (
      <MailSent>
        <MailSentIcon className="size-32" />
        <MailSentHeader>
          <MailSentTitle>Email Sent</MailSentTitle>
          <MailSentContent className="text-muted-foreground text-center">
            We have sent you an email with instructions to reset your password. Please
            check your inbox.
          </MailSentContent>
        </MailSentHeader>
      </MailSent>
    );
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} method="post">
          <FieldSet>
            <FieldGroup></FieldGroup>
            {['password', 'confirmPassword'].map((name, idx) => (
              <Controller
                key={name}
                control={form.control}
                name={name as 'password' | 'confirmPassword'}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="grid gap-2">
                    <FieldLabel htmlFor={field.name}>
                      {idx === 0 ? 'New Password' : 'Confirm Password'}
                    </FieldLabel>

                    <PasswordInput
                      id={field.name}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      showPassword={showPassword}
                      onShowPasswordChange={setShowPassword}
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            ))}
            <Controller
              control={form.control}
              name="token"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="grid gap-2">
                  <Input type="hidden" {...field} />
                </Field>
              )}
            />
          </FieldSet>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
