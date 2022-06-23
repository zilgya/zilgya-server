const { db } = require("../config/database");
const { ErrorHandler } = require("../middlewares/errorHandler");

const getProducts = (query, route) => {
  return new Promise((resolve, reject) => {
    const { find, categories, sort = "created_at", order = "desc", page = 1, limit = 12 } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let totalParam = [];
    let arr = [];
    let totalQuery = "select count(*) over() as total_products from products p join categories c on p.categories_id =c.id join users u on p.users_id = u.id join brands b on p.brands_id =b.id join colors c2 on p.colors_id =c2.id";
    let sqlQuery =
      "SELECT p.name, p.description, p.price, p.stock, p.stock_condition, c.name as category, b.name as brand, c2.name as color, u.id as seller_id FROM products p join categories c on p.categories_id =c.id join users u on p.users_id = u.id join brands b on p.brands_id =b.id join colors c2 on p.colors_id =c2.id where p.on_delete = false";
    if (!find && !categories) {
      sqlQuery += " order by p." + sort + " " + order + " LIMIT $1 OFFSET $2";
      arr.push(parseInt(limit), offset);
    }
    if (find && !categories) {
      sqlQuery += " and lower(p.name) like lower('%' || $1 || '%') order by " + sort + " " + order + " LIMIT $2 OFFSET $3";
      totalQuery += " and lower(p.name) like lower('%' || $1 || '%')";
      arr.push(find, parseInt(limit), offset);
      totalParam.push(find);
    }
    if (categories && !find) {
      sqlQuery += " and lower(c.name) = lower($1) order by p." + sort + " " + order + " LIMIT $2 OFFSET $3";
      totalQuery += " and lower(c.name) = lower($1)";
      arr.push(categories, Number(limit), offset);
      totalParam.push(categories);
    }
    if (find && categories) {
      sqlQuery += " and lower(p.name) like lower('%' || $1 || '%') and lower(c.name) = lower($2) order by " + sort + " " + order + " LIMIT $3 OFFSET $4";
      totalQuery += " and lower(p.name) like lower('%' || $1 || '%') and lower(c.name) = lower($2)";
      arr.push(find, categories, Number(limit), offset);
      totalParam.push(find, categories);
    }
    db.query(sqlQuery, arr)
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "Product Not Found" });
        }
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        db.query(totalQuery, totalParam)
          .then((res) => {
            response.totalData = Number(res.rows[0]["total_products"]);
            response.totalPage = Math.ceil(response.totalData / Number(limit));
            if (page < response.totalPage) response.nextPage = `/product${route.path}?page=${parseInt(page) + 1}`;
            if (offset > 0) response.previousPage = `/product${route.path}?page=${parseInt(page) - 1}`;
            resolve(response);
          })
          .catch((err) => {
            reject({ status: 500, err });
          });
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const getProductDetail = async (id) => {
  try {
    const result = await db.query('SELECT p.name, p.description, p.price, p.stock, p.stock_condition, c.name as category, b.name as brand, c2.name as color, u.id as seller_id FROM products p join categories c on p.categories_id =c.id join users u on p.users_id = u.id join brands b on p.brands_id =b.id join colors c2 on p.colors_id =c2.id where p.on_delete = false and p.id=$1', [id])
    if(!result.rowCount)throw new ErrorHandler({status:404,message:"Product Not Found"})
    return {
      data:result.rows[0]
    }
  } catch (error) {
    throw new ErrorHandler({
      status: error ? error.status : 500,
      message: error.message,
    });
  }
}

const getProductImages = async (id) => {
  try {
    const result = await db.query("SELECT url from images where product_id=$1", [id]);
    if (!result.rowCount) {
      throw new ErrorHandler({ status: 404, message: "Product Not Found" });
    }
    return {
      data: result.rows,
    };
  } catch (error) {
    throw new ErrorHandler({
      status: error ? error.status : 500,
      message: error.message,
    });
  }
};

const postProduct = async (body, image, id) => {
  const { name, description, price, stock, categories_id, brands_id, colors_id } = body;
  try {
    let queryParams = [];
    let params = [];
    const sqlQuery = "INSERT INTO products(name,description,price,stock,categories_id,users_id,brands_id,colors_id,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,now(),now()) returning id";

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
    throw new ErrorHandler({
      status: error ? error.status : 500,
      message: error.message,
    });
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
    throw new ErrorHandler({
      status: err.status ? err.status : 500,
      message: err.message,
    });
  }
};

const deleteProduct = async (id) => {
  try {
    const sqlQuery = "UPDATE products set on_delete=true WHERE id = $1 RETURNING *";

    const product = await db.query(sqlQuery, [id]);
    if (!product.rowCount) {
      throw new ErrorHandler({ status: 404, message: "Product Not Found" });
    }

    return {
      data: product.rows[0],
      message: "Product Successfully Deleted",
    };
  } catch (error) {
    throw new ErrorHandler({
      status: error ? error.status : 500,
      message: error.message,
    });
  }
};

module.exports = { getProducts, postProduct, deleteProduct, updateProduct, getProductImages,getProductDetail };
