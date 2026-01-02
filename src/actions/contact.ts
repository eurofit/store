'use server';

import { env } from '@/env.mjs';
import { contactFormSchema } from '@/lib/schemas/contact';
import nodemailer from 'nodemailer';

export async function sendContactEmail(_state: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  try {
    // Validate form data
    const validatedData = contactFormSchema.parse(data);

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.GMAIL,
        pass: env.GMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: env.GMAIL,
      to: env.GMAIL,
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

    // Send email
    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Email sent successfully!', name: data.name };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: `Failed to send email. Please try again.`,
    };
  }
}
