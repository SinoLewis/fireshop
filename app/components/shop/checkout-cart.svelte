<svelte:options tag="checkout-cart" />

<script lang="ts">
  import { cart, products } from "../../stores";

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
      <div class="description">
        <h3>{item}</h3>
        <p>{$cart.cart_products[item].id}</p>
        <span class="price"
          >Ksh {$cart.cart_products[item].total_price | 0}</span
        >
        <div class="actions">
          <cart-buttons product_title={item} />
        </div>
      </div>
    </div>
  {/if}
{/each}

<style lang="scss">
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out;
    &:hover {
      border-color: #737373;
    }
  }
  .image-selector {
    width: 320px;
    height: 200px;
    img {
      @apply rounded-l-md w-full h-full object-cover;
    }
  }
  .description {
    flex: 1 0 auto;
    padding: 0.5rem;
    text-align: center;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.875rem;
      color: #737373;
      margin-bottom: 0.5rem;
    }

    .price {
      font-size: 1.125rem;
      font-weight: 600;
      color: #01b1b3;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
  }
</style>
