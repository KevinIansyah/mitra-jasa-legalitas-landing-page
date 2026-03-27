'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types/user';
import { apiClient } from '@/lib/api/client';
import { ApiError } from '@/lib/types/api';

// ============================================================================
// TYPES
// ============================================================================

interface LoginResponse {
  user: User;
  token: string;
  token_type: string;
}

interface RegisterResponse {
  email: string;
  message: string;
}

interface VerifyOtpResponse {
  user: User;
  token: string;
  token_type: string;
}

interface ResendOtpResponse {
  message: string;
}

interface ForgotPasswordResponse {
  email: string;
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface UseAuthOptions {
  initialUser?: User | null;
}

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
  } = useSWR<User>(hasToken ? '/api/me' : null, apiClient.get, {
    fallbackData: initialUser ?? undefined,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  });

  // ------------------------------------------------------------------
  // Login
  // Jika email belum terverifikasi, BE return 403 + { email_verified: false }
  // Frontend simpan email ke sessionStorage lalu redirect ke /verify-otp
  // ------------------------------------------------------------------
  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/api/login', {
        email,
        password,
      });

      apiClient.setToken(response.token);
      mutate(response.user, false);

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        // Email belum diverifikasi — BE sudah kirim OTP baru
        if (error.status === 403 && error.errors?.email_verified === false) {
          otpSession.setEmail(email);
          router.push('/verify-otp');
        }
        throw error;
      }
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Register
  // BE akan handle: email baru → buat user + kirim OTP
  //                 email belum verified → kirim OTP baru (tidak buat user baru)
  // Frontend cukup simpan email ke sessionStorage lalu redirect
  // ------------------------------------------------------------------
  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>('/api/register', {
        name,
        email,
        password,
        password_confirmation,
      });

      otpSession.setEmail(response.email);

      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Verifikasi OTP → langsung dapat token & login
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
        '/api/verify-email',
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
  // ------------------------------------------------------------------
  const resendOtp = async (): Promise<ResendOtpResponse> => {
    const email = otpSession.getEmail();

    if (!email) {
      throw new ApiError(
        'Sesi verifikasi tidak ditemukan. Silakan daftar ulang.',
        400,
      );
    }

    try {
      return await apiClient.post<ResendOtpResponse>('/api/resend-otp', {
        email,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Forgot Password → BE kirim OTP ke email
  // ------------------------------------------------------------------
  const forgotPassword = async (
    email: string,
  ): Promise<ForgotPasswordResponse> => {
    try {
      const response = await apiClient.post<ForgotPasswordResponse>(
        '/api/forgot-password',
        {
          email,
        },
      );

      // Simpan email untuk dipakai di halaman reset-password
      otpSession.setEmail(response.email);

      return response;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('An unexpected error occurred', 500);
    }
  };

  // ------------------------------------------------------------------
  // Reset Password → verifikasi OTP + set password baru
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
        '/api/reset-password',
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
      await apiClient.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.removeToken();
      mutate(undefined, false);
      router.push('/login');
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
