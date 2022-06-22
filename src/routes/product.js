const Router = require("express").Router();

const productController = require("../controller/product");
// Router.post('/')
Router.get("/", productController.findProductByQuery);

module.exports = Router;
