import { Document, Page, StyleSheet, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40 },
  title: { fontSize: 18, marginBottom: 12 },
  text: { fontSize: 12 },
});

export function InvoicePdf({ invoiceId }: { invoiceId: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Invoice #{invoiceId}</Text>
        <Text style={styles.text}>Generated from Next.js App Router</Text>
      </Page>
    </Document>
  );
}
