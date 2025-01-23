// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      projectName: process.env.NUXT_PROJECT_NAME,
      projectDescription: process.env.NUXT_PROJECT_DESCRIPTION,
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-27',
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
