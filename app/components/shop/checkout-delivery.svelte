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
  let result: any;
  let valid_address;
  let working_areas;

  let loading = false;

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
        console.log("GEOAPIFY OBJ:  \n", result);
        console.log("GEOAPIFY RESULTS:  \n", results);
      })
      .catch((error) => console.log("error", error));
  }
  async function handleSelect(e, index) {
    result = results[index];
    addressEl.value = results[index].formatted;
    // TODO: API that can support glovo workingAreas
    valid_address = !!working_areas.find(
      (value) => value.cityName === result.city
    );
    addressValid = valid_address ? true : false;
    toast.set({
      icon: !addressValid ? "❌" : "👍",
      message: !addressValid
        ? `${result.city} \nis not a deliverable city from address\n ${addressEl.value}`
        : `${addressEl.value} is delivearable`,
    });
    results = [] as Result[];
    console.log("SELECTED: ", addressEl.value);
    console.log("VALID: ", valid_address);
  }

  async function handleSubmit(e) {
    // TODO: Handle request formating
    loading = true;
    let request = {
      address: {
        rawAddress: result.formatted,
        cityName: result.city,
      } as CustomerAddress,
      contact: {
        email: emailEl.value,
        name: nameEl.value,
        phone: phoneEl.value,
      } as Contact,
      packageDetails: {} as PackageDetails,
      pickupDetails: {
        address: { rawAddress: "Prestige Plaza, Ngong Road, Nairobi, Kenya" },
      } as PickupDetails,
      price: {
        // TODO: getPrice from
        delivery: { currencyCode: "KSH" },
        parcel: { currencyCode: "KSH", value: $cart.cart_price },
      } as Price,
    };

    try {
      let valid_parcel = await validateParcel(
        request.address,
        request.pickupDetails.address
      );
      if (valid_address && valid_parcel["validationResult"] === "EXECUTABLE") {
        let response = await createParcel(request);
        if (response === null || response === undefined)
          throw new Error(
            "Delivery Creation failed. Check your network connection"
          );
        toast.set({
          icon: "😎",
          message: "Your Order was succesful!",
          type: "success",
        });
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
    // console.log("CONFETTI: ", confetti());
    updateCart($cart);
    working_areas = await workingAreas();
    console.log("Working Areas: \n", working_areas);
  });
</script>

{#if $user}
  <form on:submit|preventDefault={handleSubmit}>
    <h2>Deilivery Details</h2>
    <label for="name">
      <span>Email</span>
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
        on:input={address}
        required
      />
    </label>
    <div class="results">
      {#each results || [] as hit, i}
        <div class="hit" on:click={(e) => handleSelect(e, i)}>
          <span class="hit-title">📍 {hit.formatted}</span>
        </div>
      {/each}
    </div>
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
{:else}
  <no-user />
{/if}

<style lang="scss">
  form {
    @apply grid gap-2 justify-center;
  }

  label {
    @apply input-group;

    span {
      width: 15%;
      @apply bg-primary;
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
  .send {
    @apply btn btn-primary;
  }
  .disabled {
    @apply opacity-50 cursor-not-allowed;
  }
  .results {
    width: 100%;
    @apply float-left;
  }
  .hit {
    @apply btn btn-primary block m-2;
  }
  .hit-title {
    @apply text-lg font-bold;
  }
  // .active {
  //   @apply bg-orange-500 text-white;
  // }
</style>
