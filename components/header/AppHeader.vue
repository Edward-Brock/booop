<script setup lang="ts">
import { Disclosure, DisclosureButton } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import UserDropdown from './UserDropdown.vue'
import { authClient } from '~/lib/auth-client'

const session = authClient.useSession()
</script>

<template>
  <Disclosure
    v-slot="{ open }"
    as="nav"
  >
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon
              v-if="!open"
              class="block size-6"
              aria-hidden="true"
            />
            <XMarkIcon
              v-else
              class="block size-6"
              aria-hidden="true"
            />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <img
              class="h-8 w-auto"
              src="~/public/booop_logo_96_48.png"
              alt="booop logo"
            >
          </div>
        </div>

        <div
          v-if="!session.data?.user"
          class="flex flex-wrap items-center justify-center"
        >
          <UButton
            size="md"
            color="gray"
            variant="solid"
            :ui="{ rounded: 'rounded-full' }"
            to="/signup"
          >
            注册
          </UButton>

          <UButton
            class="ml-2"
            size="md"
            variant="solid"
            :ui="{ rounded: 'rounded-full' }"
            to="/login"
          >
            <template #trailing>
              <UIcon
                name="i-heroicons-arrow-right-20-solid"
                class="w-5 h-5"
              />
            </template>
            登录
          </UButton>
        </div>

        <div
          v-if="session.data?.user"
          class="flex flex-wrap items-center justify-center"
        >
          <UserDropdown />
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style scoped>

</style>
