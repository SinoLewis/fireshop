<svelte:options tag="cart-indicator" />

<script lang="ts">
  import { cart } from "../../stores";
</script>

<span>{$cart.cart_total}</span>
