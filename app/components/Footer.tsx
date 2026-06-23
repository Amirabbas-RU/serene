import {
  Github,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

const SHOP_LINKS = [
  { label: 'All Products', href: '/collections/all' },
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Sale', href: '/collections/sale' },
  { label: 'Collections', href: '/collections' },
];

const SUPPORT_LINKS = [
  { label: 'FAQ', href: '/pages/faq' },
  { label: 'Shipping & Returns', href: '/pages/shipping-returns' },
  { label: 'Size Guide', href: '/pages/size-guide' },
  { label: 'Contact', href: '/pages/contact' },
];

const SOCIAL_LINKS = [
  { label: 'Github', icon: Github, href: '#' },
  { label: 'Twitter', icon: Twitter, href: '#' },
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Youtube', icon: Youtube, href: '#' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest text-cream/80">
      {/* ── Decorative top border ── */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-clay/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/*
            ── 4-column grid responsive ──
            Brand column spans 2 cols on sm to match the visual weight
            while keeping the underlying grid at 4 on lg.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* ═══ Brand column ═══ */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="text-2xl font-heading font-bold text-cream tracking-wide inline-block mb-4"
            >
              SERENE
            </Link>
            <p className="text-sm text-cream/60 leading-relaxed mb-6 max-w-xs">
              Curated essentials for a balanced life. Thoughtfully designed,
              ethically made, built to last.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-cream/5 backdrop-blur-sm border border-cream/10 text-cream/60 hover:text-clay hover:border-clay/40 hover:bg-clay/10 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ═══ Shop column ═══ */}
          <div>
            <h4 className="text-sm font-semibold text-cream tracking-wider uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-cream/60 hover:text-clay transition-all duration-200 inline-block hover:translate-x-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ═══ Support column ═══ */}
          <div>
            <h4 className="text-sm font-semibold text-cream tracking-wider uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-cream/60 hover:text-clay transition-all duration-200 inline-block hover:translate-x-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ═══ Newsletter column ═══ */}
          <div>
            <h4 className="text-sm font-semibold text-cream tracking-wider uppercase mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-cream/60 leading-relaxed mb-4">
              Subscribe for exclusive drops, early access, and 10% off your
              first order.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-lg bg-cream/5 border border-cream/10 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-clay/60 focus:ring-1 focus:ring-clay/30 transition-all duration-200"
              />
              <Button
                variant="primary"
                size="default"
                type="submit"
                aria-label="Subscribe"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40">
            &copy; {currentYear} SERENE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/policies/privacy-policy"
              className="text-xs text-cream/40 hover:text-clay transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/policies/terms-of-service"
              className="text-xs text-cream/40 hover:text-clay transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
