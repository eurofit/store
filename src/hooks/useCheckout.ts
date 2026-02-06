'use client';

import { checkout } from '@/actions/checkout';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useCheckout() {
  const router = useRouter();
  const checkoutMutation = useMutation({
    mutationFn: checkout,
    mutationKey: ['checkout'],
    onSuccess: ({ data: { authorization_url } }) => {
      router.push(authorization_url);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'An unexpected error occurred.',
      );
    },
  });
  return checkoutMutation;
}
