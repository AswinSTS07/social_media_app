const mongoose = require("mongoose");
const dbUrl =
  process.env.DB_URL || "mongodb://localhost:27017/social_media_app";

mongoose.set("strictQuery", true);

module.exports.connect = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(dbUrl);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
