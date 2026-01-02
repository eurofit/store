import { ContactCard } from '@/components/cards/contact';
import { ContactForm } from '@/components/forms/contact';
import { Mail, MapPin, Phone } from 'lucide-react';
import type { Metadata } from 'next';

const contacts = [
  {
    icon: <Mail className="size-4" />,
    title: 'Email',
    description: `Have a question or need help?\nDrop us an email and we'll respond within 24 hours.`,
    cta: {
      label: 'info@eurofit.uk',
      href: 'mailto:info@eurofit.uk',
    },
  },
  {
    icon: <Phone className="size-4" />,
    title: 'Phone',
    description: `Prefer to chat?\nGive us a call Monday–Friday, 9 AM–5 PM (EST).`,
    cta: {
      label: '+254 110 990 666',
      href: 'tel:+254110990666',
    },
  },
  {
    icon: <MapPin className="size-4" />,
    title: 'Headquarter',
    description: `Unit 111, 1st Floor, 6th Street Tower, 6th Street, Eastleigh, Nairobi, Kenya`,
    cta: {
      label: 'Get Directions',
      href: 'https://www.google.com/maps/place/Eurofit/@-1.2740179,36.850036,3a,90y,5.59h,119.86t/data=!3m7!1e1!3m5!1sgah-pNCiqkN0-ekyhHk4SA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-29.862727585145777%26panoid%3Dgah-pNCiqkN0-ekyhHk4SA%26yaw%3D5.592524421825633!7i16384!8i8192!4m14!1m7!3m6!1s0x182f17a816057ee7:0xd76ece853c799109!2sEurofit!8m2!3d-1.2739283!4d36.8500384!16s%2Fg%2F11mc9m0286!3m5!1s0x182f17a816057ee7:0xd76ece853c799109!8m2!3d-1.2739283!4d36.8500384!16s%2Fg%2F11mc9m0286?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D',
      external: true,
      btn: true,
    },
  },
];

export const metadata: Metadata = {
  title: 'Contact Us',

  description: 'Get in touch with our team for any inquiries or support.',
};

export default function ContactUs() {
  return (
    <>
      <div className="container mx-auto max-w-5xl p-6 pb-16">
        <hgroup className="max-w-3xl space-y-2">
          <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Reach us
          </span>
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
            Speak With our Friendly team
          </h1>
          <p className="text-muted-foreground max-w-lg text-lg text-pretty">
            We are available for questions, feedback, or collaboration opportunities. Let
            us know how we can help! Fill out the form or drop us an email.
          </p>
        </hgroup>
        <div className="mt-10 flex flex-wrap gap-10 max-md:flex-col">
          <div className="flex-1">
            <ContactsSection />
          </div>
          <div className="flex-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}

function ContactsSection() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {contacts.map((card, i) => (
        <ContactCard key={i} {...card} />
      ))}
    </section>
  );
}
