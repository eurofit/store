import { paystack } from '@/paystact';
import { paystackCustomerSchema } from '@/schemas/paystack-customer-code';
import { TaskConfig } from 'payload';

export const tasks = [
  {
    slug: 'syncToPaystack',
    retries: 3,
    inputSchema: [
      {
        name: 'firstName',
        type: 'text',
        required: true,
      },
      {
        name: 'lastName',
        type: 'text',
        required: true,
      },
      {
        name: 'email',
        type: 'text',
        required: true,
      },
      {
        name: 'phone',
        type: 'text',
      },
    ],
    outputSchema: [
      {
        name: 'paystackCustomerCode',
        type: 'text',
        required: true,
      },
    ],

    handler: async ({ input, req }) => {
      const {
        email,
        firstName: first_name,
        lastName: last_name,
        phone,
      } = paystackCustomerSchema.parse(input);

      const res = await paystack.customer.create({
        email,
        first_name,
        last_name,
        phone,
      });

      if (!res.status || !res.data) {
        throw new Error(
          `Failed to create Paystack customer: ${res.message || 'Unknown error'}`,
        );
      }

      const { customer_code } = res.data;

      await req.payload.update({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
        data: {
          paystackCustomerCode: customer_code,
        },
      });

      return {
        output: {
          paystackCustomerCode: customer_code,
        },
      };
    },
  } as TaskConfig<'syncToPaystack'>,
] satisfies TaskConfig[];
