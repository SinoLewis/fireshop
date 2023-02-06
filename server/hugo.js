// File manupulation for hugo front-matter content
const { supabase } = require("./supabase");
const { exec, execFile } = require("child_process");

// Convert cmd string from exec (shell) to execFile to avoid escape errors
async function noShell(bin, cmd) {
  execFile(bin, cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`execFile error: ${error}`);
      return;
    }
    console.log(stdout);
  });
}
async function shell(cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

// TODO: Change from shell to noShell perl regex
// TODO: Fix regex string to new content dir
async function getProductsShell() {
  const { data, error } = await supabase.from("products").select("*");
  // .eq("category", "Men's");
  let products = data;
  products.forEach((item) => {
    let description = item["description"];
    let title = item["title"];
    let category = item["category"];
    let lastmod = new Date(item["lastmod"]);
    let publishdate = new Date(item["publish_date"]);

    let perl_replace_desc = `perl -i -pe 's|(?<=description: ).+|${description}|' \"../content/categories/${title}\"/index.md`;
    let perl_replace_title = `perl -i -pe 's|(?<=title: ).+|${title}|' \"../content/categories/${title}\"/index.md`;
    let perl_replace_author = `perl -i -pe 's|(?<=author: ).+|Lee Sino|' \"../content/categories/${title}\"/index.md`;
    let perl_replace_lastmod = `perl -i -pe 's|(?<=lastmod: ).+|${lastmod.toISOString()}|' \"../content/categories/${title}\"/index.md`;
    let perl_replace_publish_date = `perl -i -pe 's|(?<=publishdate: ).+|${publishdate.toISOString()}|' \"../content/categories/${title}\"/index.md`;
    // NB: RUN THESE ONCE
    let sed_insert_category = `sed -i '4a category\: ${category}'  \"../content/categories/${title}\"/index.md`;
    let sed_delete_category = `sed -i '5,6d'  \"../content/categories/${title}\"/index.md`;
    let sed_delete = `sed -i '/github: /d'  \"../content/categories/${title}\"/index.md`;
    // META CHAR CHECK CMDS
    let perl_update_desc = [
      "perl",
      [
        "-i",
        "-pe",
        `s|(?<=description: ).+|${description}|`,
        `\"../content/categories/${title}\"/index.md`,
      ],
    ];
    console.log(`${title.toLowerCase().replace(/ /g, "-")}`);
  });
  // console.log("PRODUCTS: ", data);
}
async function getProductsNoShell() {
  const { data, error } = await supabase.from("products").select("*");
  // .eq("category", "Men's");
  let products = data;
  products.forEach((item) => {
    let description = item["description"];
    let title = item["title"].toLowerCase().replace(/ /g, "-");
    let category = item["category"].toLowerCase();
    let lastmod = new Date(item["lastmod"]);
    let publishdate = new Date(item["publish_date"]);

    let oldPath = `../content/${category}/${title}/img/featured.jpg`;
    let newPath = `../static/img/categories/${category}/${title}.jpg`;
    // noShell("mv", [oldPath, newPath]);
    // console.log(`Moved file from ${oldPath} to ${newPath}`);

    // TODO: Fix products.ts images with .jpg
  });
}
// getProductsShell();
getProductsNoShell();
