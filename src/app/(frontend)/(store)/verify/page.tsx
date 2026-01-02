import { VerifyEmail } from '@/components/verify-email';

type PageProps = {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  return (
    <main className="flex h-full min-h-[calc(100vh-5rem-3rem)] items-center justify-center md:min-h-[calc(100vh-4rem-3rem)]">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <VerifyEmail />
      </div>
    </main>
  );
}
