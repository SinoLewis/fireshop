<svelte:options tag="checkout-order" />

<script lang="ts">
  import {
    cart,
    user,
    parcel,
    authToken,
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

  let selectedOption;
  let pickupDetails: PickupDetails = {
    address: { rawAddress: "Prestige Plaza, Ngong Road, Nairobi, Kenya" },
  };
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
      pickupDetails: pickupDetails,
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
        console.log("DELIVERY STORE: ", $parcel);
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
    let token = await authToken();
    console.log("GLOVO AUTH: ", token);
    updateCart($cart);
    working_areas = await workingAreas(token["accessToken"]);
    console.log("Working Areas: \n", working_areas);
  });
</script>

{#if $user}
  <div class="box">
    <div>
      <h2>Confirm Deilivery</h2>
      <select bind:value={selectedOption} class="confirm">
        <!-- <option disabled selected>Large</option> -->
        <option value="glovo">Glovo Delivery</option>
        <option value="no">No Delivery</option>
      </select>
      {#if selectedOption === "glovo"}
        <!--
          <p>
          Glovo offers a 'shop on your behalf' app that promises to let you
          order anything
        </p>
         <div class="img">
          <figure>
            <img src="/img/glovo.webp" alt="glovo" />
          </figure>  
        </div> -->
      {/if}
    </div>
    {#if selectedOption === "glovo"}
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
            on:input={address}
            required
          />
        </label>
        {#if results?.length}
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
                  {#each results || [] as hit, i}
                    <tr>
                      <th>📍</th>
                      <td on:click={(e) => handleSelect(e, i)}
                        >{hit.formatted}</td
                      >
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        {/if}
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
      <div>
        <h2>Pickup Details</h2>
        <h4>Owner: Scott West</h4>
        <h4>Address: {pickupDetails.address.rawAddress}</h4>
        <h4>Phone: 0742021047</h4>
      </div>
    {/if}
  </div>
{:else}
  <no-user />
{/if}

<style lang="scss">
  .box {
    @apply grid justify-items-start grid-cols-1 md:grid-cols-2;
  }
  .img {
    max-height: 4rem;
    figure {
      width: 100%;
      margin: 0px;
      margin-right: 8px;

      @apply object-cover;
    }
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
