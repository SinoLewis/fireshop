import { writable } from "svelte/store";
import type { CartProducts } from "./cart";
import { encrypt, decrypt } from "./cart";
import { v4 as uuidv4 } from "uuid";

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

interface Destination {
  type: string;
  features: Feature;
  bbox: number[];
  metadata: Metadata;
}

interface Feature {
  bbox: number[];
  type: string;
  properties: Properties;
  geometry: Geometry;
}

interface Properties {
  segments: Segment[];
  summary: Summary;
  way_points: number[];
}

interface Segment {
  distance: number;
  duration: number;
  steps: Step[];
}

interface Step {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: number[];
}

interface Summary {
  distance: number;
  duration: number;
}

interface Geometry {
  coordinates: number[][];
  type: string;
}

interface Metadata {
  attribution: string;
  service: string;
  timestamp: number;
  query: Query;
  engine: Engine;
}

interface Query {
  coordinates: number[][];
  profile: string;
  format: string;
}

interface Engine {
  version: string;
  build_date: string;
  graph_date: string;
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

    console.log("STORE INIT Order: ", data);
    // TODO: encrypt cart
    localStorage.setItem(SELECTED_ORDER, encrypt(JSON.stringify(data)));
  }
  // TODO: decrypt cart
  return JSON.parse(decrypt(localStorage.getItem(SELECTED_ORDER)));
}
const order = writable<Order>(getOrder());
const destination = writable({} as Destination);

order.subscribe((value) => {
  localStorage.setItem(SELECTED_ORDER, encrypt(JSON.stringify(value)));
});
export { order, destination };
export type { Order, Address };
