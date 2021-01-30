const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto("http://localhost:3000/");
  await page.screenshot({ path: "cool-components.png" });

  await browser.close();
})();
