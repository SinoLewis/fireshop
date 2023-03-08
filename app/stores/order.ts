import { writable } from "svelte/store";
import type { CartProducts } from "./cart";
import { encrypt, decrypt } from "./cart";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../util/supabase";
import { cart, user } from "./";

const SELECTED_ORDER: any = import.meta.env.VITE_LOCAL_ORDER;
let initOrder = localStorage.getItem(SELECTED_ORDER);

type Order = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: Address;
  cart_products: CartProducts;
  delivery_price: number;
  cart_price: number;
  total_price: number;
  paid: boolean;
  approved: boolean;
  created_at: string;
  updated_at: string;
};

interface Address {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon: string;
}

function getOrder(): Order {
  if (!initOrder) {
    const date = new Date();
    const dateNow = date.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "full",
    });
    const data = {
      id: uuidv4(),
      email: "",
      phone: "",
      name: "",
      address: {
        display_name: "",
      },
      created_at: dateNow,
      updated_at: dateNow,
    } as Order;
    // TEST
    // console.log("STORE INIT Order: ", data);
    localStorage.setItem(SELECTED_ORDER, encrypt(JSON.stringify(data)));
  }
  return JSON.parse(decrypt(localStorage.getItem(SELECTED_ORDER)));
}
const order = writable<Order>(getOrder());

supabase
  .channel("any")
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "orders" },
    (payload: any) => {
      order.subscribe((value) => {
        if (payload.new?.id === value.id) {
          value = payload.new;
          // TEST
          console.log("ORDERS DB APPROVED CHECK: ", value);
        }
      });
    }
  )
  .subscribe();

order.subscribe((value) => {
  cart.subscribe((c) => {
    value.cart_price = c.cart_price;
    value.cart_products = c?.cart_products;
  });
  user.subscribe((u) => {
    value.email = u?.email;
  });
  // TEST
  console.log("ORDER STORE: ", value);
  localStorage.setItem(SELECTED_ORDER, encrypt(JSON.stringify(value)));
});
export { order };
export type { Order, Address };
