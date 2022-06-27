const { db } = require("../config/database");
//const { param } = require("../routes/transactions");
const { ErrorHandler } = require("../helpers/errorHandler");

const createNewTransactions = async (body, id) => {
    const { users_id, sub_total, shipping, total_price, product } = body;
    try {
        let userId = id;
        let params = [];
        let queryParams = [];
        const created_at = new Date(Date.now());
        if (!id) userId = users_id;
        const client = await db.connect();
        //await client.query("BEGIN");

        const queryOrder = "INSERT INTO transactions(users_id, sub_total, shipping, total_price, created_at) VALUES($1,$2,$3,$4,$5) RETURNING id";
        const order = await client.query(queryOrder, [userId, sub_total, shipping, total_price, created_at]);
        const orderId = order.rows[0].id;

        let orderItemQuery = "INSERT INTO transaction_products(transaction_id, quantity, product_id) VALUES ";
        // params.push(orderId, quantity, product_id);
        product.map((val) => {
            queryParams.push(`($${params.length + 1},$${params.length + 2},$${params.length + 3})`, ",");
            params.push(orderId, val.quantity, val.id);

        });
        queryParams.pop();
        orderItemQuery += queryParams.join("");
        orderItemQuery += " RETURNING *";
        //console.log(orderItemQuery);
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
        const sqlQuery = "select images.url, products.name as name_product, products.price, transaction_products.quantity, transactions.order_status, transactions.total_price from products join images on products.id  = images.product_id join transaction_products on products.id = transaction_products.product_id join transactions on transaction_products.transaction_id = transactions.id join users on transactions.users_id = users.id where users.id = $1";
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
        // const updated_at = new Date(Date.now());
        const sqlQuery = "UPDATE transactions SET updated_at = now(), on_delete=true WHERE id = $1 RETURNING *";
        db.query(sqlQuery, [id])
            .then((data) => {
                if (data.rows.length === 0) {
                    return resolve({ status: 404, err: "" })
                }
                const response = {
                    data: data.rows,
                    msg: "Data Terhapus"
                }
                return resolve(response)
            })
            .catch((err) => {
                reject({ status: 500, err });
            })
    })
}

const checkout = (req) => {
    return new Promise((resolve, reject) => {
        // const { id } = req.params; 
        const users_id = req.userPayload.id;
        const { phone_number, payment_method, product_id } = req.body
        const sqlQuery = "UPDATE transactions SET updated_at = now(), order_status = 'processed', phone_number=$1, payment_method=$2 where id=$3 and users_id = $4 returning *"
        db.query(sqlQuery, [phone_number, payment_method, product_id, users_id])
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
        const sqlQuery = "select transactions.id, users.username, products.name from products join transaction_products on products.id = transaction_products.product_id join transactions on transaction_products.transaction_id = transactions.id join users on transactions.users_id = users.id where users.id = $1"
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


module.exports = {
    createNewTransactions,
    getAllTransactionsfromUsers,
    getAllTransactionsfromSeller,
    updateTransactions,
    deleteDataTransactionsfromServer,
    checkout,
    getTransactions
}