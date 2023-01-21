import { writable } from "svelte/store";
import { toast } from "../stores";

interface Parcel {
  address: CustomerAddress;
  cityCode?: string;
  contact: Contact;
  label?: string;
  packageDetails?: PackageDetails;
  packageId?: number;
  partnerId?: number;
  pickupDetails?: PickupDetails;
  price: Price;
  status?: Status;
  trackingNumber?: string;
}

interface CustomerAddress {
  cityName?: string;
  country?: string;
  details?: string;
  postalCode?: number;
  rawAddress: string;
  formattedAddress?: string;
  streetName?: string;
  streetNumber?: number;
  latitude?: number;
  longitude?: number;
}

interface Contact {
  email: string;
  name: string;
  phone: string;
}

interface PackageDetails {
  contentType: string;
  description: string;
  parcelValue: number;
  weight: number;
}

interface PickupDetails {
  address: PickupAddress;
  pickupOrderCode?: string;
  pickupTime?: string;
}
//
interface PickupAddress {
  cityName?: string;
  country?: string;
  details?: string;
  postalCode?: number;
  rawAddress: string;
  formattedAddress?: string;
  streetName?: string;
  streetNumber?: number;
  latitude?: number;
  longitude?: number;
}

interface Price {
  delivery: Delivery;
  parcel: Parcel;
}

interface Delivery {
  currencyCode: string;
  value: number;
}

interface Parcel {
  currencyCode: string;
  value: number;
}

interface Status {
  createdAt: string;
  deliveryAt: string;
  lastUpdateAt: string;
  location: string;
  locationChangeHistory: LocationChangeHistory[];
  state: string;
  stateChangeHistory: StateChangeHistory[];
}

interface LocationChangeHistory {
  changeType: string;
  date: string;
  reason: string;
  value: string;
}

interface StateChangeHistory {
  changeType: string;
  date: string;
  reason: string;
  value: string;
}

interface VerifyParcel {
  address: CustomerAddress;
  pickupDetails: PickupDetails;
}
interface Asignee {
  courierName: string;
  phone: number;
}
interface Position {
  latitude: number;
  longitude: number;
}
interface Courier {
  assignedCourier: Asignee;
  position: Position;
  link: string;
}

interface Simulate {
  success: {
    code: string;
    description: string;
  };
  fail: {
    code: string;
    description: string;
  };
}

// TODO: if cancelParcel; if < ON_DELIVERY; set parcel null
const parcel = writable<Parcel>(null);
const courier = writable<Courier>(null);
// TODO: DEV ONLY
const simulate = writable<Simulate>(null);
