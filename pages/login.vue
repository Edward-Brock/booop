<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { authClient } from '~/lib/auth-client'

const toast = useToast()
const router = useRouter()

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `登录 - ${titleChunk}` : '登录'
  },
})

definePageMeta({
  layout: 'single',
  auth: false,
})

const schema = z.object({
  username: z.string({ required_error: '需要用户名' })
    .max(16, { message: '不能超过16个字符' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: '只能包含字母、数字和下划线' }),
  password: z.string({ required_error: '需要密码' })
    .min(8, { message: '必须至少包含8个字符' })
    .max(32, { message: '不能超过32个字符' }),
})

type Schema = z.output<typeof schema>

const state = reactive({
  username: undefined,
  password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // 使用用户名和密码登录
  const data = await authClient.signIn.username({
    username: event.data.username,
    password: event.data.password,
  })
  // 如果 data 中为 null，error 中为 401 且 statusText 为 UNAUTHORIZED 则通知用户
  if (data.error?.status === 401 || data.error?.statusText === '"UNAUTHORIZED"') {
    toast.add({
      icon: 'i-heroicons-x-circle',
      id: 'login_error',
      color: 'red',
      title: '登录失败',
      description: data.error.message || '发生了未知错误',
    })
  }
  // 若 data 中 token 有值且 data 不为 null 则登录成功
  if (!!data.data?.token && typeof (data) != 'undefined') {
    toast.add({
      icon: 'i-heroicons-check-circle',
      id: 'login_success',
      title: '登录成功',
      description: '欢迎回来',
    })
    router.push('/')
  }
}
</script>

<template>
  <div class="h-screen flex flex-col items-center overlay">
    <!-- 首页跳转按钮 -->
    <UButton
      class="font-medium my-8"
      icon="i-heroicons-home"
      size="md"
      color="black"
      variant="solid"
      to="/"
      label="首页"
      :trailing="false"
      :ui="{ rounded: 'rounded-full' }"
    />

    <main
      class="rounded-xl divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur"
    >
      <div class="px-4 py-5 sm:p-6">
        <div class="w-full max-w-sm space-y-6">
          <!-- 描述区 -->
          <header class="text-center">
            <div class="mb-2 pointer-events-none">
              <UIcon
                class="w-8 h-8"
                name="i-heroicons-lock-closed"
              />
            </div>

            <div class="text-2xl text-gray-900 dark:text-white font-bold">
              欢迎回来
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400 mt-1">还没有账户？</span>
              <span><NuxtLink to="/signup">注册</NuxtLink></span>
            </div>
          </header>

          <!-- 登录表单 -->
          <div>
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="onSubmit"
            >
              <UFormGroup
                label="用户名"
                name="username"
              >
                <UInput
                  v-model="state.username"
                  icon="i-heroicons-user"
                  placeholder="输入用户名"
                  size="md"
                />
              </UFormGroup>

              <UFormGroup
                label="密码"
                name="password"
              >
                <UInput
                  v-model="state.password"
                  icon="i-heroicons-key"
                  placeholder="输入密码"
                  size="md"
                  type="password"
                />
              </UFormGroup>

              <UButton
                block
                type="submit"
                :ui="{ rounded: 'rounded-full' }"
              >
                <template #trailing>
                  <UIcon
                    name="i-heroicons-arrow-right-20-solid"
                    class="w-5 h-5"
                  />
                </template>
                登录
              </UButton>
            </UForm>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>
