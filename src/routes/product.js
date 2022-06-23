const Router = require("express").Router();
const { checkToken } = require("../middlewares/auth");
const imageUpload = require("../middlewares/upload");

const { createProduct, findProductByQuery } = require("../controller/product");

Router.get("/", findProductByQuery);
Router.post("/", checkToken, imageUpload.array("photo", 5), createProduct);

module.exports = Router;
