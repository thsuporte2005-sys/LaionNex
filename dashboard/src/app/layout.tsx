import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Laion Nex - CRM & WhatsApp Sales Ecosystem',
  description: 'Premium CRM and VSL funnel manager for WhatsApp Web.'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
