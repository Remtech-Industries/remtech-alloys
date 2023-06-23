<template>
  <div ref="navbar" class="bg-slate-800 p-2 shadow-lg">
    <div class="container mx-auto flex items-stretch justify-between">
      <div class="flex flex-grow items-center self-start">
        <NuxtLink to="/">
          <img
            src="/logo.png"
            alt="Rem-Tech Alloys Logo"
            width="200"
            class="sm:ml-8"
          />
        </NuxtLink>

        <div class="hidden pl-4 tracking-wide text-slate-50 xl:block">
          Offering Prompt Delivery of Custom-Sized Stainless Steels and
          Specialty Alloys
        </div>
      </div>

      <div class="flex flex-col">
        <button
          class="block self-end rounded border border-gray-600 px-3 py-1 text-xl leading-none text-gray-400 sm:hidden"
          type="button"
          @click="toggleNavbar()"
        >
          <svg
            class="inline-block"
            style="font-size: 150%"
            viewBox="0 0 16 16"
            width="1em"
            height="1em"
            focusable="false"
            role="img"
            aria-label="menu"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>

        <div
          :class="{ hidden: !showMenu, flex: showMenu }"
          class="mt-2 items-center sm:flex sm:flex-grow"
        >
          <div
            class="ml-auto flex flex-col items-end gap-2 font-oswald text-slate-50 sm:flex-row sm:gap-5"
          >
            <NuxtLink to="/about" class="tracking-widest">ABOUT</NuxtLink>

            <div class="flex items-baseline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="15"
                viewBox="0 96 960 960"
                width="15"
                fill="white"
              >
                <path
                  d="M795 936q-122 0-242.5-60T336 720q-96-96-156-216.5T120 261q0-19.286 12.857-32.143T165 216h140q13.611 0 24.306 9.5Q340 235 343 251l27 126q2 14-.5 25.5T359 422L259 523q56 93 125.5 162T542 802l95-98q10-11 23-15.5t26-1.5l119 26q15.312 3.375 25.156 15.188Q840 740 840 756v135q0 19.286-12.857 32.143T795 936ZM229 468l81-82-23-110H180q0 39 12 85.5T229 468Zm369 363q41 19 89 31t93 14V769l-103-21-79 83ZM229 468Zm369 363Z"
                />
              </svg>

              <div class="ml-1 whitespace-nowrap tracking-widest">
                (519) 773-3455
              </div>
            </div>
          </div>
        </div>

        <div class="mt-2 flex justify-end text-slate-50">
          <div v-show="showAddedToCartAlert" class="mr-2">Added to cart!</div>

          <NuxtLink to="/cart" class="font-semibold">
            <span class="mr-1">Cart</span>

            <span class="rounded bg-yellow-500 px-1 text-sm text-slate-900">
              {{ itemCount }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import { ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const showAddedToCartAlert = ref(false)

const { itemCount } = storeToRefs(useCartStore())
watch(itemCount, (oldCount, newCount) => {
  if (oldCount > newCount) {
    showAddedToCartAlert.value = true
    setTimeout(() => (showAddedToCartAlert.value = false), 3000)
  }
})

const showMenu = ref(false)
function toggleNavbar() {
  showMenu.value = !showMenu.value
}

const navbar = ref(null)
useResizeObserver(navbar, (entries) => {
  const { width } = entries[0].contentRect
  if (width >= 640) showMenu.value = false
})
</script>
