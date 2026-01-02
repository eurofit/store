import { createPaystackCustomer } from '@/apis/paystack/create-customer';
import { updatePaystackCustomer } from '@/apis/paystack/update-customer';
import { User } from '@/payload-types';
import { isEmpty } from 'lodash-es';
import type { CollectionBeforeChangeHook } from 'payload';

export const syncPaystack: CollectionBeforeChangeHook<User> = async ({
  originalDoc,
  data,
  operation,
}) => {
  if (operation === 'update') {
    if (!data.paystackCustomerCode) return data; // No customer code to update

    let parsedChange = {} as Partial<User>;

    // detect which customer field is being changed
    if (originalDoc?.email !== data.email) {
      parsedChange['email'] = data.email;
    }
    if (originalDoc?.firstName !== data.firstName) {
      parsedChange['firstName'] = data.firstName;
    }
    if (originalDoc?.lastName !== data.lastName) {
      parsedChange['lastName'] = data.lastName;
    }
    // if (originalDoc?.phone !== data.phone) {
    //   parsedChange['phone'] = data.phone;
    // }

    if (isEmpty(parsedChange)) return data;

    const res = await updatePaystackCustomer(data.paystackCustomerCode, parsedChange);

    if ('error' in res) {
      throw new Error(res.error);
    }

    return data;
  }

  const res = await createPaystackCustomer({
    email: data.email!,
    first_name: data.firstName,
    last_name: data.lastName,
    // phone: data.phone ?? undefined,
  });

  if ('error' in res) {
    throw new Error(res.error);
  }

  if (!res.data || !res.data.customer_code) {
    throw new Error('Failed to create Paystack customer: No customer code returned.');
  }

  return {
    ...data,
    paystackCustomerCode: res.data.customer_code,
  };
};
