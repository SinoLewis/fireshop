import { products } from "./products";
import { writable } from "svelte/store";

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
const cart = writable<Cart>(null);
