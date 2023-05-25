import { writable } from "svelte/store";
import { decrypt, encrypt } from "../util/crypt";
import { v4 as uuidv4 } from "uuid";

const SELECTED_ORDER: any = import.meta.env.VITE_LOCAL_ORDER;
let initOrder = localStorage.getItem(SELECTED_ORDER);

type Order = {
  id?: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  cart_id: string;
  destination_id: string;
  delivery_price: number;
  paid: boolean;
  approved: boolean;
  created_at: string;
  updated_at: string;
};

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

order.subscribe((value) => {
  // TEST
  const date = new Date();
  value.updated_at = date.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  });
  console.log("ORDER STORE: ", value);
  localStorage.setItem(SELECTED_ORDER, encrypt(JSON.stringify(value)));
});
export { order };
export type { Order };
