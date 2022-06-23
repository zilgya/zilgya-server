const Router = require("express").Router();
const userController = require("../controller/user");
const { checkToken } = require("../middlewares/auth");
const imageUpload = require("../middlewares/upload");

//Router User
Router.get("/", checkToken, userController.getUserInfo);
Router.patch("/", checkToken, imageUpload.single("photo"), userController.patchUserInfo);
//update

module.exports = Router;
