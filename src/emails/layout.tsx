import { site } from '@/constants/site';
import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  pixelBasedPreset,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type EmailLayoutProps = Readonly<{
  children: React.ReactNode;
  preview?: string;
}>;

export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              fontFamily: {
                sans: ['Inter', 'Verdana', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body className="font-sans">
          {preview && <Preview>{preview}</Preview>}
          <Container>
            {/* HEADER  */}
            <EmailHeader />

            {/* BODY  */}
            {children}
            {/* FOOTER  */}
            <EmailFooter />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

function EmailHeader() {
  const baseUrl = site.url;
  return (
    <Section className="my-6 px-4 py-6">
      <Row>
        <Column align="center">
          <span className="logo light">
            <Img
              alt="Eurofit Logo Light"
              height="28"
              src={`${baseUrl}/logos/logo-light.png`}
            />
          </span>
          <span className="logo dark" style={{ display: 'none' }}>
            <Img
              alt="Eurofit Logo Dark"
              height="28"
              src={`${baseUrl}/logos/logo-dark.png`}
            />
          </span>
        </Column>
      </Row>

      <Row className="mt-6">
        <Column align="center">
          <table>
            <tr>
              <td className="px-2">
                <Link
                  className="text-gray-600 [text-decoration:none]"
                  href={`${baseUrl}/brands`}
                >
                  Brands
                </Link>
              </td>
              <td className="px-2">
                <Link
                  className="text-gray-600 [text-decoration:none]"
                  href={`${baseUrl}/categories`}
                >
                  Categories
                </Link>
              </td>
              <td className="px-2">
                <Link
                  className="text-gray-600 [text-decoration:none]"
                  href={`${baseUrl}/contact-us`}
                >
                  Contact
                </Link>
              </td>
              <td className="px-2">
                <Link
                  className="text-gray-600 [text-decoration:none]"
                  href={`${baseUrl}/about-us`}
                >
                  About
                </Link>
              </td>
            </tr>
          </table>
        </Column>
      </Row>
    </Section>
  );
}

function EmailFooter() {
  const baseUrl = site.url;
  return (
    <Section className="mt-10 py-6 text-center">
      <table className="w-full">
        <tr className="w-full">
          <td align="center">
            <span className="logo light">
              <Img
                alt="Eurofit Logo Light"
                height="20"
                src={`${baseUrl}/logos/logo-light.png`}
              />
            </span>
            <span className="logo dark" style={{ display: 'none' }}>
              <Img
                alt="Eurofit Logo Dark"
                height="20"
                src={`${baseUrl}/logos/logo-dark.png`}
              />
            </span>
          </td>
        </tr>
        <tr className="w-full">
          <td align="center">
            <Text className="mt-1 mb-0 text-[16px] leading-6 text-gray-500">
              European Fitness, African Strength
            </Text>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Row className="table-cell h-11 w-14 align-bottom">
              <Column className="pr-4">
                <Link href="https://www.tiktok.com/@eurofitltd">
                  <Img
                    alt="TikTok"
                    height="24"
                    src={`${baseUrl}/logos/tiktok.png`}
                    width="24"
                  />
                </Link>
              </Column>
              <Column className="pr-4">
                <Link href="https://www.instagram.com/eurofitltd">
                  <Img
                    alt="Instagram"
                    height="24"
                    src={`${baseUrl}/logos/instagram.png`}
                    width="24"
                  />
                </Link>
              </Column>
              <Column className="pr-4">
                <Link href="https://www.x.com/eurofitltd">
                  <Img alt="X" height="24" src={`${baseUrl}/logos/x.png`} width="24" />
                </Link>
              </Column>
              <Column>
                <Link href="https://www.facebook.com/eurofitltd">
                  <Img
                    alt="Facebook"
                    height="24"
                    src={`${baseUrl}/logos/facebook.png`}
                    width="24"
                  />
                </Link>
              </Column>
            </Row>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Text className="my-2 leading-6 font-semibold text-gray-500">
              Unit 111, 1st Floor, 6th Street Tower, 6th Street, Eastleigh, Nairobi, Kenya
            </Text>
            <Text className="mt-1 mb-0 leading-6 font-semibold text-gray-500">
              info@eurofit.co.ke +254 110 990 660
            </Text>
          </td>
        </tr>
      </table>
    </Section>
  );
}
