// Module To generate Meilisearch index documents
const { supabase } = require("./supabase");
const fs = require("fs");

const getProduct = async () => {
  const { data, error } = await supabase.from("products").select();
  let products = {};
  data.forEach((product) => {
    let value = {
      id: product["id"],
      title: product["title"],
      price: product["price"],
    };
    console.log(value);
    products[product["title"]] = value;
  });
  const JSONData = JSON.stringify(products);
  const a = document.createElement("a");
  const file = new Blob([JSONData], { type: "application/json" });
  a.href = URL.createObjectURL(file);
  a.download = "products.json";
  a.click();
  console.log("FINAL PRODUCTS", file);
};

//TODO: Fix image_url
const createIndex = async () => {
  try {
    const { data, error } = await supabase.from("products").select();
    console.log(data);
    const filt = [
      "price",
      "quantity",
      "available",
      "sku",
      "rating",
      "user_id",
      "discount",
    ];
    if (error) throw error;
    data.forEach((product) => {
      filt.forEach((e) => delete product[e]);
      const title = product["title"].toLowerCase().replaceAll(" ", "-");
      const category = product["category"].toLowerCase();
      product["relpermalink"] = `/${category}/${title}`;
    });
    fs.writeFile("products.json", JSON.stringify(data), function (err) {
      if (err) throw err;
      console.log("complete");
    });

    console.log("MEILI PRODUCTS: ", data);
  } catch (error) {
    console.log("MEILI ERROR: ", error.message);
  }
};

// TODO: Dict for product.ts
const createDict = async () => {
  try {
    const { data, error } = await supabase.from("products").select();
    console.log(data);
    const filt = [
      "quantity",
      "available",
      "sku",
      "rating",
      "user_id",
      "discount",
      "image_url",
      "description",
      "lastmod",
      "publish_date",
    ];
    if (error) throw error;
    data.forEach((product) => {
      filt.forEach((e) => delete product[e]);
      const title = product["title"].toLowerCase().replaceAll(" ", "-");
      const category = product["category"].toLowerCase();
      product["image"] = `/img/categories/${category}/${title}.jpg`;
      delete product['category']
    });
    fs.writeFile("app-products.json", JSON.stringify(data), function (err) {
      if (err) throw err;
      console.log("complete");
    });

    console.log("MEILI PRODUCTS: ", data);
  } catch (error) {
    console.log("MEILI ERROR: ", error.message);
  }
};

// createIndex();
createDict();
