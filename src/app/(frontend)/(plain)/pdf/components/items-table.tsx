import { Text, View } from '@react-pdf/renderer';
import { InvoiceData } from '../types';
import { styles } from './styles';

interface ItemsTableProps {
  data: InvoiceData;
}

function formatCurrency(amount: number): string {
  return `Ksh ${amount.toLocaleString('en-KE')}`;
}

export function ItemsTable({ data }: ItemsTableProps) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, styles.colNo]}>NO</Text>
        <Text style={[styles.tableHeaderCell, styles.colQty]}>QTY</Text>
        <Text style={[styles.tableHeaderCell, styles.colDescription]}>DESCRIPTION</Text>
        <Text style={[styles.tableHeaderCell, styles.colPrice]}>PRICE</Text>
        <Text style={[styles.tableHeaderCell, styles.colTotal]}>TOTAL</Text>
      </View>
      {data.items.map((item) => {
        const total = item.qty * item.price;
        return (
          <View key={item.no} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colNo]}>{item.no}</Text>
            <Text style={[styles.tableCell, styles.colQty]}>{item.qty}</Text>
            <Text style={[styles.tableCell, styles.colDescription]}>
              {item.description}
            </Text>
            <Text style={[styles.tableCell, styles.colPrice]}>
              {formatCurrency(item.price)}
            </Text>
            <Text style={[styles.tableCell, styles.colTotal]}>
              {formatCurrency(total)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
