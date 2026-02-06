import { Text, View } from '@react-pdf/renderer';
import { InvoiceData } from '../types';
import { styles } from './styles';

interface OrderInfoProps {
  data: InvoiceData;
}

export function OrderInfo({ data }: OrderInfoProps) {
  return (
    <View style={styles.section}>
      <View style={styles.orderInfoRow}>
        <View style={styles.orderInfoItem}>
          <Text style={styles.orderInfoLabel}>Sales Person:</Text>
          <Text style={styles.orderInfoValue}>{data.orderInfo.salesPerson}</Text>
        </View>
        <View style={styles.orderInfoItem}>
          <Text style={styles.orderInfoLabel}>P.O Number:</Text>
          <Text style={styles.orderInfoValue}>{data.orderInfo.poNumber}</Text>
        </View>
        <View style={styles.orderInfoItem}>
          <Text style={styles.orderInfoLabel}>Requisitioner:</Text>
          <Text style={styles.orderInfoValue}>{data.orderInfo.requisitioner}</Text>
        </View>
      </View>
      <View style={styles.orderInfoRow}>
        <View style={styles.orderInfoItem}>
          <Text style={styles.orderInfoLabel}>Payment Terms:</Text>
          <Text style={styles.orderInfoValue}>{data.orderInfo.terms}</Text>
        </View>
        <View style={styles.orderInfoItem}>
          <Text style={styles.orderInfoLabel}>Shipped Via:</Text>
          <Text style={styles.orderInfoValue}>{data.orderInfo.shippedVia}</Text>
        </View>
      </View>
    </View>
  );
}
