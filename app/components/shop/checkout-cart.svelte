<svelte:options tag="checkout-cart" />

<script lang="ts">
  import { cart } from "../../stores";

  let items = Object.keys($cart.cart_products);
</script>

<h2>Total Price: <span class="txt">{$cart.cart_price}</span></h2>
{#each items as item}
  {#if $cart.cart_products[item]}
    <div class="item">
      <figure>
        <img src={$cart.cart_products[item].image} alt={item} />
      </figure>
      <div class="body">
        <p class="txt">{item}</p>
        <p>Ksh {$cart.cart_products[item].total_price | 0}</p>
        <div>
          <cart-buttons product_title={item} />
        </div>
      </div>
      <!-- <div class="item-body">
        <h2 class="item-title">{item}</h2>
        <p>Ksh {$cart.cart_products[item].total_price | 0}</p>
        <div class="item-btns">
          <cart-buttons product_title={item} />
        </div>
      </div> -->
    </div>
  {/if}
{/each}

<style lang="scss">
  .txt {
    @apply text-blue-700;
  }
  .item {
    height: 12rem;
    border: 2px solid #ffffff;
    border-radius: 0.375rem;
    margin-bottom: 8px;
    background: linear-gradient(
      176deg,
      rgba(18, 24, 27, 1) 50%,
      rgba(32, 39, 55, 1) 100%
    );
    transition: border-color 0.15s ease-in-out;
    &:hover {
      border-color: #1D4ED8;
    }
    @apply card card-side shadow-xl;

    figure {
      width: 30%;
      margin: 0px;
      margin-right: 8px;

      @apply object-cover;
    }
    .body {
      @apply grid gap-y-0.5;
    }
    // .item-body {
    //   @apply card-body;
    // }

    // .item-title {
    //   @apply card-title;
    // }
    // .item-btns {
    //   @apply card-actions justify-end;
    // }
  }
</style>
