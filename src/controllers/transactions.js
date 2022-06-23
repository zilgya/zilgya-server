const transactionsModel = require("../models/transactions");
const { createNewTransactions, getAllTransactionsfromUsers, getAllTransactionsfromSeller, updateTransactions, deleteDataTransactionsfromServer } = transactionsModel;
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
      //console.log(err)
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

const patchUpdateTransactions = (req, res) => {
    updateTransactions(req.params, req.body)
        .then((result) => {
            const { data, msg } = result
            res.status(200).json({
                data,
                msg,
            })
        })
        .catch(({ status, err }) => {
            res.status(status).json({
                err,
                data: [],
            });
        });
};
const deleteTransactionsbyId = (req, res) => {
    const id = req.params;
    deleteDataTransactionsfromServer(id)
        .then(({ data, msg }) => {
            res.status(200).json({
                data,
                msg: "Data Deleted !",                
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

module.exports = { 
    postNewTransactions,
    getAllTransactionsUser,
    getAllTransactionsSeller,
    patchUpdateTransactions,
    deleteTransactionsbyId
}