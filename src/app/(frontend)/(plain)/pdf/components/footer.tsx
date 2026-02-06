import { site } from '@/constants/site';
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

export function Footer() {
  const printDate = new Date().toLocaleString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Thank you for your business! We appreciate your trust in {site.name}.
      </Text>
      <Text style={styles.footerText}>
        <Text style={styles.footerBold}>Payment Instructions:</Text>
      </Text>
      <Text style={styles.footerText}>
        For M-Pesa payments, send to: {site.contact.phone.text}
      </Text>
      <Text style={styles.footerText}>
        For WhatsApp inquiries:{' '}
        <Text style={styles.footerBold}>
          {site.socialLinks.find((link) => link.name === 'Whatsapp')?.href}
        </Text>
      </Text>
      <Text style={styles.footerText}>Printed on: {printDate}</Text>
    </View>
  );
}
