import { ForgetPasswordForm } from '@/components/forgot-password-form';
import { Logo } from '@/components/logo';

export default function ForgotPasswordPage() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <div className="flex items-center justify-center">
          <Logo className="text-xl" />
        </div>
        <ForgetPasswordForm />
      </div>
    </main>
  );
}
