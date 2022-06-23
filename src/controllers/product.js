const { getProducts, postProduct, updateProduct, deleteProduct, getProductImages, getProductDetail } = require("../models/product");
const { errorResponse } = require("../helpers/response");

const findProductByQuery = (req, res) => {
  getProducts(req.query, req.route)
    .then((result) => {
      const { data, total, totalData, totalPage, nextPage, previousPage } = result;
      const meta = {
        totalData,
        totalPage,
        nextPage,
        previousPage,
      };
      res.status(200).json({
        data,
        total,
        meta,
      });
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponse(res, status, err);
    });
};

const getImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await getProductImages(id);
    res.status(200).json({
      data,
    });
  } catch (error) {
    const { message, status } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

const productDetail = async (req,res)=>{
  try {
    const {id} = req.params
    const {data} = getProductDetail(id)
    res.status(200).json({
      data
    })
  } catch (error) {
    const {status,message}=error
    res.status(status ? status : 500).json({
      error:message
    })
  }
}

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
    const { data, message } = await deleteProduct(id);
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

module.exports = {
  createProduct,
  removeProduct,
  patchProduct,
  findProductByQuery,
  getImages,
  productDetail
};
