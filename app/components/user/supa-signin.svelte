<svelte:options tag="supa-signin" />

<script lang="ts">
  import { supabase } from "../../util/supabase";
  // import { sendMessageToWebhook } from "../../util/discord";
  import { cart, user, order } from "../../stores";
  import { onMount } from "svelte";

  async function getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      $cart.user_id = data.user ? data.user.id : null;
      user.set(data.user);
      console.log("CHECKOUT USER: ", $user);
      console.log("CHECKOUT CART: ", $cart);
    } catch (error) {
      console.log("USER ERROR: ", error.message);
      // sendMessageToWebhook("ERROR", error.message)
    }
  }
  supabase
    .channel("any")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "orders" },
      (payload: any) => {
        if (payload.new?.id === $order.id) {
          $order = payload.new;
          console.log("ORDERS DB APPROVED: ", $order);
        }
      }
    )
    .subscribe();

  onMount(getUser);
</script>

<modal-dialog name="signin" esc="true">
  <h1>Login</h1>
  <p>With magic email link:</p>
  <supa-email />
  <p>Or with account:</p>
  <supa-google />
  <!-- <apple-signin /> -->
  <!-- TODO: supa-phone -->
  <p class="footer">
    By signing up, you agree to FireShop's Terms of Service & Privacy Policy.
  </p>
</modal-dialog>

<style>
  .footer {
    @apply text-sm text-gray4;
  }
</style>
