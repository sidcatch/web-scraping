//const mongoose = require("mongoose");
/*const fs = require("fs");
const https = require("https"); */
const puppeteer = require("puppeteer");
const moment = require("moment");
const axios = require("axios");

//const connectDB = require("./db");
const randomDateBetween = require("./util/randomDateBetween");
const parseUdemyReviewDate = require("./util/parseUdemyReviewDate");

//console.log(randomDateBetween(moment.utc().subtract(7, "days"), moment.utc()));
//Connect Database
//connectDB();

const API_KEY = process.env.THINKIFIC_API_KEY;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  const url = "https://www.udemy.com/course/customer-service-fundamentals/";
  const courseId = 512227;
  const thinkificUserId = 40355175;

  await page.goto(url);
  await page.waitForSelector(
    ".individual-review--individual-review-content--en4c7"
  );

  let selectorForLoadMoreButton =
    ".reviews-section--reviews-show-more--2cJQg button";

  let loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
  while (loadMoreVisible) {
    await page.click(selectorForLoadMoreButton).catch(() => {});
    console.log("More button clicked");
    loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
  }

  console.log("Showing all reviews");

  //await page.click(".reviews-section--reviews-show-more--2cJQg button");

  let reviews = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        ".individual-review--individual-review-content--en4c7"
      ),
      (item, index) => {
        let name = item.querySelector(
          ".individual-review--individual-review__name-container--YY9yu .udlite-heading-md"
        ).innerText;

        let ratingRegex = /\d\.\d/;
        let rating = parseInt(
          ratingRegex.exec(
            item.querySelector(
              ".individual-review--individual-review__detail--3qCWi span span"
            ).innerText
          )[0]
        );

        let date = item.querySelector(
          ".individual-review--individual-review__detail--3qCWi .individual-review--individual-review__detail-date--DEkVn"
        ).innerText;

        let reviewText = item.querySelector(
          ".show-more--container--1QLmn div div"
        ).innerText;

        return {
          name,
          rating,
          reviewText,
          date,
        };
      }
    )
  );

  reviews = reviews.filter(({ rating }) => rating >= 4);

  reviews = reviews.map(({ name, rating, reviewText, date }) => ({
    title: `${name} DD${parseUdemyReviewDate(date)}DD`,
    reviewText,
    rating,
    /* date, */
  }));

  //console.log(reviews);

  /* reviews = reviews.map(({ name, rating, reviewText }) => ({
    title: `${name} DD${randomDateBetween(
      moment.utc().subtract(12, "M"),
      moment.utc().subtract(10, "M")
    ).toISOString()}DD`,
    reviewText,
    rating,
  })); */

  //console.log(reviews.slice(0, 3));

  //reviews = reviews.slice(2, 3);

  for (let i = 0; i < reviews.length; i++) {
    try {
      const result = await axios.post(
        `https://api.thinkific.com/api/public/v1//course_reviews?course_id=${courseId}`,
        {
          rating: reviews[i].rating,
          title: reviews[i].title,
          review_text: reviews[i].reviewText,
          user_id: thinkificUserId,
          approved: true,
        },

        {
          headers: {
            "X-Auth-API-Key": API_KEY,
            "X-Auth-Subdomain": "starweaver",
            "Content-Type": "application/json",
          },
        }
      );

      console.log(result.data);
    } catch (e) {
      console.log(e.response.data.errors);
    }
  }

  await browser.close();
  //mongoose.connection.close();
})();

const isElementVisible = async (page, cssSelector) => {
  let visible = true;
  await page
    .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
    .catch(() => {
      visible = false;
    });
  return visible;
};

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
