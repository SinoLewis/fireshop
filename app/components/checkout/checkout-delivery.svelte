<svelte:options tag="checkout-delivery" />

<script lang="ts">
  import { onMount } from "svelte";
  import { updateCart, updateOrder } from "../../util/supabase";
  import { sendMessageToWebhook, sendOrderToWebhook } from "../../util/discord";
  import { toast, user, order, destination, cart } from "../../stores";
  import type { Address } from "../../stores/order";
  import Openrouteservice from "openrouteservice-js";

  let emailEl: HTMLInputElement;
  let nameEl: HTMLInputElement;
  let phoneEl: HTMLInputElement;
  let addressEl: HTMLInputElement;

  // TODO: default=white, valid=green, error_on_submit=red
  // let emailValid = () => emailEl.validity.valid;
  let emailValid = $order.email ? true : false;
  let phoneValid = $order.phone ? true : false;
  let nameValid = $order.name ? true : false;
  let addressValid = $order.address.display_name ? true : false;

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
    console.log("INIT ORDER STORE: ", $order);
    $order.email = $user?.email;
    $order.cart_price = $cart?.cart_price;
    $order.cart_products = $cart?.cart_products;
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
    $order.address = hits[index];
    // TODO: API that can support glovo workingAreas
    toast.set({
      icon: "👍",
      message: `${addressEl.value} set as delivery location`,
    });
    addressValid = addressEl.validity.valid;
    hits.length = 0;
    calculateDirections();
    console.log("SELECTED: ", addressEl.value);
    console.log("ORDER STORE: ", $order);
  }

  async function handleSubmit(e) {
    loading = true;
    try {
      if (addressValid) {
        updateCart($cart);
        console.log("CART STORE: ", $cart);
        updateOrder($order).then(() => ($order.name = $order.phone = ""));
        console.log("ORDER STORE BEFORE: ", $order);
        sendOrderToWebhook($order);

        toast.set({
          icon: "😎",
          message: "Your Order was succesful!",
          type: "success",
        });
        console.log("ORDER STORE AFTER: ", $order);
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
    // TODO: Router to /order
    loading = false;
  }

  async function calculateDirections() {
    try {
      // pickup to add1
      // -1.3009044,36.78706018120445
      // -1.2778674,36.8880893
      // add1 to add2
      // -1.2778674,36.8880893
      // -1.3156695, 36.8984952
      const KEY = import.meta.env.VITE_OPEN_ROUTE;
      let orsDirections = new Openrouteservice.Directions({ api_key: KEY });
      let data = await orsDirections.calculate({
        coordinates: [
          [8.690958, 49.404662],
          [8.687868, 49.390139],
        ],
        profile: "driving-hgv",
        extra_info: ["waytype", "steepness"],
        avoidables: ["highways", "tollways", "ferries", "fords"],
        // avoid_polygons: {
        //   type: "Polygon",
        //   coordinates: [
        //     [
        //       [8.683533668518066, 49.41987949639816],
        //       [8.680272102355957, 49.41812070066643],
        //       [8.683919906616211, 49.4132348262363],
        //       [8.689756393432617, 49.41806486484901],
        //       [8.683533668518066, 49.41987949639816],
        //     ],
        //   ],
        // },
        format: "json",
      });
      // let response = await fetch(
      //   // `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${KEY}&start=${pickup.lat},${pickup.lon}&end=${$order.address.lat},${$order.address.lon}`
      //   `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${KEY}&start=8.681495,49.41461&end=8.687872,49.420318`
      // );
      // let data = await response.json();
      // $destination = { ...data, features: data["features"][0] };
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
          bind:value={$order.name}
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
          bind:value={$order.phone}
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
          bind:value={$order.email}
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
          bind:value={$order.address.display_name}
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
      <h2 class="mg">Total Cost</h2>
      <user-data />
      <div />
      <button
        on:click={handleSubmit}
        class="send"
        class:disabled={!emailValid ||
          !phoneValid ||
          !addressValid ||
          !nameValid ||
          loading}>{loading ? "proceeding..." : "proceed to order"}</button
      >
    </div>
  </div>
{:else}
  <no-user />
{/if}

<style lang="scss">
  .mg {
    @apply mx-4;
  }
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
