<svelte:options tag="checkout-tabs" />

<script lang="ts">
  let activeTab = 0;
  const tab1 = () => (activeTab = 0);
  const tab2 = () => (activeTab = 1);
  const tab3 = () => (activeTab = 2);
</script>

<div class="box">
  <div class="group">
    <btn on:click={tab1} class="blue">Cart 🛒</btn>
    <btn on:click={tab2} class="green">Order 🖲️</btn>
    <btn on:click={tab3} class="purple">Delivery 🚚</btn>
  </div>

  <div>
    {#if activeTab === 0}
      <checkout-cart />
    {/if}
    {#if activeTab === 1}
    <checkout-merchant />
    <!-- <checkout-order /> -->
    {/if}
    {#if activeTab === 2}
      <checkout-delivery />
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
      @apply text-xs md:text-xl btn-display glow uppercase cursor-pointer shadow-md px-5 py-2 transition-all duration-150 my-0.5 hover:drop-shadow-[0_0_4px_rgba(225,225,225,0.5)];
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
    @apply hover:translate-y-[-2px];
  }
  .btn-display {
    @apply font-display font-normal;
  }
</style>
