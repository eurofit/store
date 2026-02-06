export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  accountNumber: string;
  fao: string;
  billTo: {
    name: string;
    contact: string;
    address: string[];
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
    no: number;
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
