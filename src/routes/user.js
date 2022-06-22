const Router = require("express").Router();
const userController = require("../controller/user");

// Masih butuh check token sama multer


//Router User
Router.get("/", userController.getUserInfo); 
Router.patch("/", userController.patchUserInfo);

module.exports = Router;
