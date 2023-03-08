<svelte:options tag="checkout-cart" />

<script lang="ts">
  import { cart } from "../../stores";

  let items = Object.keys($cart.cart_products);
  let image = null;
  $: image;

  const preload: any = async (src) => {
    const resp = await fetch(src);
    const blob = await resp.blob();

    return new Promise(function (resolve, reject) {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(`Error: ,${error}`);
    });
  };
</script>

<h2>Total Price: <span class="txt">{$cart.cart_price}</span></h2>
{#each items as item}
  {#if $cart.cart_products[item]}
    <div class="item">
      <div class="image">
        {#await preload($cart.cart_products[item].image)}
          <img src="/img/default-cover.png" />
        {:then base64}
          <img src={base64} alt={item} />
        {/await}
      </div>
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
  .image {
    @apply w-72 pr-4;

    img {
      border-radius: 0.75rem;

      @apply w-full h-48 object-cover;
    }
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
      border-color: #1d4ed8;
    }
    @apply card card-side shadow-xl;

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
