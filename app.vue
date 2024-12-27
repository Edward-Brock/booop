<script setup lang="ts">
const config = useRuntimeConfig()
const projectName = config.public.projectName
const projectDescription = config.public.projectDescription

useSeoMeta({
  title: projectName as string,
  ogTitle: projectName as string,
  description: projectDescription as string,
  ogDescription: projectDescription as string,
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>
