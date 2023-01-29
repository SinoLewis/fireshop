import { createClient } from "@supabase/supabase-js";
import { toast, Cart } from "../stores";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loginHandler(error: any) {
  console.log("LOGIN HANDLER: ", error);
  // modal.set(null);
  toast.set({
    icon: error ? "❌" : "👋",
    message: error
      ? error.message
      : "Access granted! Logged into the mainframe!",
    type: error ? "error" : "success",
  });
}

export async function signInWithGoogle() {
  let { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.href,
    },
  });
  loginHandler(error);
}

export async function signInWithApple() {
  let { error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: window.location.href,
    },
  });
  loginHandler(error);
}

export async function supabaseSignOut() {
  let { error } = await supabase.auth.signOut();
  toast.set({
    icon: error ? "❌" : "🫶",
    message: error ? error.message : "Thanks for hanging out, see ya around!",
  });
}

export async function passwordlessSignin(email: string) {
  let res: any, serverError: any;
  let { error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: window.location.href,
    },
  });
  serverError = error;
  if (!error) res = `Magic signin link sent to ${email}`;

  return { res, serverError };
}

async function getPriceById(id) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id);
    if (error) throw error;
    console.log("PRICE: ", data[0]["price"]);
    return data[0]["price"];
  } catch (error) {
    console.error("PRICE ERROR", error.message);
  }
}

export async function updateCart(cart: Cart) {
  Object.values(cart.cart_products).forEach(
    async (item) => (item.price = await getPriceById(item.id))
  );
  // TODO: Test if its right price with fake html price
  try {
    const { data, error } = await supabase
      .from("carts")
      .select("*")
      .eq("id", cart.id);
    if (error) throw error;
    if (data[0]["id"] === cart.id) {
      const { data, error } = await supabase
        .from("carts")
        .update({ ...cart })
        .eq("user_id", cart.user_id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("carts").insert(cart);
      if (error) throw error;
    }
    console.log("CART update DB: ", data);
  } catch (error) {
    console.log("CART update ERROR: ", error);
  }
}

export async function sendMessageToWebhook(message) {
  const webhook = import.meta.env.VITE_WEBHOOK;
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Successfully sent message to webhook");
  } catch (err) {
    console.error(`Error sending message to webhook: ${err}`);
  }
}
