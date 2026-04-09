import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ConditionalChatWidget } from '@/components/conditional-chat-widget';
import { ChatSuppressionProvider } from '@/components/chat-suppression-provider';
import { Toaster } from '@/components/toaster';

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  style: ['italic'],
  weight: ['700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Mitra Jasa Legalitas',
    template: '%s',
  },
  description: 'Konsultan legalitas bisnis profesional di Indonesia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfair.variable} antialiased bg-surface-page`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ChatSuppressionProvider>
            {children}
            <ConditionalChatWidget />
            <Toaster />
          </ChatSuppressionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
