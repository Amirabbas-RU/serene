import { Link } from "react-router";
import { motion } from "framer-motion";
import { Shield, Cookie, FileText, ChevronRight } from "lucide-react";
import { Badge } from "~/components/ui/badge";

const POLICIES = [
  {
    handle: "privacy-policy",
    title: "Privacy Policy",
    desc: "How we collect, use and protect your personal data under GDPR.",
    icon: Shield,
    id: "serene-policy-card-privacy-policy",
  },
  {
    handle: "cookie-policy",
    title: "Cookie Policy",
    desc: "What cookies we use, why, and how to manage your consent (Consent Mode v2).",
    icon: Cookie,
    id: "serene-policy-card-cookie-policy",
  },
  {
    handle: "terms-of-service",
    title: "Terms of Service",
    desc: "The terms that govern your use of SERENE and purchases.",
    icon: FileText,
    id: "serene-policy-card-terms-of-service",
  },
];

export default function PoliciesIndex() {
  return (
    <div id="serene-page-policies-index">
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-forest via-forest-light to-forest relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-clay/10 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <Badge variant="secondary" className="mb-4 text-cream/60 border-cream/10 bg-cream/5">Legal</Badge>
          <h1 id="serene-heading-policies" className="font-heading text-5xl md:text-6xl text-cream mb-4">Policies</h1>
          <p className="text-cream/60 max-w-xl text-lg leading-relaxed">Transparent, GDPR-compliant policies — your rights, our responsibilities.</p>
        </motion.div>
      </section>

      <section className="py-16 px-6 bg-cream">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {POLICIES.map((p, i) => (
            <motion.div
              key={p.handle}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                id={p.id}
                to={`/policies/${p.handle}`}
                className="group block p-6 rounded-2xl bg-cream-light/80 border border-cream-dark/30 hover:border-clay/30 hover:shadow-md transition-all duration-300 h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-clay/10 flex items-center justify-center mb-4 group-hover:bg-clay/20 transition-colors">
                  <p.icon className="w-5 h-5 text-clay" />
                </div>
                <h2 className="font-heading text-lg text-forest group-hover:text-clay transition-colors">{p.title}</h2>
                <p className="text-sm text-forest/50 mt-2 leading-relaxed">{p.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs text-clay mt-4 font-medium">Read <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 px-6 bg-cream-dark/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-forest/50">Questions? <Link to="/pages/contact" className="text-clay underline underline-offset-2">Contact us</Link> — we respond within 24 hours.</p>
        </div>
      </section>
    </div>
  );
}
