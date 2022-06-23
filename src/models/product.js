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

const updateProduct = async (body, user_id, product_id, image) => {
  const { name, price, description, stock, categories_id, brands_id, colors_id } = body;
  try {
    let params = [];
    let queryParams = [];
    let imageQuery = "UPDATE images as i set url = c.column_a from (values";
    if (image) {
      image.map((val) => {
        queryParams.push(`($${params.length + 1})`, ",");
        params.push(val.path);
      });
      queryParams.pop();
      imageQuery += queryParams.join("");
      imageQuery += `) as c(column_a) where i.product_id=$${params.length + 1} RETURNING *`;
      params.push(product_id);

      await db.query(imageQuery, params);
    }

    const productQuery =
      "UPDATE products SET name = COALESCE(NULLIF($1, ''), name), price = COALESCE(NULLIF($2, '')::integer, price), description = COALESCE(NULLIF($3, ''), description), stock = COALESCE(NULLIF($4, '')::integer, stock),categories_id = COALESCE(NULLIF($5, '')::integer, categories_id),brands_id = COALESCE(NULLIF($6, '')::integer, brands_id),colors_id = COALESCE(NULLIF($7, '')::integer, colors_id), updated_at = now() WHERE id = $8 and users_id = $9 RETURNING *";

    const result = await db.query(productQuery, [name, price, description, stock, categories_id, brands_id, colors_id, product_id, user_id]);

    if (!result.rowCount) {
      throw new ErrorHandler({ status: 404, message: "Product Not Found" });
    }

    return { data: result.rows[0], message: "Product Successfully Updated" };
  } catch (err) {
    throw new ErrorHandler({ status: err.status ? err.status : 500, message: err.message });
  }
};

const deleteProduct = async (id) => {
  try {
    const sqlQuery = "UPDATE products set on_delete=true WHERE id = $1 RETURNING *";

    const product = await db.query(sqlQuery, id);
    if (!product.rowCount) {
      throw new ErrorHandler({ status: 404, message: "Product Not Foun" });
    }

    return {
      data: product.rows[0],
      message: "Product Successfully Deleted",
    };
  } catch (error) {
    throw new ErrorHandler({ status: error ? error.status : 500, message: error.message });
  }
};

module.exports = { postProduct, deleteProduct, updateProduct };
