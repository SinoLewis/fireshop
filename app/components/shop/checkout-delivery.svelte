<svelte:options tag="checkout-delivery" />

<script lang="ts">
  import { cart, user, PickupAddress, Parcel } from "../../stores";
  import { onMount } from "svelte";
  import { supabase } from "../../util/supabase";

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
  let pickupAddress: PickupAddress;

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
    addressEl = results[index].formatted;
    results = [];
    addressValid = true;
    console.log("SELECTED: ", addressEl);
  }

  async function handleSubmit(e) {
    // TODO: address.rawAddress, contact, packageDetails(!), packageID(!), pickupDetails.address price
    let request: Parcel = {
      address: {},
      contact: {},
      packageDetails: {},
      packageID: "",
      pickupDetails: {
        address: pickupAddress,
      },
      price: {},
    };
    const email = emailEl.value;
    const name = nameEl.value;
    const phone = phoneEl.value;
    const address = addressEl.value;
    loading = true;
    // const { res, serverError } = await sendPasswordlessEmail(email, url);
    loading = false;
    // error = serverError;
    // confirmation = res;
  }

  async function getPriceById(id) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id);
      if (error) throw error;
      console.log("PRICE: ", data[0]["price"]);
      return data[0]["price"];
    } catch (error) {
      console.error("PRICE ERROR", error.message);
    }
  }
  async function insertCart() {
    try {
      const { data, error } = await supabase
        .from("carts")
        .insert($cart)
        .select();
      if (error) throw error;
      console.log("CART upsert DB: ");
      console.dir(data);
    } catch (error) {
      console.log("CART upsert CHECKOUT: ", error);
    }
  }
  async function updateCart() {
    // TODO: getPrice for all cart items; change obj of cart_products with db prices
    // const price = await getPriceById('item-123')

    // TODO: Update cart db with the valid price data
    // const { data, error } = await supabase.from('carts').insert([$cart])
    try {
      const { data, error } = await supabase
        .from("carts")
        .update({ ...$cart })
        .eq("user_id", $cart.user_id)
        .select();
      if (error) insertCart();
      // if (error) throw error;
      console.log("CART update DB: ");
      console.dir(data);
    } catch (error) {
      console.log("CART update ERROR: ", error);
    }
  }
  // TODO: Push cart items to delivery store
  onMount(async () => {
    // getPriceById("4b195327-2353-44fd-ba0a-d9754ed91e10");
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
      bind:value={addressEl}
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
    @apply grid justify-center;
  }
  .input {
    @apply bg-gray7 bg-opacity-30 text-white text-lg block py-3 px-1 w-96 border-b-4 border-b-white border-t-0 border-r-0 border-l-0 rounded-none outline-none focus-visible:outline-none;
  }
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
