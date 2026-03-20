type Item = {
  id: string;
  sku: string;
  bbe: string;
  title: string;
  qty: string;
  price: string;
};

export interface InvoiceData {
  id: string;
  fao: string;
  account: string;
  date: string;
  dueDate: string;
  status: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
  };
  items: Item[];
  subtotal: string;
  deliveryFee: string;
  tax: string;
  total: string;
}
