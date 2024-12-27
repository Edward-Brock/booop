// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      projectName: process.env.NUXT_PROJECT_NAME,
      projectFullName: process.env.NUXT_PROJECT_FULL_NAME,
      projectDescription: process.env.NUXT_PROJECT_DESCRIPTION,
      projectRepositoryUrl: process.env.NUXT_PROJECT_REPOSITORY_URL,
      projectLicenseType: process.env.NUXT_PROJECT_LICENSE_TYPE,
      projectLicenseUrl: process.env.NUXT_PROJECT_LICENSE_URL,
    },
  },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
