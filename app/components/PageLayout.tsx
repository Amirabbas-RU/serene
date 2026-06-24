import { useCallback, useState, type ReactNode } from 'react';
import { Outlet } from 'react-router';
import Header, { MobileMenu } from '~/components/Header';
import Footer from '~/components/Footer';

/* ─── Types ─── */

interface PageLayoutProps {
  children?: ReactNode;
}

/* ─── Component ─── */

export default function PageLayout({ children }: PageLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex min-h-screen flex-col bg-cream text-forest font-body">
      {/* ─────── Header ─────── */}
      <Header
        mobileOpen={mobileOpen}
        onToggleMobile={toggleMobile}
        onCloseMobile={closeMobile}
      />

      {/* ─────── Mobile Menu (sibling of header, no portal/stacking issues) ─────── */}
      <MobileMenu open={mobileOpen} onClose={closeMobile} />

      {/* ─────── Main Content ─────── */}
      <main className="flex-1">
        {children ?? <Outlet />}
      </main>

      {/* ─────── Footer ─────── */}
      <Footer />
    </div>
  );
}
