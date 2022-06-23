const Router = require("express").Router();

const authControllers = require("../controllers/auth");
const { checkDuplicate, checkToken, emailToken } = require("../middlewares/auth");

// register
Router.post("/new", checkDuplicate, authControllers.register);
// sign in
Router.post("/", authControllers.signIn);
// confirm email
Router.get("/confirm/:token", emailToken, authControllers.confirmEmail);
// sign out
Router.delete("/", checkToken, authControllers.logout);

module.exports = Router;
