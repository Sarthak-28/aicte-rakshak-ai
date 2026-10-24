import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'AICTE Rakshak AI — Regulatory Compliance & Application Validation',
  description: 'AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification for AICTE, Ministry of Education, Government of India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
