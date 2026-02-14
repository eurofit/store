'use server';

import { env } from '@/env.mjs';
import config from '@/payload/config';
import { contactFormSchema } from '@/schemas/contact';
import { getPayload } from 'payload';

export async function sendContactEmail(_state: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  try {
    const validatedData = contactFormSchema.parse(data);

    const payload = await getPayload({ config });

    // Email content
    const mailOptions = {
      from: env.SMTP_USERNAME,
      to: env.SMTP_INFO_USERNAME,
      fromName: 'Contact Form',
      subject:
        validatedData.subject || `New Contact Form Submission from ${validatedData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: validatedData.email,
    };

    await payload.sendEmail(mailOptions);

    return { success: true, message: 'Email sent successfully!', name: data.name };
  } catch (error) {
    return {
      success: false,
      message: `Failed to send email. Please try again.`,
    };
  }
}
