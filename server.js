require("dotenv").config();
const express = require("express");

const app = express();

const PORT = process.env.PORT;

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Zilgya API",
  });
});

app.listen(PORT, console.log(`Server is Running at port ${PORT}`));
//ilhamnurrohman