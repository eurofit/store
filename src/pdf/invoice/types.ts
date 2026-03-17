export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  accountNumber: string;
  fao: string;
  billTo: {
    name: string;
    contact: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      country: string;
      postalCode: string;
      postalAddress: string;
    };
    phone: string;
  };
  shipTo: {
    name: string;
    address: string[];
    phone: string;
  };
  orderInfo: {
    salesPerson: string;
    poNumber: string;
    requisitioner: string;
    terms: string;
    shippedVia: string;
  };
  items: Array<{
    sku: string;
    bbe: string;
    qty: number;
    description: string;
    price: number;
  }>;
  subtotal: number;
  vat: number;
  deliveryFee: number;
  grandTotal: number;
  paid: number;
  unpaidBalance: number;
}
