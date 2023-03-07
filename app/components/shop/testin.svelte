<svelte:options tag="testin-button" />

<script lang="ts">
</script>

<!-- The button to open modal -->
<label for="my-modal">open modal</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal" class="toggle" />
<div class="popup">
  <div class="box">
    <h3>Congratulations random Internet user!</h3>
    <p>
      You've been selected for a chance to get one year of subscription to use
      Wikipedia for free!
    </p>
    <div>
      <label for="my-modal">Yay!</label>
    </div>
  </div>
</div>

<style lang="scss">
  .toggle {
    @apply modal-toggle;
  }
  .popup {
    @apply modal;
  }
  .box {
    @apply modal-box;
    h3 {
      @apply font-bold text-lg;
    }
    p {
      @apply py-4;
    }
    div {
      @apply modal-action;
    }
  }

  label {
    @apply btn;
  }
</style>
