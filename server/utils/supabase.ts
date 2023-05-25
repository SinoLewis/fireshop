const { createClient } = require("@supabase/supabase-js");
const {
  VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY,
} = require("./../config.json");

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function getOrderIds() {
  try {
    const { data, error } = await supabase.from("custom-orders").select("id");
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.log("GET ORDER ERROR: ", error.message);
  }
}
async function updateOrder(id: string, price: number) {
  const date = new Date();
  const dateNow = date.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  });

  try {
    const { data, error } = await supabase
      .from("custom-orders")
      .update({ delivery_price: price, updated_at: dateNow, approved: true })
      .eq("id", id)
      .select();
    if (error) throw error;
    console.log("ORDER DATA: ", data);
    return data[0];
  } catch (error: any) {
    console.log("UPDATE ORDER ERROR: ", error.message);
  }
}

async function cancelOrder(id: string) {
  const date = new Date();
  const dateNow = date.toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "full",
  });

  try {
    const { data, error } = await supabase
      .from("custom-orders")
      .update({ delivery_price: null, updated_at: dateNow, approved: false })
      .eq("id", id)
      .select();
    if (error) throw error;
    console.log("ORDER DATA: ", data);
    return data[0];
  } catch (error: any) {
    console.log("UPDATE ORDER ERROR: ", error.message);
  }
}
module.exports = {
  getOrderIds,
  updateOrder,
  cancelOrder,
};
