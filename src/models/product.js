const { db } = require("../config/database");
const { ErrorHandler } = require("../middlewares/errorHandler");

const getProducts = (query, route) => {
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
    let totalParam = [];
    let arr = [];
    let totalQuery =
      "select count(*) over() as total_products from products p join categories c on p.categories_id =c.id join users u on p.users_id = u.id";
    let sqlQuery =
      "SELECT p.name, p.description, p.price, p.stock, p.stock_condition, c.name as category,  u.id as seller_id FROM products p join categories c on p.categories_id =c.id join users u on p.users_id = u.id";
    if (!find && !categories) {
      sqlQuery += " order by " + sort + " " + order + " LIMIT $1 OFFSET $2";
      arr.push(parseInt(limit), offset);
    }
    if (find && !categories) {
      sqlQuery +=
        " where lower(p.name) like lower('%' || $1 || '%') order by " +
        sort +
        " " +
        order +
        " LIMIT $2 OFFSET $3";
      totalQuery += " where lower(p.name) like lower('%' || $1 || '%')";
      arr.push(find, parseInt(limit), offset);
      totalParam.push(find);
    }
    if (categories && !find) {
      sqlQuery +=
        " where lower(c.name) = lower($1) order by " +
        sort +
        " " +
        order +
        " LIMIT $2 OFFSET $3";
      totalQuery += " where lower(c.name) = lower($1)";
      arr.push(categories, Number(limit), offset);
      totalParam.push(categories);
    }
    if (find && categories) {
      sqlQuery +=
        " where lower(p.name) like lower('%' || $1 || '%') and lower(c.name) = lower($2) order by " +
        sort +
        " " +
        order +
        " LIMIT $3 OFFSET $4";
      totalQuery +=
        " where lower(p.name) like lower('%' || $1 || '%') and lower(c.name) = lower($2)";
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
          .then((result) => {
            response.totalData = Number(result.rows[0]["total_products"]);
            response.totalPage = Math.ceil(response.totalData / Number(limit));
            if (page < response.totalPage)
              response.nextPage = `/product${route.path}?page=${
                parseInt(page) + 1
              }`;
            if (offset > 0)
              response.previousPage = `/product${route.path}?page=${
                parseInt(page) - 1
              }`;
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

module.exports = { postProduct, getProducts };
