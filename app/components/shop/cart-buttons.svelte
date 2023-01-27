<svelte:options tag="cart-buttons" />

<script lang="ts">
  import { cart, add, minus, remove } from "../../stores";

  export let product_title;
  let addItem = () => add(product_title);
  let minusItem = () => minus(product_title);
  let removeItem = () => remove(product_title);
</script>

<!-- TODO: Add favourite fuctionality -->
{#if $cart.cart_products[product_title]}
  <div class="btns">
    <button class="btn btn-red btn-sm glow" on:click={removeItem}> 🗑️ Remove </button>
    <span>
      <button class="btn btn-red btn-sm glow" on:click={minusItem}> ➖ </button>
      <div class="tag qty">
        {$cart.cart_products[product_title]?.quantity | 0}
      </div>
      <button class="btn btn-blue btn-sm glow" on:click={addItem}> ➕ </button>
    </span>
  </div>
{:else}
  <button class="btn btn-blue btn-sm glow" on:click={addItem}> 🛒 Add </button>
{/if}

<style lang="scss">
  .btn {
    @apply bg-white text-black uppercase font-bold inline-flex cursor-pointer text-center shadow-md no-underline px-5 py-2 transition-all duration-150 my-0.5;
    &.glow {
      @apply hover:drop-shadow-[0_0_4px_rgba(225,225,225,0.5)];
    }
  }
  .btn-sm {
    @apply px-3 py-1 text-xs font-sans uppercase font-bold;
  }

  .glow {
    @apply hover:translate-y-[-2px];
  }

  .btn-red {
    @apply bg-red-500 text-white hover:bg-red-600 active:bg-red-700;
    &.glow {
      @apply hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.5)];
    }
  }

  .btn-blue {
    @apply bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700;
    &.glow {
      @apply hover:drop-shadow-[0_0_5px_rgba(59,130,246,0.5)];
    }
  }
  .tag {
    @apply inline-block mr-1 pt-1 pb-1.5 px-2 text-xs rounded-md border-none bg-black bg-opacity-30 text-gray3;
  }
  .qty {
    background: white;
    color: #4a8afc;
  }
  .btn-purple {
    @apply bg-purple-500 text-white active:bg-purple-700;
    &.glow {
      @apply hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.5)];
    }
  }
  .btns {
    @apply flex justify-between p-2;
  }
</style>
