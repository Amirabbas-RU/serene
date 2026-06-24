import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useCart } from '~/lib/cart-context';

export function HeaderMenu() {
  return null;
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/collections/all' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/pages/about' },
];

const MOBILE_SECONDARY = [
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Account', href: '/account', icon: User },
  { label: 'Cart', href: '/cart', icon: ShoppingBag, showBadge: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { totalQuantity } = useCart();

  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isHome
          ? cn(
              'text-white border-white/10',
              scrolled
                ? 'bg-cream/12 backdrop-blur-16'
                : 'glass-dark',
            )
          : cn(
              'text-forest border-forest/10 shadow-sm',
              scrolled
                ? 'bg-cream/90 backdrop-blur-16'
                : 'glass',
            ),
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ── Mobile hamburger ── */}
          <button
            onClick={toggleMobile}
            className={cn(
              'lg:hidden -ml-2 p-2.5 rounded-xl transition-all duration-200',
              isHome
                ? 'text-white hover:bg-white/[0.12] active:bg-white/[0.18]'
                : 'text-forest hover:bg-forest/[0.06] active:bg-forest/[0.10]',
            )}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* ── Logo ── */}
          <Link
            to="/"
            className={cn(
              'text-2xl font-heading font-bold tracking-wide flex-shrink-0',
              isHome ? 'text-white' : 'text-forest',
            )}
          >
            SERENE
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'relative text-sm font-medium tracking-wide transition-colors duration-200',
                  'after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0',
                  'after:bg-current after:transition-all after:duration-300 hover:after:w-full',
                  isHome
                    ? 'text-white/80 hover:text-white'
                    : 'text-forest/70 hover:text-forest',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right icons ── */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/search"
              className={cn(
                'p-2.5 rounded-xl transition-colors',
                isHome
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-forest/60 hover:text-forest hover:bg-forest/5',
              )}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              to="/account"
              className={cn(
                'p-2.5 rounded-xl transition-colors hidden sm:flex',
                isHome
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-forest/60 hover:text-forest hover:bg-forest/5',
              )}
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              to="/cart"
              className={cn(
                'relative p-2.5 rounded-xl transition-colors',
                isHome
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-forest/60 hover:text-forest hover:bg-forest/5',
              )}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-clay rounded-full px-1">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Decorative border ── */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500',
          scrolled ? 'opacity-0' : 'opacity-100',
          isHome
            ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent'
            : 'bg-gradient-to-r from-transparent via-forest/20 to-transparent',
        )}
      />

      {/* ═══════════════════════════════════════
          MOBILE MENU — rendered via portal to
          avoid backdrop-filter containing-block bug.
          Guarded for SSR: document is undefined on server.
          ═══════════════════════════════════════ */}
      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {mobileOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    key="mobile-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeMobile}
                  />

                  {/* Drawer */}
                  <motion.div
                    key="mobile-drawer"
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                    className="fixed top-0 left-0 bottom-0 w-[280px] max-w-[85vw] bg-cream z-50 shadow-2xl lg:hidden flex flex-col"
                  >
                    {/* ── Header ── */}
                    <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-4 border-b border-cream-dark/20">
                      <Link
                        to="/"
                        onClick={closeMobile}
                        className="text-xl font-heading font-bold text-forest"
                      >
                        SERENE
                      </Link>
                      <button
                        onClick={closeMobile}
                        className="p-2 -mr-2 rounded-lg text-forest/40 hover:text-forest hover:bg-forest/5 transition-colors"
                        aria-label="Close menu"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* ── Navigation ── */}
                    <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-1">
                      {NAV_LINKS.map((link) => {
                        const isActive = location.pathname === link.href;
                        return (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={closeMobile}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200',
                              isActive
                                ? 'bg-clay/10 text-clay-dark'
                                : 'text-forest/80 hover:text-forest hover:bg-forest/[0.04]',
                            )}
                          >
                            {link.label}
                          </Link>
                        );
                      })}

                      {/* Divider */}
                      <div className="h-px bg-cream-dark/30 my-3" />

                      {/* Secondary links */}
                      {MOBILE_SECONDARY.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={closeMobile}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-forest/70 hover:text-forest hover:bg-forest/[0.04] transition-all duration-200"
                        >
                          <item.icon className="w-5 h-5 text-forest/30" />
                          {item.label}
                          {item.showBadge && totalQuantity > 0 && (
                            <span className="ml-auto bg-clay text-white text-xs font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full px-1.5">
                              {totalQuantity > 99 ? '99+' : totalQuantity}
                            </span>
                          )}
                        </Link>
                      ))}
                    </nav>

                    {/* ── Footer ── */}
                    <div className="shrink-0 px-5 py-4 border-t border-cream-dark/20">
                      <p className="text-[11px] text-forest/30 text-center tracking-wide">
                        &copy; {new Date().getFullYear()} SERENE
                      </p>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </header>
  );
}
