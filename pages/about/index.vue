<template>
  <div class="container mx-auto flex max-w-screen-md flex-col gap-6 px-6">
    <h2 class="mt-6 font-oswald text-3xl">About Rem-Tech Alloys</h2>

    <p>
      Rem-Tech Alloys was established in 2023 as a spin-off of Rem-Tech
      Industries, an expert in machining stainless steels and superalloys since
      the year 2000. Rem-Tech Alloys aims to fill an existing industry gap by
      delivering stainless steels and specialty alloys promptly and at any size.
      We are dedicated to fulfilling the unique requirements of our customers.
    </p>

    <div class="grid-cols-1 md:grid-cols-2">
      <div>
        <p>
          MTR's (Material Test Reports) are maintained for traceability to the
          mill, and PMI (Positive Material Identification) is performed with an
          XRF (X-Ray fluorescent) analyzer to verify the elemental composition
          of all stainless steels and high nickel alloys.
        </p>

        <h2 class="mb-3 mt-8 font-extrabold">Contact Details</h2>

        <p>
          105 White Street
          <br />
          Aylmer, Ontario, Canada
          <br />
          N5H 3G3
        </p>

        <p>
          Phone: (519) 773-3455
          <br />
          Email: info@remtechalloys.com
          <br />
          Hours: Monday - Friday, 8:00 AM - 5:00 PM
        </p>
      </div>

      <div class="my-8 grid grid-cols-2 gap-1">
        <NuxtImg src="/overhead.jpg" />
        <NuxtImg src="/medium_close.jpg" />
        <NuxtImg src="/extremely_close.jpg" />
        <NuxtImg src="/side.jpg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
useHead({ title: 'About' })
</script>
