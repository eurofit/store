import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/utils/cn';

interface Faq {
  question: string;
  answer: string;
}

type FaqSectionProps = {
  title?: string;
  faqs: Faq[];
} & React.ComponentProps<'section'>;

export function FaqSection({
  title = 'Frequently Asked Questions',
  faqs,
  className,
  ...props
}: FaqSectionProps) {
  return (
    <section className={cn('max-w-md space-y-6', className)} {...props}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <Accordion type="single" collapsible className="w-full" defaultValue="faq-item-1">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-item-${index + 1}`}>
            <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
