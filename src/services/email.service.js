import { Resend } from 'resend';
import config from '../config/env.js';

export class EmailService {
  constructor() {
    this.resend = new Resend(config.resend.apiKey);
  }

  async sendContactMessage(name, email, message) {
    const { data, error } = await this.resend.emails.send({
      from: 'Contact Form <contact@smartwardrobe.com>',
      to: [config.email.user],
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">New Contact Form Message</h2>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">This is an automated message sent from the contact form.</p>
        </div>
      `,
      replyTo: email,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

export const emailService = new EmailService();

