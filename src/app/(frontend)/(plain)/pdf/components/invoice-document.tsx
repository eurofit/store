import { site } from '@/constants/site';
import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { truncate } from 'lodash-es';
import '../fonts';
import { InvoiceData } from '../types';
import { Barcode } from './barcode';
import { styles } from './styles';

const Br = () => '\n';

type InvoiceDocumentProps = {
  data: InvoiceData;
  qrCode: string;
};

export function InvoiceDocument({ data, qrCode }: InvoiceDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER  */}
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
                +44 7538 584237 / +254 110 990 666 <Br />
                +254 797 722 699 <Br />
                info@eurofit.uk
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Text style={styles.title}>Invoice</Text>
            <Barcode value={data.invoiceNumber} />
            <View
              style={{
                position: 'relative',
                marginTop: 16,
                width: '200',
                height: '80px',
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
                    justifyContent: 'center',
                    paddingHorizontal: 6,
                    borderLeft: '1px solid black',
                    borderBottom: '1px solid black',
                    textTransform: 'capitalize',
                  }}
                >
                  <Text>{truncate(data.fao, { length: 17 })}</Text>
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
                    textTransform: 'capitalize',
                    justifyContent: 'center',
                  }}
                >
                  <Text>{truncate(data.accountNumber, { length: 17 })}</Text>
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
                  <Text>ORDER</Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    height: '100%',
                    alignItems: 'flex-end',
                    paddingHorizontal: 6,
                    borderLeft: '1px solid black',
                    textTransform: 'capitalize',
                    justifyContent: 'center',
                  }}
                >
                  <Text>{truncate(data.invoiceNumber, { length: 17 })}</Text>
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
                  <Text>Date</Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    height: '100%',
                    alignItems: 'flex-end',
                    paddingHorizontal: 6,
                    borderLeft: '1px solid black',
                    justifyContent: 'center',
                  }}
                >
                  <Text>{data.date}</Text>
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
                  <Text>Status</Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    height: '100%',
                    alignItems: 'flex-end',
                    paddingHorizontal: 6,
                    borderLeft: '1px solid black',
                    justifyContent: 'center',
                  }}
                >
                  <Text>Paid</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER  */}
        <View
          fixed
          style={{
            position: 'relative',
            height: '50px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 'auto',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              justifyContent: 'flex-end',
            }}
          >
            <Text
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
            <Text>Printed on: {format(new Date(), 'dd/MM/yyyy HH:mm')}</Text>
          </View>

          <View
            style={{
              position: 'relative',
              height: '100%',
              marginLeft: 'auto',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View
              style={{ gap: 4, alignItems: 'flex-end', width: 80, textAlign: 'right' }}
            >
              <Text style={{ textAlign: 'right' }}>Happy?</Text>
              <Text style={{ textAlign: 'right' }}>Scan to leave us a review.</Text>
            </View>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={qrCode}
              style={{
                width: 'auto',
                height: '100%',
                objectFit: 'contain',
                aspectRatio: 1,
              }}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}
