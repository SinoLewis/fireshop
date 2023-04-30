<svelte:options tag="meili-search" />

<script lang="ts">
  import { MeiliSearch } from "meilisearch";
  import { modal } from "../../stores";
  import { router } from "../../main";
  import { onMount } from "svelte";
  import { supabase } from "../../util/supabase";
  import { construct_svelte_component } from "svelte/internal";

  const client = new MeiliSearch({
    host: "http://localhost:7700",
  });
  const index = client.index("products");

  let results: any;
  let hits = [];
  let activeHit = 0;
  onMount(async () => {
    return () => {
      window.removeEventListener("keydown", handleSpecialKeys);
    };
  });

  async function search(e: Event) {
    const q = (e.target as HTMLInputElement).value;
    const body = {
      query: q,
    };
    try {
      try {
        const { data, error } = await supabase.functions.invoke("meilisearch", {
          body: JSON.stringify(body),
        });
        if (error) throw error;
        hits = data["hits"];
        activeHit = 0;
      } catch (error) {
        console.warn("MEILISEARCH Edge Error", error);
      }
    } catch (error) {
      console.log("MEILI SEARCH ERROR: ", error);
    }
    // TEST
    // console.log("MEILI: ", results);
  }

  function goUp() {
    activeHit = activeHit <= 0 ? activeHit : activeHit - 1;
  }
  function goDown() {
    activeHit = activeHit >= hits.length - 1 ? activeHit : activeHit + 1;
  }
  function selectHit() {
    if (hits[activeHit]) {
      const url = hits[activeHit].relpermalink;
      router.go(url);
      modal.set(null);
    }
  }
  function handleSpecialKeys(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      goUp();
    }
    if (e.key === "ArrowDown") {
      goDown();
    }
    if (e.key === "Enter") {
      selectHit();
    }
  }
</script>

<svelte:window on:keydown={handleSpecialKeys} />

<modal-dialog name="search">
  <form>
    {#if $modal === "search"}
      <input
        class="input"
        name="search"
        type="text"
        autofocus
        placeholder="Search"
        on:input={search}
      />
    {/if}
  </form>

  <div class="results">
    {#if !results?.totalHits}
      <p class="no-results">No results yet</p>
    {/if}
    {#each hits as hit, i}
      <a
        class="hit"
        href={hit.relpermalink}
        class:active={i === activeHit}
        on:mouseover={() => (activeHit = i)}
        on:focus={() => (activeHit = i)}
      >
        <span class="hit-title">{hit.title}</span>
        <span class="hit-type"> in {hit.category}</span>
        <span class="hit-description">{@html hit._formatted.description}</span>
      </a>
    {/each}
  </div>

  <footer>
    <kbd on:click={selectHit}>↩</kbd> <span class="kbd-text">select</span>
    <kbd on:click={goUp}>↑</kbd>
    <kbd on:click={goDown}>↓</kbd> <span class="kbd-text">navigate</span>
    <kbd on:click={() => modal.set(null)}>esc</kbd>
    <span class="kbd-text">leave</span>
  </footer>
</modal-dialog>

<style lang="scss">
  a,
  a:hover,
  a:focus,
  a:active {
    text-decoration: none;
    color: inherit;
  }
  form {
    @apply overflow-hidden;
  }
  .input {
    @apply bg-gray7 bg-opacity-50 text-white w-full md:w-[768px] font-sans text-xl rounded-none block p-3 
             border-4 border-solid border-t-0 border-r-0 border-l-0 border-b-purple-500 outline-none focus-visible:outline-none mr-2;
  }
  .results {
    @apply max-w-full min-h-[200px];
  }
  .hit {
    @apply block no-underline font-sans p-4 my-2 border bg-gray7 bg-opacity-50 shadow-md transition-all;
  }
  .hit-description {
    @apply text-gray3 text-sm block;
  }
  .hit-title {
    @apply text-lg font-bold;
  }
  .hit-type {
    @apply text-white font-light;
  }
  .no-results {
    @apply text-gray3 text-sm text-center;
  }

  .active {
    @apply bg-orange-500 text-white;
    .hit-description {
      @apply text-white;
    }
  }
  footer {
    @apply text-xs text-gray3 mt-6;
  }
  kbd {
    @apply text-gray3 cursor-pointer text-xs bg-transparent border border-solid rounded-md 
           border-orange-500 bg-opacity-50 p-1.5 hover:bg-orange-500 hover:text-white transition-all;
  }
  .kbd-text {
    @apply mr-3;
  }
</style>
