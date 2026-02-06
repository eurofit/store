import { Text, View } from '@react-pdf/renderer';
import { InvoiceData } from '../types';
import { styles } from './styles';

interface BillShipToProps {
  data: InvoiceData;
}

export function BillShipTo({ data }: BillShipToProps) {
  return (
    <View style={styles.twoColumn}>
      <View style={styles.column}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        <Text style={styles.addressText}>{data.billTo.name}</Text>
        <Text style={styles.addressText}>{data.billTo.contact}</Text>
        {data.billTo.address.map((line, index) => (
          <Text key={index} style={styles.addressText}>
            {line}
          </Text>
        ))}
        <Text style={styles.addressText}>Tel: {data.billTo.phone}</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.sectionTitle}>Ship To:</Text>
        <Text style={styles.addressText}>{data.shipTo.name}</Text>
        {data.shipTo.address.map((line, index) => (
          <Text key={index} style={styles.addressText}>
            {line}
          </Text>
        ))}
        <Text style={styles.addressText}>Tel: {data.shipTo.phone}</Text>
      </View>
    </View>
  );
}
