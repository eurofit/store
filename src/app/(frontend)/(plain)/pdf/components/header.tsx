import { site } from '@/constants/site';
import { Text, View } from '@react-pdf/renderer';
import { Barcode } from './barcode';
import { styles } from './styles';

const Br = () => '\n';

export function Header() {
  return (
    <View style={styles.header}>
      <View>
        <View>
          <View style={styles.logo}>
            <Text>euro</Text>
            <Text style={{ color: 'red' }}>fit</Text>
          </View>
          <Text style={styles.subtitle}>European Fitness, African Strength</Text>
        </View>
        <View style={styles.address}>
          <Text>
            {site.address.line1}, <Br />
            {site.address.line2}, <Br />
            {site.address.postalAddress}, <Br />
            {site.address.city}, {site.address.country}. <Br />
            +254 110 990 666 <Br />
            info@eurofit.uk
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <Text style={styles.title}>Invoice</Text>
        <Barcode value="4587321" options={{ textAlign: 'right' }} />
        <View
          style={{
            position: 'relative',
            marginTop: 20,
            width: '200px',
            height: '50px',
            flexDirection: 'column',
            border: '1px solid black',
          }}
        >
          <View
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
            }}
          >
            <View
              style={{
                width: '35%',
                textAlign: 'right',
                alignItems: 'flex-end',
                justifyContent: 'center',
                borderBottom: '1px solid black',
                paddingHorizontal: 6,
              }}
            >
              <Text>FAO</Text>
            </View>
            <View
              style={{
                width: '65%',
                height: '100%',
                alignItems: 'flex-end',
                paddingHorizontal: 6,
                borderLeft: '1px solid black',
                borderBottom: '1px solid black',
              }}
            >
              <Text>Full Name</Text>
            </View>
          </View>
          <View
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
              borderBottom: '1px solid black',
            }}
          >
            <View
              style={{
                width: '35%',
                textAlign: 'right',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingHorizontal: 6,
              }}
            >
              <Text>ACC NO</Text>
            </View>
            <View
              style={{
                width: '65%',
                height: '100%',
                alignItems: 'flex-end',
                paddingHorizontal: 6,
                borderLeft: '1px solid black',
              }}
            >
              <Text>Full Name</Text>
            </View>
          </View>
          <View
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
            }}
          >
            <View
              style={{
                width: '35%',
                textAlign: 'right',
                alignItems: 'flex-end',
                justifyContent: 'center',

                paddingHorizontal: 6,
              }}
            >
              <Text>Date</Text>
            </View>
            <View
              style={{
                width: '65%',
                height: '100%',
                alignItems: 'flex-end',
                paddingHorizontal: 6,
                borderLeft: '1px solid black',
              }}
            >
              <Text>Full Name</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
