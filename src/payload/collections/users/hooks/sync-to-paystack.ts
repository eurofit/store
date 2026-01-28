import { User } from '@/payload/types';
import { paystack } from '@/paystack';
import { paystackCustomerSchema } from '@/schemas/paystack-customer-code';
import { APIError, CollectionBeforeChangeHook } from 'payload';

export const syncToPaystack: CollectionBeforeChangeHook<User> = async ({
  req,
  operation,
  data,
}) => {
  if (operation !== 'create') return;
  1;

  const {
    email,
    firstName: first_name,
    lastName: last_name,
    phone,
  } = paystackCustomerSchema.parse(data);

  const res = await paystack.customer.create({
    email,
    first_name,
    last_name,
    phone,
  });

  if (res.status !== true || !res.data) {
    throw new APIError(`Paystack Error: ${res.message}`, 500);
  }

  return {
    ...data,
    paystackCustomerCode: res.data.customer_code,
  };
};
