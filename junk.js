const path = require("path");
const fs = require("fs");

let image =
  "https://www.bigbasket.com/media/uploads/p/s/40008569_2-prestige-popular-aluminium-pressure-cooker-10003.jpg";

let destinatioon = path.join(
  __dirname,
  "public",
  image.substring(image.lastIndexOf("/") + 1)
);

console.log(destinatioon);
