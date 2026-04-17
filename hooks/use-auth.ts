'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types/user';
import { apiClient } from '@/lib/api/client';
import {
  AUTH_API,
  LoginResponse,
  RegisterResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  UseAuthOptions,
} from '@/lib/types/auth';
import { ApiError } from '@/lib/types/api';

// ============================================================================
// SESSION STORAGE HELPERS
// ============================================================================

const OTP_EMAIL_KEY = 'pending_verification_email';

export const otpSession = {
  setEmail(email: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(OTP_EMAIL_KEY, email);
  },

  getEmail(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(OTP_EMAIL_KEY);
  },

  clearEmail(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(OTP_EMAIL_KEY);
  },
};

// ============================================================================
// HOOK
// ============================================================================

export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter();
  const { initialUser } = options;

  const hasToken = typeof window !== 'undefined' && !!apiClient.getToken();

  const {
    data: user,
    error,
    mutate,
  } = useSWR<User>(hasToken ? AUTH_API.me : null, apiClient.get, {
    fallbackData: initialUser ?? undefined,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  });

  // ------------------------------------------------------------------
  // Login
  // ------------------------------------------------------------------
  const login = async (
    email: string,
    password: string,
    rememberMe = false,
    cfTurnstileToken?: string,
  ): Promise<LoginResponse | void> => {
    try {
      const response = await apiClient.post<LoginResponse>(AUTH_API.login, {
        email,
        password,
        ...(cfTurnstileToken ? { cf_turnstile_token: cfTurnstileToken } : {}),
      });

      apiClient.setToken(response.token, rememberMe);
      mutate(response.user, false);

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 403 && error.errors?.email_verified === false) {
          otpSession.setEmail(email);
          router.push('/verify-otp');
          return;
        }
        throw error;
      }
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Register
  //
  // Catatan backend terbaru: kalau email sudah terdaftar (baik verified maupun
  // belum), backend SELALU balikin 422. FE tidak lagi boleh auto masuk flow OTP
  // dari response register untuk email existing -- user diarahkan ke halaman
  // login / resend OTP secara manual oleh form.
  // ------------------------------------------------------------------
  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    password_confirmation: string,
    cfTurnstileToken?: string,
  ): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>(
        AUTH_API.register,
        {
          name,
          email,
          phone,
          password,
          password_confirmation,
          ...(cfTurnstileToken ? { cf_turnstile_token: cfTurnstileToken } : {}),
        },
      );

      otpSession.setEmail(response.email ?? email);

      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Verify OTP
  // ------------------------------------------------------------------
  const verifyOtp = async (otp: string): Promise<VerifyOtpResponse> => {
    const email = otpSession.getEmail();

    if (!email) {
      throw new ApiError(
        'Sesi verifikasi tidak ditemukan. Silakan daftar ulang.',
        400,
      );
    }

    try {
      const response = await apiClient.post<VerifyOtpResponse>(
        AUTH_API.verifyEmail,
        {
          email,
          otp,
        },
      );

      apiClient.setToken(response.token);
      mutate(response.user, false);
      otpSession.clearEmail();

      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Resend OTP
  //
  // Backend sekarang SELALU return 200 generic. Kalau `emailOverride` diisi,
  // email itu yang dipakai & disimpan ke session (berguna untuk shortcut
  // "Belum verifikasi? Kirim ulang kode" dari halaman register).
  // ------------------------------------------------------------------
  const resendOtp = async (
    emailOverride?: string,
    cfTurnstileToken?: string,
  ): Promise<ResendOtpResponse> => {
    const email = emailOverride?.trim() || otpSession.getEmail();

    if (!email) {
      throw new ApiError(
        'Sesi verifikasi tidak ditemukan. Silakan daftar ulang.',
        400,
      );
    }

    try {
      const response = await apiClient.post<ResendOtpResponse>(
        AUTH_API.resendVerificationOtp,
        {
          email,
          ...(cfTurnstileToken ? { cf_turnstile_token: cfTurnstileToken } : {}),
        },
      );

      if (emailOverride) {
        otpSession.setEmail(email);
      }

      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Forgot Password
  //
  // Backend sekarang SELALU return 200 generic (tidak memvalidasi eksistensi
  // email). Kita simpan email dari input untuk dipakai pada step reset-password.
  // ------------------------------------------------------------------
  const forgotPassword = async (
    email: string,
    cfTurnstileToken?: string,
  ): Promise<ForgotPasswordResponse> => {
    try {
      const response = await apiClient.post<ForgotPasswordResponse>(
        AUTH_API.forgotPassword,
        {
          email,
          ...(cfTurnstileToken ? { cf_turnstile_token: cfTurnstileToken } : {}),
        },
      );

      otpSession.setEmail(response.email ?? email);

      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Reset Password
  // ------------------------------------------------------------------
  const resetPassword = async (
    otp: string,
    password: string,
    password_confirmation: string,
  ): Promise<ResetPasswordResponse> => {
    const email = otpSession.getEmail();

    if (!email) {
      throw new ApiError(
        'Sesi reset password tidak ditemukan. Silakan ulangi.',
        400,
      );
    }

    try {
      const response = await apiClient.post<ResetPasswordResponse>(
        AUTH_API.resetPassword,
        {
          email,
          otp,
          password,
          password_confirmation,
        },
      );

      otpSession.clearEmail();

      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Logout
  // ------------------------------------------------------------------
  const logout = async (): Promise<void> => {
    try {
      await apiClient.post(AUTH_API.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.removeToken();
      mutate(undefined, false);
      router.push('/masuk');
      router.refresh();
    }
  };

  return {
    user,
    isLoading: hasToken && !error && !user,
    isError: error,
    isAuthenticated: !!user,
    login,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
  };
}
