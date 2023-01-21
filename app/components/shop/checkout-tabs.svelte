<svelte:options tag="checkout-tabs" />

<script lang="ts">
  let activeTab = 0;
  const tab1 = () => (activeTab = 0);
  const tab2 = () => (activeTab = 1);
  const tab3 = () => (activeTab = 2);
</script>

<div>
  <div class="box box-btns">
    <btn class="btn btn-lg btn-blue btn-display glow" on:click={tab1}
      >🛒 Cart</btn
    >
    <btn class="btn btn-lg btn-purple btn-display glow" on:click={tab2}
      >🚚 Delivery</btn
    >
    <btn class="btn btn-lg btn-green btn-display glow" on:click={tab3}
      >🖲️ Tracking</btn
    >
  </div>
  <div class="box">
    {#if activeTab === 0}
      <checkout-cart />
    {/if}
    {#if activeTab === 1}
      <checkout-delivery />
    {/if}
    {#if activeTab === 2}
      <checkout-tracking />
    {/if}
  </div>
</div>

<style lang="scss">
  .box {
    @apply bg-gray6 shadow-lg border-l-4 border-gray5 p-6 rounded-r-lg;
  }
  .box-btns {
    @apply flex justify-between;
  }
  .btn {
    @apply bg-white text-black uppercase font-bold inline-flex cursor-pointer text-center shadow-md no-underline px-5 py-2 transition-all duration-150 my-0.5;
    &.glow {
      @apply hover:drop-shadow-[0_0_4px_rgba(225,225,225,0.5)];
    }
  }
  .btn-lg {
    @apply px-5 py-3 text-xl;
  }
  .glow {
    @apply hover:translate-y-[-2px];
  }
  .btn-display {
    @apply font-display font-normal;
  }
  .btn-purple {
    @apply bg-purple-500 text-white active:bg-purple-700;
  }
  .btn-green {
    @apply bg-green-500 text-white active:bg-green-700;
  }
  .btn-blue {
    @apply bg-blue-500 text-white active:bg-blue-700;
  }
</style>
