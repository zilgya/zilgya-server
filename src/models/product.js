const { db } = require("../config/database");

const getProducts = (query) => {
  return new Promise((resolve, reject) => {
    const {
      find,
      categories,
      sort = "categories_id",
      order = "desc",
      page = 1,
      limit = 12,
    } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let totalQuery =
      "select count(*) over() as total_products from products p join categories c on p.categories_id =c.id join users u on p.users_id = u.id";
    let sqlQuery =
      "SELECT p.name, p.description, p.price, p.stock, p.stock_condition, c.name as category,  u.id as seller_id FROM products p join categories c on p.categories_id =c.id join users u on p.users_id = u.id";
    db.query(sqlQuery)
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "Product Not Found" });
        }
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

module.exports = {
  getProducts,
};
