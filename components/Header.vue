<template>
  <div ref="navbar" class="bg-slate-800 p-2 shadow-lg">
    <div class="container mx-auto flex items-stretch justify-between">
      <div class="flex flex-grow items-center self-start">
        <NuxtLink to="/">
          <NuxtImg
            src="/logo.png"
            alt="Rem-Tech Alloys Logo"
            :width="200"
            :height="75"
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
          class="mt-2 items-center sm:flex"
        >
          <div
            class="ml-auto flex flex-col items-end gap-2 font-oswald text-slate-50 sm:flex-row sm:gap-5"
          >
            <NuxtLink to="/pages/rfq" class="tracking-wide">
              GET A QUOTE
            </NuxtLink>

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

            <a
              target="_blank"
              href="https://www.linkedin.com/company/rem-tech-alloys-inc/"
              class="flex cursor-pointer items-baseline"
            >
              <span class="mr-1.5">LinkedIn</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="white"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                />

                <path
                  fill-rule="evenodd"
                  d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'
import { useResizeObserver } from '@vueuse/core'

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
