const { db } = require("../config/database");
const { ErrorHandler } = require("../middlewares/errorHandler");

const postProduct = async (body, image, id) => {
  const { name, description, price, stock, categories_id, brands_id, colors_id } = body;
  try {
    let queryParams = [];
    let params = [];
    const sqlQuery = "INSERT INTO products(name,description,price,stock,categories_id,users_id,brands_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) returning id";

    const product = await db.query(sqlQuery, [name, description, price, stock, categories_id, id, brands_id, colors_id]);

    const product_id = product.rows[0].id;

    let imageQuery = "INSERT INTO images(url,product_id) VALUES ";
    image.map((val) => {
      queryParams.push(`($${params.length + 1},$${params.length + 2})`, ",");
      params.push(val.path, product_id);
    });

    queryParams.pop();
    imageQuery += queryParams.join("");
    imageQuery += " RETURNING *";
    const result = await db.query(imageQuery, params);

    return {
      data: result.rows[0],
      message: "Product Successfully Created",
    };
  } catch (error) {
    throw new ErrorHandler({ status: error ? error.status : 500, message: error.message });
  }
};

module.exports = { postProduct };
