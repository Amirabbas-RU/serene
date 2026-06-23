import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '~/lib/utils';

/* ─── Types ─── */

interface AsideProps {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
  title?: string;
  align?: 'left' | 'right';
}

/* ─── Component ─── */

export default function Aside({
  children,
  open,
  onClose,
  title,
  align = 'right',
}: AsideProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus?.();
        previousActiveElement.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* ── Close on Escape ── */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  /* ── Focus trap: keep focus inside panel ── */
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    // Focus the panel on open
    const timer = setTimeout(() => {
      const closeButton = panel.querySelector<HTMLButtonElement>('button');
      if (closeButton) {
        closeButton.focus();
      } else {
        panel.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [open]);

  /* ── Overlay click ── */
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  /* ── Panel animation values ── */
  const panelInitialX = align === 'left' ? '-100%' : '100%';
  const panelExitX = align === 'left' ? '-100%' : '100%';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ─── Overlay ─── */}
          <motion.div
            key="aside-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* ─── Panel ─── */}
          <motion.div
            key="aside-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Slide-in panel'}
            tabIndex={-1}
            initial={{ x: panelInitialX }}
            animate={{ x: 0 }}
            exit={{ x: panelExitX }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={cn(
              'fixed top-0 z-50 flex h-full flex-col bg-cream/90 backdrop-blur-xl shadow-xl',
              'w-80 max-w-[85vw]',
              align === 'left' ? 'left-0' : 'right-0',
            )}
          >
            {/* ─── Header ─── */}
            {(title || onClose) && (
              <div className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
                {title && (
                  <h2 className="font-heading text-lg font-semibold text-forest">
                    {title}
                  </h2>
                )}

                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close panel"
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      'text-forest/50 transition-colors hover:bg-forest/10 hover:text-forest',
                    )}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* ─── Body ─── */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
