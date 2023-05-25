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
export async function updateOrderStatus(req: any, res: any) {
  const { store_id, order_id } = req.params;
  const body = req.body;
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
export async function updateOrderProducts(req: any, res: any) {
  const { store_id, order_id } = req.params;
  const body = req.body;
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
export async function uploadMenu(req: any, res: any) {
  const { store_id, body } = req.params;
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

export async function verifyMenu(req: any, res: any) {
  const { store_id, transaction_id } = req.params;
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

export async function validateMenu(req: any, res: any) {
  const body = req.body;
  try {
    const response = await axiosClient.post(`/paris/menu/validate`, body);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// items procdures
export async function updateItemProduct(req: any, res: any) {
  const { store_id, product_id } = req.params;
  const body = req.body;
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

export async function updateItemAttributes(req: any, res: any) {
  const { store_id, attr_id } = req.params;
  const body = req.body;
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

export async function updateBulkItems(req: any, res: any) {
  const { store_id } = req.params;
  const body = req.body;
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

export async function getBulkItems(req: any, res: any) {
  const { store_id, transaction_id } = req.params;
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
export async function getScheduleStore(req: any, res: any) {
  const { store_id } = req.params;
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
export async function updateCloseStore(req: any, res: any) {
  const { store_id, order_id, body } = req.params;
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
export async function getCloseStore(req: any, res: any) {
  const { store_id } = req.params;
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
export async function deleteTempClose(req: any, res: any) {
  const { store_id } = req.params;
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
