import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useCart } from '~/lib/cart-context';

/**
 * HeaderMenu — named export for backward compatibility.
 * Returns null; menu rendering is handled inside Header itself.
 */
export function HeaderMenu() {
  return null;
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/collections/all' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/pages/about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { totalQuantity } = useCart();

  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  /* ── Close mobile drawer on route change ── */
  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  /* ── Scroll listener — becomes more opaque on scroll ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Body scroll lock when mobile menu is open ── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
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
              'lg:hidden p-2 rounded-lg transition-colors',
              isHome ? 'hover:bg-white/10' : 'hover:bg-forest/5',
            )}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/search"
              className={cn(
                'p-2 rounded-lg transition-colors',
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
                'p-2 rounded-lg transition-colors hidden sm:block',
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
                'relative p-2 rounded-lg transition-colors',
                isHome
                  ? 'text-white/70 hover:text-white hover:bg-white/10'
                  : 'text-forest/60 hover:text-forest hover:bg-forest/5',
              )}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-clay rounded-full">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Decorative floating gradient border that fades on scroll ── */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500',
          scrolled ? 'opacity-0' : 'opacity-100',
          isHome
            ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent'
            : 'bg-gradient-to-r from-transparent via-forest/20 to-transparent',
        )}
      />

      {/* ── Mobile slide-out drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobile}
            />

            {/* Drawer panel */}
            <motion.div
              key="mobile-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-cream z-50 shadow-2xl lg:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-cream-dark/30">
                <Link to="/" onClick={closeMobile} className="text-xl font-heading font-bold text-forest tracking-wide">
                  SERENE
                </Link>
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-lg text-forest/50 hover:text-forest hover:bg-forest/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto py-3 px-3">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={closeMobile}
                      className={cn(
                        'flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 mb-0.5',
                        isActive
                          ? 'bg-clay/10 text-clay-dark'
                          : 'text-forest hover:text-forest hover:bg-forest/5',
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-cream-dark/40 my-3 mx-4" />

                {/* Secondary links */}
                <Link
                  to="/search"
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-forest/70 hover:text-forest hover:bg-forest/5 transition-all duration-200 mb-0.5"
                >
                  <Search className="w-5 h-5 text-forest/40" />
                  Search
                </Link>
                <Link
                  to="/account"
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-forest/70 hover:text-forest hover:bg-forest/5 transition-all duration-200 mb-0.5"
                >
                  <User className="w-5 h-5 text-forest/40" />
                  Account
                </Link>
                <Link
                  to="/cart"
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-forest/70 hover:text-forest hover:bg-forest/5 transition-all duration-200"
                >
                  <ShoppingBag className="w-5 h-5 text-forest/40" />
                  Cart
                  {totalQuantity > 0 && (
                    <span className="ml-auto bg-clay text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              </nav>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-cream-dark/30">
                <p className="text-xs text-forest/40 text-center">
                  &copy; {new Date().getFullYear()} SERENE
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
