<svelte:options tag="testin-button" />

<script lang="ts">
  let image = null;
  $: image;

  const preload: any = async (src) => {
    const resp = await fetch(src);
    const blob = await resp.blob();

    return new Promise(function (resolve, reject) {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(`Error: ,${error}`);
    });
  };
</script>

{#await preload("https://picsum.photos/200/300")}
  <img
    src="https://yeodnfioatjhhthgvaxt.supabase.co/storage/v1/object/public/fireshop-images/default-cover.png"
    alt="default image"
  />
{:then base64}
  <img src={base64} alt="Alright Buddy!" />
  <!-- 	<code>{base64}</code> -->
{/await}
