const express = require("express");

const Router = express.Router();

const promosControllers = require("../controllers/promo");

Router.get("/", promosControllers.getPromoCode);

module.exports = Router;