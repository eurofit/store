import { createStockAlert } from '@/actions/notify-me';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useStockAlert({
  onSuccess,
}: { onSuccess?: (isRequested: boolean) => void } = {}) {
  const createStockAlertMutation = useMutation({
    mutationFn: createStockAlert,
    onSuccess: (isRequested) => {
      toast.success('You will be notified when the product is back in stock!');
      if (onSuccess) {
        onSuccess(isRequested);
      }
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  return createStockAlertMutation;
}
