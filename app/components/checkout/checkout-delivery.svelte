<svelte:options tag="checkout-delivery" />

<script lang="ts">
  import { sendMessageToWebhook } from "../../util/discord";
  import {
    toast,
    user,
    order,
    checkout,
    geocode,
    directions,
  } from "../../stores";
  import { onMount } from "svelte";
  import { supabase } from "../../util/supabase";

  const KEY = import.meta.env.VITE_OPEN_ROUTE;

  let emailEl: HTMLInputElement;
  let nameEl: HTMLInputElement;
  let phoneEl: HTMLInputElement;
  let addressEl: HTMLInputElement;
  $: isFormValid = false;
  // TODO: default=white, valid=green, error_on_submit=red
  let loading = false;

  let addressValue = $order.geocode
    ? $order.geocode.features.properties.label
    : "";
  // let addressValue = $order.geocode
  //   ? $order.geocode.features.properties.name +
  //     "," +
  //     $order.geocode.features.properties?.region
  //   : "";
  let counter = 1;

  onMount(() => {
    isFormValid =
      nameEl.validity.valid &&
      phoneEl.validity.valid &&
      emailEl.validity.valid &&
      !!$order.geocode.features?.properties.label;
    // !!$order.geocode.features?.properties.name;

    console.log("INPUT VALIDITY NAME: ", nameEl.validity.valid);
    console.log("INPUT VALIDITY PHONE: ", phoneEl.validity.valid);
    console.log("INPUT VALIDITY EMAIL: ", emailEl.validity.valid);
    console.log("INPUT VALIDITY ADDRESS: ", addressEl.validity.valid);
    console.log("FORM VALIDITY: ", isFormValid);
    console.log("ORDER STORE: ", $order);
  });

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  async function getAddressHits(query) {
    try {
      const body = {
        place: query,
      };
      const { data, error } = await supabase.functions.invoke("ors-geocode", {
        body: JSON.stringify(body),
      });
      if (error) throw error;
      geocode.set(data["data"]);
      console.log(data);
      console.log(`API REQ NO: ${query}, ${counter++}`);
    } catch (error) {
      console.log("OSM GEOCODE ERROR: ", error);
      sendMessageToWebhook("ERROR", error.message);
    }
  }
  const debouncedSearch = debounce(getAddressHits, 2500);

  const handleAddress = (e: Event) => {
    const q = (e.target as HTMLInputElement).value;
    debouncedSearch(q);
  };
  async function setAddress(e, index) {
    const destination = $geocode.features[index];
    $geocode.features = destination;
    $order.geocode = $geocode;
    addressEl.value = destination.properties.label;
    // addressEl.value =
    //   destination.properties.name + "," + destination.properties.region;
    calculateDirections($order.geocode.features.geometry.coordinates);
    toast.set({
      icon: "👍",
      message: `${$geocode.features.properties.label} set as delivery location`,
    });
    console.log("GEOCODE STORE: ", $geocode);
  }

  async function calculateDirections(coordinates: number[]) {
    let pickupAddress = [36.786911, -1.300596];

    try {
      const body = {
        start: `${pickupAddress[0]},${pickupAddress[1]}`,
        end: `${coordinates[0]},${coordinates[1]}`,
      };
      const { data, error } = await supabase.functions.invoke("ors-directions", {
        body: JSON.stringify(body),
      });
      if (error) throw error;
      directions.set(data["data"]);
      $order.directions = $directions;
      console.log("DIRECTIONS STORE: ", $directions);
    } catch (error) {
      console.log("OSM DIRECTIONS ERROR: ", error);
      sendMessageToWebhook("ERROR", error.message);
    }
  }

  async function handleSubmit(e) {
    loading = true;
    setTimeout(() => {
      try {
        if (isFormValid) {
          checkout.set(2);
          toast.set({
            icon: "😎",
            message: "Your Delivery details are set succesful!",
            type: "success",
          });
          // TEST
          // console.log("ORDER STORE AFTER: ", $order);
        } else {
          if (!nameEl.validity.valid) throw new Error(`Name value is empty`);
          else if (!phoneEl.validity.valid)
            throw new Error(`Phone value is empty`);
          else if (!emailEl.validity.valid)
            throw new Error(`Email value is empty`);
          else throw new Error(`Address value is not selected`);
        }
      } catch (error) {
        toast.set({
          icon: "❌",
          message: error.message,
          type: "error",
        });
      }
      loading = false;
      console.log("Delayed execution");
    }, 2000);
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
          bind:value={addressValue}
          on:input={handleAddress}
          required
        />
      </label>
      {#if Array.isArray($geocode?.features)}
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
                {#each $geocode?.features || [] as hit, i}
                  <tr>
                    <th>📍</th>
                    <td on:click={(e) => setAddress(e, i)}
                      >{hit.properties?.label}</td
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
      <!-- <button class:animate={loading}>Testing...</button> -->
      <button on:click={handleSubmit} class:animate={loading} class="send"
        >{loading ? "proceeding..." : "proceed to order"}</button
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
  .animate {
    @apply animate-spin;
  }
  .send {
    @apply btn bg-green-500 mx-4 px-4 py-2 text-xl font-display text-white hover:bg-info-content drop-shadow-[6px_6px_0_black] hover:drop-shadow-[0_0_7px_rgba(168,85,247,0.5)] transition-all duration-300;
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
