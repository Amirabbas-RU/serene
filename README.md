<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=32&pause=800&color=1a3a30&center=true&vCenter=true&width=500&height=60&lines=SERENE;Timeless+Home+%26+Body;Where+Elegance+Meets+Simplicity" alt="SERENE" />
</div>

<p align="center">
  A premium headless <strong>Shopify Hydrogen</strong> storefront — atmospheric dark hero, glassmorphic design, real product showcase, and a full cart system. Built with intention.
</p>

<div align="center">

![Shopify](https://img.shields.io/badge/Shopify-7AB55C?style=for-the-badge&logo=shopify&logoColor=white)
![Hydrogen](https://img.shields.io/badge/Hydrogen-2026.4-000000?style=for-the-badge&logo=shopify&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

> **🌐 Live Demo:** [serene-two-azure.vercel.app](https://serene-two-azure.vercel.app)

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🌌 **Atmospheric Hero** | Animated ambient blobs, floating particles, noise texture, grid overlay, concentric rings |
| 🧊 **Glassmorphism** | Frosted glass cards, backdrop blur, translucent borders throughout |
| 🛍️ **Full Cart System** | Add to cart from anywhere — cookie-persisted, quantity controls, order summary |
| 📱 **Product Pages** | Image gallery, variant picker, quantity selector, trust badges |
| 🏠 **Rich Homepage** | Hero with real product showcase cards, featured collections, product grid, brand values |
| 🎨 **Nature Palette** | Forest green, warm clay, cream, sage — inspired by organic materials |
| ⚡ **Live Products** | Hero cards use real Storefront API data with product images |
| 🔍 **Search** | Full-text product search with styled results |
| 📄 **About Page** | Brand story, team values, immersive design |

</div>

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/ixiflower/serene.git
cd serene

# Install dependencies
npm install --legacy-peer-deps

# Start dev server (with NODE_ENV=development for SSR)
NODE_ENV=development npm run dev -- --host

# Build for production
npm run build
```

## 🛒 Cart System

The cart is a **client-side React Context** with cookie persistence:

| Capability | Detail |
|-----------|--------|
| **Add to Cart** | Product detail page, product cards (hover), homepage grid |
| **Quantity** | Increment/decrement on product page and cart page |
| **Remove** | Individual item removal, clear entire cart |
| **Persistence** | Cookie-based, survives page reloads for 30 days |
| **Order Summary** | Live subtotal, item count, shipping notice |

```tsx
// Usage — add an item from anywhere
const { addItem } = useCart();
addItem({
  variantId: "gid://...",
  title: "Linen Shirt",
  handle: "linen-shirt",
  variantTitle: "Medium / White",
  price: { amount: "89.00", currencyCode: "USD" },
  quantity: 1,
  imageUrl: "https://...",
  imageAlt: "Linen Shirt",
});
```

## 🛠 Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Framework** | Shopify Hydrogen 2026.4 + React Router v7 |
| **Styling** | Tailwind CSS v4 with `@theme` design tokens |
| **Animation** | Framer Motion + custom CSS keyframes |
| **UI Primitives** | class-variance-authority + clsx + tailwind-merge |
| **Icons** | Lucide React |
| **Data** | Shopify Storefront API (GraphQL) |
| **Fonts** | Playfair Display (headings) + Inter (body) |
| **Deploy** | Vercel with React Router framework preset |

</div>

## 📂 Project Structure

<div align="center">

```
app/
├── components/
│   ├── ui/              # Button, Badge, Card primitives (CVA)
│   ├── Header.tsx       # Glass header with cart badge + mobile drawer
│   ├── Footer.tsx       # 4-column footer with newsletter
│   ├── ProductCard.tsx  # Product card with hover Add to Cart
│   └── PageLayout.tsx   # App shell wrapper
├── lib/
│   ├── cart-context.tsx # Cart state manager (React Context)
│   ├── storefront.ts    # Shopify Storefront API client
│   └── utils.ts         # cn() utility (clsx + tailwind-merge)
├── routes/
│   ├── _index.tsx       # Homepage — hero, collections, products
│   ├── products.$handle.tsx  # Product detail with gallery + variants
│   ├── cart.tsx         # Cart page with line items + summary
│   ├── collections.all.tsx   # All products with grid
│   ├── collections.$handle.tsx  # Collection detail
│   ├── search.tsx       # Product search
│   └── pages.about.tsx  # About page
└── styles/
    └── app.css          # Tailwind v4 @theme tokens + animations
```

</div>

## 🎨 Design System

```css
@theme {
  --color-cream: #faf3e0;       /* Page background */
  --color-forest: #1a3a30;      /* Primary text, dark sections */
  --color-clay: #c4956a;        /* CTAs, accents, badges */
  --color-sage: #7a9a8a;        /* Secondary accents */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}
```

## 📦 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ixiflower/serene)

Or manually:

```bash
npx vercel link
npx vercel --prod
```

**Required Vercel environment variables:**

| Variable | Description |
|----------|-------------|
| `PUBLIC_STORE_DOMAIN` | Shopify store domain |
| `PUBLIC_STOREFRONT_API_TOKEN` | Storefront API token |
| `PRIVATE_STOREFRONT_API_TOKEN` | Private API token |
| `PUBLIC_STOREFRONT_ID` | Storefront ID |
| `SESSION_SECRET` | Session encryption key |

## 📝 License

MIT — built with ❤️ by [ixi_flower](https://github.com/ixiflower)
