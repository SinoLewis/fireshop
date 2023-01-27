<svelte:options tag="checkout-cart" />

<script lang="ts">
  import { cart } from "../../stores";

  let items = Object.keys($cart.cart_products);
</script>

<h2>Total Price: {$cart.cart_price}</h2>
{#each items as item}
  {#if $cart.cart_products[item]}
    <div class="content">
      <div class="image-selector">
        <img
          src="https://assets.bitdegree.org/crypto/storage/media/pow-blockchain-infographics-5f572a4421ef9.o.jpg"
          alt="Selected Image"
        />
      </div>
      <span>
        <h4>{item}</h4>
      </span>
      <!-- <p>
        Many desktop publishing packages and web page editors now use Lorem
        Ipsum as their default model text, and a search.
      </p> -->
      <span class="price">
        <h4>Ksh {$cart.cart_products[item].total_price | 0}</h4>
      </span>
      <cart-buttons class="btns" product_title={item} />
    </div>
  {/if}
{/each}

<style lang="scss">
  .content {
    // 4 elements in 2 rows: img, desc, price, btns
    // sm: 1st row = 2 cols, 2nd row = btns
    // md: 1st row = 3 cols, 2nd row = btns
    @apply grid gap-x-4 grid-cols-3;
    border: 2px solid #ffffff;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out;
    &:hover {
      border-color: #737373;
    }
    img {
      @apply rounded-l-md w-full object-cover;
    }
    .price {
      @apply text-right px-2;
    }
    .btns {
      @apply col-start-2 col-end-4;
    }
  }
</style>
