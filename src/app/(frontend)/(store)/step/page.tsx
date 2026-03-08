import { getCurrentUser } from '@/actions/auth/get-current-user';
import { CheckoutStepperDemo } from '@/components/checkout/stepper';

export default async function Page() {
  const user = await getCurrentUser();
  return <CheckoutStepperDemo user={user} />;
}
