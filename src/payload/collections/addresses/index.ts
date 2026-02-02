import { titles } from '@/constants/titles';
import { CollectionConfig } from 'payload';
import { ensureSingleDefaultAddress } from './hooks/ensure-single-default-address';

export const addresses: CollectionConfig = {
  slug: 'addresses',

  labels: {
    singular: 'Address',
    plural: 'Addresses',
  },

  admin: {
    useAsTitle: 'label',
    description: 'Customer delivery addresses.',
  },

  fields: [
    /**
     * OWNERSHIP
     */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who owns this address.',
      },
    },

    /**
     * CONTACT PERSON
     */
    {
      name: 'title',
      type: 'select',
      options: titles,
      required: true,
    },
    {
      name: 'firstName',
      type: 'text',
      admin: {
        description:
          'First name of the person receiving the delivery, if different from the account owner.',
      },
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        description:
          'Last name of the person receiving the delivery, if different from the account owner.',
      },
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description:
          'Email address for this address, if different from the user’s main email.',
      },
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        description:
          'Phone number for this address, if different from the user’s main number.',
      },
      required: true,
    },

    /**
     * ADDRESS IDENTITY
     */
    {
      name: 'label',
      type: 'text',
      admin: {
        description:
          'Short name to identify this address. Example: Home, Work, Shop, Warehouse, Cargo.',
      },
    },

    /**
     * CORE ADDRESS
     */
    {
      name: 'line1',
      type: 'text',
      required: true,
      admin: {
        description:
          'Primary address details. Example: Building name, house number, or plot number.',
      },
    },
    {
      name: 'line2',
      type: 'text',
      admin: {
        description:
          'Optional extra details. Example: Apartment number, floor, or suite.',
      },
    },
    {
      name: 'line3',
      type: 'text',
      admin: {
        description: 'Landmark',
      },
    },

    /**
     * LOCATION (ADMINISTRATIVE)
     */
    {
      name: 'country',
      type: 'text',
      required: true,
      defaultValue: 'Kenya',
      admin: {
        description: 'Country where this address is located.',
      },
    },
    {
      name: 'county',
      type: 'text',
      required: true,
      admin: {
        description: 'County name. Example: Nairobi, Kiambu, Mombasa.',
      },
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      admin: {
        description: 'City or town. Example: Nairobi, Thika, Nakuru.',
      },
    },
    {
      name: 'postalCode',
      type: 'text',
      required: true,
      admin: {
        description: 'Postal code for the area. Example: 00100, 00200.',
      },
    },

    /**
     * DELIVERY INSTRUCTIONS
     */
    {
      name: 'note',
      type: 'textarea',
      admin: {
        description:
          'Extra delivery instructions. Example: Call when at the gate, Ask for caretaker.',
      },
    },

    /**
     * DEFAULT ADDRESS
     */
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        description: 'Set this as the user’s default delivery address.',
      },
    },
  ],

  hooks: {
    beforeChange: [ensureSingleDefaultAddress],
  },
};
