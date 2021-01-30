const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.bigbasket.com/ps/?q=toys");
  //await page.screenshot({ path: "bigbasket.png" });

  const content = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".items a.ng-binding"), (data) =>
      data.innerText.trim()
    )
  );

  console.log(content);

  await browser.close();
})();
