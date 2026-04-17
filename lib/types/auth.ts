import { User } from './user';

export const AUTH_API = {
  register: '/auth/register',
  login: '/auth/login',
  verifyEmail: '/auth/verify-email',
  resendVerificationOtp: '/auth/resend-verification-otp',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  me: '/auth/me',
  logout: '/auth/logout',
} as const;

export type AuthApiPath = (typeof AUTH_API)[keyof typeof AUTH_API];

export interface LoginResponse {
  user: User;
  token: string;
  token_type: string;
}

export interface RegisterResponse {
  email: string;
  message: string;
}

export interface VerifyOtpResponse {
  user: User;
  token: string;
  token_type: string;
}

export interface ResendOtpResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  email?: string;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface UseAuthOptions {
  initialUser?: User | null;
}
