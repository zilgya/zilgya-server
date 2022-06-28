const promoModel = require("../models/promo");
const { getPromo } = promoModel;
const { successResponse, errorResponse } = require("../helpers/response");

const getPromoCode = (req, res) => {
  getPromo(req.params)
    .then((result) => {
      const { total, data } = result;
      successResponse(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponse(res, status, err);
    });
};
module.exports = {
  getPromoCode,
};
