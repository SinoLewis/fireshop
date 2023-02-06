<svelte:options tag="supa-signout" />

<script type="ts">
  import { supabaseSignOut } from "../../util/supabase";
</script>

<button on:click={supabaseSignOut}> Sign Out </button>

<style lang="scss">
  button {
    @apply btn bg-purple-50;
  }
</style>
