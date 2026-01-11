import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwtHelper.js';
import { validatePasswordStrength } from '../utils/passwordValidator.js';

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(email, password) {
    const validationResult = validatePasswordStrength(password);
    if (!validationResult.isValid) {
      throw new Error(`Password does not meet requirements: ${validationResult.errors.join(', ')}`);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcryptSaltRounds
    );

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
    });

    const tokens = await this.createTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const tokens = await this.createTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(refreshToken) {
    const verified = verifyRefreshToken(refreshToken);
    if (!verified.valid) {
      throw new Error('Invalid refresh token');
    }

    const user = await this.userRepository.findByRefreshToken(refreshToken);
    if (!user) {
      throw new Error('Refresh token not found');
    }

    if (user.refreshTokenExpiresAt && new Date() > user.refreshTokenExpiresAt) {
      throw new Error('Refresh token expired');
    }

    const tokens = await this.createTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async logout(userId) {
    await this.userRepository.clearRefreshToken(userId);
  }

  async createTokens(userId, email) {
    const accessToken = generateAccessToken({ userId, email });
    const refreshToken = generateRefreshToken({ userId, email });
    const expiresAt = new Date(Date.now() + config.cookie.maxAge.refreshToken);
    return { accessToken, refreshToken, expiresAt };
  }

  async saveRefreshToken(userId, refreshToken) {
    const expiresAt = new Date(Date.now() + config.cookie.maxAge.refreshToken);
    await this.userRepository.updateRefreshToken(userId, refreshToken, expiresAt);
  }

  sanitizeUser(user) {
    const { password, refreshToken, refreshTokenExpiresAt, ...sanitized } = user;
    return sanitized;
  }
}

