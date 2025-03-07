<template>
  <footer
    class="mt-auto w-full bg-slate-900 p-4 text-sm font-light text-slate-100"
  >
    <div class="flex h-full w-full flex-col gap-3">
      <div
        class="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-10"
      >
        <a class="cursor-pointer" @click="showPolicy('Privacy Policy')">
          Privacy
        </a>

        <a class="cursor-pointer" @click="showPolicy('Terms Of Service')">
          Terms of Service
        </a>

        <a class="cursor-pointer" @click="showPolicy('Shipping Policy')">
          Shipping Policy
        </a>

        <a class="cursor-pointer" @click="showPolicy('Refund Policy')">
          Return Policy
        </a>

        <NuxtLink to="/about">Contact Us</NuxtLink>
      </div>

      <div class="text-center text-xs">
        &copy; {{ year }} Rem-Tech Alloys Inc. All rights reserved.
      </div>
    </div>

    <Dialog
      :visible="!!words"
      modal
      dismissable-mask
      @update:visible="words = null"
      :header="header"
      :draggable="false"
    >
      <span class="css" v-html="words"></span>
    </Dialog>
  </footer>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref } from '#imports'

type PolicyName =
  | 'Refund Policy'
  | 'Privacy Policy'
  | 'Shipping Policy'
  | 'Terms Of Service'

const year = new Date().getFullYear()
const words = ref<string | null>(null)
const header = ref('')

async function showPolicy(title: PolicyName) {
  words.value = 'policy'
  header.value = title
}
</script>

<!-- #best v-html :deep -->
<style scoped>
.css :deep() {
  p {
    @apply mb-3;
  }

  ol {
    @apply list-outside list-decimal px-5;
  }

  li {
    @apply mb-2;
  }

  a {
    @apply text-blue-500;
  }
}
</style>
