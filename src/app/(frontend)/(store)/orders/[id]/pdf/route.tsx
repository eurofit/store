import { getCurrentUser } from '@/actions/auth/get-current-user';
import { sampleInvoice } from '@/pdf/invoice/data';
import { InvoiceDoc } from '@/pdf/invoice/doc';
import { generateBarcode } from '@/utils/generate-barcode';
import { streamToBuffer } from '@/utils/stream-to-buffer';
import { pdf } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';
import QrCode from 'qrcode';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const [params, user] = await Promise.all([paramsPromise, getCurrentUser()]);

  const { id: orderId } = await params;

  const qr = await QrCode.toDataURL('https://g.page/r/CS7vpFfn8OgQEAE/review', {
    margin: 0,
  });
  const barcode = await generateBarcode(orderId);

  const stream = await pdf(
    <InvoiceDoc data={sampleInvoice} qrCode={qr} barcode={barcode} />,
  ).toBuffer();

  const buffer = await streamToBuffer(stream);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="invoice.pdf"',
    },
  });
}
