import { createClient, OAuthResponse } from "@supabase/supabase-js";
import {
  toast,
  modal,
  Cart,
  Order,
  CartProducts,
  Geocode,
  Directions,
} from "../stores";
import { sendMessageToWebhook } from "./discord";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loginHandler(promise: Promise<OAuthResponse>) {
  let res: any, serverError: string;
  try {
    res = await promise;
    modal.set(null);
    toast.set({
      message: "Access granted! Logged into the mainframe!",
      type: "success",
    });
  } catch (err) {
    serverError = err.message;
    console.error(err);
    toast.set({
      message: serverError,
      type: "error",
    });
  }
  return { res, serverError };
}

export async function signInWithGoogle() {
  let credential = supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/${window.location.pathname}`,
    },
  });
  return loginHandler(credential);
}

export async function signInWithApple() {
  let credential = supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${window.location.origin}/${window.location.pathname}`,
    },
  });
  return loginHandler(credential);
}

export async function supabaseSignOut() {
  let { error } = await supabase.auth.signOut();
  if (error) sendMessageToWebhook("ERROR", error.message);
  toast.set({
    icon: error ? "❌" : "🫶",
    message: error ? error.message : "Thanks for hanging out, see ya around!",
  });
}

export async function passwordlessSignin(email: string) {
  let res: any, serverError: any;
  let { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/${window.location.pathname}`,
    },
  });
  serverError = error;
  // TEST
  // console.log("SERVER DATA: ", data);
  // console.log("SERVER ERROR: ", data);
  if (!error) {
    res = `Magic signin link sent to ${email}`;
    sendMessageToWebhook("AUTH", `${email} requested a login link`);
  }
  return { res, serverError };
}
export async function updateDestination(
  geocode: Geocode,
  directions: Directions,
  user_id: string
) {
  const date = new Date();
  const dateNow = date.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  });
  try {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("user_id", user_id);
    if (error) throw error;
    const db_destination = {
      user_id: user_id,
      geocode_type: geocode.type,
      label: geocode.features.properties?.label,
      region: geocode.features.properties?.region,
      locality: geocode.features.properties?.locality,
      bbox_coordinates: directions.features[0]?.bbox,
      distance: directions.features[0]?.properties.summary.distance,
      duration: directions.features[0]?.properties.summary.duration,
      updated_at: dateNow,
    };
    if (data[0]?.user_id === user_id) {
      const { data, error }: { data: any; error: any } = await supabase
        .from("destinations")
        .update({ ...db_destination })
        .eq("user_id", user_id)
        .select();
      if (error) throw error;
      // console.log("ORDER update DB: ", data);
      return data[0];
    } else {
      const { data, error }: { data: any; error: any } = await supabase
        .from("destinations")
        .insert(db_destination)
        .select();
      if (error) throw error;
      // console.log("ORDER insert DB: ", data);
      return data[0];
    }
  } catch (error) {
    console.log("DESTINATION update ERROR: ", error);
    sendMessageToWebhook("ERROR", error.message);
  }
}
export async function updateOrder(order: Order): Promise<Order> {
  const date = new Date();
  const dateNow = date.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  });
  const { cart_products, directions, geocode, ...db_order } = order;
  try {
    const destination = await updateDestination(
      geocode,
      directions,
      order.user_id
    );
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order.id);
    if (error) throw error;
    //  TEST
    // console.log("ORDER get DB: ", data);
    if (data[0]?.id === order.id) {
      const { data, error }: { data: any; error: any } = await supabase
        .from("orders")
        .update({
          ...db_order,
          destination_id: destination.id,
          cart_products: Object.values(cart_products).map((v) => v.id),
          id: undefined,
          updated_at: dateNow,
        })
        .eq("id", order.id)
        .select();
      if (error) throw error;
      // console.log("ORDER update DB: ", data);
      return data[0];
    } else {
      const { data, error }: { data: any; error: any } = await supabase
        .from("orders")
        .insert({
          ...db_order,
          destination_id: destination.id,
          cart_products: Object.values(cart_products).map((v) => v.id),
        })
        .select();
      if (error) throw error;
      // console.log("ORDER insert DB: ", data);
      return data[0];
    }
  } catch (error) {
    console.log("ORDER update ERROR: ", error);
    sendMessageToWebhook("ERROR", error.message);
  }
}

async function getPriceById(id) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id);
    if (error) throw error;
    // TEST
    // console.log("PRICE: ", data[0]["price"]);
    return data[0]["price"];
  } catch (error) {
    console.error("PRICE ERROR", error.message);
    sendMessageToWebhook("ERROR", error.message);
  }
}

export async function updateCart(cart: Cart): Promise<Cart> {
  const date = new Date();
  const dateNow = date.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  });
  Object.values(cart.cart_products).forEach(
    async (item) => (item.price = await getPriceById(item.id))
  );
  const { cart_products, ...db_cart } = cart;
  // TODO: Test if its right price with fake html price
  try {
    const { data, error } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", cart.user_id);
    if (error) throw error;
    // TEST
    // console.log("CART get DB: ", data);
    if (data[0]?.id === cart.id) {
      const { data, error }: { data: any; error: any } = await supabase
        .from("carts")
        .update({
          ...db_cart,
          cart_products: Object.values(cart_products).map((v) => v.id),
          id: undefined,
          updated_at: dateNow,
        })
        .eq("user_id", cart.user_id)
        .select();
      if (error) throw error;
      // console.log("CART update DB: ", data);
      return data[0];
    } else {
      const { data, error }: { data: any; error: any } = await supabase
        .from("carts")
        .insert({
          ...db_cart,
          cart_products: Object.values(cart_products).map((v) => v.id),
        })
        .select();
      if (error) throw error;
      // console.log("CART insert DB: ", data);
      return data[0];
    }
  } catch (error) {
    console.log("CART update ERROR: ", error);
    sendMessageToWebhook("ERROR", error.message);
  }
}

async function updateProductQuantity(cart: Cart) {
  Object.values(cart.cart_products).forEach(async (item) => {
    try {
      const { data: product, error: p_error } = await supabase
        .from("products")
        .select("*")
        .eq("id", item.id);
      if (p_error) throw p_error;
      product[0]["quantity"] - item.quantity;
      const { data, error } = await supabase
        .from("products")
        .update({ ...product })
        .eq("id", item.id);
      if (error) throw error;
      // TEST
      //  console.log("PRODUCTS update: ", data);
    } catch (error) {
      console.log("PRODUCTS update ERROR: ", error);
      sendMessageToWebhook("ERROR", error.message);
    }
  });
}
