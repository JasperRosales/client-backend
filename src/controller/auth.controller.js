import { userRepository } from '../repositories/user.repository.js';
import { AuthService } from '../services/auth.service.js';
import { validatePasswordMatch, validatePasswordStrength } from '../utils/passwordValidator.js';

const authService = new AuthService(userRepository);

export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const matchResult = validatePasswordMatch(password, confirmPassword);
    if (!matchResult.isValid) {
      return res.status(400).json({ success: false, message: matchResult.error });
    }

    const strengthResult = validatePasswordStrength(password);
    if (!strengthResult.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: strengthResult.errors,
      });
    }

    const result = await authService.register(email, password);
    res.status(201).json({
      success: true,
      data: { user: result.user, accessToken: result.accessToken },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }
    const result = await authService.refresh(refreshToken);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      data: { 
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (userId) {
      await authService.logout(userId);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found' });
    }

    await authService.deleteUser(userId);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
