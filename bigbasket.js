const path = require("path");
const mongoose = require("mongoose");
/*const fs = require("fs");
const https = require("https"); */
const puppeteer = require("puppeteer");

const connectDB = require("./db");
const Product = require("./models/Product");
const ProductCategory = require("./models/ProductCategory");

//Connect Database
connectDB();

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  const url = "https://www.bigbasket.com/cl/fruits-vegetables/?nc=nb";
  const category = "Fruits and Vegetables";
  const maxNumberOfProducts = 25;

  await page.goto(url);
  //await page.waitForSelector(".items .item");

  await autoScroll(page);

  const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".items .item"), (item) => {
      let title = item
        .querySelector(".prod-name a.ng-binding")
        .innerText.split(" -")[0]
        .trim();
      let amount = item.querySelector(".qnty-selection span.ng-binding")
        .innerText;
      let price = item.querySelector(".discnt-price span.ng-binding").innerText;
      let image = item.querySelector("img.img-responsive").src;

      return {
        title,
        amount,
        price,
        image,
      };
    })
  );
  //console.log(products);

  let productCategory = await ProductCategory.findOne({ category });
  if (!productCategory) {
    productCategory = new ProductCategory({ category });
    await productCategory.save();
    console.log("Category created: " + category);
  }
  let { _id } = productCategory;
  //console.log(_id);

  let productsToSave = products
    .slice(0, maxNumberOfProducts)
    .map(({ title, amount, price, image }) => {
      return {
        title,
        amount,
        price,
        image: "/public/images" + image.substring(image.lastIndexOf("/")),
        category: _id,
      };
    });
  console.log(productsToSave.length);

  if (productsToSave.length < maxNumberOfProducts) {
    console.log("Less products than required");
    process.exit(0);
  }

  await Product.insertMany(productsToSave);

  let images = products
    .slice(0, maxNumberOfProducts)
    .map((product) => product.image);
  //console.log(images);
  for (let i = 0; i < images.length; i++) {
    let imageHandle = await page.$(`[src~="${images[i]}"]`);

    let destination = path.join(
      __dirname,
      "..",
      "MongoStore",
      "public",
      "images",
      images[i].substring(images[i].lastIndexOf("/") + 1)
    );

    await imageHandle.screenshot({
      path: destination,
      omitBackground: true,
    });
    console.log(destination);
  }

  /*  images.forEach(async (image) => {
    let imageHandle = await page.$(`[src~="${image}"]`);

    let destinatioon = path.join(
      __dirname,
      "public",
      image.substring(image.lastIndexOf("/") + 1)
    );
    await imageHandle.screenshot({
      path: destinatioon,
      omitBackground: true,
    });
  }); */

  await browser.close();
  mongoose.connection.close();
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}
