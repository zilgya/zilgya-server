const jwt = require("jsonwebtoken");
const { errorResponse } = require("../helpers/response");
const { getUserByEmail } = require("../models/auth");

const checkDuplicate = (req, res, next) => {
  getUserByEmail(req.body.email)
    .then((result) => {
      if (result.rowCount > 0)
        return errorResponse(res, 400, { msg: "Email already use !" });
      next();
    })
    .catch((error) => {
      const { status, err } = error;
      errorResponse(res, status, err);
    });
};

const checkToken = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  // bearer token
  if (!bearerToken) {
    return errorResponse(res, 401, { msg: "Sign in needed" });
  }
  const token = bearerToken.split(" ")[1];
  // verifikasi token
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { issuer: process.env.JWT_ISSUER },
    (err, payload) => {
      // error handling
      if (err && err.name === "TokenExpiredError"){
        return errorResponse(res, 401, { msg: "You need to Sign in again" });
      }
  
      req.userPayload = payload;
      next();
    }
  );
};

module.exports = { checkDuplicate, checkToken };