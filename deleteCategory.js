const mongoose = require("mongoose");

const connectDB = require("./db");
const Product = require("./models/Product");
const ProductCategory = require("./models/ProductCategory");

//Connect Database
connectDB();

(async () => {
  let category = "Foodgrains, Oil and Masala";
  let productCategory = await ProductCategory.findOne({ category });
  if (!productCategory) {
    console.log("Did not find the category");
    process.exit(0);
  }
  let { _id } = productCategory;
  console.log(_id);

  await Product.deleteMany({ category: _id });
  await productCategory.deleteOne({ _id });

  mongoose.connection.close();
})();
