const Router = require("express").Router();

const userController = require("../controllers/user");
const { checkToken } = require("../middlewares/auth");
const imageUpload = require("../middlewares/upload");

//Router User
Router.get("/", checkToken, userController.getUserInfo);
Router.patch("/", checkToken, imageUpload.single("photo"), userController.patchUserInfo);
Router.patch("/edit-password", userController.patchUserPassword);

module.exports = Router;
