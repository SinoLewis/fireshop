<svelte:options tag="checkout-delivery" />

<script lang="ts">
  import { onMount } from "svelte";
  import { updateCart, updateMerchant } from "../../util/supabase";
  import { sendMessageToWebhook, sendOrderToWebhook } from "../../util/discord";
  import { toast, user, merchant, destination, cart } from "../../stores";
  import type { Address } from "../../stores/merchant";

  let emailEl: HTMLInputElement;
  let nameEl: HTMLInputElement;
  let phoneEl: HTMLInputElement;
  let addressEl: HTMLInputElement;

  // TODO: default=white, valid=green, error_on_submit=red
  // let emailValid = () => emailEl.validity.valid;
  let emailValid = $merchant.email ? true : false;
  let phoneValid = $merchant.phone ? true : false;
  let nameValid = $merchant.name ? true : false;
  let addressValid = $merchant.address.display_name ? true : false;

  let loading = false;
  let hits: Address[];
  let hit: Address;
  let pickup = {
    place_id: 129591613,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    osm_type: "way",
    osm_id: 95790444,
    boundingbox: ["-1.3012552", "-1.3001224", "36.7866732", "36.7874179"],
    lat: "-1.3009044",
    lon: "36.78706018120445",
    display_name:
      "Prestige Plaza, Ngong Road, Hurlingham, Nairobi, Nairobi County, Nairobi, 44847, Kenya",
    class: "shop",
    type: "mall",
    importance: 0.20000999999999997,
  };

  onMount(async () => {
    console.log("INIT MERCHANT STORE: ", $merchant, "");
    $merchant.email = $user?.email;
    $merchant.cart_products = $cart.cart_products;
  });
  async function validate() {
    emailValid = emailEl.validity.valid;
    phoneValid = phoneEl.validity.valid;
    nameValid = nameEl.validity.valid;
  }

  async function getAddressHits(e: Event) {
    try {
      addressValid = false;
      const q = (e.target as HTMLInputElement).value;
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json`;
      const response = await fetch(url);
      hits = await response.json();
      console.log("NOMINATIM HITS: ", hits);
    } catch (error) {
      console.log("NOMINATIM ERROR: ", error);
      sendMessageToWebhook("ERROR", error.message);
    }
  }
  async function setAddress(e, index) {
    hit = hits[index];
    addressEl.value = hits[index].display_name;
    $merchant.address = hits[index];
    // TODO: API that can support glovo workingAreas
    toast.set({
      icon: "👍",
      message: `${addressEl.value} set as delivery location`,
    });
    addressValid = addressEl.validity.valid;
    hits.length = 0;
    calculateDirections();
    console.log("SELECTED: ", addressEl.value);
    console.log("MERCHANT STORE: ", $merchant);
  }

  async function handleSubmit(e) {
    loading = true;
    try {
      if (addressValid) {
        sendOrderToWebhook($merchant);
        updateMerchant($merchant);
        toast.set({
          icon: "😎",
          message: "Your Order was succesful!",
          type: "success",
        });
        console.log("MERCHANT STORE: ", $merchant);
      } else {
        throw new Error(`ADDRESS: ${addressEl.value} is unknown`);
      }
    } catch (error) {
      toast.set({
        icon: "❌",
        message: error.message,
        type: "error",
      });
    }
    loading = false;
  }

  async function calculateDirections() {
    try {
      let response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${
          import.meta.env.VITE_OPEN_ROUTE
        }&start=${pickup.lat},${pickup.lon}&end=${$merchant.address.lat},${
          $merchant.address.lon
        }`
      );
      let data = await response.json();
      $destination = data;
      console.log("CALC OPENROUTE: ", $destination);
    } catch (error) {
      console.log("CALC ERROR: ", error.message);
    }
  }
</script>

{#if $user}
  <div class="box">
    <form on:submit|preventDefault>
      <h2>Deilivery Details</h2>
      <label for="name">
        <span>Name</span>
        <input
          class="input-field"
          type="text"
          name="name"
          bind:this={nameEl}
          bind:value={$merchant.name}
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
          bind:value={$merchant.phone}
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
          bind:this={emailEl}
          bind:value={$merchant.email}
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
          bind:value={$merchant.address.display_name}
          on:input={getAddressHits}
          required
        />
      </label>
      {#if hits?.length}
        <div class="results">
          <div class="hit">
            <table>
              <!-- head -->
              <thead>
                <tr>
                  <th />
                  <th>Pick Address</th>
                </tr>
              </thead>
              <tbody>
                {#each hits || [] as hit, i}
                  <tr>
                    <th>📍</th>
                    <td on:click={(e) => setAddress(e, i)}
                      >{hit.display_name}</td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </form>
    <div>
      <h2>Total Cost</h2>
      <user-data />
      <div />
      <button
        class="send"
        class:disabled={!emailValid ||
          !phoneValid ||
          !addressValid ||
          !nameValid ||
          loading}>{loading ? "ordering..." : "order"}</button
      >
    </div>
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
      height: 3.5rem;
      @apply bg-info-content;
    }
    .input-field {
      width: 100%;
      @apply input input-bordered border-b-4 border-b-white border-t-0 border-r-0 border-l-0;
    }
  }
  // input {
  //   height: 56px;
  // }
  input[type="email"]:valid,
  input[type="tel"]:valid,
  input[type="text"]:valid {
    @apply border-b-green-500;
  }
  .confirm {
    @apply select select-bordered select-lg w-full max-w-xs;
  }
  .send {
    @apply btn bg-green-500 mx-4;
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
</style>
