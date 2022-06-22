const Router = require("express").Router();
const userRouter = require('./user')

const authRouter = require("./auth");

Router.get("/", (_req, res) => {
  res.json({
    message: "This is Zilgya API",
  });
});
Router.use("/auth", authRouter);
Router.use("/user", userRouter);
// Router.use("/product");
// Router.use("/transaction");
Router.get("*", (_req, res) => {
  res.status(404).json({
    message: "Page Not Found",
  });
});

module.exports = Router;
