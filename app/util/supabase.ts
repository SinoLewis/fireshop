import { createClient } from "@supabase/supabase-js";
import { toast } from "../stores";

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
