import { writable } from "svelte/store";
import { toast } from ".";

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
  delivery: DeliveryPrice;
  parcel: ParcelPrice;
}

interface DeliveryPrice {
  currencyCode: string;
  value: number;
}

interface ParcelPrice {
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

interface WorkingArea {
  code: string;
  cityName: string;
  polygons: string[];
  workingTime: WorkingTime;
}

interface WorkingTime {
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

// Addres API types
interface Result {
  datasource: Datasource;
  country: string;
  country_code: string;
  lon: number;
  lat: number;
  name: string;
  formatted: string;
  address_line1: string;
  address_line2: string;
  category: string;
  timezone: Timezone;
  result_type: string;
  rank: Rank;
  place_id: string;
  bbox: Bbox;
}

interface Datasource {
  sourcename: string;
  attribution: string;
  license: string;
  url: string;
}

interface Timezone {
  name: string;
  name_alt: string;
  offset_STD: string;
  offset_STD_seconds: number;
  offset_DST: string;
  offset_DST_seconds: number;
  abbreviation_STD: string;
  abbreviation_DST: string;
}

interface Rank {
  importance: number;
  confidence: number;
  match_type: string;
}

interface Bbox {
  lon1: number;
  lat1: number;
  lon2: number;
  lat2: number;
}

// TODO: if cancelParcel; if < ON_DELIVERY; set parcel null
const parcel = writable<Parcel>(null);
const courier = writable<Courier>(null);
const workAreas = writable<WorkingArea[]>(null);
const valid_parcel = writable(false);
// TODO: DEV ONLY
const simulate = writable<Simulate>(null);

async function clearCart() {
  const SELECTED_CART: any = import.meta.env.VITE_LOCAL_CART;
  localStorage.removeItem(SELECTED_CART);
}

// TODO: Limit API call to 10 mins
const authToken = async () => {
  const VITE_GLOVO_KEY: any = import.meta.env.VITE_GLOVO_KEY;
  const VITE_GLOVO_SEC: any = import.meta.env.VITE_GLOVO_SEC;
  let body = {
    grantType: "client_credentials",
    clientId: VITE_GLOVO_KEY,
    clientSecret: VITE_GLOVO_SEC,
  };

  try {
    let response = await fetch("http://172.18.0.17:3000/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let data = await response.json();
    if (response.status === 200 || 201) {
      return data;
    } else {
      console.log(`POST: ${response.status}: ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error("POST: ", error.message);
    return;
  }
};
const createParcel = async (token: string, body: Parcel) => {
  try {
    let response = await fetch("http://172.18.0.17:3000/parcels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
      return null;
    }
  } catch (error) {
    console.error("POST: ", error.message);
    return;
  }
};
const validateParcel = async (
  token: string,
  address: CustomerAddress,
  pickupDetails: PickupDetails
) => {
  try {
    let response = await fetch("http://172.18.0.17:3000/parcels/validation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({ address, pickupDetails }),
      body: JSON.stringify({
        address: {
          cityName: "Madrid",
          rawAddress: "Madrid, Spain",
        },
        pickupDetails: {
          address: {
            rawAddress: "Prestige Plaza, Ngong Road, Nairobi, Kenya",
          },
        },
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      parcel.update((value) => {
        return {
          ...value,
          pickupDetails: data.pickupDetails,
          address: data.address,
        };
      });
      if (data["validationResult"] === "EXECUTABLE") valid_parcel.set(true);
      console.log("POST: ", data);
      return data;
    } else {
      console.log(`POST: ${response.status}: ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error("POST: ", error.message);
    return;
  }
};
const workingAreas = async (token: string): Promise<WorkingArea[]> => {
  try {
    const response = await fetch(
      "http://172.18.0.17:3000/parcels/working-areas",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      workAreas.update((value) => {
        return { ...value, workingAreas: data.workingAreas };
      });
      console.log("GET: ", data);
      return data.workingAreas;
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return;
  }
};
const cancelParcel = async (token: string, trackingNumber: string) => {
  try {
    const response = await fetch(
      `http://172.18.0.17:3000/parcels/${trackingNumber}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      parcel.set(null);
      console.log("GET: ", data);
      return "SUCCESS";
    } else {
      console.log(`ERROR: ${response.status}: ${response.statusText}`);
      return { code: response.status, description: response.statusText };
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return;
  }
};
const statusParcel = async (
  token: string,
  trackingNumber: string
): Promise<StateChangeHistory> => {
  try {
    const response = await fetch(
      `http://172.18.0.17:3000/parcels/${trackingNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      return null;
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return;
  }
};
const infoCourier = async (
  token: string,
  trackingNumber: string
): Promise<Asignee> => {
  try {
    const response = await fetch(
      `http://172.18.0.17:3000/courier/${trackingNumber}/info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      return null;
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return;
  }
};
const postionCourier = async (
  token: string,
  trackingNumber: string
): Promise<Position> => {
  try {
    const response = await fetch(
      `http://172.18.0.17:3000/courier/${trackingNumber}/position`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      return null;
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return;
  }
};

const trackLink = async (
  token: string,
  trackingNumber: string
): Promise<string> => {
  try {
    const response = await fetch(
      `http://172.18.0.17:3000/courier/${trackingNumber}/link`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      return null;
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return;
  }
};

const simSuccess = async (token: string, trackingNumber: string) => {
  try {
    const response = await fetch(
      `http://172.18.0.17:3000/sim/${trackingNumber}/success`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      return null;
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return;
  }
};
const simFail = async (token: string, trackingNumber: string) => {
  try {
    const response = await fetch(
      `http://172.18.0.17:3000/sim/${trackingNumber}/fail`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      return null;
    }
  } catch (error) {
    console.error("GET: ", error.message);
    return;
  }
};

// const testPost = async (user) => {
//   try {
//     const response = await fetch("http://172.18.0.17:3000/users/21", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ user }),
//     });
//     const data = await response.json();
//     if (response.status === 200) {
//       console.log("GET: ", data);
//     } else {
//       console.log(`ERROR: ${response.status}: ${response.statusText}`);
//       return null;
// }
//   } catch (error) {
//     console.error("GET: ", error.message);
//     return ;
//   }
// };

// const testGet = async () => {
//   try {
//     const response = await fetch("http://172.18.0.17:3000/users/21", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const data = await response.json();
//     if (response.status === 200) {
//       console.log("GET: ", data);
//       return data.position;
//     } else {
//       console.log(`ERROR: ${response.status}: ${response.statusText}`);
//       return null;
//     }
//   } catch (error) {
//     console.error("GET: ", error.message);
//     return ;
//   }
// };
export {
  parcel,
  authToken,
  valid_parcel,
  validateParcel,
  createParcel,
  workingAreas,
  cancelParcel,
};

export type {
  Parcel,
  Result,
  CustomerAddress,
  Contact,
  PackageDetails,
  Price,
  PickupDetails,
};
