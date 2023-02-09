<svelte:options tag="item-comment" />

<script lang="ts">
  import { sendMessageToWebhook } from "../../util/discord";
  import { toast } from "../../stores";

  let value;
  async function handleSubmit() {
    sendMessageToWebhook("COMMENT", value);
    console.log("COMMENT: ", value);
    value = undefined;

    toast.set({
      icon: "😎",
      message: "Your post was succesful!",
      type: "success",
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="area">
    <textarea placeholder="Type your comment" bind:value />
  </div>
  <div>
    <button class="btn btn-lg btn-blue btn-display glow" type="submit"
      >Submit</button
    >
  </div>
</form>

<style lang="scss">
  form {
    @apply grid gap-4;
  }

  .area {
    @apply w-11/12;
    textarea {
      @apply textarea textarea-bordered textarea-lg w-full max-w-xs;
    }
  }
  .btn {
    @apply bg-white text-black uppercase font-bold inline-flex cursor-pointer text-center shadow-md no-underline px-5 py-2 transition-all duration-150 my-0.5;
    &.glow {
      @apply hover:drop-shadow-[0_0_4px_rgba(225,225,225,0.5)];
    }
  }
  .btn-lg {
    @apply text-xs md:text-xl;
  }
  .glow {
    @apply hover:translate-y-[-2px];
  }
  .btn-display {
    @apply font-display font-normal;
  }
  .btn-blue {
    @apply bg-blue-500 text-white active:bg-blue-700;
  }
</style>
