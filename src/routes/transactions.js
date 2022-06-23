const express = require("express");

const Router = express.Router();

const transactionsControllers = require("../controllers/transactions");
// const validate = require("../middlewares/validate");
const { checkToken } = require("../middlewares/auth");
// const { checkAuthorizations } = require("../middlewares/users_validate");

Router.post("/", checkToken, transactionsControllers.postNewTransactions);
Router.get("/users", checkToken, transactionsControllers.getAllTransactionsUser);
Router.get("/seller", checkToken, transactionsControllers.getAllTransactionsSeller);
Router.patch("/:id", checkToken, transactionsControllers.patchUpdateTransactions);
Router.delete("/delete/:id", checkToken, transactionsControllers.deleteTransactionsbyId);

module.exports = Router;