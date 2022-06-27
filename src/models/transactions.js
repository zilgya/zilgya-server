const { db } = require("../config/database");
//const { param } = require("../routes/transactions");
const { ErrorHandler } = require("../helpers/errorHandler");

const createNewTransactions = async (body, id) => {
  const { users_id, sub_total, shipping, total_price, product, promo_id } = body;
  try {
    let userId = id;
    let orderId;
    let params = [];
    let queryParams = [];

    const created_at = new Date(Date.now());

    if (!id) userId = users_id;
    let queryOrderParams = [userId, sub_total, shipping, total_price, created_at];

    let queryOrder = "INSERT INTO transactions(users_id, sub_total, shipping, total_price, created_at) VALUES($1,$2,$3,$4,$5) RETURNING id";
    if (promo_id) {
      queryOrder = "with t as (INSERT INTO transactions(users_id, sub_total, shipping, total_price, created_at,promo_id) VALUES($1,$2,$3,$4,$5,$6) returning id),pr as (UPDATE promos set on_delete=true where id = $6) select t.id from t";
      queryOrderParams.push(promo_id);
    }
    const order = await db.query(queryOrder, queryOrderParams);
    orderId = order.rows[0].id;

    let orderItemQuery = "INSERT INTO transaction_products(transaction_id, quantity, product_id) VALUES ";

    product.map((val) => {
      queryParams.push(`($${params.length + 1},$${params.length + 2},$${params.length + 3})`, ",");
      params.push(orderId, val.quantity, val.id);
    });
    queryParams.pop();
    orderItemQuery += queryParams.join("");
    orderItemQuery += " RETURNING *";

    const result = await db.query(orderItemQuery, params);

    return { data: result.rows[0], message: "Transaction Successfully Created" };
  } catch (err) {
    throw new ErrorHandler({ status: err.status ? err.status : 500, message: err.message });
  }
};

const getAllTransactionsfromUsers = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "select t.id,i.url, p.name as name,u.username as seller, p.price, tp.quantity, t.order_status, t.total_price from transaction_products tp join transactions t on tp.transaction_id  = t.id join products p  on p.id = tp.product_id join images i on p.id = i.product_id join users u on p.users_id = u.id  where tp.transaction_id in(select id from transactions where users_id=$1 and on_delete = false)";
    db.query(sqlQuery, [id])
      .then((result) => {
        //console.log(result)
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const getAllTransactionsfromSeller = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "select t.id,i.url, p.name as name,u.username as buyer, p.price, tp.quantity, t.order_status, t.total_price from transaction_products tp join transactions t on tp.transaction_id  = t.id join products p  on p.id = tp.product_id join images i on p.id = i.product_id join users u on t.users_id = u.id where p.users_id = $1 and t.on_delete = false";
    db.query(sqlQuery, [id])
      .then((result) => {
        const response = {
          data: result.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const deleteDataTransactionsfromServer = (req) => {
  return new Promise((resolve, reject) => {
    const { id } = req.params;
    // const updated_at = new Date(Date.now());
    const sqlQuery = "UPDATE transactions SET updated_at = now(), on_delete=true WHERE id = $1 RETURNING *";
    db.query(sqlQuery, [id])
      .then((data) => {
        if (data.rows.length === 0) {
          return resolve({ status: 404, err: "" });
        }
        const response = {
          data: data.rows,
          msg: "Data Terhapus",
        };
        return resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const checkout = (req) => {
  return new Promise((resolve, reject) => {
    // const { id } = req.params; 
    const users_id = req.userPayload.id;
    const { phone_number, payment_method, order_id } = req.body;
    const sqlQuery = "UPDATE transactions SET updated_at = now(), order_status = 'SENT', phone_number=$1, payment_method=$2 where id=$3 and users_id = $4 returning *";
    db.query(sqlQuery, [phone_number, payment_method, order_id, users_id])
      .then((result) => {
        resolve({
          data: result.rows,
          msg: null,
        })
      })
      .catch((err) => {
        reject(console.log(err));
      })
  })
}
const getTransactions = (id) => {
  return new Promise((resolve, reject) => {
    // const { id } = req.params; 
    //const { transactions_id } = req.body
    const sqlQuery = "select transactions.id, users.username, products.name from products join transaction_products on products.id = transaction_products.product_id join transactions on transaction_products.transaction_id = transactions.id join users on transactions.users_id = users.id where users.id = $1 and transactions.order_status = 'NOT PAID'"
    db.query(sqlQuery, [id])
      .then((result) => {
        //console.log(result)
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      })
  })
}
const completed = (req) => {
  return new Promise((resolve, reject) => {
    const { id } = req.params;
    // const users_id = req.userPayload.id;
    // const { order_id } = req.body;
    const sqlQuery = "UPDATE transactions SET updated_at = now(), order_status = 'COMPLETED' where id=$1 returning *";
    db.query(sqlQuery, [id])
      .then((result) => {
        resolve({
          data: result.rows,
          msg: null,
        })
      })
      .catch((err) => {
        reject(console.log(err));
      })
  })
}


module.exports = {
  createNewTransactions,
  getAllTransactionsfromUsers,
  getAllTransactionsfromSeller,
  deleteDataTransactionsfromServer,
  checkout,
  getTransactions,
  completed
}
