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
        const sqlQuery = "select images.url, products.name as name_product, products.price, transaction_products.quantity, transactions.order_status, transactions.total_price from products join images on products.id  = images.product_id join transaction_products on products.id = transaction_products.product_id join transactions on transaction_products.transaction_id = transactions.id join users on transactions.users_id = users.id" ;
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

module.exports = {
    createNewTransactions,
    getAllTransactionsfromUsers,
    getAllTransactionsfromSeller,
}