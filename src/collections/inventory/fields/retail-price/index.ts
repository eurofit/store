import { NumberField } from 'payload';

export const retailPriceField: NumberField = {
  name: 'retailPrice',
  type: 'number',
  label: 'Retail Price',
  required: true,
  defaultValue: 0,
  min: 0,
  validate: (value) => {
    if (value === undefined || value === null) {
      return 'Retail Price is required';
    }
    if (value < 0) {
      return 'Retail Price must be a positive number';
    }
    return true;
  },
  admin: {
    step: 0.01,
  },
};
