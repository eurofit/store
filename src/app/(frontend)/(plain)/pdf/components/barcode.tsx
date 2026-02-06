import { Image } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode';

function generateBarcodeBase64(value: string, options?: JsBarcode.BaseOptions) {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, value, {
    format: 'CODE128',
    width: 2,
    height: 50,
    displayValue: false,
    margin: 0,
    ...options,
  });
  return canvas.toDataURL('image/png');
}

type BarcodeProps = {
  value: string;
  options?: JsBarcode.BaseOptions;
};

export function Barcode({ value, options }: BarcodeProps) {
  const barcode = generateBarcodeBase64(value, options);

  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={barcode} style={{ width: 130 }} />;
}
