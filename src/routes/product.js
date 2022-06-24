const Router = require("express").Router();
const { checkToken } = require("../middlewares/auth");
const imageUpload = require("../middlewares/upload");

const {
  createProduct,
  findProductByQuery,
  findSellerProduct,
  removeProduct,
  patchProduct,
  getImages,
  productDetail,
} = require("../controllers/product");

Router.get("/seller", checkToken, findSellerProduct);
Router.get("/", findProductByQuery);
Router.get("/:id", productDetail);
Router.get("/images/:id", getImages);
Router.post("/", checkToken, imageUpload.array("photo", 5), createProduct);
Router.patch("/:id", checkToken, imageUpload.array("photo", 5), patchProduct);
Router.delete("/:id", checkToken, removeProduct);

module.exports = Router;
