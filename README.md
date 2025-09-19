# Renotive Task — Nuxt 3 + Vue 3 (TypeScript)

A lightweight sample app that lists products from **DummyJSON**, with **search**, **price sort (asc/desc)**, **infinite scroll** (mobile-first), **SWR-style caching**, and **product modals** (details + create). The codebase uses the **Composition API** end-to-end and keeps the UI minimal (no heavy UI kits).

---

## ✅ Requirements Coverage

- **Vue 3 + Nuxt 3** with **Composition API** throughout
- **Type safety** with TypeScript (components, composables, server routes)
- **SWR (stale-while-revalidate)** data fetching via a tiny custom composable
- Proper **loading** and **error** states
- **Responsive design**, **mobile-first**
- Efficient large list rendering: **infinite scroll** (via `@vueuse/core`) + **lazy images**
- Product **Details** modal (read) and **Create** modal (POST)
- Flexible data layer: **server proxy** or **direct API** (for GitHub Pages)

---

## Tech Stack

- **Nuxt 3** (Nitro server, file-based routing)
- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript**
- **@vueuse/core** (`useInfiniteScroll`, `watchDebounced`)
- **DummyJSON** public API  
- Light **design tokens** (CSS custom properties) and tiny utility classes

---

## Project Structure (short)
├─ components/
│  ├─ product/
│  │  ├─ ProductCard.vue
│  │  ├─ ProductModal.vue        # details-only modal
│  │  └─ ProductCreateModal.vue  # create-only modal
│  └─ ui/
│     ├─ UiModal.vue             # generic modal shell (teleport + backdrop)
│     ├─ UiButton.vue
│     └─ UiInput.vue
├─ pages/
│  └─ index.vue               # actions + grid + infinite scroll
├─ server/
│  └─ api/
│     ├─ products.get.ts         # GET /api/products (proxy → DummyJSON)
│     ├─ products.post.ts        # POST /api/products (proxy → DummyJSON/add)
│     └─ products/[id].get.ts    # GET /api/products/:id (proxy → DummyJSON/:id)
├─ types/
│  └─ product.ts                 # IProduct and related types
├─ app.vue, nuxt.config.ts, README.md, …
---

## Getting Started

### Prerequisites
- Node.js **v18+** (or 20+)
- npm / pnpm / yarn

### Install & Dev
```bash
# install
npm i

# run dev server (http://localhost:3000)
npm run dev