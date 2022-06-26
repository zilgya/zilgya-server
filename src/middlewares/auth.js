const validate = {};
const jwt = require("jsonwebtoken");
const { errorResponse } = require("../helpers/response");
const { getUserByEmail } = require("../models/auth");
const { client } = require("../config/redis");
const { ErrorHandler } = require("./errorHandler");

const registerInput = (req, res, next) => {
  // cek apakah Undifined body sesuai dengan yang diinginkan
  const { email, password, roles_id } = req.body;
  let emailFormat = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  if (!email) {
    return errorResponse(res, 400, { msg: "Email cannot be empty !" });
  }
  for (const key in req.body) {
    if (key === "email") {
      if (!req.body[key].match(emailFormat)) {
        return errorResponse(res, 400, {
          msg: "Please insert a valid email !",
        });
      }
    }
  }

  if (!password) {
    return errorResponse(res, 400, { msg: "Password cannot be empty !" });
  }
  if (!roles_id) {
    return errorResponse(res, 400, { msg: "Please choose a role !" });
  }

  next();
};

const loginInput = (req, res, next) => {
  // cek apakah Undifined body sesuai dengan yang diinginkan
  const { email, password } = req.body;
  let emailFormat = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  if (!email) {
    return errorResponse(res, 400, {
      msg: "Email cannot be empty !",
    });
  }
  
  for (const key in req.body) {
    if (key === "email") {
      if (!req.body[key].match(emailFormat)) {
        return errorResponse(res, 400, {
          msg: "Please insert a valid email !",
        });
      }
    }
  }
  if (!password) {
    return errorResponse(res, 400, { msg: "Password cannot be empty!" });
  }

  next();
};

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
    async (err, payload) => {
      // error handling
      if (err && err.name === "TokenExpiredError") {
        return errorResponse(res, 401, { msg: "You need to Sign in again" });
      }

      try {
        const cachedToken = await client.get(`jwt${payload.id}`);
        if (!cachedToken) {
          return errorResponse(res, 401, { msg: "Sign in needed" });
        }

        if (cachedToken !== token) {
          return errorResponse(res, 401, {
            msg: "Token Unauthorize, please login again",
          });
        }
        req.userPayload = payload;
        next();
      } catch (error) {
        const status = error.status ? error.status : 500;
        return errorResponse(res, status, { msg: error.message });
      }
    }
  );
};

const emailToken = (req, _res, next) => {
  const { token } = req.params;
  jwt.verify(
    token,
    process.env.JWT_SECRET_CONFIRM_KEY,
    async (err, payload) => {
      if (err) {
        next({
          status: 403,
          message: "Your link expired, please register again.",
        });
        return;
      }
      try {
        const cachedToken = await client.get(`jwt${payload.email}`);
        if (!cachedToken) {
          throw new ErrorHandler({
            status: 403,
            message: "Your link expired,please register again",
          });
        }

        if (cachedToken !== token) {
          throw new ErrorHandler({
            status: 403,
            message: "Token Unauthorize, please register again",
          });
        }
      } catch (error) {
        const status = error.status ? error.status : 500;
        next({ status, message: error.message });
      }
      req.userPayload = payload;
      next();
    }
  );
};

module.exports = {
  checkDuplicate,
  checkToken,
  emailToken,
  registerInput,
  loginInput,
};
