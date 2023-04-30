import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();
const GLOVO_KEY = process.env.GLOVO_KEY;

const axiosClient = axios.create({
  baseURL: "https://stageapi.glovoapp.com",
  // baseURL: "https://api.glovoapp.com",
  headers: { "Content-Type": "application/json", Authorization: GLOVO_KEY },
});

// orders procedures
export async function updateOrderStatus(
  store_id: string,
  order_id: string,
  body: object
) {
  try {
    const response = await axiosClient.put(
      `/webhook/stores/${store_id}/orders/${order_id}/status`,
      body
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function updateOrderProducts(
  store_id: string,
  order_id: string,
  body: object
) {
  try {
    const response = await axiosClient.post(
      `/webhook/stores/${store_id}/orders/${order_id}/replace_products`,
      body
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// TODO: Get auth webhook url
// notification procedure

// menu procdures
export async function uploadMenu(store_id: string, body: object) {
  try {
    const response = await axiosClient.post(
      `/webhook/stores/${store_id}/menu`,
      body
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function verifyMenu(store_id: string, transaction_id: string) {
  try {
    const response = await axiosClient.get(
      `/webhook/stores/${store_id}/menu/${transaction_id}`
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.dir(error);
  }
}

export async function validateMenu(body: object) {
  try {
    const response = await axiosClient.post(`/paris/menu/validate`, body);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// items procdures
export async function updateItemProduct(
  store_id: string,
  product_id: string,
  body: object
) {
  try {
    const response = await axiosClient.patch(
      `/webhook/stores/${store_id}/products/${product_id}`,
      body
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function updateItemAttributes(
  store_id: string,
  attr_id: string,
  body: object
) {
  try {
    const response = await axiosClient.patch(
      `/webhook/stores/${store_id}/attributes/${attr_id}`,
      body
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function updateBulkItems(store_id: string, body: object) {
  try {
    const response = await axiosClient.post(
      `/webhook/stores/${store_id}/menu/updates`,
      body
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getBulkItems(store_id: string, transaction_id: string) {
  try {
    const response = await axiosClient.get(
      `/webhook/stores/${store_id}/menu/updates/${transaction_id}`
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.dir(error);
  }
}

// scheduling procedures
export async function getScheduleStore(store_id: string) {
  try {
    const response = await axiosClient.get(
      `/webhook/stores/${store_id}/schedule`
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.dir(error);
  }
}
export async function updateCloseStore(store_id: string, body: object) {
  try {
    const response = await axiosClient.put(
      `/webhook/stores/${store_id}/closing`,
      body
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.dir(error);
  }
}
export async function getCloseStore(store_id: string) {
  try {
    const response = await axiosClient.get(
      `/webhook/stores/${store_id}/closing`
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function deleteTempClose(store_id: string) {
  try {
    const response = await axiosClient.delete(
      `/webhook/stores/${store_id}/closing`
    );
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}
