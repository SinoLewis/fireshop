<svelte:options tag="supa-signin" />

<script lang="ts">
</script>

<modal-dialog name="signin" esc="true">
  <h1>Login</h1>
  <p>With account:</p>
  <supa-google />
  <p>Or with magic email link:</p>
  <supa-email />
  <p class="footer">
    By signing up, you agree to FireShop's Terms of Service & Privacy Policy.
  </p>
</modal-dialog>

<style>
  .footer {
    @apply text-sm text-gray4;
  }
</style>
