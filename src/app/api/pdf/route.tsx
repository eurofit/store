import { pdf } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';
import { InvoicePdf } from './invoice';
export const runtime = 'nodejs';

async function streamToBuffer(stream: NodeJS.ReadableStream) {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

export async function GET() {
  const stream = await pdf(<InvoicePdf invoiceId={'#1002'} />).toBuffer();
  const buffer = await streamToBuffer(stream);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="invoice.pdf"',
    },
  });
}
