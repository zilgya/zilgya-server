const Router = require("express").Router();
const { checkToken } = require("../middlewares/auth");
const imageUpload = require("../middlewares/upload");

const { createProduct, findProductByQuery, removeProduct, patchProduct, getImages } = require("../controllers/product");

Router.get("/", findProductByQuery);
Router.get("/images/:id", getImages);
Router.post("/", checkToken, imageUpload.array("photo", 5), createProduct);
Router.patch("/:id", checkToken, imageUpload.array("photo", 5), patchProduct);
Router.delete("/:id", checkToken, removeProduct);

module.exports = Router;
