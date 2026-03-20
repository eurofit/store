import { InvoiceDoc } from '@/pdf/invoice/doc';
import { Invoice } from '@/schemas/invoice';
import { generateBarcode } from '@/utils/generate-barcode';
import { streamToBuffer } from '@/utils/stream-to-buffer';
import { pdf } from '@react-pdf/renderer';
import QrCode from 'qrcode';

const googleReviewLink = `https://g.page/r/CS7vpFfn8OgQEAE/review`;

export async function getInvoiceBuffer(invoice: Invoice) {
  const qrCodePromise = QrCode.toDataURL(googleReviewLink, {
    margin: 0,
  });
  const barcodePromise = generateBarcode(invoice.id.toString());

  const [qr, barcode] = await Promise.all([qrCodePromise, barcodePromise]);

  const stream = await pdf(
    <InvoiceDoc data={invoice} qrCode={qr} barcode={barcode} />,
  ).toBuffer();

  const buffer = await streamToBuffer(stream);

  return buffer;
}
