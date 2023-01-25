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

interface ValidateParcel {
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
interface WorkAreas {
  workingAreas: WorkingArea[];
}

export interface WorkingArea {
  code: string;
  cityName: string;
  polygons: string[];
  workingTime: WorkingTime;
}

export interface WorkingTime {
  from: string;
  duration: number;
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
const workAreas = writable<WorkAreas>(null);
// TODO: DEV ONLY
const simulate = writable<Simulate>(null);

async function clearCart() {
  const SELECTED_CART: any = import.meta.env.VITE_LOCAL_CART;
  localStorage.removeItem(SELECTED_CART);
}
const createParcel = async (body: Parcel) => {
  try {
    let response = await fetch("http://localhost:3000/parcels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    });
    let data: Parcel = await response.json();
    if (response.status === 200 || 201) {
      parcel.set(data);
      clearCart();
      toast.set({
        icon: "🚚",
        message: "Your Delivery is on the way!",
        type: "success",
      });
      console.log("POST: ", data);
      return data;
    } else {
      toast.set({
        icon: "🚫",
        message: "Delivery error! Confirm your details well.",
        type: "error",
      });
      console.log(`POST: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("POST: ", error.message);
    return null;
  }
};
const validateParcel = async (
  customerAddress: CustomerAddress,
  pickupDetails: PickupAddress
) => {
  try {
    let response = await fetch("http://localhost:3000/parcels/validation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerAddress, pickupDetails }),
    });
    let data: ValidateParcel = await response.json();
    if (response.status === 200) {
      parcel.update((value) => {
        return {
          ...value,
          pickupDetails: data.pickupDetails,
          address: data.address,
        };
      });
      console.log("POST: ", data);
      return data;
    } else {
      console.log(`POST: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("POST: ", error.message);
    return null;
  }
};
const workingAreas = async (trackingNumber: string): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:3000/parcels/working-areas`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      workAreas.update((value) => {
        return { ...value, workingAreas: data.workingAreas };
      });
      console.log("GET: ", data);
      return data.link;
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};
const cancelParcel = async (trackingNumber: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/parcels/${trackingNumber}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      parcel.set(null);
      console.log("GET: ", data);
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
      return { code: response.status, description: response.statusText };
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};
const statusParcel = async (
  trackingNumber: string
): Promise<StateChangeHistory> => {
  try {
    const response = await fetch(
      `http://localhost:3000/parcels/${trackingNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      parcel.set(data);
      console.log("GET: ", data);
      return data.stateChangeHistory;
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};
const infoCourier = async (trackingNumber: string): Promise<Asignee> => {
  try {
    const response = await fetch(
      `http://localhost:3000/courier/${trackingNumber}/info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      courier.update((value) => {
        return { ...value, assignedCourier: data.assignedCourier };
      });
      console.log("GET: ", data);
      return data.assignedCourier;
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};
const postionCourier = async (trackingNumber: string): Promise<Position> => {
  try {
    const response = await fetch(
      `http://localhost:3000/courier/${trackingNumber}/position`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      courier.update((value) => {
        return { ...value, position: data.position };
      });
      console.log("GET: ", data);
      return data.position;
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};

const trackLink = async (trackingNumber: string): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:3000/courier/${trackingNumber}/link`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      courier.update((value) => {
        return { ...value, link: data.link };
      });
      console.log("GET: ", data);
      return data.link;
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};

const simSuccess = async (trackingNumber: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/sim/${trackingNumber}/success`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      simulate.update((value) => {
        return { ...value, success: data.success };
      });
      console.log("GET: ", data);
      return data.success;
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};
const simFail = async (trackingNumber: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/sim/${trackingNumber}/fail`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      simulate.update((value) => {
        return { ...value, fail: data.fail };
      });
      console.log("GET: ", data);
      return data;
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};

const testPost = async (user) => {
  try {
    const response = await fetch("http://localhost:3000/users/21", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });
    const data = await response.json();
    if (response.status === 200) {
      console.log("GET: ", data);
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};

const testGet = async () => {
  try {
    const response = await fetch("http://localhost:3000/users/21", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      console.log("GET: ", data);
      return data.position;
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return null;
  }
};
export { parcel, validateParcel, createParcel, statusParcel };

export type { Parcel, PickupAddress };
