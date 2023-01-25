const { MeiliSearch } = require("meilisearch");
const fs = require("fs");

const jsonString = fs.readFileSync("./products.json");
const products = JSON.parse(jsonString);

// 1. Init client SDK to docker meili in kuma nwtwork
const client = new MeiliSearch({ host: "http://172.18.0.2:7700" });

// // 2. Add docs & check server response
client
  .index("products")
  .addDocuments(products)
  .then((res) => console.log(res))
  .catch((error) => console.log(`MEILI CREATE ERROR: ${error}`));
