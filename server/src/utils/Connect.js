const mongoose = require("mongoose");

const connectDb = async () => {
  // console.log(process.env.MONGO_URL);
  mongoose.set("strictQuery", false);
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.log("Failed to connect");
    });
};

module.exports = {
  connectDb,
};
