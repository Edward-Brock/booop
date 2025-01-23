<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const projectName = config.public.projectName
const projectDescription = config.public.projectDescription

function setSeoMeta(title: string, description: string) {
  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
  })
}

setSeoMeta(projectName, projectDescription)
</script>
