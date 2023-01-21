import { products } from "./products";
import { writable } from "svelte/store";
import CryptoJS from "crypto-js";
const SELECTED_CART: any = import.meta.env.VITE_LOCAL_CART;
const KEY: any = import.meta.env.VITE_LOCAL_KEY;
// TODO: decrypt cart
let initCart = localStorage.getItem(SELECTED_CART);

interface CartProducts {
  [key: string]: {
    id: string;
    price: number;
    quantity: number;
    total_price: number;
  };
}

interface Cart {
  id?: string;
  user_id?: string;
  cart_products: CartProducts;
  cart_price: number;
  cart_total: number;
  // is_paid: boolean;
  // ["Checkout", "Paid"];
  created_at: string;
  updated_at: string;
}

function encrypt(text: string) {
  const secret = CryptoJS.AES.encrypt(text, KEY).toString();
  return secret;
}
function decrypt(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

function getCart(): Cart {
  if (!initCart) {
    const date = new Date();
    const dateNow = date.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "full",
    });
    const data = {
      id: self.crypto.randomUUID(),
      cart_price: 0,
      cart_total: 0,
      cart_products: {},
      created_at: dateNow,
      updated_at: dateNow,
    } as Cart;

    console.log("STORE INITCART: ", data);
    // TODO: encrypt cart
    localStorage.setItem(SELECTED_CART, encrypt(JSON.stringify(data)));
  }
  // TODO: decrypt cart
  return JSON.parse(decrypt(localStorage.getItem(SELECTED_CART)));
}
const cart = writable<Cart>(getCart());
