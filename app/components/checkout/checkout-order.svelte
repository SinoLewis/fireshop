<svelte:options tag="checkout-order" />

<script lang="ts">
  import { user, cart, toast, order } from "../../stores";
  import jsPDF from "jspdf";
  import html2canvas from "html2canvas";

  let items = Object.keys($cart.cart_products);

  let printEl: HTMLDivElement;

  function printPDF() {
    // Select the section to be printed
    // let elementToPrint = document.getElementById("template-section");

    html2canvas(printEl, { width: 240, height: 320 }).then((canvas) => {
      // Create a new PDF document
      let pdf = new jsPDF("p", "pt", [595, 842]);
      // pdf.setFontSize(16);
      // Add the canvas to the PDF
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 211, 298);

      // Open the PDF for downloading
      pdf.save("template.pdf");
    });
  }

  const cancelSubmit = async () => {
    // TODO: Check with glovo when to cancel parcel
    // TODO: If cancel is valid; re-update products.quantity db
    // let status: any = await cancelParcel("tracking-number");
    // if (status === "SUCCESS") {
    //   toast.set({
    //     icon: "😎",
    //     message: "Cancel Order was succesful!",
    //     type: "success",
    //   });
    // }
    // if (status?.code) {
    //   toast.set({
    //     icon: "❌",
    //     message: status.description,
    //     type: "error",
    //   });
    // }
    // TODO: if(status === undefined) Network conn posibly
  };
</script>

{#if $user}
  <div id="template-section" bind:this={printEl}>
    <h2>Total Price: {$cart.cart_price}</h2>
    <ul class="receipt">
      {#each items as item}
        {#if $cart.cart_products[item]}
          <div class="items">
            <img src={$cart.cart_products[item].image} alt={item} />
            <span>
              <h4>{item}</h4>
            </span>
            <span class="price">
              <h4>Ksh {$cart.cart_products[item].total_price | 0}</h4>
            </span>
          </div>
        {/if}
      {/each}
    </ul>
  </div>

  {#if $order?.approved === true}
    <h4>Delivery EXECUTABLE</h4>
    <button class="btn btn-blue glow" on:click={printPDF}>Download PDF</button>
    <modal-action type="open" name="cancel">
      <button class="btn btn-blue btn-sm glow">Cancel Delivery 🚫</button>
    </modal-action>
    <modal-dialog name="cancel" esc="true">
      <h2>Are you Sure you want to cancel the Delivery?</h2>
      <button class="btn btn-red glow" on:click={cancelSubmit}
        >Confirm Cancel</button
      >
    </modal-dialog>
  {:else}
    <h4>Delivery not EXECUTABLE</h4>
  {/if}
{:else}
  <no-user />
{/if}

<style lang="scss">
  .receipt {
    @apply border-4;
  }
  .items {
    img {
      width: 50px;
      height: 50px;
    }
    span {
      @apply px-4 break-words;
    }
    @apply list-none p-4 my-3 bg-gray6 shadow-xl rounded-lg flex justify-between items-center;
  }
  .content {
    // 4 elements in 2 rows: img, desc, price, btns
    // sm: 1st row = 2 cols, 2nd row = btns
    // md: 1st row = 3 cols, 2nd row = btns
    @apply grid gap-x-4 grid-cols-3;
    border: 2px solid #ffffff;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out;
    &:hover {
      border-color: #737373;
    }
    img {
      @apply rounded-l-md w-full object-cover;
    }
    .price {
      @apply text-right px-2;
    }
  }
  .btn {
    @apply bg-white text-black uppercase font-bold inline-flex cursor-pointer text-center shadow-md no-underline px-5 py-2 transition-all duration-150 my-0.5;
    &.glow {
      @apply hover:drop-shadow-[0_0_4px_rgba(225,225,225,0.5)];
    }
  }
  .btn-sm {
    @apply px-3 py-1 text-xs font-sans uppercase font-bold;
  }

  .glow {
    @apply hover:translate-y-[-2px];
  }

  .btn-blue {
    @apply bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700;
    &.glow {
      @apply hover:drop-shadow-[0_0_5px_rgba(59,130,246,0.5)];
    }
  }
  .btn-red {
    @apply bg-red-500 text-white hover:bg-red-600 active:bg-red-700;
    &.glow {
      @apply hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.5)];
    }
  }
</style>
