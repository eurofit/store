import { site } from '@/constants/site';
import { formatWithCommas } from '@/utils/format-with-commas';
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
    <Document
      title={`Eurofit - Invoice #${data.invoiceNumber}`}
      author={site.name}
      subject={`Invoice #${data.invoiceNumber}`}
      keywords="invoice, eurofit, fitness, gym, supplements"
      creator={site.name}
      producer={site.name}
      language="en-US"
    >
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
                width: 170,
                flexDirection: 'column',
                border: '1px solid black',
                textTransform: 'uppercase',
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
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontWeight: 600 }}>FAO</Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    height: '100%',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
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
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontWeight: 600 }}>ACC NO</Text>
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
                    paddingVertical: 2,
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
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontWeight: 600 }}>ORDER</Text>
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
                    paddingVertical: 2,
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
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontWeight: 600 }}>Date</Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    height: '100%',
                    alignItems: 'flex-end',
                    paddingHorizontal: 6,
                    borderLeft: '1px solid black',
                    justifyContent: 'center',
                    paddingVertical: 2,
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
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ fontWeight: 600 }}>Status</Text>
                </View>
                <View
                  style={{
                    width: '65%',
                    height: '100%',
                    alignItems: 'flex-end',
                    paddingHorizontal: 6,
                    borderLeft: '1px solid black',
                    justifyContent: 'center',
                    paddingVertical: 2,
                  }}
                >
                  <Text>Paid</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* TABLE  */}
        <View
          style={{
            marginTop: 24,
            border: '1px solid black',
          }}
        >
          {/* HEADER Row */}
          <View
            style={{
              flexDirection: 'row',
              borderBottom: '1px solid black',
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: '#e5e5e5',
            }}
          >
            <View
              style={{
                width: '8%',
                alignContent: 'center',
                alignItems: 'flex-start',
                borderRight: '1px solid black',
                height: '100%',
                padding: 4,
              }}
            >
              <Text>No</Text>
            </View>
            <View
              style={{
                alignItems: 'flex-start',
                borderRight: '1px solid black',
                height: '100%',
                flexGrow: 1,
                padding: 4,
              }}
            >
              <Text>Description</Text>
            </View>
            <View
              style={{
                width: '10%',
                alignItems: 'center',
                borderRight: '1px solid black',
                height: '100%',
                padding: 4,
              }}
            >
              <Text>Qty</Text>
            </View>
            <View
              style={{
                width: '12%',
                alignItems: 'center',
                borderRight: '1px solid black',
                height: '100%',
                padding: 4,
              }}
            >
              <Text>
                Price&nbsp;
                <Text style={{ fontSize: 9, fontWeight: 300 }}>(KSh)</Text>
              </Text>
            </View>
            <View
              style={{
                width: '17%',
                alignItems: 'center',
                borderRight: '1px solid black',
                height: '100%',
                padding: 4,
              }}
            >
              <Text>
                Subtotal&nbsp;
                <Text style={{ fontSize: 9, fontWeight: 300 }}>(KSh)</Text>
              </Text>
            </View>
          </View>
          {/* ROWS */}
          {data.items.map((item, index) => (
            <View
              key={item.sku}
              style={{
                flexDirection: 'row',
                borderBottom:
                  index === data.items.length - 1 ? undefined : '1px solid black',
              }}
            >
              <View
                style={{
                  width: '8%',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  borderRight: '1px solid black',
                  height: '100%',
                  padding: 4,
                }}
              >
                <Text>{index + 1}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  borderRight: '1px solid black',
                  height: '100%',
                  flexGrow: 1,
                  padding: 4,
                }}
              >
                <Text style={{ fontWeight: 500 }}>{item.description}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 4,
                    fontSize: 9,
                    fontStyle: 'italic',
                    marginTop: 2,
                    fontWeight: 300,
                    color: '#666',
                  }}
                >
                  <Text>SKU: {item.sku}</Text>
                  <Text>|</Text>
                  <Text>BBE: {item.bbe}</Text>
                </View>
              </View>
              <View
                style={{
                  width: '10%',
                  alignItems: 'flex-end',
                  borderRight: '1px solid black',
                  height: '100%',
                  padding: 4,
                }}
              >
                <Text>{item.qty}</Text>
              </View>
              <View
                style={{
                  width: '12%',
                  alignItems: 'flex-end',
                  borderRight: '1px solid black',
                  height: '100%',
                  padding: 4,
                  overflow: 'hidden',
                }}
              >
                <Text>{formatWithCommas(item.price)}</Text>
              </View>
              <View
                style={{
                  width: '17%',
                  alignItems: 'flex-end',
                  borderRight: '1px solid black',
                  height: '100%',
                  padding: 4,
                  overflow: 'hidden',
                }}
              >
                <Text>{formatWithCommas(item.price * item.qty)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SUMMARY SECTION */}
        <View
          style={{ flexDirection: 'row', marginTop: 24, alignItems: 'flex-start' }}
          wrap={false}
        >
          <View style={{ gap: 16 }}>
            <View style={{ width: '37%' }}>
              <Text style={{ fontWeight: 700, fontSize: 12 }}>Payment Instructions:</Text>
              <Text style={{ marginTop: 4 }}>
                Kindly send your payment via M-Pesa to{' '}
                <Text style={{ fontWeight: 700 }}>0110990666</Text>. The name that will
                appear is <Text style={{ fontWeight: 700 }}>Cabdiqani Maxamed</Text>.
                THANK YOU!
              </Text>
            </View>
            <View style={{ width: '37%' }}>
              <Text style={{ fontWeight: 700, fontSize: 12 }}>Please Note:</Text>
              <Text style={{ marginTop: 4 }}>
                All items must be inspected upon delivery. By accepting this delivery, you
                confirm that the goods were received in good and very acceptable
                condition. All items are sold as-is, with no returns, and refunds. Any
                issues or damage must be reported immediately at the time of delivery. No
                claims will be accepted afterward.
              </Text>
            </View>
          </View>
          {/* TABLE */}
          <View
            style={{
              marginLeft: 'auto',
              border: '1px solid black',
              width: '39%',
              fontWeight: 700,
            }}
          >
            {/* ROW */}
            <View
              style={{
                position: 'relative',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottom: '1px solid black',
              }}
            >
              <View
                style={{
                  padding: 4,
                  textAlign: 'right',
                  textTransform: 'uppercase',
                  justifyContent: 'flex-end',

                  width: '50%',
                  borderRight: '1px solid black',
                }}
              >
                <Text>Subtotal</Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: 4,
                  textAlign: 'right',
                  width: '50%',
                  borderLeft: '1px solid black',
                }}
              >
                <Text>
                  <Text style={{ fontSize: 9 }}>KSh</Text>
                  &nbsp;
                  {formatWithCommas(data.subtotal)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottom: '1px solid black',
              }}
            >
              <View
                style={{
                  padding: 4,
                  textAlign: 'right',
                  textTransform: 'uppercase',
                  justifyContent: 'flex-end',
                  width: '50%',
                  borderRight: '1px solid black',
                }}
              >
                <Text>VAT</Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: 4,
                  textAlign: 'right',
                  width: '50%',
                }}
              >
                <Text>
                  <Text style={{ fontSize: 9, textTransform: 'none' }}>KSh</Text>
                  &nbsp;
                  {data.vat == 0
                    ? formatWithCommas(data.vat, { minimumFractionDigits: 2 })
                    : formatWithCommas(data.vat)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottom: '1px solid black',
                textTransform: 'uppercase',
              }}
            >
              <View
                style={{
                  padding: 4,
                  textAlign: 'right',
                  justifyContent: 'flex-end',
                  width: '50%',
                  borderRight: '1px solid black',
                }}
              >
                <Text style={{ textTransform: 'uppercase' }}>Delivery Fee</Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: 4,
                  textAlign: 'right',
                  width: '50%',
                }}
              >
                <Text>
                  <Text style={{ fontSize: 9, textTransform: 'none' }}>KSh</Text>
                  &nbsp;
                  {data.deliveryFee == 0
                    ? formatWithCommas(data.deliveryFee, { minimumFractionDigits: 2 })
                    : formatWithCommas(data.deliveryFee)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                border: '1px solid black',
                backgroundColor: 'green',
                color: 'white',
                fontWeight: 900,
                textTransform: 'uppercase',
              }}
            >
              <View
                style={{
                  padding: 6,
                  textAlign: 'right',
                  justifyContent: 'flex-end',
                  width: '50%',
                  borderRight: '2px solid black',
                }}
              >
                <Text>Grand Total</Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: 6,
                  textAlign: 'right',
                  textTransform: 'uppercase',
                  width: '50%',
                }}
              >
                <Text>
                  <Text style={{ fontSize: 9, textTransform: 'none' }}>KSh</Text>
                  &nbsp;
                  {formatWithCommas(data.grandTotal)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 'auto' }} />

        {/* FOOTER  */}
        <View
          fixed
          style={{
            position: 'relative',
            height: 60,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
          }}
        >
          <View style={{ gap: 20 }}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Great Vibes',
              }}
            >
              Thank you for your order!
            </Text>
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
              <Text>Printed on: {format(new Date(), 'dd/MM/yyyy HH:mm:ss')}</Text>
            </View>
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
