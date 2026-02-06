import { InvoiceData } from './types';

export const sampleInvoice: InvoiceData = {
  invoiceNumber: '511305442125',
  date: '05/11/2025',
  accountNumber: 'ACC123456',
  fao: 'Yasir Manager',
  billTo: {
    name: 'YASIR CUSMETICS',
    contact: 'Yasir Manager',
    address: [
      'Unit 111, 1st Floor, 6th Street Tower',
      '6th Street, Eastleigh',
      'Nairobi, Kenya',
    ],
    phone: '+254 110 990 666',
  },
  shipTo: {
    name: 'YASIR CUSMETICS',
    address: [
      'Unit 111, 1st Floor, 6th Street Tower',
      '6th Street, Eastleigh',
      'Nairobi, Kenya',
    ],
    phone: '+254 110 990 666',
  },
  orderInfo: {
    salesPerson: 'John Doe',
    poNumber: 'PO-2025-001',
    requisitioner: 'Yasir Manager',
    terms: 'Net 30 Days',
    shippedVia: 'Delivery',
  },
  items: [
    {
      no: 1,
      qty: 10,
      description: 'Product A - Premium Quality',
      price: 5000,
    },
    {
      no: 2,
      qty: 5,
      description: 'Product B - Standard Quality',
      price: 3000,
    },
    {
      no: 3,
      qty: 8,
      description: 'Product C - Deluxe Edition',
      price: 7500,
    },
    {
      no: 4,
      qty: 12,
      description: 'Product D - Basic Package',
      price: 2000,
    },
    {
      no: 5,
      qty: 3,
      description: 'Product E - Professional Grade',
      price: 12000,
    },
  ],
  subtotal: 159900,
  vat: 0,
  deliveryFee: 0,
  grandTotal: 159900,
  paid: 100000,
  unpaidBalance: 59900,
};
