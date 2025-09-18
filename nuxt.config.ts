export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  routeRules: {
    '/api/products': { cache: { swr: true, maxAge: 60 } },
    '/api/products/**': { cache: { swr: true, maxAge: 120 } },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Sample Project',
    },
  },
  components: {
    global: true,
    dirs: ['@/components/ui'],
  },
  modules: ['@vueuse/nuxt'],
  css: ['@/assets/main.css'],
});
