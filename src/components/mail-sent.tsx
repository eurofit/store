import { cn } from '@/utils/cn';

type MailSentProps = React.ComponentProps<'section'>;

function MailSent({ className, ...props }: MailSentProps) {
  return (
    <section className={cn('flex flex-col items-center gap-4', className)} {...props} />
  );
}

type MailSentHeaderProps = React.ComponentProps<'hgroup'>;

function MailSentHeader({ className, ...props }: MailSentHeaderProps) {
  return <hgroup className={cn('max-w-xs text-center', className)} {...props} />;
}

type MailSentTitleProps = React.ComponentProps<'h1'>;

function MailSentTitle({ className, ...props }: MailSentTitleProps) {
  return <h1 className={cn('text-2xl font-bold capitalize', className)} {...props} />;
}

type MailSentContentProps = React.ComponentProps<'div'>;
function MailSentContent({ className, ...props }: MailSentContentProps) {
  return <div className={cn(className)} {...props} />;
}

export { MailSent, MailSentContent, MailSentHeader, MailSentTitle };
