
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ["/gonggao", "/gonggao/*", "/about"],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@element-plus/nuxt", "@nuxtjs/sitemap"],
  site: {
    url: "https://shitu.pages.dev",
    hostname:"https://shitu.pages.dev",
    name: "My Awesome Website",
  },
});
