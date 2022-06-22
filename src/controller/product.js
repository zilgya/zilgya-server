const { db } = require("../config/database");

const { getProducts } = require("../models/product");
const { successResponse, errorResponse } = require("../helpers/response");

const findProductByQuery = (req, res) => {
  getProducts(req.query, req.route)
    .then((result) => {
      const { data, total, totalData, totalPage, nextPage, previousPage } =
        result;
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
      //   successResponse(res, 200, data, total, totalData, totalPage);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponse(res, status, err);
    });
};

module.exports = {
  findProductByQuery,
};
