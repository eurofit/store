import { getInvoice } from '@/actions/get-invoice';
import { site } from '@/constants/site';
import { getInvoiceBuffer } from '@/utils/getInvoiceBuffer';
import { formatDate } from 'date-fns';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: orderId } = await params;

  const invoice = await getInvoice({ orderId: Number(orderId) });
  const invoiceBuffer = await getInvoiceBuffer(invoice);

  const lowerCaseSiteName = site.name.toLowerCase();
  const invoiceDate = formatDate(invoice.date, 'yyyy-MM-dd');
  const filename = `${lowerCaseSiteName}-invoice-${invoice.id}-at-${invoiceDate}.pdf`;

  return new NextResponse(invoiceBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  });
}
