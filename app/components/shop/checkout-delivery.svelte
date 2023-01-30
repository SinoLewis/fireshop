<svelte:options tag="checkout-delivery" />

<script lang="ts">
  import {
    cart,
    user,
    parcel,
    validateParcel,
    createParcel,
    workingAreas,
    Contact,
    PackageDetails,
    Price,
    CustomerAddress,
    PickupDetails,
    Result,
  } from "../../stores";
  import { onMount } from "svelte";
  import { updateCart } from "../../util/supabase";
  import { toast } from "../../stores";
  import confetti from "../../util/confetti";

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
  // TODO: button default=blue, all_inputs_valid=green

  let results: any;
  let activeHit = 0;
  let noDelivery = false;

  let loading = false;
  // TODO: Error and confirmation objects w/ properties of input fields
  let confirmation: string;
  let error: string;

  async function validate() {
    emailValid = emailEl.validity.valid;
    phoneValid = phoneEl.validity.valid;
    nameValid = nameEl.validity.valid;
  }

  async function address(e: Event) {
    // TODO: Reduce API calls using setTimeOut
    const KEY = import.meta.env.VITE_GEOAPIFY;
    const q = (e.target as HTMLInputElement).value;
    fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${q}&format=json&apiKey=${KEY}`
    )
      .then((response) => response.json())
      .then((result) => {
        results = result.results;
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }
  async function handleSelect(e, index) {
    addressEl.value = results[index].formatted;
    results = [] as Result[];
    addressValid = true;
    console.log("SELECTED: ", addressEl);
  }

  async function handleSubmit(e) {
    // TODO: Handle request formating
    loading = true;
    let request = {
      address: { rawAddress: addressEl.value } as CustomerAddress,
      contact: {
        email: emailEl.value,
        name: nameEl.value,
        phone: phoneEl.value,
      } as Contact,
      packageDetails: {} as PackageDetails,
      pickupDetails: {} as PickupDetails,
      price: {} as Price,
    };

    try {
      let working_areas = await workingAreas();
      // TODO: API that can support glovo workingAreas
      let valid_address = !!working_areas.find(
        (value) => value.code === request.address.country
      );
      let valid_parcel = await validateParcel(
        request.address,
        request.pickupDetails.address
      );
      if (valid_address && valid_parcel["validationResult"] === "EXECUTABLE") {
        createParcel(request);
        toast.set({
          icon: "😎",
          message: "Your Order was succesful!",
          type: "success",
        });
      } else {
        throw new Error(`Address: ${emailEl.value} is not Deliverable`);
      }
    } catch (error) {
      toast.set({
        icon: "❌",
        message: error.message,
        type: "error",
      });
    }
    loading = false;
    // error = serverError;
    // confirmation = res;
  }

  onMount(async () => {
    // TODO: if cart change
    console.log("CONFETTI: ", confetti())
    updateCart($cart);
  });
</script>

{#if $user}
  <form on:submit|preventDefault={handleSubmit}>
    <label for="name">Name</label>
    <input
      class="input"
      type="text"
      name="name"
      bind:this={nameEl}
      on:input={validate}
      required
    />
    <label for="phone">Phone</label>
    <input
      class="input"
      type="tel"
      name="phone"
      placeholder="254712345678"
      bind:this={phoneEl}
      on:input={validate}
      required
    />
    <label for="email">Email</label>
    <input
      class="input"
      type="email"
      name="email"
      value={$user.email}
      bind:this={emailEl}
      on:input={validate}
      required
    />
    <label for="address">Address</label>
    <input
      class="input"
      type="text"
      name="address"
      placeholder="Address"
      bind:this={addressEl}
      on:input={address}
      required
    />
    <div class="results">
      {#each results || [] as hit, i}
        <a
          class="hit"
          class:active={i === activeHit}
          on:mouseover={() => (activeHit = i)}
          on:focus={() => (activeHit = i)}
          on:click={(e) => handleSelect(e, i)}
        >
          <span class="hit-title">📍 {hit.formatted}</span>
        </a>
      {/each}
    </div>
    <input
      class="btn"
      type="submit"
      value={loading ? "sending..." : "send"}
      class:disabled={!emailValid ||
        !phoneValid ||
        !addressValid ||
        !nameValid ||
        loading}
    />
  </form>
{:else}
  <no-user />
{/if}

<style lang="scss">
  form {
    width: 100%;
    @apply grid justify-center;
  }
  .input {
    // width: 80%;
    @apply block bg-gray7 bg-opacity-30 text-white text-lg py-3 px-1 border-b-4 border-b-white border-t-0 border-r-0 border-l-0 rounded-none outline-none focus-visible:outline-none;
  }
  // @media screen and (min-width: 640px) {
  //   .input {
  //     width: 50%;
  //   }
  // }
  label {
    @apply text-gray3 font-bold;
  }
  input[type="email"]:valid,
  input[type="tel"]:valid,
  input[type="text"]:valid {
    @apply border-b-green-500;
  }
  .btn {
    @apply bg-blue-500 font-sans text-white font-bold inline-block text-center shadow-md px-4 py-3 my-2 w-auto border-none cursor-pointer hover:bg-blue-500;
  }
  .disabled {
    @apply opacity-50 cursor-not-allowed;
  }
  .results {
    @apply max-w-full float-left;
  }
  .hit {
    @apply block no-underline font-sans p-4 my-2 border bg-gray7 bg-opacity-50 shadow-md transition-all;
  }
  .hit-title {
    @apply text-lg font-bold;
  }
  .active {
    @apply bg-orange-500 text-white;
  }
</style>
