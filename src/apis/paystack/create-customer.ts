import { paystack } from '@/constants/paystack';
import { env } from '@/env.mjs';
import { PaystackCustomer, PaystackResponse, PaystackSuccessResponse } from '@/types';

export async function createPaystackCustomer(
  customer: PaystackCustomer,
): Promise<PaystackSuccessResponse | { error: string }> {
  try {
    const res = await fetch(paystack.customer, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + env.PAYSTACK_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    const result = (await res.json()) as PaystackResponse;

    if (!result.status) {
      return {
        error: 'Failed to create Paystack customer.',
      };
    }

    return result;
  } catch (error: unknown) {
    return {
      error: 'An unexpected error occurred while creating the Paystack customer.',
    };
  }
}
