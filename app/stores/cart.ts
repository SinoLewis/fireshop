import { products } from "./products";
import { writable } from "svelte/store";
import { decrypt, encrypt } from "../util/crypt";

const SELECTED_CART: any = import.meta.env.VITE_LOCAL_CART;
let initCart = localStorage.getItem(SELECTED_CART);

interface CartProducts {
  [key: string]: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    total_price: number;
    image?: string;
    category: string;
  };
}

export interface Cart {
  id?: string;
  user_id?: string;
  cart_products: CartProducts;
  cart_price: number;
  cart_total: number;
  // is_paid: boolean;
  // ["Checkout", "Paid"];
  created_at: string;
  updated_at: string;
}

function getCart(): Cart {
  if (!initCart) {
    const date = new Date();
    const dateNow = date.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "full",
    });
    const data = {
      cart_price: 0,
      cart_total: 0,
      cart_products: {},
      created_at: dateNow,
      updated_at: dateNow,
    } as Cart;
    // TEST
    // console.log("STORE INITCART: ", data);
    localStorage.setItem(SELECTED_CART, encrypt(JSON.stringify(data)));
  }
  return JSON.parse(decrypt(localStorage.getItem(SELECTED_CART)));
}
const cart = writable<Cart>(getCart());

const add = async (name: string) => {
  let { id, title, price, category } = products[name];
  cart.update((value) => {
    if (value.cart_products.hasOwnProperty(title)) {
      value.cart_products[title].quantity++;
    } else {
      value.cart_products[title] = {
        id,
        title,
        price,
        quantity: 1,
        total_price: price,
        category,
      };
    }
    return { ...value };
  });
};
const minus = async (name: string) => {
  let item = products[name];
  cart.update((value) => {
    if (value.cart_products.hasOwnProperty(item.title)) {
      value.cart_products[item.title].quantity--;
      if (value.cart_products[item.title].quantity === 0)
        delete value.cart_products[item.title];
    }
    return { ...value };
  });
};
const remove = async (name: string) => {
  let item = products[name];
  cart.update((value) => {
    delete value.cart_products[item.title];
    return { ...value };
  });
};

cart.subscribe((value) => {
  Object.values(value.cart_products).forEach(async (item) => {
    item.total_price = item.price * item.quantity;
    const URL: any = import.meta.env.VITE_SUPABASE_URL;
    let publicUrl =
      URL +
      "/storage/v1/object/public/fireshop-images/" +
      item.category +
      "/" +
      item.title.toLowerCase().replaceAll(" ", "-") +
      ".jpg";

    // CDN images via SUPABASE client
    // let { data } = await supabase.storage
    //   .from("fireshop-images")
    //   .getPublicUrl(
    //     `${item.category}/${item.title.toLowerCase().replaceAll(" ", "-")}.jpg`
    //   );
    item["image"] = publicUrl;
  });
  value.cart_price = Object.values(value.cart_products).reduce(
    (acc, item) => acc + item.total_price,
    0
  );
  value.cart_total = Object.values(value.cart_products).reduce(
    (acc, item) => acc + item.quantity,
    0
  );


  let date = new Date();
  value.updated_at = date.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  });
  localStorage.setItem(SELECTED_CART, encrypt(JSON.stringify(value)));
  // TEST
  console.log("CART STORE", value);
});

export { cart, add, minus, remove, encrypt, decrypt };
export type { CartProducts };
