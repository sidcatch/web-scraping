const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(
    "https://www.bigbasket.com/pc/kitchen-garden-pets/cookware-non-stick/?nc=nb"
  );

  //await autoScroll(page);

  let images = await page.$$(".items .item img.img-responsive");

  /* let destinatioon = path.join(__dirname, "public", "image.jpg");
   await image.screenshot({
    path: destinatioon,
    omitBackground: true,
  });  */

  console.log(images);

  /* const products = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".items .item"), (item) => {
      let title = item
        .querySelector(".prod-name a.ng-binding")
        .innerText.split("-")[0]
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
  ); */

  //console.log(products);
  await browser.close();
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
      }, 100);
    });
  });
}
