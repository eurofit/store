import { User } from '@/payload-types';
import { paystackCustomerSchema } from '@/schemas/paystack-customer-code';
import type { CollectionBeforeChangeHook } from 'payload';

export const syncPaystack: CollectionBeforeChangeHook<User> = async ({
  req,
  data,
  operation,
}) => {
  if (operation !== 'create') return data;

  const input = paystackCustomerSchema.parse(data);

  const job = await req.payload.jobs.queue({
    task: 'syncToPaystack',
    input,
    overrideAccess: false,
    req,
  });

  await req.payload.jobs.runByID({
    id: job.id,
    overrideAccess: false,
    req,
  });

  return;
};
