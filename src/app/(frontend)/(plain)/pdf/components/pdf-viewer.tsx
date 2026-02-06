'use client';

import { PDFViewer } from '@react-pdf/renderer';
import QrCode from 'qrcode';
import { sampleInvoice } from '../data';
import { InvoiceDocument } from './invoice-document';

export async function PdfViewer() {
  const qr = await QrCode.toDataURL('https://share.google/84Zpx44Yhx0tfIhfP', {
    margin: 0,
  });
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <InvoiceDocument data={sampleInvoice} qrCode={qr} />
    </PDFViewer>
  );
}
