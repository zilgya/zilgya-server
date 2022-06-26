require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const mainRouter = require("./src/routes/index.js");
const { dbConn } = require("./src/config/database.js");
const { redisConn } = require("./src/config/redis");

const cloudinaryConfig = require("./src/middlewares/cloudinary");

dbConn();
redisConn();
const app = express();
const PORT = process.env.PORT || 5000;

const originList = ["http://localhost:3000", "::1", "https://zilgya-furniture.netlify.app"];

const corsOption = {
  origin: (origin, callback) => {
    if (originList.includes(origin) || !origin) return callback(null, true);
    return callback(new Error("Forbidden Origin"));
  },
  optionsSuccessStatus: 200,
  methods: ["OPTIONS", "GET", "POST", "PATCH", "DELETE"],
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("*", cloudinaryConfig);

app.use(mainRouter);

app.listen(PORT, console.log(`Server is Running at port ${PORT}`));
