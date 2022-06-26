const express = require("express");

const Router = express.Router();

const transactionsControllers = require("../controllers/transactions");
const { checkToken } = require("../middlewares/auth");

Router.post("/", checkToken, transactionsControllers.postNewTransactions);
Router.get("/users", checkToken, transactionsControllers.getAllTransactionsUser);
Router.get("/seller", checkToken, transactionsControllers.getAllTransactionsSeller);
Router.patch("/checkout", checkToken, transactionsControllers.checkoutProduct);
Router.delete("/delete/:id", checkToken, transactionsControllers.deleteTransactionsbyId);

module.exports = Router;
