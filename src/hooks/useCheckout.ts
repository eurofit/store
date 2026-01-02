'use client';

import { checkout } from '@/actions/checkout';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useCheckout() {
  const router = useRouter();
  const checkoutMutation = useMutation({
    mutationFn: checkout,
    mutationKey: ['checkout'],
    onSuccess: ({ data: { authorization_url } }) => {
      router.push(authorization_url);
    },
  });

  return checkoutMutation;
}
