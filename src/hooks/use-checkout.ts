'use client';

import { checkout as checkoutAction } from '@/actions/checkout';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCheckout() {
  const checkoutMutation = useMutation({
    mutationFn: checkoutAction,
    mutationKey: ['checkout'],
    onSuccess: ({ data: { authorization_url } }) => {
      // push to blank page
      window.open(authorization_url, '_blank');
    },
    onError: () => {
      toast.error('An unexpected error occurred.');
    },
  });

  const { mutate: checkout, isPending: isCheckingout, ...r } = checkoutMutation;

  return {
    checkout,
    isCheckingout,
    ...r,
  };
}
