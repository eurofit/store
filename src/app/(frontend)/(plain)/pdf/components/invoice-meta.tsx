import { Text, View } from '@react-pdf/renderer';
import { InvoiceData } from '../types';
import { styles } from './styles';

interface InvoiceMetaProps {
  data: InvoiceData;
}

export function InvoiceMeta({ data }: InvoiceMetaProps) {
  return (
    <View style={styles.invoiceMeta}>
      <View style={styles.invoiceMetaRow}>
        <Text style={styles.invoiceMetaLabel}>Invoice No:</Text>
        <Text style={styles.invoiceMetaValue}>{data.invoiceNumber}</Text>
      </View>
      <View style={styles.invoiceMetaRow}>
        <Text style={styles.invoiceMetaLabel}>Date:</Text>
        <Text style={styles.invoiceMetaValue}>{data.date}</Text>
      </View>
      <View style={styles.invoiceMetaRow}>
        <Text style={styles.invoiceMetaLabel}>ACC NO:</Text>
        <Text style={styles.invoiceMetaValue}>{data.accountNumber}</Text>
      </View>
      <View style={styles.invoiceMetaRow}>
        <Text style={styles.invoiceMetaLabel}>FAO:</Text>
        <Text style={styles.invoiceMetaValue}>{data.fao}</Text>
      </View>
    </View>
  );
}
