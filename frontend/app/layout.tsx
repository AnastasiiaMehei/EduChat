import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EduChat',
  description: 'AI chat for education and learning support.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
