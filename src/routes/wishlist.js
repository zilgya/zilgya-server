const Router = require("express").Router();
const { getWishlist, getWishlistByProductId,postWishlist, deleteWishlist } = require("../controllers/wishlist");
const { checkToken } = require("../middlewares/auth");

Router.get("/", checkToken, getWishlist);
Router.get("/:id", checkToken, getWishlistByProductId);
Router.post("/", checkToken, postWishlist);
Router.delete("/:id", checkToken, deleteWishlist);

module.exports = Router;
