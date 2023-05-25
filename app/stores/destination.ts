import { writable } from "svelte/store";
import { decrypt, encrypt } from "../util/crypt";
import { v4 as uuidv4 } from "uuid";
import type { Geocode, Directions } from "../types";
import { order } from "./";

const SELECTED_DESTINATION: any = import.meta.env.VITE_LOCAL_DESTINATION;
let initDestination = localStorage.getItem(SELECTED_DESTINATION);

interface Destination {
  id: string;
  user_id: string;
  geocode_type: string;
  label: string;
  region: string;
  locality: string;
  bbox_coordinates: number[];
  distance: number;
  duration: number;
  updated_at: string;
  created_at: string;
}

function getDestination() {
  if (!initDestination) {
    const date = new Date();
    const dateNow = date.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "full",
    });
    const data = {
      id: uuidv4(),
      created_at: dateNow,
      updated_at: dateNow,
    };
    localStorage.setItem(SELECTED_DESTINATION, encrypt(JSON.stringify(data)));
  }
  return JSON.parse(decrypt(localStorage.getItem(SELECTED_DESTINATION)));
}

const destination = writable<Destination>(getDestination());

const addGeocode = (geocode: Geocode, geo_index: number) => {
  destination.update((value) => {
    value.geocode_type = geocode.type;
    value.label = geocode.features[geo_index].properties?.label;
    value.region = geocode.features[geo_index].properties?.region;
    value.locality = geocode.features[geo_index].properties?.locality;

    return { ...value };
  });
};
const addDirection = (directions: Directions) => {
  destination.update((value) => {
    value.bbox_coordinates = directions.features[0]?.bbox;
    value.distance = directions.features[0]?.properties.summary.distance;
    value.duration = directions.features[0]?.properties.summary.duration;

    return { ...value };
  });
};

destination.subscribe((value) => {
  let date = new Date();
  value.updated_at = date.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  });
  order.update((o) => {
    o.destination_id = value.id;
    return { ...o };
  });
  localStorage.setItem(SELECTED_DESTINATION, encrypt(JSON.stringify(value)));
  console.log("DESTINATION STORE", value);
});
export { destination, addGeocode, addDirection };

export type { Destination };
