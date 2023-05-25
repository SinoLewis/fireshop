<svelte:options tag="supa-signin" />

<script lang="ts">
  import { order } from "../../stores";
  import { supabase } from "../../util/supabase.auth";

  supabase
    .channel("any")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "custom-orders" },
      (payload: any) => {
        if (payload.new?.id === $order.id) {
          $order.delivery_price = payload.new.delivery_price;
          $order.approved = payload.new.approved
          // TEST
          console.log("ORDERS STORE DB CHANGE CHECK: ", $order);
        }
      }
    )
    .subscribe();
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
