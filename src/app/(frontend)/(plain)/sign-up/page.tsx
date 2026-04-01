import { SignupForm } from '@/components/forms/signup';
import { Logo } from '@/components/logo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'Create a new account',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/sign-up',
  },
};

export default function Page() {
  return (
    <div className="bg-muted flex min-h-svh p-6 md:p-10">
      <div className="m-auto w-full max-w-md space-y-4">
        <div className="flex items-center justify-center">
          <Logo className="text-xl" />
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
