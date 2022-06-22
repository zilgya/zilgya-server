const { db } = require("../config/database");

const { getProducts } = require("../models/product");
const { successResponse, errorResponse } = require("../helpers/response");

const findProductByQuery = (req, res) => {
  getProducts(req.query)
    .then((result) => {
      const { data, total } = result;
      successResponse(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponse(res, status, err);
    });
};

module.exports = {
  findProductByQuery,
};
