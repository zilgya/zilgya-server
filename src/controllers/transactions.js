const transactionsModel = require("../models/transactions");
const { createNewTransactions, getAllTransactionsfromUsers, getAllTransactionsfromSeller, deleteDataTransactionsfromServer, checkout, getTransactions, completed } = transactionsModel;

const postNewTransactions = async (req, res) => {
  try {
    const { id } = req.userPayload;
    const { data, message } = await createNewTransactions(req.body, id);

    res.status(201).json({
      data,
      message,
    });
  } catch (err) {
    const { message, status } = err;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

const getAllTransactionsUser = (req, res) => {
  const id = req.userPayload.id;
  getAllTransactionsfromUsers(id)
    .then(({ data }) => {
      res.status(200).json({
        err: null,
        data,
      });
    })
    .catch(({ status, err }) => {
      res.status(status).json({
        err,
        data: [],
      });
    });
};

const getAllTransactionsSeller = (req, res) => {
  const id = req.userPayload.id;
  getAllTransactionsfromSeller(id)
    .then(({ data }) => {
      res.status(200).json({
        data,
      });
    })
    .catch(({ status, err }) => {
      res.status(status).json({
        err,
      });
    });
};

const deleteTransactionsbyId = (req, res) => {
  // const id = req.params;
  deleteDataTransactionsfromServer(req)
    .then(({ data, msg }) => {
      res.status(200).json({
        data,
        msg,
        err: null,
      });
    })
    .catch((error) => {
      const { err, status } = error;
      res.status(status).json({
        data: [],
        err,
      });
    });
};

const checkoutProduct = (req, res) => {
  checkout(req)
    .then(({ data, msg }) => {
      res.status(200).json({
        data,
        msg,
        err: null,
      });
    })
    .catch((error) => {
      console.log(error);
      const { err, status } = error;
      res.status(status).json({
        data: [],
        err,
      });
    });
};
const getTransactionsUsers = (req, res) => {
  const id = req.userPayload.id;
  getTransactions(id)
    .then((data) => {
      res.status(200).json({
        data,
      });
    })
    .catch(({ status, err }) => {
      res.status(status).json({
        err,
      });
    });
};
const patchCompleted = (req, res) => {
  completed(req)
    .then((data) => {
      res.status(200).json({
        data,
      });
    })
    .catch(({ status, err }) => {
      res.status(status).json({
        err,
      });
    });
};
module.exports = {
  postNewTransactions,
  getAllTransactionsUser,
  getAllTransactionsSeller,
  deleteTransactionsbyId,
  checkoutProduct,
  getTransactionsUsers,
  patchCompleted,
};
