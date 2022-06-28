const { createWishlist, readWishlist, removeWishlist, readWishlistByIdProduct } = require("../models/wishlist");

const getWishlist = async (req, res) => {
  try {
    const product_id = req.params.id;
    const user_id = req.userPayload.id;
    const { data, total } = await readWishlist(user_id, product_id);
    res.status(200).json({
      data,
      total,
    });
  } catch (error) {
    const { status, message } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};
const getWishlistByProductId = async(req,res)=>{
  try {
    const product_id= req.params.id;
    const user_id = req.userPayload.id;
    const { data, message } = await readWishlistByIdProduct(user_id, product_id);
    res.status(200).json({
      data,
      message,
    });
  } catch (error) {
    const { status, message } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};


const postWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.userPayload.id;
    const { data, message } = await createWishlist(user_id, product_id);
    res.status(200).json({
      data,
      message,
    });
  } catch (error) {
    const { status, message } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const product_id = req.params.id;
    const { data, message } = await removeWishlist(product_id);
    res.status(200).json({
      data,
      message,
    });
  } catch (error) {
    const { status, message } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

module.exports = { getWishlist, getWishlistByProductId,postWishlist, deleteWishlist };
