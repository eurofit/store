import { Image } from '@react-pdf/renderer';
import { generateBarcode } from '../../utils/generate-barcode';

type BarcodeProps = {
  value: string;
} & Omit<React.ComponentProps<typeof Image>, 'src'>;

export async function Barcode({ value, ...props }: BarcodeProps) {
  const barcode = await generateBarcode(value);

  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={barcode} style={{ width: 130 }} {...props} />;
}
