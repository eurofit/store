import Paystack from 'paystack-sdk';
import { env } from './env.mjs';

export const paystack = new Paystack(env.PAYSTACK_SECRET_KEY);
