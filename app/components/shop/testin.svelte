<svelte:options tag="testin-button" />

<script lang="ts">
  import { supabase } from "../../util/supabase";
  import { onMount } from "svelte";

  let addressEl: HTMLInputElement;

  const edgeTest = async () => {
    const body = {
      start: "8.681495,49.41461",
      end: "8.687862,49.420318",
    };
    try {
      const { data, error } = await supabase.functions.invoke(
        "ors-directions",
        {
          body: JSON.stringify(body),
        }
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn("Edge Testin Error", error);
    }
  };
  onMount(async () => {
    console.log("Testin", await edgeTest());
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

  // Throttle function that limits the number of requests sent per second to 5
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        inThrottle = true;
        func.apply(this, args);
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  let index = 0;

  async function getAddressHits(query) {
    try {
      // fetch(`http://localhost:3000/geocode/${query}`)
      fetch(`http://localhost:3000/directions/${query}`)
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      console.log(`API REQ NO: ${query}, ${index++}`);
    } catch (error) {
      console.log("OpenStreetMap ERROR: ", error);
    }
  }
  const debouncedSearch = debounce(getAddressHits, 2500);
  const throttledSearch = throttle(getAddressHits, 2000);

  const handleInput = (e: Event) => {
    const q = (e.target as HTMLInputElement).value;
    debouncedSearch(q);
  };
</script>

<h1>Testin: Limiited Cached API request</h1>
<form on:submit|preventDefault>
  <label for="address">
    <span>Debounced</span>
    <input
      class="input-field"
      type="text"
      name="address"
      placeholder="Address"
      bind:this={addressEl}
      on:input={handleInput}
      required
    />
  </label>
  <label for="address">
    <span>Throttle</span>
    <input
      class="input-field"
      type="text"
      name="address"
      placeholder="Address"
      bind:this={addressEl}
      on:input={throttledSearch}
      required
    />
  </label>
</form>
