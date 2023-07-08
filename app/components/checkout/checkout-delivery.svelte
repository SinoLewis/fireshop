<svelte:options tag="checkout-delivery" />

<script lang="ts">
  import { error_revolt } from "../../util/revolt";
  import {
    toast,
    user,
    order,
    checkout,
    is_form_valid,
    destination,
    addGeocode,
    addDirection,
  } from "../../stores";
  import { onMount } from "svelte";
  import { supabase } from "../../util/supabase.auth";
  import type { Directions, Geocode } from "../../types";

  const KEY = import.meta.env.VITE_OPEN_ROUTE;

  let emailEl: HTMLInputElement;
  let nameEl: HTMLInputElement;
  let phoneEl: HTMLInputElement;
  let addressEl: HTMLInputElement;
  // TODO: default=white, valid=green, error_on_submit=red
  let loading = false;

  let addressValue = $destination ? $destination.label : "";
  let geocode: Geocode;
  let directions: Directions;
  const tab1 = () => checkout.set(0);

  onMount(() => {
    $is_form_valid =
      !!$order.name && !!$order.email && !!$order.phone && !!$destination.label;
    console.log("ORDER STORE: ", $order);
  });
  function inputValidity() {
    $is_form_valid =
      !!$order.name && !!$order.email && !!$order.phone && !!$destination.label;
    console.log("FORM VALIDITY: ", $is_form_valid);
    console.log("INPUT VALIDITY NAME: ", !!$order.name);
    console.log("INPUT VALIDITY PHONE: ", !!$order.phone);
    console.log("INPUT VALIDITY EMAIL: ", !!$order.email);
    console.log("INPUT VALIDITY ADDRESS: ", !!$destination.label);
  }

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
      const { data, error } = await supabase.functions.invoke(
        "upstash-ors-geocode",
        {
          body: JSON.stringify(body),
        }
      );
      if (error) throw error;
      geocode = data["data"];
      console.log(data);
    } catch (error) {
      console.log("OSM GEOCODE ERROR: ", error);
      error_revolt(error.message);
    }
  }
  const debouncedSearch = debounce(getAddressHits, 2500);

  const handleAddress = (e: Event) => {
    const q = (e.target as HTMLInputElement).value;
    debouncedSearch(q);
  };
  async function setAddress(e, index) {
    addressEl.value = geocode.features[index].properties.label;
    addGeocode(geocode, index);
    calculateDirections(geocode.features[index].geometry.coordinates);
    geocode = null;
    toast.set({
      icon: "👍",
      message: `${addressEl.value} set as delivery location`,
    });
    console.log("GEOCODE API: ", geocode);
  }

  async function calculateDirections(coordinates: number[]) {
    let pickupAddress = [36.786911, -1.300596];

    try {
      const body = {
        start: `${pickupAddress[0]},${pickupAddress[1]}`,
        end: `${coordinates[0]},${coordinates[1]}`,
      };
      const { data, error } = await supabase.functions.invoke(
        "upstash-ors-directions",
        {
          body: JSON.stringify(body),
        }
      );
      if (error) throw error;
      directions = data["data"];
      addDirection(directions);
      console.log("DIRECTIONS API: ", directions);
    } catch (error) {
      console.log("OSM DIRECTIONS ERROR: ", error);
      error_revolt(error.message);
    }
  }

  async function handleSubmit(e) {
    loading = true;
    setTimeout(() => {
      try {
        if ($is_form_valid) {
          checkout.set(2);
          toast.set({
            icon: "😎",
            message: "Your Delivery details are set succesful!",
            type: "success",
          });
        } else {
          console.log("FORM VALIDITY: ", $is_form_valid);
          if (!$order.name) throw new Error(`Name value is empty`);
          else if (!$order.phone) throw new Error(`Phone value is empty`);
          else if (!$order.name) throw new Error(`Email value is empty`);
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
    <form on:input={inputValidity} on:submit|preventDefault>
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
          placeholder="0712345678"
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
      {#if Array.isArray(geocode?.features)}
        <div class="results">
          <div class="hit">
            <table>
              <thead>
                <tr>
                  <th />
                  <th>Pick Address</th>
                </tr>
              </thead>
              <tbody>
                {#each geocode?.features || [] as hit, i}
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
      <div class="btn-flex">
        <button on:click={tab1} class="send blue">Back to Cart</button>
        <button
          on:click={handleSubmit}
          class:animate={loading}
          class="send green"
          >{loading ? "proceeding..." : "proceed to Order"}</button
        >
      </div>
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
  .btn-flex {
    @apply flex gap-2;
  }
  .green {
    @apply bg-green-500;
  }
  .blue {
    @apply bg-blue-500;
  }
  .send {
    @apply btn mx-4 px-4 py-2 text-xl font-display text-white hover:bg-info-content drop-shadow-[6px_6px_0_black] hover:drop-shadow-[0_0_7px_rgba(168,85,247,0.5)] transition-all duration-300;
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
    table {
      @apply table-auto text-left;
    }
  }
  .glow {
    @apply hover:translate-y-[-2px];
  }
</style>
