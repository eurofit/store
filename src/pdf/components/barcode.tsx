import { Image } from '@react-pdf/renderer';
import bwipjs from 'bwip-js';

export async function generateBarcode(value: string) {
  const png = await bwipjs.toBuffer({
    bcid: 'code128',
    text: value,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: 'center',
  });

  return `data:image/png;base64,${png.toString('base64')}`;
}

type BarcodeProps = {
  value: string;
} & Omit<React.ComponentProps<typeof Image>, 'src'>;

export async function Barcode({ value, ...props }: BarcodeProps) {
  const barcode = await generateBarcode(value);

  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={barcode} style={{ width: 130 }} {...props} />;
}
