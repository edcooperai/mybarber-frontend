import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generate2FASecret = () => {
  return crypto.randomBytes(20).toString('hex');
};