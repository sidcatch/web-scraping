const moment = require("moment");

const parseUdemyReviewDate = (date) => {
  if (/year/.test(date)) {
    let regexArray = /\d+/.exec(date);

    if (regexArray)
      return moment.utc().subtract(regexArray[0], "y").toISOString();
    else return moment.utc().subtract(1, "y").toISOString();
  } else if (/month/.test(date)) {
    let regexArray = /\d+/.exec(date);

    if (regexArray)
      return moment.utc().subtract(regexArray[0], "M").toISOString();
    else return moment.utc().subtract(1, "M").toISOString();
  } else if (/day/.test(date)) {
    let regexArray = /\d+/.exec(date);

    if (regexArray)
      return moment.utc().subtract(regexArray[0], "d").toISOString();
    else return moment.utc().subtract(1, "d").toISOString();
  } else return moment.utc().toISOString();
};

//console.log(parseUdemyReviewDate("a day ago"));

module.exports = parseUdemyReviewDate;
