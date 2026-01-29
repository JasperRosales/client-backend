import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import { otpRepository } from '../repositories/otp.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { validatePasswordStrength } from '../utils/passwordValidator.js';

export class OtpService {
  constructor(otpRepository, userRepository) {
    this.otpRepository = otpRepository;
    this.userRepository = userRepository;
    this.resend = new Resend(config.resend.apiKey);
  }

  generateOtp() {
    const length = config.otp.length;
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  async createOtp(email) {
    // Delete existing OTPs for this email
    await this.otpRepository.deleteByEmail(email);

    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + config.otp.expiry);

    const otp = await this.otpRepository.create({
      email,
      code,
      purpose: 'password_reset',
      expiresAt,
    });

    return otp;
  }

  async sendOtpEmail(email, code) {
    const { data, error } = await this.resend.emails.send({
      from: 'Password Reset <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Password Reset OTP</h2>
          <p>You requested to reset your password. Here is your OTP:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
          </div>
          <p>This OTP will expire in <strong>20 minutes</strong>.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async requestOtp(email) {
    const otp = await this.createOtp(email);
    await this.sendOtpEmail(email, otp.code);
    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(email, code, newPassword = null) {
    const otp = await this.otpRepository.findByEmailAndCode(email, code);

    if (!otp) {
      throw new Error('Invalid OTP');
    }

    if (new Date() > otp.expiresAt) {
      await this.otpRepository.deleteByEmail(email);
      throw new Error('OTP expired');
    }

    await this.otpRepository.deleteByEmail(email);

    // If newPassword is provided, update the user's password
    if (newPassword) {
      const validationResult = validatePasswordStrength(newPassword);
      if (!validationResult.isValid) {
        throw new Error(`Password does not meet requirements: ${validationResult.errors.join(', ')}`);
      }

      const hashedPassword = await bcrypt.hash(newPassword, config.bcryptSaltRounds);
      await this.userRepository.updatePassword(email, hashedPassword);

      return { success: true, message: 'Password changed successfully', passwordChanged: true };
    }

    return { success: true, message: 'OTP verified successfully', passwordChanged: false };
  }
}

export const otpService = new OtpService(otpRepository, userRepository);

