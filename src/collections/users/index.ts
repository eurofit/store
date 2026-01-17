import { generateForgotPasswordEmailHTML } from '@/emails/forgot-password';
import { generateVerificationEmailHTML } from '@/emails/verification';
import type { CollectionConfig } from 'payload';
import { syncToPaystack } from './hooks/sync-to-paystack';

export const users: CollectionConfig = {
  slug: 'users',
  typescript: {
    interface: 'User',
  },
  admin: {
    useAsTitle: 'email',
  },
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  auth: {
    verify: {
      generateEmailHTML({ token, user }) {
        return generateVerificationEmailHTML({
          token,
          firstName: user.firstName,
        });
      },
      generateEmailSubject() {
        return 'Verify your email';
      },
    },
    maxLoginAttempts: 12,
    forgotPassword: {
      generateEmailHTML: ({ user, token } = {}) =>
        generateForgotPasswordEmailHTML({
          user,
          token,
        }),
    },
  },
  disableDuplicate: true,
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'The email address of the user. This will be used for login.',
      },
      index: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'The first name of the user.',
      },
      index: true,
    },
    {
      name: 'middleName',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'The middle name of the user.',
      },
      index: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'The last name of the user.',
      },
      index: true,
    },

    {
      name: 'gender',
      type: 'select',
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
      ],
      defaultValue: 'female',
      required: true,
    },
    {
      name: 'birthDate',
      type: 'date',
      admin: {
        description: 'The birth date of the user.',
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      hasMany: true,
      on: 'user',
      admin: {
        allowCreate: true,
      },
      saveToJWT: true,
    },
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'user',
      defaultLimit: 1,
      admin: {
        allowCreate: true,
      },
    },
    {
      name: 'stockAlerts',
      type: 'join',
      collection: 'stock-alerts',
      on: 'user',
      admin: {
        allowCreate: true,
      },
    },
    {
      name: 'paystackCustomerCode',
      type: 'text',
      required: true,
      admin: {
        description:
          'The Paystack customer code for this user. This is given by external payment processor Paystack.',
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeChange: [syncToPaystack],
  },
};
