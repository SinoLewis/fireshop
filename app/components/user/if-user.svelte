<svelte:options tag="if-user" />

<!-- Is signed in  -->
<script lang="ts">
  import { user } from "../../stores";
</script>

{#if $user?.aud === "authenticated"}
  <slot />
{:else}
  <slot name="signed-out" />
{/if}
