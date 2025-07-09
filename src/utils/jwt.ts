import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

// Generate access token
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as unknown as StringValue,
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

// Generate refresh token
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as unknown as StringValue,
  };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, options);
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as TokenPayload;
};
