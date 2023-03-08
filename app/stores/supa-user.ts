import { writable } from "svelte/store";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../util/supabase";
import { cart } from "./cart";

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
    cart.update((value) => {
      value.user_id = data.user ? data.user.id : null;
      return { ...value };
    });
    user.set(data.user);
  } catch (error) {
    console.log("USER ERROR: ", error.message);
  }
}
// TEST
user.subscribe((value) => {
  console.log("USER STORE: ", value);
});

export { user };
