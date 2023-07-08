import type { Cart, Order, CartProducts, Destination } from "../stores";
import { supabase } from "./supabase.auth";
import { error_revolt } from "./revolt";

async function getDestination(id: string) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id);
  console.log("DESTINATION get: ", data[0]);
  if (error) throw error;
  return data[0];
}

async function insertDestination(db_destination: object) {
  const { data, error }: { data: any; error: any } = await supabase
    .from("destinations")
    .insert(db_destination)
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateDestination(destination: Destination) {
  try {
    const user_destination = await getDestination(destination.id);
    if (
      user_destination?.user_id === destination.user_id &&
      user_destination?.id === destination.id
    ) {
      const { data, error }: { data: any; error: any } = await supabase
        .from("destinations")
        .update(destination)
        .eq("id", destination.id)
        .select();
      if (error) throw error;
      console.log("DESTINATION update DB: ", data);
      return data[0];
    } else {
      const data = await insertDestination(destination);
      console.log("DESTINATION insert DB: ", data);
      return data;
    }
  } catch (error) {
    console.log("DESTINATION update ERROR: ", error);
    error_revolt(error.message);
  }
}

async function getCustomOrders(order: Order) {
  const { data, error } = await supabase
    .from("custom-orders")
    .select("*")
    .eq("id", order.id);
  if (error) throw error;
  return data[0];
}

async function insertCustomOrders(order: Order) {
  const { data, error }: { data: any; error: any } = await supabase
    .from("custom-orders")
    .insert(order)
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateOrder(order: Order): Promise<Order> {
  const date = new Date();
  try {
    const user_order = await getCustomOrders(order);
    if (user_order?.user_id === order.user_id && user_order?.id === order.id) {
      const { data, error }: { data: any; error: any } = await supabase
        .from("custom-orders")
        .update(order)
        .eq("id", order.id)
        .select();
      if (error) throw error;
      console.log("ORDER update DB: ", data);
      return data[0];
    } else {
      const data = await insertCustomOrders(order);
      console.log("ORDER insert DB: ", data);
      return data;
    }
  } catch (error) {
    console.log("ORDER update ERROR: ", error);
    error_revolt(error.message);
  }
}

async function getPriceById(id) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id);
    if (error) throw error;
    return data[0]["price"];
  } catch (error) {
    console.error("PRICE ERROR", error.message);
    error_revolt(error.message);
  }
}

async function getCarts(cart: Cart) {
  const { data, error } = await supabase
    .from("carts")
    .select("*")
    .eq("id", cart.id);
  if (error) throw error;
  return data[0];
}

async function insertCarts(db_cart, cart_products: CartProducts) {
  const { data, error }: { data: any; error: any } = await supabase
    .from("carts")
    .insert({
      ...db_cart,
      cart_products: Object.values(cart_products).map((v) => v.id),
    })
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateCart(cart: Cart): Promise<Cart> {
  Object.values(cart.cart_products).forEach(
    async (item) => (item.price = await getPriceById(item.id))
  );
  const { cart_products, ...db_cart } = cart;
  // TODO: Test if its right price with fake html price
  try {
    const user_cart = await getCarts(cart);
    if (user_cart?.user_id === cart.user_id && user_cart?.id === cart.id) {
      const { data, error }: { data: any; error: any } = await supabase
        .from("carts")
        .update({
          ...db_cart,
          cart_products: Object.values(cart_products).map((v) => v.id),
        })
        .eq("id", cart.id)
        .select();
      if (error) throw error;
      console.log("CART update DB: ", data);
      return data[0];
    } else {
      const data = await insertCarts(db_cart, cart_products);
      console.log("CART insert DB: ", data);
      return data;
    }
  } catch (error) {
    console.log("CART update ERROR: ", error);
    error_revolt(error.message);
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
    } catch (error) {
      console.log("PRODUCTS update ERROR: ", error);
      error_revolt(error.message);
    }
  });
}
