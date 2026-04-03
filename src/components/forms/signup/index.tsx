'use client';

import { signUp as signUpAction } from '@/actions/auth/sign-up';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SignupData, SignUpSchema } from './schema';

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationFn: signUpAction,
    onSuccess: ({ email }) => {
      toast.success('Account created successfully!', {
        description: 'Please check your email to verify your account.',
      });
      router.push(`/verify?email=${email}`);
    },
    onError: () => {
      toast.error('Failed to create account. Please try again.');
    },
  });

  const form = useForm<SignupData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      gender: 'male',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: SignupData) => {
    signup(data);
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-2 md:grid-cols-2">
              <Controller
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="firstName"
                      className='after:-ml-1 after:text-red-700 after:content-["*"]'
                    >
                      First Name
                    </FieldLabel>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      autoComplete="given-name"
                      {...field}
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Field aria-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="lastName"
                      className='after:-ml-1 after:text-red-700 after:content-["*"]'
                    >
                      Last Name
                    </FieldLabel>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      autoComplete="family-name"
                      {...field}
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="email"
                    className='after:-ml-1 after:text-red-700 after:content-["*"]'
                  >
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    {...field}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your email with
                    anyone else.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="gender"
              render={({ field, fieldState }) => (
                <FieldSet className="space-y-2">
                  <FieldLegend variant="label">Choose your gender</FieldLegend>
                  <RadioGroup
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue="male"
                    className="max-w-sm md:flex md:gap-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="male">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Male</FieldTitle>
                          <FieldDescription>(He, Him, His)</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="male" id="male" />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="female">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Female</FieldTitle>
                          <FieldDescription>(She, Her, Hers)</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="female" id="female" />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                </FieldSet>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                  <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                  <FieldDescription>Please confirm your password.</FieldDescription>
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSigningUp}>
                  {isSigningUp && <Spinner />}
                  {isSigningUp ? 'Creating Account...' : 'Create Account'}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
