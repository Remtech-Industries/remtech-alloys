<template>
  <footer
    class="mt-auto w-full bg-slate-900 p-4 text-sm font-light text-slate-100"
  >
    <div class="flex h-full w-full flex-col gap-3">
      <div
        class="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-10"
      >
        <a
          v-for="document in policyDocuments"
          :key="document.title"
          class="cursor-pointer"
          @click="selectedDocument = document"
        >
          {{ document.title }}
        </a>

        <NuxtLink to="/about">Contact Us</NuxtLink>
      </div>

      <div class="text-center text-xs">
        &copy; {{ new Date().getFullYear() }} Rem-Tech Alloys Inc. All rights
        reserved.
      </div>
    </div>

    <Dialog
      :visible="!!selectedDocument"
      modal
      dismissable-mask
      @update:visible="selectedDocument = undefined"
      :header="selectedDocument?.title"
      :draggable="false"
    >
      <span class="css" v-html="selectedDocument?.content"></span>
    </Dialog>
  </footer>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref } from '#imports'
import { policyDocuments, type PolicyDocument } from '@/utils/policy-documents'

const selectedDocument = ref<PolicyDocument>()
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
