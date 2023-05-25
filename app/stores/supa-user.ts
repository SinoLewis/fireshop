import { writable } from "svelte/store";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../util/supabase.auth";
import { cart, destination, order } from "./";

const user = writable<User>(null);

supabase.auth.onAuthStateChange((event, session) => {
  // TEST
  getUser();
  console.log("USER AUTH: ", event, session);
});

async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    user.set(data.user);
    cart.update((c) => {
      c.user_id = data.user.id;
      return { ...c };
    });
    destination.update((d) => {
      d.user_id = data.user.id;
      return { ...d };
    });
    order.update((o) => {
      o.user_id = data.user.id;
      o.email = data.user.email;
      return { ...o };
    });
  } catch (error) {
    user.set(null);
    console.log("USER ERROR: ", error.message);
  }
}
// TEST
user.subscribe((value) => {
  console.log("USER STORE: ", value);
});

export { user };
