import { getInvoice } from '@/actions/get-invoice';
import { getInvoiceBuffer } from '@/utils/getInvoiceBuffer';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;

  const invoice = await getInvoice({ orderId: Number(orderId) });
  const invoiceBuffer = await getInvoiceBuffer(invoice);

  return new NextResponse(invoiceBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="invoice.pdf"',
    },
  });
}
