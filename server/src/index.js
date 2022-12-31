const express = require("express");
const { authRouter } = require("./routes/auth");
require("dotenv").config();

const port = process.env.PORT || 8000;
const app = express();

app.use("/", authRouter);
app.use(express.json());

const start = async () => {
  try {
    app.listen(port, () => console.log(`Server is listening at port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
