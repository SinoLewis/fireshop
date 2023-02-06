<svelte:options tag="user-cred" />

<script lang="ts">
  import { user } from "../../stores";

  export let field: "email" | "id";
</script>

{#if field === "email"}
  <span>{$user?.email}</span>
{/if}

{#if field === "id"}
  <span>{$user?.id}</span>
{/if}
