<template>
  <button
    @click="addToCart()"
    class="rounded bg-slate-400 px-2 py-1 text-slate-700 hover:bg-slate-300"
  >
    Add To Cart
  </button>
</template>

<script setup lang="ts">
import { usePostToShopify } from '~~/utils/post-to-shopify'
import { useGetCart } from '~~/utils/get-cart'
interface Props {
  form: object
  selectedVariant: object
}
const props = defineProps<Props>()

const query = `
mutation createCart($cartInput: CartInput) {
  cartCreate(input: $cartInput) {
    cart {
      id
    }
  }
}
`
// {"data":{"cartCreate":{"cart":{"id":"gid://shopify/Cart/8c1440386e1e325a270b62e92a00e0ee"}}}}

const cartId = 'gid://shopify/Cart/8c1440386e1e325a270b62e92a00e0ee'

const cart = await useGetCart(cartId)

function addToCart() {
  const response = usePostToShopify(query, {
    cartInput: {
      lines: [
        {
          quantity: props.form.quantity,
          merchandiseId: props.selectedVariant.id,
        },
      ],
    },
  })

  console.log(response)
}
</script>
