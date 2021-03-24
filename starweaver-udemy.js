//const mongoose = require("mongoose");
/*const fs = require("fs");
const https = require("https"); */
const puppeteer = require("puppeteer");

//const connectDB = require("./db");

//Connect Database
//connectDB();

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  const url =
    "https://www.udemy.com/course/top-python-for-data-science-course/";

  await page.goto(url);
  await page.waitForSelector(
    ".individual-review--individual-review-content--en4c7"
  );

  const reviews = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        ".individual-review--individual-review-content--en4c7"
      ),
      (item, index) => {
        let name = item.querySelector(
          ".individual-review--individual-review__name-container--YY9yu .udlite-heading-md"
        ).innerText;

        let ratingRegex = /\d\.\d/;
        let rating = parseFloat(
          ratingRegex.exec(
            item.querySelector(
              ".individual-review--individual-review__detail--3qCWi span span"
            ).innerText
          )[0]
        );

        let reviewText = item.querySelector(
          ".show-more--container--1QLmn div div"
        ).innerText;

        return {
          name,
          rating,
          reviewText,
        };
      }
    )
  );
  console.log(reviews);

  await browser.close();
  //mongoose.connection.close();
})();

/* 
.individual-review--individual-review--1AJi4
  .individual-review--individual-review-content--en4c7
    .individual-review--individual-review__name-container--YY9yu
      .udlite-heading-md
    .individual-review--individual-review__detail--3qCWi
      .star-rating--star-wrapper--2eczq star-rating--large--3T9Yf
        .udlite-sr-only
    .show-more--container--1QLmn
      div
        .udlite-text-sm individual-review--individual-review__comment--2o94n
          p
          p
*/
