<svelte:options tag="testin-button" />

<script lang="ts">
  import { onMount } from "svelte";
  import { user } from "../../stores";

  let src = "/img/ui/avatar.svg";
  // let user_img; // Assuming $user is a Svelte store

  // onMount(() => {
  //   // Simulate API call
  //   setTimeout(() => {
  //     // Update the $user store with the API response
  //     $user_img = {
  //       user_metadata: {
  //         avatar_url: "https://example.com/avatar.jpg",
  //       },
  //     };
  //   }, 2000); // Delay for 2 seconds, replace with your actual API call
  // });

  $: {
    // Reactive assignment to update src when $user changes
    src = $user?.user_metadata?.avatar_url ?? "/img/ui/avatar.svg";
  }
</script>

<img {src} alt="User Avatar" />
