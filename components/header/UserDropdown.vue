<script setup lang="ts">
import { useRouter } from 'vue-router'
import { authClient } from '~/lib/auth-client'

const toast = useToast()
const router = useRouter()
const projectRepositoryUrl = useRuntimeConfig().public.projectRepositoryUrl
const session = authClient.useSession()
const items = [
  [{
    label: session.value.data?.user.username as string,
    slot: 'account',
    disabled: true,
  }], [{
    label: '设置',
    icon: 'i-heroicons-cog-8-tooth',
  }, {
    label: 'GitHub 仓库',
    icon: 'i-mdi-github',
    click: async () => {
      await navigateTo(projectRepositoryUrl, {
        external: true,
      })
    },
  }], [{
    label: '退出账号',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login')
          },
        },
      })
      toast.add({
        icon: 'i-heroicons-arrow-right-on-rectangle',
        id: 'logout_success',
        title: '退出账号',
        description: '账号已成功退出',
      })
    },
  }],
]
</script>

<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      :label="session.data?.user.name"
      color="white"
      variant="soft"
    >
      <template #leading>
        <UAvatar
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          size="xs"
        />
      </template>
    </UButton>

    <template #account="{ item }">
      <div class="text-left">
        <p>
          登录身份
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>

<style scoped>
</style>
