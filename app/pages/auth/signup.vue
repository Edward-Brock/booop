<template>
  <main class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="~/assets/images/booop_logo.svg"
        alt="booop logo"
      >
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        注册你的账号
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <UForm
        :schema="v.safeParser(schema)"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormField
          label="昵称"
          name="name"
          required
          size="lg"
          class="block text-sm/6 font-medium text-gray-900"
        >
          <UInput
            v-model="state.name"
            type="text"
            autocomplete="name"
            placeholder="输入昵称"
            icon="i-heroicons-user"
            class="block w-full text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </UFormField>

        <UFormField
          label="电子邮箱"
          name="email"
          required
          size="lg"
          class="block text-sm/6 font-medium text-gray-900"
        >
          <UInput
            v-model="state.email"
            type="email"
            autocomplete="email"
            placeholder="输入电子邮箱"
            icon="i-heroicons-envelope"
            class="block w-full text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </UFormField>

        <UFormField
          label="密码"
          name="password"
          required
          size="lg"
          class="block text-sm/6 font-medium text-gray-900"
        >
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="current-password"
            placeholder="输入密码"
            icon="i-heroicons-lock-closed"
            class="block w-full text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </UFormField>

        <UButton
          color="neutral"
          type="submit"
          size="lg"
          :loading="isSubmitting"
          class="block w-full font-bold"
        >
          注册
        </UButton>
      </UForm>
    </div>

    <footer class="mt-20">
      <div class="space-y-4 text-center text-sm/6 text-gray-500">
        已经有账号？
        <UButton
          color="neutral"
          variant="link"
          trailing-icon="i-lucide-arrow-right"
          size="lg"
          class="font-semibold"
          to="/auth/login"
        >
          登录账号
        </UButton>
      </div>
    </footer>
  </main>
</template>

<script lang="ts" setup>
import MD5 from 'crypto-js/md5'
import * as v from 'valibot'
import type { FormSubmitEvent } from '#ui/types'
import { authClient } from '~/utils/auth-client'

definePageMeta({
  layout: 'auth',
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `注册 - ${titleChunk}` : '注册'
  },
})

/**
 * 计算电子邮箱的 MD5 哈希值
 * @param email 需要计算哈希的电子邮箱地址
 * @returns MD5 哈希值的字符串形式
 */
function hashEmail(email: string): string {
  return MD5(email.trim().toLowerCase()).toString()
}

/**
 * 根据哈希值生成图片请求 URL
 * @param hash - MD5 哈希值
 * @returns 拼接好的图片请求 URL
 */
function generateAvatarUrl(hash: string): string {
  return `https://cravatar.cn/avatar/${hash}?d=retro`
}

/**
 * 将图片 URL 转换为 Base64 数据
 * @param image - 图片的 URL
 * @returns Base64 数据 URI
 */
async function convertImageToBase64(image: string): Promise<string> {
  try {
    const response = await fetch(image)
    if (!response.ok) throw new Error(`请求失败，状态码: ${response.status}`)

    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => reject('读取图片数据失败')
      reader.readAsDataURL(blob)
    })
  }
  catch (error) {
    console.error('图片转换失败:', error)
    throw error // 抛出错误以便外部处理
  }
}

const schema = v.object({
  email: v.pipe(v.string(), v.trim(), v.email('请输入有效的电子邮箱')),
  password: v.pipe(v.string(), v.trim(), v.minLength(8, '密码最少8个字符'), v.maxLength(32, '密码最多32个字符')),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, '昵称不能为空')),
})

type Schema = v.InferOutput<typeof schema>

const isSubmitting = ref(false)
const state = reactive({
  email: '',
  password: '',
  name: '',
})

const toast = useToast()
const router = useRouter()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true // 在提交时设置为 true
  const emailHash = hashEmail(event.data.email)
  const avatarUrl = generateAvatarUrl(emailHash)

  try {
    const avatarBase64 = await convertImageToBase64(avatarUrl)

    // 用户注册 API 调用
    await authClient.signUp.email({
      email: event.data.email,
      password: event.data.password,
      name: event.data.name,
      image: avatarBase64, // 使用 Base64 头像
    }, {
      onSuccess: () => {
        // 注册成功后提示
        toast.add({
          icon: 'i-heroicons-check-circle',
          title: '注册成功',
          color: 'success',
        })
        router.push('/')
      },
      onError: (ctx) => {
        // 处理注册失败错误提示
        toast.add({
          icon: 'i-heroicons-x-circle',
          title: '注册失败',
          description: ctx.error.message,
          color: 'error',
        })
      },
    })
  }
  catch (error) {
    toast.add({
      icon: 'i-heroicons-x-circle',
      title: '注册失败',
      description: '头像生成失败或网络错误',
      color: 'error',
    })
  }
  finally {
    isSubmitting.value = false // 提交完成后重置为 false
  }
}
</script>

<style>

</style>
