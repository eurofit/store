import { Text, View } from '@react-pdf/renderer';
import { InvoiceData } from '../types';
import { styles } from './styles';

interface TotalsProps {
  data: InvoiceData;
}

function formatCurrency(amount: number): string {
  return `Ksh ${amount.toLocaleString('en-KE')}`;
}

export function Totals({ data }: TotalsProps) {
  return (
    <View style={styles.totals}>
      <View style={styles.totalsRow}>
        <Text style={styles.totalsLabel}>Subtotal:</Text>
        <Text style={styles.totalsValue}>{formatCurrency(data.subtotal)}</Text>
      </View>
      {data.vat > 0 && (
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>VAT:</Text>
          <Text style={styles.totalsValue}>{formatCurrency(data.vat)}</Text>
        </View>
      )}
      {data.deliveryFee > 0 && (
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Delivery Fee:</Text>
          <Text style={styles.totalsValue}>{formatCurrency(data.deliveryFee)}</Text>
        </View>
      )}
      <View style={[styles.totalsRow, styles.grandTotalRow]}>
        <Text style={styles.grandTotalLabel}>Grand Total:</Text>
        <Text style={styles.grandTotalValue}>{formatCurrency(data.grandTotal)}</Text>
      </View>
      {data.paid > 0 && (
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Paid:</Text>
          <Text style={styles.totalsValue}>{formatCurrency(data.paid)}</Text>
        </View>
      )}
      {data.unpaidBalance > 0 && (
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Unpaid Balance:</Text>
          <Text style={styles.totalsValue}>{formatCurrency(data.unpaidBalance)}</Text>
        </View>
      )}
    </View>
  );
}
