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
  return (
    <Section className="my-6 p-6">
      <Row align="center">
        {/* LEFT: LOGO */}
        <Column align="left" className="w-1/4 pr-6">
          <Img
            alt="Eurofit logo"
            height="16"
            src={site.url + '/logo.png'}
            className="block"
          />
        </Column>

        {/* RIGHT: LINKS */}
        <Column align="right" className="w-3/4">
          <Row align="right">
            <Column className="pr-2" align="right">
              <Link className="text-gray-600 no-underline" href={`${site.url}/about-us`}>
                About
              </Link>
            </Column>

            <Column className="px-2" align="right">
              <Link
                className="text-gray-600 no-underline"
                href={`${site.url}/contact-us`}
              >
                Contact
              </Link>
            </Column>

            <Column className="pl-2" align="right">
              <Link className="text-gray-600 no-underline" href={`${site.url}/brands`}>
                Shop
              </Link>
            </Column>
          </Row>
        </Column>
      </Row>
    </Section>
  );
}

function EmailFooter() {
  return (
    <Section className="mb-6 p-6">
      <table className="w-full">
        <tr className="w-full">
          <td>
            <Img
              alt="Eurofit logo"
              height="24"
              src="https://i.postimg.cc/TwKNqZZ5/EUROFIT.png"
            />
          </td>
        </tr>
        <tr className="w-full">
          <td>
            <Text className="mt-1 mb-0 text-sm leading-6 text-gray-600 italic">
              &quot;European Fitness, African Strength&quot;
            </Text>
          </td>
        </tr>
        <tr className="w-full">
          <td>
            <Row className="table-cell h-11 w-20 align-bottom">
              <Column className="pr-[8px]">
                <Link href="#">
                  <Img
                    alt="Facebook"
                    height="30"
                    src="https://react.email/static/facebook-logo.png"
                    width="30"
                  />
                </Link>
              </Column>
              <Column className="pr-[8px]">
                <Link href="#">
                  <Img
                    alt="X"
                    height="30"
                    src="https://react.email/static/x-logo.png"
                    width="30"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="#">
                  <Img
                    alt="Instagram"
                    height="30"
                    src="https://react.email/static/instagram-logo.png"
                    width="30"
                  />
                </Link>
              </Column>
            </Row>
          </td>
        </tr>
        <tr>
          <td>
            <Text className="my-2 text-sm leading-6 font-semibold text-gray-500">
              {site.address.line1}, <br />
              {site.address.line2}, <br />
              {site.address.postalAddress} <br />
              {site.address.city}, {site.address.country} <br />
              +44 7538 584237 / +254 110 990 666 <br />
              info@eurofit.uk
            </Text>
          </td>
        </tr>
      </table>
    </Section>
  );
}
