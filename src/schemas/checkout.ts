import { isPossiblePhoneNumber } from 'libphonenumber-js';
import * as z from 'zod';

const mpesaSchema = z.object({
  method: z.literal('mpesa'),
  mpesaPhone: z.string().min(1, 'Phone number is required').optional(),
});

const airtelSchema = z.object({
  method: z.literal('airtel'),
  airtelPhone: z.string().min(1, 'Phone number is required').optional(),
});

const cardSchema = z.object({
  method: z.literal('card'),
  number: z.string().optional(),
  expiry: z.string().optional(),
  cvc: z.string().optional(),
  name: z.string().optional(),
});

export const paymentSchema = z
  .union([mpesaSchema, airtelSchema, cardSchema])
  .superRefine((data, ctx) => {
    // Validate M-Pesa phone
    if (data.method === 'mpesa') {
      if (!data.mpesaPhone) {
        ctx.addIssue({
          code: 'custom',
          path: ['mpesaPhone'],
          message: 'Phone number is required',
        });
      } else if (!isPossiblePhoneNumber(data.mpesaPhone, 'KE')) {
        ctx.addIssue({
          code: 'custom',
          path: ['mpesaPhone'],
          message: 'Please enter a valid Kenyan phone number (07XXXXXXXX)',
        });
      }
    }

    // Validate Airtel Money phone
    if (data.method === 'airtel') {
      if (!data.airtelPhone) {
        ctx.addIssue({
          code: 'custom',
          path: ['airtelPhone'],
          message: 'Phone number is required',
        });
      } else if (!/^07\d{8}$/.test(data.airtelPhone)) {
        ctx.addIssue({
          code: 'custom',
          path: ['airtelPhone'],
          message: 'Please enter a valid Kenyan phone number (07XXXXXXXX)',
        });
      }
    }

    // Validate Card fields
    if (data.method === 'card') {
      if (!data.number) {
        ctx.addIssue({
          code: 'custom',
          path: ['number'],
          message: 'Card number is required',
        });
      } else if (!/^\d{16}$/.test(data.number.replace(/\s/g, ''))) {
        ctx.addIssue({
          code: 'custom',
          path: ['number'],
          message: 'Card number must be 16 digits',
        });
      }

      if (!data.expiry) {
        ctx.addIssue({
          code: 'custom',
          path: ['expiry'],
          message: 'Expiry date is required',
        });
      } else if (!/^\d{2}\/\d{2}$/.test(data.expiry)) {
        ctx.addIssue({
          code: 'custom',
          path: ['expiry'],
          message: 'Please use MM/YY format',
        });
      }

      if (!data.cvc) {
        ctx.addIssue({
          code: 'custom',
          path: ['cvc'],
          message: 'Security code is required',
        });
      } else if (!/^\d{3,4}$/.test(data.cvc)) {
        ctx.addIssue({
          code: 'custom',
          path: ['cvc'],
          message: 'Security code must be 3-4 digits',
        });
      }

      if (!data.name) {
        ctx.addIssue({
          code: 'custom',
          path: ['name'],
          message: 'Cardholder name is required',
        });
      }
    }
  });

export type PaymentData = z.infer<typeof paymentSchema>;
