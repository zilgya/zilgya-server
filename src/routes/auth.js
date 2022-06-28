const Router = require("express").Router();

const authControllers = require("../controllers/auth");
const { checkDuplicate, checkToken, emailToken, registerInput, loginInput } = require("../middlewares/auth");

// register
Router.post("/new", registerInput, checkDuplicate, authControllers.register);
// sign in
Router.post("/", loginInput, authControllers.signIn);
// confirm email
Router.get("/confirm/:token", emailToken, authControllers.confirmEmail);
// forgot-password
Router.get("/forgot-password/:email", authControllers.forgotPassword);
// sign out
Router.delete("/", checkToken, authControllers.logout);

module.exports = Router;
