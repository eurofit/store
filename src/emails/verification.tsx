import { site } from '@/constants/site';
import { Button, render, Section, Text } from '@react-email/components';
import { EmailLayout } from './layout';

type VerificationEmailProps = {
  token?: string;
  firstName?: string;
};

const VerificationEmail = ({ firstName, token }: VerificationEmailProps) => {
  const verificationLink = `${site.url}/verify?token=${token}`;
  return (
    <EmailLayout
      preview={`You're almost there${firstName ? `, ${firstName}` : ''}! Confirm your email to access your new Eurofit account.`}
    >
      <Section className="px-6">
        <Text>Hi {firstName ?? 'there'},</Text>
        <Text>Welcome to Eurofit — we&apos;re excited to have you on board!&nbsp;🎉</Text>
        <Text>
          To keep your account secure and confirm your identity, please verify your email
          address by clicking the button below:
        </Text>
        <Button
          className="box-border w-full rounded-xl bg-blue-600 px-3 py-3 text-center font-semibold text-white"
          href={verificationLink}
        >
          Verify Email Address
        </Button>
        <Text>
          If the button doesn&apos;t work, copy and paste this link into your browser:{' '}
          {verificationLink}
        </Text>
        <Text>
          If you didn&apos;t create an account with us, please ignore this message.
        </Text>
        <Text>
          Warm regards, <br />
          <strong>The Eurofit Team</strong>
        </Text>
      </Section>
    </EmailLayout>
  );
};

export function generateVerificationEmailHTML(props: VerificationEmailProps) {
  return render(<VerificationEmail {...props} />);
}

export default VerificationEmail;
