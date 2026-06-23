import { type LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Heart, Leaf, Users, Newspaper } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { getStorefrontClient } from '~/lib/storefront';

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const PAGE_QUERY = `#graphql
  query AboutPage {
    shop {
      name
      description
    }
  }
`;

export async function loader({}: LoaderFunctionArgs) {
    const storefront = getStorefrontClient();
  const data = await storefront.query(PAGE_QUERY, {
    cache: storefront.CacheLong(),
  });
  return { shop: data.shop };
}

export default function AboutPage() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-forest via-forest-light to-forest relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-[40rem] h-[40rem] bg-clay/8 rounded-full blur-3xl animate-blob1" />
          <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] bg-sage/10 rounded-full blur-3xl animate-blob2" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <Badge variant="secondary" className="mb-4 text-cream/60 border-cream/10 bg-cream/5">
            Our Story
          </Badge>
          <h1 className="font-heading text-5xl md:text-7xl text-cream mb-6 leading-[1.1]">
            The Story Behind{' '}
            <span className="bg-gradient-to-r from-clay via-clay-light to-clay bg-clip-text text-transparent">
              Serene
            </span>
          </h1>
          <p className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A journey of mindful craftsmanship, timeless design, and an unwavering
            commitment to creating products that bring peace into your everyday life.
          </p>
        </motion.div>
      </section>

      {/* ─── MISSION ─── */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge variant="default" className="mb-4">Our Mission</Badge>
              <h2 className="font-heading text-4xl md:text-5xl text-forest mb-6 leading-[1.15]">
                Creating Calm in a Chaotic World
              </h2>
              <div className="space-y-4 text-forest/60 leading-relaxed">
                <p>
                  {shop?.description || 'Serene was born from a simple belief: that the spaces we inhabit and the objects we surround ourselves with should bring us peace, not noise.'}
                </p>
                <p>
                  In a world that moves faster every day, we design with intention — choosing 
                  natural materials, timeless silhouettes, and muted palettes that ground you 
                  in the present moment.
                </p>
                <p>
                  Every piece in our collection is a reminder to slow down, breathe, and 
                  find beauty in simplicity.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-forest-light via-forest to-forest-dark flex items-center justify-center"
            >
              <div className="text-center p-12">
                <span className="font-heading text-cream/10 text-9xl block mb-4">S</span>
                <p className="text-cream/30 text-sm max-w-xs mx-auto">
                  Where timeless elegance meets modern simplicity
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="py-24 px-6 bg-cream-dark/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">What We Stand For</Badge>
            <h2 className="font-heading text-4xl md:text-5xl text-forest mb-4">
              Our Core Values
            </h2>
            <p className="text-forest/50 max-w-lg mx-auto">
              The principles that guide every decision we make.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: 'Sustainability',
                desc: 'We prioritize organic, renewable materials and ethical production processes that minimize our environmental footprint.',
              },
              {
                icon: Heart,
                title: 'Mindful Design',
                desc: 'Every curve, texture, and color is chosen with intention — nothing is accidental, everything serves a purpose.',
              },
              {
                icon: Users,
                title: 'Community First',
                desc: 'We partner with local artisans and fair-trade cooperatives, ensuring every purchase supports skilled craftspeople.',
              },
              {
                icon: Shield,
                title: 'Quality Forever',
                desc: 'We stand behind every piece with a lifetime guarantee. If it breaks, we repair or replace it — no questions asked.',
              },
              {
                icon: Sparkles,
                title: 'Timeless Beauty',
                desc: 'We reject fast trends in favor of enduring aesthetics. Our pieces are designed to be loved for generations.',
              },
              {
                icon: Newspaper,
                title: 'Radical Transparency',
                desc: 'From material sourcing to pricing, we share everything. You deserve to know exactly what goes into your products.',
              },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                custom={i}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group p-8 rounded-2xl bg-cream-light/60 border border-cream-dark/20 hover:border-clay/30 hover:shadow-md transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-clay/10 flex items-center justify-center mb-5 group-hover:bg-clay/20 transition-colors">
                  <value.icon className="w-5 h-5 text-clay" />
                </div>
                <h3 className="font-heading text-lg text-forest mb-3">{value.title}</h3>
                <p className="text-forest/50 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STORY SECTION ─── */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-light order-2 md:order-1 flex items-center justify-center"
            >
              <div className="text-center p-12">
                <span className="font-heading text-cream/10 text-8xl block mb-4">&</span>
                <p className="text-cream/30 text-sm max-w-xs mx-auto">
                  Every piece tells a story
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 md:order-2"
            >
              <Badge variant="default" className="mb-4">Our Craft</Badge>
              <h2 className="font-heading text-4xl md:text-5xl text-forest mb-6 leading-[1.15]">
                The Art of Slow Making
              </h2>
              <div className="space-y-4 text-forest/60 leading-relaxed">
                <p>
                  In an age of mass production, we choose a different path. Each Serene 
                  piece is crafted by skilled artisans who have spent decades perfecting 
                  their trade.
                </p>
                <p>
                  From hand-finished ceramics to naturally dyed textiles, our production 
                  process honors traditional techniques while embracing modern comfort. 
                  We believe that an object made with care carries that care into your home.
                </p>
                <p>
                  This is slow making — deliberate, thoughtful, and deeply respectful of 
                  both the materials and the hands that shape them.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6 bg-forest relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[20rem] h-[20rem] bg-clay/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <Badge variant="secondary" className="mb-4 text-cream/60 border-cream/10 bg-cream/5">
            Join Us
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl text-cream mb-6 leading-[1.15]">
            Ready to Find Your Serene?
          </h2>
          <p className="text-cream/50 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
            Explore our collection and discover pieces that bring calm, beauty, and 
            intention into your everyday life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" as="a" href="/collections/all" className="rounded-full">
              Shop the Collection
            </Button>
            <Button variant="outline-light" size="lg" as="a" href="/collections" className="rounded-full">
              View Collections
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
