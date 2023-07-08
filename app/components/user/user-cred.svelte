<svelte:options tag="user-cred" />

<script lang="ts">
  import { user } from "../../stores";

  export let field: "email" | "id" | "photoURL";

  let src = "/img/ui/avatar.svg";
  $: {
    src = $user?.user_metadata?.avatar_url ?? "/img/ui/avatar.svg";
  }
</script>

{#if field === "email"}
  <span>{$user?.email}</span>
{/if}

{#if field === "id"}
  <span>{$user?.id}</span>
{/if}
{#if field === "photoURL"}
  <img
    {src}
    alt="avatar"
    referrerpolicy="no-referrer"
    style="max-width: 100%; border-radius: 9999px;"
    on:error={() => (src = "/img/ui/avatar.svg")}
  />
{/if}
