<svelte:options tag="checkout-tracking" />

<script lang="ts">
  import { user } from "../../stores";
  import jsPDF from "jspdf";
  import html2canvas from "html2canvas";

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
</script>

{#if $user}
  <div
    id="template-section"
    bind:this={printEl}
    style="color: black;background: white;"
  >
    <h3>PDF for Test</h3>
    <p>Here is some content for testing!!</p>
  </div>
  <button on:click={printPDF}>Download PDF</button>
{:else}
  <no-user />
{/if}
