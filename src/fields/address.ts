import { ArrayField, deepMerge, Field } from 'payload';

type AddressFieldOverrides = Partial<ArrayField>;

export function addressField(
  name: string = 'address',
  overrides?: AddressFieldOverrides,
): Field[] {
  const baseAddressField: ArrayField = {
    name,
    type: 'array',
    fields: [
      {
        name: 'line1',
        type: 'text',
        required: true,
        admin: {
          position: 'sidebar',
          description:
            "Primary address line — include the estate or apartment name and street. Example for estate: 'Fedha Estate, Outer Ring Road'. Example for apartment: 'Sixth Street Tower, 6th Street'.",
        },
        index: true,
      },
      {
        name: 'line2',
        type: 'text',
        admin: {
          position: 'sidebar',
          description:
            "Secondary details — unit, floor, block, gate, etc., starting from smallest to largest. Example for estate: 'House 55, Gate C'. Example for apartment: 'Unit 111, 1st Floor, Block B'.",
        },
      },
      {
        name: 'line3',
        type: 'text',
        admin: {
          position: 'sidebar',
          description:
            "Optional additional details — landmarks, directions, etc. Example: 'Near Fedha Shopping Centre'.",
        },
      },
      {
        name: 'city',
        type: 'text',
        required: true,
        admin: {
          position: 'sidebar',
          description: "Town or city name. Example: 'Nairobi'.",
        },
        index: true,
      },
      {
        name: 'state',
        type: 'text',
        required: true,
        admin: {
          position: 'sidebar',
          description: "County or province. Example: 'Nairobi County'.",
        },
      },
      {
        name: 'zipCode',
        type: 'text',
        required: true,
        admin: {
          position: 'sidebar',
          description:
            "Postal or ZIP code (5 digits in Kenya). Example: '00518' for Fedha or Embakasi.",
        },
        index: true,
      },
      {
        name: 'country',
        type: 'text',
        required: true,
        defaultValue: 'Kenya',
        admin: {
          position: 'sidebar',
          description: "Country name. Example: 'Kenya'.",
        },
        index: true,
      },
      {
        name: 'isDefault',
        type: 'checkbox',
        label: 'Primary Address',
        defaultValue: false,
        admin: {
          position: 'sidebar',
          description: 'Indicates if this is the default address for the user.',
        },
        // TODO: add hook to ensure only one address can be set as default
        // beforeValidate: [ensureSingleDefaultAddressHook],
      },
    ],
  };

  const addressField = deepMerge(baseAddressField, overrides ?? {});

  return [addressField];
}
