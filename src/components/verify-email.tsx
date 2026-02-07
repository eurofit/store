'use client';

import { MailSentContent, MailSentHeader, MailSentTitle } from '@/components/mail-sent';
import { buttonVariants } from '@/components/ui/button';
import { Loader2, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { MailSent as MailSentIcon } from './illustrations/mail-sent';

import { verifyEmail } from '@/actions/auth/verify-email';
import { useSearchParams } from 'next/navigation';
import { MailSent } from './mail-sent';

export function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isPending, startTransition] = useTransition();
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;
    startTransition(() => {
      verifyEmail(token)
        .then((result) => {
          setIsVerified(result);
        })
        .catch(() => setIsError(true));
    });
  }, [token]);

  if (!token) {
    return (
      <MailSent>
        <MailSentIcon className="size-32" />
        <MailSentHeader>
          <MailSentTitle>Check your email</MailSentTitle>
        <MailSentContent className="text-muted-foreground text-balance text-center">
          We've sent a verification link to your email.
        </MailSentContent>
        </MailSentHeader>
      </MailSent>
    );
  }

  if (isError) {
    return (
      <div className="flex max-w-xs flex-col items-center gap-2 text-center">
        <XCircle className="text-destructive h-8 w-8" aria-hidden="true" />
        <h3 className="text-balance text-xl font-semibold">There Was a Problem</h3>
        <p className="text-muted-foreground text-balance text-sm">
          This token is invalid or expired. Try requesting a new verification link.
        </p>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-muted-foreground relative mb-6 flex size-32 items-center justify-center">
          <Image
            src="/illustrations/verified.svg"
            fill
            alt="Verified"
            sizes="128px"
          />
        </div>

        <h3 className="text-balance text-2xl font-semibold">You're All Set!</h3>
        <p className="text-muted-foreground mt-1 text-balance text-center">
          Thank you for verifying your email.
        </p>
        <Link className={buttonVariants({ className: 'mt-4' })} href="/login">
          Sign In →
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex max-w-sm flex-col items-center gap-2">
        <Loader2 className="size-8 animate-spin" />
        <h3 className="text-balance text-xl font-semibold">Verifying…</h3>
        <p className="text-muted-foreground text-balance text-sm">This won't take long.</p>
      </div>
    );
  }

  return null;
}
