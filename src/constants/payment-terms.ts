export const defaultPaymentTerms = [
  {
    code: 'COD',
    name: 'Cash on Delivery',
    description: 'Payment is made by the customer at the time of delivery',
  },
  {
    code: 'PIA',
    name: 'Payment in Advance',
    description: 'Full payment is required before delivery or service',
  },
  {
    code: 'NET7',
    name: 'Net 7 Days',
    description: 'Payment is due 7 days after the invoice date',
  },
  {
    code: 'NET14',
    name: 'Net 14 Days',
    description: 'Payment is due 14 days after the invoice date',
  },
  {
    code: 'NET30',
    name: 'Net 30 Days',
    description: 'Payment is due 30 days after the invoice date',
  },
  {
    code: 'EOM',
    name: 'End of Month',
    description: 'Payment is due at the end of the current month',
  },
  {
    code: 'EOM+30',
    name: 'End of Month + 30 Days',
    description: 'Payment is due 30 days after the end of the current month',
  },
  {
    code: 'MFI',
    name: 'Monthly Final Invoice',
    description: 'Used for recurring monthly summaries, common in retail or gym setups',
  },
  {
    code: 'PSOC',
    name: 'Payment for Sold On Consignment',
    description: 'Invoice includes only payment for sold items under consignment',
  },
  {
    code: 'DOD',
    name: 'Delivery on Deposit',
    description: 'Partial payment collected at delivery, remaining later',
  },
  {
    code: 'PPIA',
    name: 'Partial Payment in Advance',
    description: 'Partial payment required before delivery, remaining due later',
  },
];
