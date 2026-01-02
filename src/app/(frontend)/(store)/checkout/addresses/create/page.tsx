import { getCurrentUser } from '@/actions/auth/get-current-user';
import { AddressForm } from './address-form';

export default function CheckoutAddressPage() {
  const user = getCurrentUser();
  return <AddressForm user={user} />;
}
