require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { getConfig } = require("./config/configService");
const { notFoundHander, errorLogger, errorHandler } = require("./middleware");

const NODE_ENV = getConfig("NODE_ENV");
const PORT = getConfig("PORT");
const MONGO_URI = getConfig("MONGO_URI");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (NODE_ENV == "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(notFoundHander());
app.use(errorLogger());
app.use(errorHandler());

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Mongoose connected !");
  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });
}
main();
