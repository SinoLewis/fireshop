<svelte:options tag="supa-signout" />

<script type="ts">
  import { supabaseSignOut } from "../../util/supabase";
</script>

<button on:click={supabaseSignOut}> Sign Out </button>

<style lang="scss">
  button {
    @apply btn cursor-pointer px-4 py-2 text-xl font-display text-white bg-black hover:bg-purple-600 drop-shadow-[6px_6px_0_black] hover:drop-shadow-[0_0_7px_rgba(168,85,247,0.5)] transition-all duration-300;
  }
</style>
