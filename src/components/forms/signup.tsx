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
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

// TODO: use stepperize to break this form into multiple steps

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <div className="grid gap-2 md:grid-cols-3">
              <Field>
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
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
                <Input
                  id="middleName"
                  type="text"
                  placeholder="Michael"
                  autoComplete="additional-name"
                />
              </Field>
              <Field>
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
                  required
                />
              </Field>
            </div>
            <Field>
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
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email with
                anyone else.
              </FieldDescription>
            </Field>

            <div className="space-y-2">
              <FieldLabel>Choose your gender</FieldLabel>
              <RadioGroup defaultValue="male" className="max-w-sm md:flex md:gap-2">
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
            </div>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" autoComplete="new-password" required />
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
