console.log(
  `%c  
__ _               _                 
/ _(_)_ __ ___  ___| |__   ___  _ __  
| |_| | '__/ _ \/ __| '_ \ / _ \| '_ \ 
|  _| | | |  __/\__ \ | | | (_) | |_) |
|_| |_|_|  \___||___/_| |_|\___/| .__/ 
                               |_|     `,
  "font-family:monospace; color: orange;"
);

// Global code
import "../styles/app.scss";
import flamethrower from "flamethrower-router";
import { scrollSave } from "./util/scroll";
import "./util/key-bindings";

// saves scroll position on navbar
scrollSave();

// Router
export const router = flamethrower({ prefetch: "hover", log: false });

// TEST
// export * from './components/shop/testin.svelte';
// Shop
export * from "./components/shop/cart-buttons.svelte";
export * from "./components/shop/meili-search.svelte";
// AUTH
export * from "./components/shop/supa-email.svelte";
export * from "./components/shop/supa-signin.svelte";
export * from "./components/shop/supa-google.svelte";
// CHECKOUT
export * from "./components/shop/no-user.svelte";
export * from "./components/shop/checkout-tabs.svelte";
export * from "./components/shop/checkout-cart.svelte";
export * from "./components/shop/checkout-delivery.svelte";
export * from "./components/shop/checkout-tracking.svelte";

// UI
export * from "./components/ui/modal-action.svelte";
export * from "./components/ui/modal-dialog.svelte";
export * from "./components/ui/route-loader.svelte";
export * from "./components/ui/toast-message.svelte";
export * from "./components/ui/navbar-toggle.svelte";
export * from "./components/ui/img-reveal.svelte";
export * from "./components/ui/scroll-show.svelte";
export * from "./components/ui/discord-count.svelte";
export * from "./components/ui/scroll-up.svelte";

// Shared
export * from "./components/ui/loading-spinner.svelte";
