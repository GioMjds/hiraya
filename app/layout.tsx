import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Open_Sans } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme-context';

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: {
    default:
      'Welcome to Hiraya - A Large-Scale Skill Matching Platform and Capability Graph for Job Seekers, Employers and Professionals',
    template: '%s | Hiraya',
  },
  description:
    'Hiraya is a platform designed to address the fundamental limitations of traditional hiring and skill assessment systems. By modeling skills, capabilities, and roles as interconnected entities within a graph structure, Hiraya enables more accurate, transparent, and fair matching between job seekers and opportunities.',
  // Add more metadata properties as needed
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Hiraya',
  // Add more structured data properties as needed
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${openSans.className} ${openSans.style} antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
