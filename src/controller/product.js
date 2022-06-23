const { postProduct, updateProduct } = require("../models/product");

const createProduct = async (req, res) => {
  try {
    let image = "";
    const { id } = req.userPayload;
    const { files } = req;

    if (files.length) {
      image = files;
    }

    const { data, message } = await postProduct(req.body, image, id);
    res.status(200).json({
      data,
      message,
    });
  } catch (error) {
    const { message } = error;
    res.status(500).json({
      error: message,
    });
  }
};

const patchProduct = async (req, res) => {
  try {
    let image = "";
    const user_id = req.userPayload.id;
    const product_id = req.params.id;
    const { files } = req;

    if (files.length) {
      image = files;
    }

    const { data, message } = await updateProduct(req.body, user_id, product_id, image);
    res.status(200).json({
      data,
      message,
    });
  } catch (error) {
    const { message } = error;
    res.status(500).json({
      error: message,
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, message } = await postProduct(id);
    res.status(200).json({
      data,
      message,
    });
  } catch (error) {
    const { message, status } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

module.exports = { createProduct, removeProduct, patchProduct };
