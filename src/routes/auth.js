const Router = require("express").Router();

const authControllers = require("../controllers/auth");
const validateRegister = require("../middlewares/auth") 
const { checkDuplicate, checkToken, emailToken } = require("../middlewares/auth");

// register
Router.post("/new", validateRegister.validateRegisterUsers ,checkDuplicate, authControllers.register);
// sign in
Router.post("/", authControllers.signIn);
// confirm email
Router.get("/confirm/:token", emailToken, authControllers.confirmEmail);
// forgot-password
Router.get("/forgot-password", authControllers.forgotPassword);
// sign out
Router.delete("/", checkToken, authControllers.logout);

module.exports = Router;
