'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { forgotPassword as forgotPasswordAction } from '@/actions/auth/forgot-password';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { Field, FieldGroup, FieldLabel, FieldSet } from './ui/field';

const formSchema = z.object({
  email: z.email('Invalid email address'),
});

export function ForgetPasswordForm() {
  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: forgotPasswordAction,
    onSuccess: ({ email }) => {
      toast.success('Email sent', {
        description: 'Please check your inbox for the password reset link.',
      });

      router.push(`/reset-password?email=${email}`);
    },
    onError: () => {
      toast.error('User not found', {
        description: 'Please check the email address and try again.',
        duration: 8000,
      });
    },
  });
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = ({ email }: z.infer<typeof formSchema>) => {
    forgotPassword({ email });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="grid gap-2">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      placeholder="johndoe@mail.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {isPending ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
