'use server';

import { env } from '@/env.mjs';
import config from '@/payload/config';
import { contactFormSchema } from '@/schemas/contact';
import { getPayload, SendEmailOptions } from 'payload';

export async function sendContactEmail(_state: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  console.log('SMTP_HOST:', env.SMTP_HOST);
  console.log('SMTP_USER:', env.SMTP_USERNAME);
  console.log('SMTP_PASS exists:', !!env.SMTP_PASSWORD);

  try {
    const validatedData = contactFormSchema.parse(data);

    // verify turnstile token
    // const turnstileResponse = await fetch(
    //   `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       secret: env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
    //       response: validatedData['cf-turnstile-response'],
    //     }),
    //   },
    // );

    // const turnstileData = await turnstileResponse.json();

    // if (!turnstileData.success) {
    //   return { success: false, message: 'Failed to verify CAPTCHA' };
    // }

    const payload = await getPayload({ config });

    // Email content
    const mailOptions: SendEmailOptions = {
      from: env.SMTP_USERNAME,
      to: env.SMTP_INFO_USERNAME,
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
    console.error('Error sending contact email:', error);
    return {
      success: false,
      message: `Failed to send email. Please try again.`,
    };
  }
}
