const { createWishlist, readWishlist, removeWishlist } = require("../models/wishlist");

const getWishlist = async (req, res) => {
  try {
    const product_id = req.params.id;
    const user_id = req.userPayload.id;
    const { data } = await readWishlist(user_id, product_id);
    res.status(200).json({
      data,
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

module.exports = { getWishlist, postWishlist, deleteWishlist };
