<svelte:options tag="checkout-merchant" />

<script lang="ts">
  import { onMount } from "svelte";
  import { updateCart } from "../../util/supabase";
  import { sendMessageToWebhook } from "../../util/discord";
  import { toast, user } from "../../stores";

  let emailEl: HTMLInputElement;
  let nameEl: HTMLInputElement;
  let phoneEl: HTMLInputElement;
  let addressEl: HTMLInputElement;

  // TODO: default=white, valid=green, error_on_submit=red
  // let emailValid = () => emailEl.validity.valid;
  let emailValid = false;
  let phoneValid = false;
  let nameValid = false;
  let addressValid = false;

  let loading = false;

  async function validate() {
    emailValid = emailEl.validity.valid;
    phoneValid = phoneEl.validity.valid;
    nameValid = nameEl.validity.valid;
    addressValid = addressEl.validity.valid;
  }

  async function handleSubmit(e) {
    loading = true;
    let request = {
      name: nameEl.value,
      email: emailEl.value,
      phone: phoneEl.value,
      address: addressEl.value
    };
    try {
      sendMessageToWebhook("ORDER", request);
      toast.set({
        icon: "😎",
        message: "Your Order was succesful!",
        type: "success",
      });
      console.log("DELIVERY STORE: ", request);
    } catch (error) {
      toast.set({
        icon: "❌",
        message: error.message,
        type: "error",
      });
    }
    loading = false;
  }
</script>

{#if $user}
  <div class="box">
    <div>
      <h2>Confirm Deilivery</h2>
    </div>
    <form on:submit|preventDefault={handleSubmit}>
      <h2>Deilivery Details</h2>
      <label for="name">
        <span>Name</span>
        <input
          class="input-field"
          type="text"
          name="name"
          bind:this={nameEl}
          on:input={validate}
          required
        />
      </label>
      <label for="phone">
        <span>Phone</span>
        <input
          class="input-field"
          type="tel"
          name="phone"
          placeholder="254712345678"
          bind:this={phoneEl}
          on:input={validate}
          required
        />
      </label>
      <label for="email">
        <span>Email</span>
        <input
          class="input-field"
          type="email"
          name="email"
          value={$user.email}
          bind:this={emailEl}
          on:input={validate}
          required
        />
      </label>
      <label for="address">
        <span>Address</span>
        <input
          class="input-field"
          type="text"
          name="address"
          placeholder="Address"
          bind:this={addressEl}
          required
        />
      </label>
      <input
        class="send"
        type="submit"
        value={loading ? "sending..." : "send"}
        class:disabled={!emailValid ||
          !phoneValid ||
          !addressValid ||
          !nameValid ||
          loading}
      />
    </form>
  </div>
{:else}
  <no-user />
{/if}

<style lang="scss">
  .box {
    @apply grid justify-items-start grid-cols-1 md:grid-cols-2;
  }
  form {
    @apply grid gap-2 justify-center;
  }

  label {
    width: 20rem;
    @apply input-group;

    span {
      // width: 15%;
      @apply bg-info-content;
    }
    .input-field {
      width: 100%;
      @apply input input-bordered border-b-4 border-b-white border-t-0 border-r-0 border-l-0;
    }
  }
  input[type="email"]:valid,
  input[type="tel"]:valid,
  input[type="text"]:valid {
    @apply border-b-green-500;
  }
  .confirm {
    @apply select select-bordered select-lg w-full max-w-xs;
  }
  .send {
    @apply btn btn-info;
  }
  .disabled {
    @apply opacity-50 cursor-not-allowed;
  }
  .results {
    @apply max-w-lg;
  }
  .hit {
    th {
      @apply font-bold text-info;
    }
    td {
      word-wrap: break-word;
      max-width: 18rem;
      background: linear-gradient(
        176deg,
        rgb(0, 56, 80) 50%,
        rgba(32, 39, 55, 1) 100%
      );
      @apply text-lg font-bold cursor-pointer glow transition-all duration-150 my-0.5 hover:drop-shadow-[0_0_4px_rgba(225,225,225,0.5)];
    }
    // @apply overflow-x-auto;

    table {
      @apply table-auto text-left;
    }
    // @apply btn btn-primary block m-2;
  }
  .glow {
    @apply hover:translate-y-[-2px];
  }
  // .active {
  //   @apply bg-orange-500 text-white;
  // }
</style>
