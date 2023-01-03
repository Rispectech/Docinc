const express = require("express");
const { authRouter } = require("./routes/auth");
const { userRouter } = require("./routes/User");
const { connectDb } = require("./utils/Connect");
const { ErrorHandler } = require("./utils/error");
require("dotenv").config();

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());

app.use("/", authRouter);
app.use("/", userRouter);
app.use(ErrorHandler);

const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => console.log(`Server is listening at port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
