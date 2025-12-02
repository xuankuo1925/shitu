export default defineNuxtConfig({
  nitro: {
    prerender: {
      // routes: ["/gonggao", "/gonggao/11", "/about"],
      crawlLinks: true,
      routes: ["/sitemap.xml", "/robots.txt"],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/content", "@element-plus/nuxt", "@nuxtjs/sitemap"],
  site: {
    url: "https://shitu.pages.dev",
    hostname: "https://shitu.pages.dev",
    name: "My Awesome Website",
  },
});
