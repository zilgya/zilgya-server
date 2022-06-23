const { db } = require("../config/database");
//const { param } = require("../routes/transactions");
const { ErrorHandler } = require("../helpers/errorHandler");

const createNewTransactions = async (body, u_id) => {
    const { users_id, sub_total, shipping, tax, total_price, quantity, colors, brands, price, product_id } = body;
    try {
        let userId = u_id;
        let params = [];
        const created_at = new Date(Date.now());
        if (!u_id) userId = users_id;
        const client = await db.connect();
        //await client.query("BEGIN");

        const queryOrder = "INSERT INTO transactions(users_id, sub_total, shipping, tax, total_price, created_at) VALUES($1,$2,$3,$4,$5,$6) RETURNING id";
        const order = await client.query(queryOrder, [userId, sub_total, shipping, tax, total_price, created_at]);
        const orderId = order.rows[0].id;

        let orderItemQuery = "INSERT INTO transaction_products(transaction_id, quantity, colors, brands, price, product_id) VALUES ($1,$2,$3,$4,$5,$6)";
        params.push(orderId, quantity, colors, brands, price, product_id);
        //orderItemQuery += queryParams.join("");
        //orderItemQuery += " RETURNING *";
        const result = await client.query(orderItemQuery, params);
        //await client.query("COMMIT");
        return { data: result.rows[0], message: "Transaction Successfully Created" };
    } catch (err) {
        const client = await db.connect();
        //await client.query("ROLLBACK");
        throw new ErrorHandler({ status: err.status ? err.status : 500, message: err.message });
    }
};

const getAllTransactionsfromUsers = (id) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "select transactions.sub_total, transactions.created_at, users.username from transactions join users on transactions.users_id = users.id where transactions.users_id = $1 order by created_at asc";
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
    });
};

const getAllTransactionsfromSeller = (id) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = "select images.url, products.name as name_product, products.price, transaction_products.quantity, transactions.order_status, transactions.total_price from products join images on products.id  = images.product_id join transaction_products on products.id = transaction_products.product_id join transactions on transaction_products.transaction_id = transactions.id join users on transactions.users_id = users.id where users.id = $1" ;
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
    });
};

const updateTransactions = (params, body) => {
    return new Promise((resolve, reject) => {
        const { id } = params
        const { users_id, sub_total, shipping, tax, total_price } = body;
        const updated_at = new Date(Date.now());
        const sqlQuery =
            "UPDATE transactions SET users_id=COALESCE($1, users_id), sub_total=COALESCE($2, sub_total), shipping=COALESCE($3, shipping), tax=COALESCE($4, tax), total_price=COALESCE($5, total_price), updated_at=COALESCE($6, updated_at) where id=$7 returning *";
        db.query(sqlQuery, [users_id, sub_total, shipping, tax, total_price, updated_at, id])
            .then((result) => {
                resolve({
                    data: result.rows,
                    msg: null,
                })
            })
            .catch((err) => reject({ status: 500, err }));
    });
};

const deleteDataTransactionsfromServer = (params) => {
    return new Promise((resolve, reject) => {
        const { id } = params;
        const sqlQuery = "DELETE FROM transactions WHERE id=$1 returning *";
        db.query(sqlQuery, [id])
            .then((data) => {
                if (data.rows.length === 0) {
                    return resolve({ status: 404, err: "" })
                }
                const response = {
                    data: data.rows,
                    msg: "Data Terhapus"
                }
            })
            .catch((err) => {
                reject({ status: 500, err });
            })
    })
}

module.exports = {
    createNewTransactions,
    getAllTransactionsfromUsers,
    getAllTransactionsfromSeller,
    updateTransactions,
    deleteDataTransactionsfromServer
}