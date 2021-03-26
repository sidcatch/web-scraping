const moment = require("moment");

const getRandomInt = require("./getRandomInt");

const randomDateBetween = (x, y) => {
  let randomUnixTimestamp = getRandomInt(x.unix(), y.unix());

  return moment.unix(randomUnixTimestamp);
  //return randomUnixTimestamp;
  //return today.toString();
};

//console.log(randomDateBetween(moment.utc().subtract(7, "days"), moment.utc()));

module.exports = randomDateBetween;
