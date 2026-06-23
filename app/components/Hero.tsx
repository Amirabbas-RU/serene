import { useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Truck } from 'lucide-react';
import { Button } from '~/components/ui/button';

/* ── SVG noise texture data URI ── */
const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E`;

export default function Hero() {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${10 + Math.random() * 8}s`,
      size: `${2 + Math.random() * 4}px`,
    }));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-forest via-forest-light to-forest">
      {/* Ambient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-[36rem] h-[36rem] bg-clay/15 rounded-full mix-blend-screen filter blur-3xl animate-blob1" />
        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-sage/15 rounded-full mix-blend-screen filter blur-3xl animate-blob2" />
        <div className="absolute bottom-0 left-1/4 w-[24rem] h-[24rem] bg-cream/10 rounded-full mix-blend-screen filter blur-3xl animate-blob3" />
        <div
          className="absolute top-1/3 right-1/4 w-[18rem] h-[18rem] bg-clay/10 rounded-full mix-blend-screen filter blur-3xl animate-blob1"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-[20rem] h-[20rem] bg-sage/10 rounded-full mix-blend-screen filter blur-3xl animate-blob2"
          style={{ animationDelay: '-10s' }}
        />
      </div>

      {/* Noise Texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bottom-0 rounded-full bg-white/20 animate-particle-drift"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Concentric Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[90vh] h-[90vh] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vh] h-[70vh] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vh] h-[50vh] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vh] h-[30vh] rounded-full border border-white/5" />
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream/10 backdrop-blur-sm border border-white/10 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-clay" />
              </span>
              <Sparkles className="w-4 h-4 text-clay" />
              <span className="text-sm text-cream/90 font-medium">
                Summer 2026 Collection
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, duration: 0.6, ease: 'easeOut' }}
              className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight text-white mb-6"
            >
              Discover Your{' '}
              <span className="bg-gradient-to-r from-clay via-clay-light to-clay bg-clip-text text-transparent">
                Serene
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24, duration: 0.6, ease: 'easeOut' }}
              className="text-base sm:text-lg text-cream/70 leading-relaxed mb-10 max-w-lg"
            >
              Embrace tranquility with our curated collection of ethically
              crafted essentials. Each piece is designed to bring balance and
              harmony to your everyday.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.36, duration: 0.6, ease: 'easeOut' }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Link to="/collections/all">
                <Button variant="primary" size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link to="/collections">
                <Button variant="outline-light" size="lg">
                  Explore Collections
                </Button>
              </Link>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.48, duration: 0.6, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-6 sm:gap-10"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-clay" />
                <span className="text-sm text-cream/60">
                  <strong className="text-cream/90 font-semibold">12K+</strong>{' '}
                  Premium Quality
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-clay" />
                <span className="text-sm text-cream/60">
                  <strong className="text-cream/90 font-semibold">98%</strong>{' '}
                  Ethical Craft
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-clay" />
                <span className="text-sm text-cream/60">
                  <strong className="text-cream/90 font-semibold">4.9</strong>{' '}
                  Free Shipping
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column — Product Showcase Cards */}
          <div className="hidden lg:flex flex-col gap-6 items-center relative">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
              className="w-72 glass rounded-2xl p-5 shadow-xl relative overflow-hidden animate-float"
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
              <div className="aspect-[4/5] rounded-lg bg-cream/10 mb-4 flex items-center justify-center">
                <span className="text-cream/40 text-sm">Product Image</span>
              </div>
              <h3 className="text-white font-heading text-lg">Zen Candle</h3>
              <p className="text-cream/60 text-sm">$48.00</p>
            </motion.div>

            {/* Card 2 — staggered enter + delayed float */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: 'easeOut' }}
              className="w-72 glass rounded-2xl p-5 shadow-xl relative overflow-hidden animate-float-delayed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
              <div className="aspect-[4/5] rounded-lg bg-cream/10 mb-4 flex items-center justify-center">
                <span className="text-cream/40 text-sm">Product Image</span>
              </div>
              <h3 className="text-white font-heading text-lg">Bamboo Mat</h3>
              <p className="text-cream/60 text-sm">$32.00</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
