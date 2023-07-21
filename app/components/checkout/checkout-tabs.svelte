<svelte:options tag="checkout-tabs" />

<script lang="ts">
  import { checkout } from "../../stores";
</script>

<div class="box">
  <div class="group">
    <btn class:glow={$checkout === 0} class="blue">1. Cart 🛒</btn>
    <btn class:glow={$checkout === 1} class="green">2. Delivery 🚚</btn>
    <btn class:glow={$checkout === 2} class="purple">3. Order 📲</btn>
  </div>

  <div>
    {#if $checkout === 0}
      <checkout-cart />
    {/if}
    {#if $checkout === 1}
      <checkout-delivery />
    {/if}
    {#if $checkout === 2}
      <checkout-order />
    {/if}
  </div>
</div>

<style lang="scss">
  .box {
    @apply grid justify-items-center;
  }
  .group {
    @apply text-center btn-group btn-group-horizontal gap-1 justify-items-center;

    btn {
      @apply text-xs md:text-xl btn-display uppercase cursor-pointer shadow-md px-5 py-2 transition-all duration-150 my-0.5 hover:drop-shadow-[0_0_4px_rgba(225,225,225,0.5)];
    }

    .blue {
      @apply bg-blue-500 text-white active:bg-blue-700;
    }
    .green {
      @apply bg-green-500 text-white active:bg-green-700;
    }
    .purple {
      @apply bg-purple-500 text-white active:bg-purple-700;
    }
  }
  .glow {
    @apply translate-y-[-20px];
  }
  .btn-display {
    @apply font-display font-normal;
  }
</style>
