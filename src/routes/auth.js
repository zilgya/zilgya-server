const Router = require("express").Router();

const authControllers = require("../controllers/auth");
const { checkDuplicate, checkToken } = require("../middlewares/auth");
// const validate = require("../middlewares/users_validate");

// register
Router.post("/new", checkDuplicate, authControllers.register);
// sign in
Router.post("/", authControllers.signIn);
// sign out
Router.delete("/", checkToken, authControllers.logout);

module.exports = Router;
