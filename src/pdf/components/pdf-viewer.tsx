import QrCode from 'qrcode';
import { sampleInvoice } from '../invoice/data';
import { InvoiceDoc } from '../invoice/doc';
import { PDFViewer } from './viewer';

export async function PdfViewer() {
  const qr = await QrCode.toDataURL('https://g.page/r/CS7vpFfn8OgQEAE/review', {
    margin: 0,
  });
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <InvoiceDoc data={sampleInvoice} qrCode={qr} />
    </PDFViewer>
  );
}
