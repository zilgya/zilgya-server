const Router = require("express").Router();

const authController = require("../controller/auth");
const { checkDuplicate, checkToken } = require("../middlewares/auth");

// register
Router.post("/new", checkDuplicate, authController.register);
// sign in
Router.post("/", authController.signIn);
// sign out
Router.delete("/", checkToken, authController.logout);

module.exports = Router;
