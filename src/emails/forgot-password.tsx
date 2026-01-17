import { baseUrl } from '@/constants/base-url';
import { site } from '@/constants/site';
import { User } from '@/payload-types';
import { Button, Link, render, Section, Text } from '@react-email/components';
import { EmailLayout } from './layout';

type ForgotPasswordEmailProps = {
  token?: string;
  user?: User;
};

export default function ForgotPasswordEmail({ user, token }: ForgotPasswordEmailProps) {
  const resetPasswordLink = `${site.url}/reset-password?token=${token}`;

  const preview = `Hi ${user?.firstName ?? 'there'}, here's how to reset your Eurofit password.`;

  return (
    <EmailLayout preview={preview}>
      {/* Body */}
      <Section className="px-6">
        <Text>Hi {user?.firstName ?? 'there'},</Text>

        <Text>
          We got a request to reset your EUROFIT account password. If that was you, just
          click the button below to set up a new one.
        </Text>

        <Text>
          For your security, this link will only be valid for <strong>1 hour</strong>.
        </Text>

        <Button
          className="box-border w-full rounded-[8px] bg-blue-600 px-[12px] py-[12px] text-center font-semibold text-white"
          href={resetPasswordLink}
        >
          Reset Password
        </Button>

        <Text>
          If the button doesn&apos;t work, copy and paste this link into your browser:{' '}
          {resetPasswordLink}
        </Text>

        <Text>
          Didn’t ask to reset your password? No worries — just ignore this email and your
          current password will stay the same.
        </Text>

        <Text>
          As always, please never ever share this email with anyone to keep your account
          safe.
        </Text>

        <Text>
          Warm regards, <br />
          <strong>The Eurofit Team</strong>
        </Text>
      </Section>
    </EmailLayout>
  );
}

function Logo() {
  return (
    <Link
      href={baseUrl}
      className="flex items-center space-x-1 no-underline"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        fontFamily: "'Montserrat', 'Helvetica', sans-serif",
        fontWeight: '600',
      }}
    >
      <Text className="text-2xl font-extrabold text-black uppercase">Euro</Text>
      <Text className="text-2xl font-extrabold text-[#fb2c36] uppercase">fit</Text>
    </Link>
  );
}

export function generateForgotPasswordEmailHTML(props: ForgotPasswordEmailProps) {
  return render(<ForgotPasswordEmail {...props} />);
}
