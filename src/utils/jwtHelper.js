import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessTokenSecret, {
    expiresIn: config.jwt.accessTokenExpiry,
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshTokenSecret, {
    expiresIn: config.jwt.refreshTokenExpiry,
  });
};

export const verifyAccessToken = (token) => {
  try {
    return { valid: true, decoded: jwt.verify(token, config.jwt.accessTokenSecret) };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return { valid: true, decoded: jwt.verify(token, config.jwt.refreshTokenSecret) };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

