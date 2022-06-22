const transactionsModel = require("../models/transactions");
const { createNewTransactions, getAllTransactionsfromUsers, getAllTransactionsfromSeller } = transactionsModel;
// const { successResponse, errorResponse } = require("../helpers/response");
// const { status } = require("express/lib/response");

// const postNewTransactions = (req, res) => {
//     createNewTransactions(req.body)
//         .then(({ data }) => {
//             res.status(200).json({
//                 err: null,
//                 data,
//             });
//         })
//         .catch(({ status, err }) => {
//             res.status(status).json({
//                 err,
//                 data: [],
//             });
//         });
// };

const postNewTransactions = async (req, res) => {
    try {
      const { data, message } = await createNewTransactions(req.body);
  
      res.status(201).json({
        data,
        message,
      });
    } catch (err) {
      console.log(err)
      const { message, status } = err;
      res.status(status).json({
        error: message,
      });
    }
  };

const getAllTransactionsUser = (req, res) => {
    const id = req.userPayload.id;
    getAllTransactionsfromUsers(id)
        .then((data) => {
            res.status(200).json({
                err: null,
                data,
            });
        })
        .catch(({status, err}) => {
            res.status(status).json({
                err,
                data: [],
            });
        });
}
const getAllTransactionsSeller = (req, res) => {
    const id = req.userPayload.id;
    getAllTransactionsfromSeller(id)
        .then((data) => {
            res.status(200).json({
                err: null,
                data,
            });
        })
        .catch(({status, err}) => {
            res.status(status).json({
                err,
                data: [],
            });
        });
}

module.exports = { 
    postNewTransactions,
    getAllTransactionsUser,
    getAllTransactionsSeller
}