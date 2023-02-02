<svelte:options tag="checkout-cart" />

<script lang="ts">
  import { cart } from "../../stores";

  let items = Object.keys($cart.cart_products);
</script>

<h2>Total Price: {$cart.cart_price}</h2>
{#each items as item}
  {#if $cart.cart_products[item]}
    <div class="item">
      <figure>
        <img src={$cart.cart_products[item].image} alt={item} />
      </figure>
      <div class="item-body">
        <h2 class="item-title">{item}</h2>
        <p>Ksh {$cart.cart_products[item].total_price | 0}</p>
        <div class="item-btns">
          <cart-buttons product_title={item} />
        </div>
      </div>
    </div>
  {/if}
{/each}

<style lang="scss">
  .item {
    border: 2px solid #ffffff;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out;
    &:hover {
      border-color: #737373;
    }
    @apply card card-side bg-base-100 shadow-xl;

    figure {
      width: 30%;
    }

    .item-body {
      @apply card-body;
    }

    .item-title {
      @apply card-title;
    }
    .item-btns {
      @apply card-actions justify-end;
    }
  }
</style>
