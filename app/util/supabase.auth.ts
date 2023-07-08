import { createClient, OAuthResponse } from "@supabase/supabase-js";
import { toast, modal } from "../stores";
import { error_revolt, auth } from "./revolt";

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
  if (error) error_revolt(error.message);
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
  if (!error) {
    res = `Magic signin link sent to ${email}`;
    auth(`${email} requested a login link`);
  }
  return { res, serverError };
}
