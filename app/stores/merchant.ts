import { writable } from "svelte/store";
import type { CartProducts } from "./cart";
import { encrypt, decrypt } from "./cart";
import { v4 as uuidv4 } from "uuid";

const SELECTED_MERCHANT: any = import.meta.env.VITE_LOCAL_MERCHANT;
let initMerchant = localStorage.getItem(SELECTED_MERCHANT);

type Merchant = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: Address;
  cart_products: CartProducts;
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

function getMerchant(): Merchant {
  if (!initMerchant) {
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
    } as Merchant;

    console.log("STORE INIT MERCHANT: ", data);
    // TODO: encrypt cart
    localStorage.setItem(SELECTED_MERCHANT, encrypt(JSON.stringify(data)));
  }
  // TODO: decrypt cart
  return JSON.parse(decrypt(localStorage.getItem(SELECTED_MERCHANT)));
}
const merchant = writable<Merchant>(getMerchant());

merchant.subscribe((value) => {
  localStorage.setItem(SELECTED_MERCHANT, encrypt(JSON.stringify(value)));
});
export { merchant };
export type { Merchant, Address };
