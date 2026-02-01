'use client';

import { login as loginAction } from '@/actions/auth/login';
import { userAtom } from '@/atoms/user';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoginData } from '@/schemas/login';
import { cn } from '@/utils/cn';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from './ui/field';
import { Spinner } from './ui/spinner';

const EXCLUDE_PATHS = ['/login', '/sign-up', '/reset-password', '/forgot-password'];

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const setUser = useSetAtom(userAtom);

  // TODO: Handle merging anonymous cart with user cart after login
  const form = useForm<LoginData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: loginAction,
    onSuccess: (res) => {
      toast.success('Logged in successfully!', {
        description: `Welcome back, ${res.user.firstName}!`,
      });

      setUser(res.user);

      // Redirect to the next page or home
      const redirectTo =
        next && !EXCLUDE_PATHS.some((path) => next.startsWith(path)) ? next : '/';
      router.push(redirectTo);
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : 'An unexpected error occurred.',
      );
      // form.setError('email', {
      //   type: 'custom',
      //   message: 'Credentials do not exist.',
      // });
      // form.setError('password', {
      //   type: 'custom',
      //   message: 'Credentials do not exist.',
      // });
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  const onSubmit = (data: LoginData) => login(data);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="gap-6">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="text-foreground! ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <PasswordInput
                        autoComplete="current-password"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Button type="submit" disabled={isLoggingIn}>
                  {isLoggingIn && <Spinner />}
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              </FieldGroup>
            </FieldSet>
          </form>

          <div className="flex items-center gap-2 text-center text-sm">
            Don&apos;t have an account?
            <Link href="/sign-up" className="hover:underline hover:underline-offset-4">
              Sign up&nbsp;&rarr;
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{' '}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
