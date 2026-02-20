export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/main.css"],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  fonts: {
    families: [{ name: "Montserrat", provider: "google" }],
    defaults: {
      weights: [400, 500, 600, 700, 800],
    },
    processCSSVariables: true,
  },

  modules: [
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/ui",
    "nuxt-auth-utils",
  ],
});
