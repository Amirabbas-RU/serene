import { type ReactNode } from 'react';
import { Outlet } from 'react-router';
import Header from '~/components/Header';
import Footer from '~/components/Footer';

/* ─── Types ─── */

interface PageLayoutProps {
  children?: ReactNode;
}

/* ─── Component ─── */

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-forest font-body">
      {/* ─────── Header ─────── */}
      <Header />

      {/* ─────── Main Content ─────── */}
      <main className="flex-1">
        {children ?? <Outlet />}
      </main>

      {/* ─────── Footer ─────── */}
      <Footer />
    </div>
  );
}
